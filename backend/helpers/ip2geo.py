import psycopg2
import json
import requests
import time

conn = psycopg2.connect(dbname='postgres', user='postgres', host='10.90.137.214', password='IAmTraktor')

with conn.cursor() as cur:
    cur.itersize = 1000
    cur.execute('SELECT ip FROM unique_ips WHERE latitude is null order by ip desc')

    j = 0
    while True:
        time.sleep(4)

        print(j)
        j += 1

        rows = cur.fetchmany(size=100)
        if not rows:
            break

        ips = list(map(lambda x: x[0], rows))

        data = requests.post('http://ip-api.com/batch?fields=8384', json=ips).json()

        with conn.cursor() as cur2:
            for i in range(len(ips)):
                ip = data[i]['query']
                latitude = data[i]['lat']
                longitude = data[i]['lon']
                cur2.execute('UPDATE unique_ips SET latitude=%s, longitude=%s WHERE ip=%s', (latitude, longitude, ip))

        conn.commit()
