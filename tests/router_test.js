describe('Locflow.Router specs', () => {
  let router;

  beforeEach(() => {
    router = new Locflow.Router();
  });

  describe('#register', () => {
    it('registers a route', () => {
      let route = router.register('/home', {
        onVisit: function() {},
        onLeave: function() {},
      });
      expect(router.findMatch('/home')).to.eq(route);
    });

    it('generates isolated cache objects', () => {
      let route1 = router.register('/home', {
        onVisit: function() {},
        onLeave: function() {},
      });
      let route2 = router.register('/about', {
        onVisit: function() {},
        onLeave: function() {},
      });
      expect(route1.cache).to.be.an.instanceof(Locflow.Cache);
      expect(route2.cache).to.be.an.instanceof(Locflow.Cache);
      expect(route1).not.to.eq(route2);
    });
  });

  describe('#findMatch', () => {
    it('returns the first match', () => {
      let first = { onVisit: function(){}, onLeave: function(){} };
      let second = { onVisit: function(){}, onLeave: function(){} };
      router.register('/home', first);
      router.register('/home', second);
      let match = router.findMatch('/home');
      expect(match.onVisit).to.eq(first.onVisit);
    });

    it('returns default navigation if not found', () => {
      let match = router.findMatch('/something');
      expect(match instanceof Locflow.Navigation).to.be.true;
    });
  });

  describe('#invokeVisit', () => {
    let homeRoute, aboutRoute, visit;
    beforeEach(() => {
      homeRoute = router.register('/home', {
        onVisit: visit => { visit.goingTo = 'home'; },
        onLeave: visit => { visit.leavingFrom = 'home'; },
        restore: visit => { visit.restoringIn= 'home'; },
      });
      aboutRoute = router.register('/about', {
        onVisit: visit => { visit.goingTo = 'about'; },
        onLeave: visit => { visit.leavingFrom = 'about'; },
        restore: visit => { visit.restoringIn= 'about'; },
      });
      visit = new Locflow.Visit('/home');
      router.invokeVisit(visit);
    });

    it('stores the matched route', () => {
      expect(router.currentRoute).to.eq(homeRoute);
    });

    it('stores the latest visit', () => {
      expect(router.latestVisit).to.eq(visit);
    });

    it('invokes onVisit', () => {
      expect(visit.goingTo).to.eq('home');
    });

    it('invokes onLeave', () => {
      let latestVisit = router.latestVisit;
      let visit = new Locflow.Visit('/about');
      router.invokeVisit(visit);
      expect(latestVisit.leavingFrom).to.eq('home');
      expect(visit.goingTo).to.eq('about');
    });
  });

  describe('#restore', () => {
    it('calls restore callback', () => {
      router.register('/home', {
        restore: visit => { visit.restoringIn = 'home'; }
      });
      let visit = new Locflow.Visit('/home');
      router.restore(visit);
      expect(visit.restoringIn).to.eq('home');
    });
  });
});
