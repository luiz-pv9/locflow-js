(function() {
  Locflow.Cache = class Cache {
    constructor() {
      this.data = {};
      this.limit = 9999;
    }

    setSize(limit) {
      this.limit = limit;
      this.removeExceeding();
    }

    sortedKeysByTime() {
      let sorted = [];
      Object.keys(this.data).forEach(key => {
        sorted.push([key, this.data[key].timestamp]);
      });
      return sorted.sort((a, b) => {
        return a[1] - b[1];
      }).map(rec => { return rec[0] });
    }

    removeExceeding() {
      let pending = Object.keys(this.data).length - this.limit;
      let sortedKeys = this.sortedKeysByTime();
      while(pending > 0) {
        this.remove(sortedKeys.shift());
        pending -= 1;
      }
    }

    expireAfter(key, timeout) {
      let record = this.data[key];
      if(record) {
        record.expireTimeout = setTimeout(() => {
          this.remove(key);
        }, timeout);
      }
    }

    /**
     * Called before `set`. This functions clears a possible expire timeout
     * for an existing key.
     */
    prepare(key) {
      let record = this.getRecord(key);
      if(record && record.expireTimeout) {
        clearTimeout(record.expireTimeout);
      }
    }

    put(key, value, opts = {}) {
      this.prepare(key);

      this.data[key] = { value, timestamp: new Date().getTime() };
      this.removeExceeding();

      if(opts.expire) {
        this.expireAfter(key, opts.expire);
      }
    }

    getRecord(key) {
      return this.data[key];
    }

    has(key) {
      return this.get(key) !== undefined;
    }

    get(key, defaultValue) {
      let record = this.getRecord(key);
      return record === undefined ? defaultValue : record.value;
    }

    remove(key) {
      let record = this.data[key];
      delete this.data[key];
      return record ? record.value : undefined;
    }

    removeAll() {
      Object.keys(this.data).forEach(key => {
        this.remove(key);
      });
    }
  }
})();
