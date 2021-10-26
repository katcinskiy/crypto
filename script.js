alert("I am on it")


console.log("I am on it.")


const gradient_threshold = 15
const pause_between_bets = 30 // seconds


class Deque {

    size = 0

    constructor() {
        this.front = this.back = undefined;
    }
    addFront(value) {
        this.size++;
        if (!this.front) this.front = this.back = { value };
        else this.front = this.front.next = { value, prev: this.front };
    }
    removeFront() {
        this.size--;
        let value = this.peekFront();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.front = this.front.prev).next = undefined;
        return value;
    }
    peekFront() {
        return this.front && this.front.value;
    }
    addBack(value) {
        this.size++;
        if (!this.front) this.front = this.back = { value };
        else this.back = this.back.prev = { value, next: this.back };
    }
    removeBack() {
        this.size--;
        let value = this.peekBack();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.back = this.back.next).back = undefined;
        return value;
    }
    peekBack() {
        return this.back && this.back.value;
    }
}


class Storage {
    deque = new Deque()
    interval = 5
    current_gradient = 0

    sec_diff(lower, upper) {
        return (upper - lower) / 1000
    }

    add_to_storage(value, timestamp) {
        this.deque.addBack({
            'value': value,
            'timestamp': timestamp
        })
        while (this.sec_diff(this.deque.peekFront()['timestamp'], timestamp) > this.interval) {
            this.deque.removeFront()
        }
        this.current_gradient = (this.deque.peekBack()['value'] - this.deque.peekFront()['value']) / this.interval
        console.log("Added: value - " + value + ", timestamp - " + timestamp + ", new gradient - " + this.current_gradient)
    }
}

const storage = new Storage()
let last_bet_time = new Date()

function onMessage(mess) {
    let j = JSON.parse(mess.data);
    if (j.data) {
        let value = j.data['p']
        let timestamp = j.data['T']
        storage.add_to_storage(parseFloat(value), timestamp)
        if (Math.abs(storage.current_gradient) > gradient_threshold) {
            let current_date = new Date()
            if (((current_date - last_bet_time) / 1000) > pause_between_bets) {
                // if(storage.current_gradient > 0) {
                //     $(document).ready(function() {
                //         $("#btnCall").click()
                //     });
                // } else {
                //     $(document).ready(function() {
                //         $("#btnPut").click()
                //     });
                // }
                last_bet_time = current_date
            }
        }
    }
}

let binanceWS = new WebSocket ("wss://stream.binance.com/stream");
binanceWS.onopen = () => {
    binanceWS.send (JSON.stringify ({"method": "SUBSCRIBE",
        "params": ["btcusdt@aggTrade"],
        "id": 3
    }));
    // setTimeout (game_check, 100);
}
binanceWS.onmessage = onMessage;

