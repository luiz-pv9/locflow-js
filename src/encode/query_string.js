(function() {
  Locflow.Encode = Locflow.Encode || {};
  Locflow.Encode.QueryString = class QueryString {
    constructor(query) {
      this.query = query.replace('?', '');
    }

    toJson() {
      return this.generateNestedMap(this.generateFlatMap());
    }

    isValid() {
      return Object.keys(this.generateFlatMap()).length > 0;
    }

    generateNestedMap(flatMap) {
      let nested = {};
      Object.keys(flatMap).forEach(key => {
        let nestedPath = this.findNestedPath(key);
        this.assignNestedValue(nested, nestedPath, flatMap[key]);
      });
      return nested;
    }

    findNestedPath(key) {
      let pathRegex = /^[^\[\]]+(\[[^\[\]]*\])*$/;
      if( ! key.match(pathRegex)) { return [key]; }
      return key.split('[')
        .map(path => { return path.replace(']', '').trim() })
        .filter(step => { return step.trim() !== ''; });
    }

    assignNestedValue(map, path, value) {
      let originalMap = map;
      path.forEach((step, index) => {
        if( ! map[step]) {
          map[step] = {};
        }
        if(index === path.length -1) {
          map[step] = value;
        } else {
          map = map[step];
        }
      });
      return originalMap;
    }

    generateFlatMap() {
      let queryParts = this.query.split('&');
      let pairs = {};
      queryParts.forEach(queryPart => {
        this.mergeKeyValuePair(pairs, this.splitKeyValue(queryPart));
      });
      return pairs;
    }

    mergeKeyValuePair(pairs, { key, value } = {}) {
      if(!key || !value) { return pairs; }
      if(pairs[key] && Array.isArray(pairs[key])) {
        pairs[key].push(value);
      } else if(pairs[key]) {
        pairs[key] = [pairs[key], value];
      } else {
        pairs[key] = /\[\]$/.test(key) ? [value] : value;
      }
    }

    splitKeyValue(queryPart) {
      let values = queryPart.split('=');
      if(values.length !== 2) { return; }
      return { 
        key: values[0], 
        value: decodeURIComponent(values[1]) 
      };
    }
  };
})();
