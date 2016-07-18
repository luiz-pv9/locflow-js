(function() {
  Locflow.cloneArray = function cloneArray(arr) {
    return arr.map(elm => { return elm; });
  }

  Locflow.mergeObjects = function mergeObjects(obj1, obj2) {
    let merged = {};
    Object.keys(obj2 || {}).forEach(key => {
      merged[key] = obj2[key];
    });
    Object.keys(obj1 || {}).forEach(key => {
      merged[key] = obj1[key];
    });
    return merged;
  }
})();
