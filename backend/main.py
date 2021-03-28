from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os

import logging.config

try:
    conn = psycopg2.connect(f"dbname='{os.environ['POSTGRES_DB']}' user='{os.environ['POSTGRES_USER']}' host='{os.environ['DATABASE_URL']}' password='{os.environ['POSTGRES_PASSWORD']}'")
except: 
    print("Oopsie... I can not connect to database")    
cur = conn.cursor()

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


@app.route('/')
def hello_world():
    cur.execute("SELECT * FROM users LIMIT 10;")
    logger.info(cur.fetchone())
    return 'Hello'


@app.route('/zhopa')
def zhopa():
    cur.execute("select a.action_attributes_str as buff_time, b.longitude, b.latitude from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= '2021-03-14 18:00:00' and server_time < '2021-03-14 20:00:00'")
    return jsonify(cur.fetchall())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
