import websocket
import _thread
import pymongo
import json

client = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = client["binance_history"]
collection = mydb['data']

def on_message(ws, message):
    decoded = json.loads(message)
    if 'data' in decoded:
        timestamp = decoded['data']['T']
        value = decoded['data']['p']
        print(value, timestamp)
        collection.insert_one(decoded['data'])

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        # for i in range(3):
        #     time.sleep(1)
        ws.send(json.dumps({
            "method": "SUBSCRIBE",
            # "params": ["!miniTicker@arr@3000ms", "btcusdt@aggTrade", "btcusdt@kline_1d", "btcusdt@depth"],
            "params": ["ethusdt@aggTrade"],
            "id": 1
        }))
        # time.sleep(1)
        # ws.close()
        # print("thread terminating...")
    _thread.start_new_thread(run, ())


def run_bibance():
    # websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://stream.binance.com/stream",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    ws.run_forever()


run_bibance()