FROM python:3.7-alpine

WORKDIR /application

RUN apk add --no-cache make gcc musl-dev libffi-dev openssl-dev

COPY ./requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT [ "python" ]

CMD [ "main.py" ]
