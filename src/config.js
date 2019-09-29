const config = {
  development: {
    api: {
      endpoint: 'http://localhost:8000/api/',
    },
    autoRefresh: false,
    pomodoroDuration: 25 * 60 * 1000,
  },
  test: {
    api: {
      endpoint: 'http://localhost:8000/api/',
    },
    autoRefresh: false,
    pomodoroDuration: 1 * 30 * 1000,
  },
  production: {
    api: {
      endpoint: 'https://naggingnelly-backend.herokuapp.com/api',
    },
    autoRefresh: true,
    pomodoroDuration: 25 * 30 * 1000,
  },
};

export default config[process.env.NODE_ENV];
