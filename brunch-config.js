module.exports = {
  files: {
    javascripts: {
      joinTo: 'locflow.js',
      order: {
        before: ['src/locflow.js'],
      }
    }
  },
  paths: {
    watched: ['src']
  },
  modules: {
    wrapper: false,
    definition: false,
  },
  npm: {
    enabled: false,
  }
};
