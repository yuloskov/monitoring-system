FROM python:3.7

WORKDIR /application

COPY ./requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "gunicorn" ]
