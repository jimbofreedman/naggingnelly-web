import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import './components/App.css';

import { autorun } from 'mobx';
import { Provider } from 'mobx-react';
import axios from 'axios';
import { ResourceStore } from '@reststate/mobx';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as serviceWorker from './serviceWorker';
import App from './components/App';
import theme from './theme';

import config from './config';

import UserStore from './UserStore';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const httpClient = axios.create({
  baseURL: config.api.endpoint,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/vnd.api+json',
  },
});

httpClient.interceptors.request.use((httpConfig) => {
  const url = httpConfig.url[httpConfig.url.length - 1] === '?'
    ? httpConfig.url.substr(0, httpConfig.url.length - 1) : httpConfig.url;
  // eslint-disable-next-line no-param-reassign
  httpConfig.url = url[url - 1] === '/' ? url : `${url}/`;
  return httpConfig;
});

const todoItemStore = new ResourceStore({
  name: 'todoItems',
  httpClient,
});

const userStore = new UserStore(httpClient);

const stores = {
  user: userStore,
  todoItems: todoItemStore,
};

autorun(() => {
  todoItemStore.loadAll();
}, { scheduler: (run) => { setTimeout(run, 30000); } });


// eslint-disable-next-line no-undef
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Provider {...stores}>
      <DragDropContextProvider backend={HTML5Backend}>
        <App />
      </DragDropContextProvider>
    </Provider>
    {/* eslint-disable-next-line no-undef */}
  </MuiThemeProvider>, document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
