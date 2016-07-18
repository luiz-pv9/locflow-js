(function() {
  Locflow.Dispatcher = class Dispatcher {
    constructor(prefix = 'locflow:') {
      this.prefix = prefix;
    }

    dispatchOn(targets, eventName, data) {
      targets.forEach(target => {
        this.dispatch(eventName, {target, data});
      });
    }

    dispatch(eventName, {target, data} = {}) {
      let ev = document.createEvent('Events');
      ev.initEvent(this.normalizeName(eventName), true, true);
      ev.data = data || {};
      (target || document).dispatchEvent(ev);
      return ev;
    }

    normalizeName(name) {
      return this.prefix + name;
    }
  }

  Locflow.dispatcher = new Locflow.Dispatcher('locflow:');
})();
