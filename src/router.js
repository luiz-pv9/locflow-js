(function() {
  Locflow.Router = class Router {
    constructor() {
      this.routes = [];
      this.defaultNavigation = new Locflow.Navigation();
      this.defaultNavigation.cache = new Locflow.Cache();
    }

    removeAll() {
      this.routes = [];
    }

    register(path, callbacks) {
      let route = {
        cache: new Locflow.Cache(),
        url: new Locflow.Url(path),
        restore: callbacks.restore,
        onVisit: callbacks.onVisit,
        onLeave: callbacks.onLeave,
      };
      this.routes.push(route);
      return route;
    }

    findMatch(path) {
      let route = this.routes.find(route => {
        return route.url.match(new Locflow.Url(path));
      });
      return route ? route : this.defaultNavigation;
    }

    invokeCustomRoute(visit) {
      let route = this.findMatch(visit.url);
      if(route instanceof Locflow.Navigation) {
        this.currentRoute = route;
        this.latestVisit = visit;
      } else {
        this.callRouteVisitActions(visit, route);
      }
    }

    invokeVisit(visit) {
      let route = this.findMatch(visit.url);
      this.callRouteVisitActions(visit, route);
    }

    callRouteVisitActions(visit, route) {
      if(this.currentRoute != null && this.currentRoute.onLeave) {
        this.currentRoute.onLeave(this.latestVisit, this.currentRoute.cache);
      }

      this.currentRoute = route;
      this.latestVisit = visit;
      if(visit.action !== 'restore') {
        route.onVisit(visit, route.cache);
      }
    }

    restore(visit) {
      let route = this.findMatch(visit.url);
      route.restore(visit, route.cache);
      if(visit.action === 'restore') {
        setTimeout(() => { 
          visit.finish(); 
        });
      }
    }
  };

  Locflow.router = new Locflow.Router();
})();
