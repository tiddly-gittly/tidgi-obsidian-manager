class asyncGV {
    constructor() {
        this.ready = false;
        this.storage = {};
    }
    //静态方法
    static getInstance() {
        if (!this.instance) {
            this.instance = new asyncGV();
        }
        return this.instance;
    }

    // 在各个异步模块之间同步数据。
    resolve(storage: {}) {
        this.storage = storage;
        if (this.storage) {
            this.ready = true;
        }
        console.log(this.storage)
    }

    state() {
        return this.ready;
    }

    getData() {
        if (this.ready) {
            return this.storage;
        } else {
            console.log("还未准备好");
            return this.ready;
        }
    }

    // 对获取到的storage进行传操作。
    push(k: any, v: any) {
        this.storage[k] = v;
    }

    getK(k: any) {
        return this.storage[k];
    }

}

export { asyncGV }