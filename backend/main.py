from flask import Flask
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


@app.route('/')
def hello_world():
    cur.execute("SELECT * FROM users LIMIT 10;")
    logger.info(cur.fetchone())
    return 'Hello'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
