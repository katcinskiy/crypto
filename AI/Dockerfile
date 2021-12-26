FROM python:3.8-alpine
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN pip install websocket
RUN pip install pymongo
RUN pip install websocket-client
CMD ["python", "collect_data.py"]