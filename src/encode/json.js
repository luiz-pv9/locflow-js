(function() {
  Locflow.Encode = Locflow.Encode || {};
  Locflow.Encode.Json = class Json {
    constructor(json) {
      this.json = json;
    }

    toQueryString() {
      let flatMap = this.generateFlatArray();
      if(Object.keys(flatMap).length === 0) {
        return '';
      }
      return flatMap.map(pair => { return this.encodeKeyValuePair(pair) })
        .reduce((arr, val) => { return arr.concat(val) })
        .reduce((query, pair) => { return query += pair + '&' }, '')
        .replace(/\&$/, '');
    }

    generateFlatArray(target, path, json) {
      if(target == null) { target = []; }
      if(path == null) { path = []; }
      if(json == null) { json = this.json; }
      Object.keys(json).forEach(key => {
        let value = json[key];
        let keyPath = Locflow.cloneArray(path);
        keyPath.push(key);
        if(typeof value === 'object' && !Array.isArray(value)) {
          this.generateFlatArray(target, keyPath, value);
        } else {
          target.push({ key: keyPath, value });
        }
      });
      return target;
    }

    encodeKeyValuePair(attrs) {
      let key = attrs.key;
      let value = attrs.value;
      if(Array.isArray(value) && value.length > 1) {
        return value.map(singleValue => {
          return this.encodeSingleKeyValuePair({ key, value: [singleValue] })
        }).reduce((arr, val) => { return arr.concat(val) });
      } else {
        return this.encodeSingleKeyValuePair({ key, value });
      }
    }

    encodeSingleKeyValuePair(attrs) {
      let key = attrs.key;
      let value = attrs.value;
      let suffix = '';
      if(Array.isArray(value)) {
        suffix = '[]';
        value = value[0];
      }
      value = encodeURI(value);
      if(key.length === 1) {
        return [`${key[0]}${suffix}=${value}`];
      } else {
        let joinedKey = key[0];
        key.slice(1).forEach(path => {
          joinedKey += `[${path}]`;
        });
        return [`${joinedKey}${suffix}=${value}`];
      }
    }
  };
})();
