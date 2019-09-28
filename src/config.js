const config = {
  development: {
    api: {
      endpoint: 'http://localhost:8000/todo/api/',
    },
    autoRefresh: false,
    pomodoroDuration: 1 * 30 * 1000,
    togglApiToken: process.env.TOGGL_API_TOKEN,
  },
  test: {
    api: {
      endpoint: 'http://localhost:8000/todo/api/',
    },
    autoRefresh: false,
    pomodoroDuration: 1 * 30 * 1000,
    togglApiToken: process.env.TOGGL_API_TOKEN,
  },
  production: {
    api: {
      endpoint: 'https://naggingnelly-backend.herokuapp.com/todo/api',
    },
    autoRefresh: true,
    pomodoroDuration: 25 * 30 * 1000,
    togglApiToken: process.env.TOGGL_API_TOKEN,
  },
};

export default config[process.env.NODE_ENV];
