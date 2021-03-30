from flask import Flask, jsonify, g, request
from flask_cors import CORS
import psycopg2
import os

import logging.config

try:
    conn = psycopg2.connect(f"dbname='{os.environ['POSTGRES_DB']}' user='{os.environ['POSTGRES_USER']}' host='{os.environ['DATABASE_URL']}' password='{os.environ['POSTGRES_PASSWORD']}'")
except: 
    print("Oopsie... I can not connect to database")    

LOGGER_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': (
                '%(asctime)s | %(levelname)-9s'
                ' | %(name)s | %(message)s'
            ),
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        }
    },
    'loggers': {
        '': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    },
}

logger = logging.getLogger(__name__)
logging.config.dictConfig(LOGGER_CONFIG)

app = Flask(__name__)
CORS(app)


@app.before_request
def before_request():
    logger.info('Creating cursor')
    g.cur = conn.cursor()
    logger.info('Created cursor')


@app.teardown_request
def teardown_request(exception):
    g.cur.close()


@app.route('/')
def hello_world():
    g.cur.execute("SELECT * FROM users LIMIT 10;")
    logger.info(g.cur.fetchone())
    return 'Hello'


@app.route('/api/map/metrics/buff', methods=['GET'])
def metrics_buff():
    start, end = request.args.get('start'), request.args.get('end')
    logger.info(start)
    logger.info(end)
    g.cur.execute("select a.action_attributes_str as buff_time, b.longitude, b.latitude, count(*) from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= %s and server_time < %s group by a.action_attributes_str, b.longitude, b.latitude", (start, end))
    return jsonify(g.cur.fetchall())


# @app.route('', methods=['GET'])
# def metrics_quality():
#     start, end = request.json['start'], request.json['end']
#     logger.info(start)
#     logger.info(end)
#     g.cur.execute("select * where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= %s and server_time < %s group by a.action_attributes_str, b.longitude, b.latitude", (start, end))
#     return jsonify(g.cur.fetchall())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
