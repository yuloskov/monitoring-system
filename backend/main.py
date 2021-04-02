from flask import Flask, jsonify, g, request
from flask_cors import CORS
from datetime import datetime
import os
import time
import psycopg2

import logging.config

db = os.environ['POSTGRES_DB']
user = os.environ['POSTGRES_USER']
passw = os.environ['POSTGRES_PASSWORD']

def create_conn():
    return psycopg2.connect(
        f"dbname='{db}' user='{user}' host='db' password='{passw}'"
    )

try:
    conn = create_conn()
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
    global conn
    logger.info('Creating cursor')
    if conn.closed != 0:
        logger.info('RECREATING CONNECTION')
        conn = create_conn()
    g.cur = conn.cursor()
    logger.info('Created cursor')


@app.teardown_request
def teardown_request(exception):
    cur = g.pop('cur', None)
    if cur is not None:
        cur.close()


@app.route('/api/user_board/metrics/quality_chart', methods=['GET'])
def quality_chart():
    start, end = request.args.get('start'), request.args.get('end')
    profile_id = request.args.get('profile_id')

    g.cur.execute(
        """
        select action_result, server_time from qualities 
        where profile_id=%s and server_time>=%s and server_time<=%s 
        order by server_time
        """,
        (profile_id, start, end)
    )
    return jsonify(g.cur.fetchall())


@app.route('/')
def hello_world():
    g.cur.execute("SELECT * FROM users LIMIT 10;")
    logger.info(g.cur.fetchone())
    return 'Hello'


@app.route('/api/map/metrics/buff', methods=['GET'])
def metrics_buff():
    start, end = request.args.get('start'), request.args.get('end')
    g.cur.execute(
        """
        select a.action_attributes_str as buff_time, b.longitude, b.latitude, 
        count(*) from buffering_stop a, unique_ips b 
        where a.action_attributes_str < 300000 and a.request_ip = b.ip 
        and server_time >= %s and server_time < %s 
        group by a.action_attributes_str, b.longitude, b.latitude
        """,
        (start, end),
    )
    return jsonify(g.cur.fetchall())


@app.route('/api/map/metrics/quality', methods=['GET'])
def metrics_quality():
    start, end = request.args.get('start'), request.args.get('end')
    exec_start = time.time()
    g.cur.execute(
        """
        select q.action_result as quality, u.longitude, u.latitude, count(*)
        from qualities q, unique_ips u
        where q.request_ip = u.ip and server_time >= %s and server_time < %s
        group by q.action_result, u.longitude, u.latitude
        """,
        (start, end)
    )
    logger.info(f'Query time: {time.time() - exec_start} sec')
    return jsonify(g.cur.fetchall())


@app.route('/api/user_board/metrics/info', methods=['GET'])
def user_info():
    start, end = request.args.get('start'), request.args.get('end')
    profile_id = request.args.get('user_id')
    fields = [
        'profile_id',
        'device_type',
        'user_browser',
        'user_browser_version',
        'user_os',
        'user_os_version',
        'request_ip'
    ]

    g.cur.execute(
        f"""
        select distinct {', '.join(fields)}
        from users where profile_id=%s and
        server_time >= %s and server_time < %s
        """,
        (profile_id, start, end)
    )
    res = g.cur.fetchall()

    return jsonify([{k: v for k, v in zip(fields, r)} for r in res])


@app.route('/api/user_board/metrics/buff', methods=['GET'])
def user_buff():
    start, end = request.args.get('start'), request.args.get('end')
    profile_id = request.args.get('user_id')

    g.cur.execute(
        """
        select action_attributes_str from buffering_stop 
        where profile_id=%s and server_time>=%s and 
        server_time<=%s order by server_time
        """,
        (profile_id, start, end)
    )
    result = g.cur.fetchall()
    return jsonify([int(s[0]) for s in result])


@app.route('/api/content_board/metrics/buff', methods=['GET'])
def content_buff():
    start, end = request.args.get('start'), request.args.get('end')
    content_id = request.args.get('content_id')

    g.cur.execute(
        """
        select action_attributes_str from users 
        where content_id=%s and server_time>=%s and 
        server_time<=%s and action_id='buffer_stop' and 
        action_attributes_str::integer < 300000 order by server_time
        """,
        (content_id, start, end)
    )
    result = g.cur.fetchall()
    return jsonify([int(s[0]) for s in result])


