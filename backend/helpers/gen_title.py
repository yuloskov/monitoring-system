import psycopg2
from coolname import generate
import random

conn = psycopg2.connect(
    dbname='postgres',
    user='postgres',
    host='34.89.182.168',
    password='cn7vlDky584Lo3rk'
)
print()

with conn.cursor() as cur:
    cur.execute(
        """
        SELECT content_id FROM content_titles WHERE content_title is null
        """
    )

    while True:
        rows = cur.fetchmany(size=100)
        if not rows:
            break

        ids = list(map(lambda x: x[0], rows))
        with conn.cursor() as cur2:
            for id in ids:
                t = ' '.join(x.capitalize() for x in generate(random.randint(2, 4)))
                cur2.execute(
                    """
                    UPDATE content_titles SET content_title=%s
                    WHERE content_id=%s
                    """, (t, id)
                )
        conn.commit()