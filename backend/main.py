from flask import Flask
import psycopg2

import logging.config

try:
    conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost' password='postgres'")
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
    return 'Hello'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
