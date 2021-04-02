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
        SELECT profile_id FROM personal_info WHERE first_name is null
        """
    )

    while True:
        rows = cur.fetchmany(size=100)
        if not rows:
            break

        ids = list(map(lambda x: x[0], rows))
        with conn.cursor() as cur2:
            for id in ids:
                name = [x.capitalize() for x in generate(2)]
                first_name = ''.join(name[0])
                last_name = ''.join(name[1])
                cur2.execute(
                    """
                    UPDATE personal_info SET first_name=%s, last_name=%s
                    WHERE profile_id=%s
                    """, (first_name, last_name, id)
                )
        conn.commit()