@app.route('/api/content_board/metrics/info', methods=['GET'])
def content_info():
    content_id = request.args.get('content_id')
    g.cur.execute(
        """
        select content_title from content_titles where content_id=%s
        """,
        (content_id, )
    )

    return jsonify(g.cur.fetchall())


@app.route('/api/user_board/metrics/content_table', methods=['GET'])
def content_table():
    start, end = request.args.get('start'), request.args.get('end')
    profile_id = request.args.get('user_id')

    g.cur.execute(
        f"""
        select distinct b.content_title, a.content_id, device_type 
        from users a, content_titles b 
        where a.content_id = b.content_id and profile_id=%s 
        and server_time >= %s and server_time < %s
        """,
        (profile_id, start, end)
    )

    return jsonify(g.cur.fetchall())


@app.route('/api/user_board/metrics/actions', methods=['GET'])
def get_actions():
    start, end = request.args.get('start'), request.args.get('end')
    profile_id = request.args.get('user_id')
    content_id = request.args.get('content_id')

    g.cur.execute(
        f"""
           select distinct server_time, action_id, action_result from users 
           where profile_id=%s and server_time >= %s and server_time < %s 
           and content_id = %s
           """,
        (profile_id, start, end, content_id)
    )

    return jsonify(g.cur.fetchall())


@app.route('/api/user_board/metrics/quality_histogram', methods=['GET'])
def user_quality_bar():
    start, end = request.args.get('start'), request.args.get('end')
    user_id = request.args.get('user_id')

    g.cur.execute(
        f"""
        select action_result as quality, count(*) as count
        from qualities
        where profile_id = %s
        and server_time >= %s and server_time < %s
        group by profile_id, quality;
        """,
        (user_id, start, end)
    )

    return jsonify(g.cur.fetchall())


@app.route('/api/content_board/metrics/quality_histogram', methods=['GET'])
def content_quality_bar():
    start, end = request.args.get('start'), request.args.get('end')
    content_id = request.args.get('content_id')

    g.cur.execute(
        f"""
        select action_result as quality, count(*) as count
        from qualities_new
        where content_id = %s
        and server_time >= %s and server_time < %s
        group by content_id, quality;
        """,
        (content_id, start, end)
    )

    return jsonify(g.cur.fetchall())


@app.route('/api/content_board/metrics/views_chart', methods=['GET'])
def content_views_chart():
    start, end = request.args.get('start'), request.args.get('end')
    content_id = request.args.get('content_id')
    epsilon = (datetime.fromisoformat(end[:-1]) - datetime.fromisoformat(start[:-1])).seconds // 10
    logger.info(epsilon)
    g.cur.execute(
        f"""
        select count(distinct profile_id), to_timestamp(round(extract('epoch' from server_time) / %(epsilon)s) * %(epsilon)s)
        from qualities_new
        where server_time >= %(start)s
        and server_time <= %(end)s
        and content_id = %(content_id)s

        group by round(extract('epoch' from server_time) / %(epsilon)s)
        order by round(extract('epoch' from server_time) / %(epsilon)s);
        """,
        {'content_id': content_id, 'start': start, 'end': end, 'epsilon': epsilon}
    )
    result = g.cur.fetchall()
    return jsonify(result)


@app.route('/api/user_board/metrics/kpi', methods=['GET'])
def kpi():
    start, end = request.args.get('start'), request.args.get('end')
    user_id = request.args.get('user_id')

    g.cur.execute(
        f"""
        select a.*, b.*, least(1, cbrt(4 * a.metric1 * b.metric2 * b.metric3)) as metric
        from (select coalesce(avg(action_result) / max(action_result), 1)::double precision as metric1
            from qualities
            where profile_id = %(user_id)s
                and server_time >= %(start)s
                and server_time < %(end)s) as a,
            (select 1.0 / log(2 + count(*)) as metric2,
                    coalesce(avg(action_attributes_str) / max(action_attributes_str), 1)::double precision as metric3
            from buffering_stop_new
            where profile_id = %(user_id)s
                and server_time >= %(start)s
                and server_time < %(end)s) as b;
        """,
        {'user_id': user_id, 'start': start, 'end': end}
    )
    return jsonify(g.cur.fetchone())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
