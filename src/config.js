const config = {
  development: {
    api: {
      endpoint: 'http://localhost:8000/todo/api/',
    },
    autoRefresh: false,
  },
  test: {
    api: {
      endpoint: 'http://localhost:8000/todo/api/',
    },
    autoRefresh: false,
  },
  production: {
    api: {
      endpoint: 'https://naggingnelly-backend.herokuapp.com/todo/api',
    },
    autoRefresh: true,
  },
};

export default config[process.env.NODE_ENV];
