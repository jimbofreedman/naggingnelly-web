import React, { Component } from 'react';
import './App.css';

import { autorun } from 'mobx';
import { Provider, observer } from 'mobx-react';
import axios from 'axios';
import { ResourceStore } from '@reststate/mobx';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button } from '@material-ui/core';
import theme from './theme';

import config from './config';

import UserStore from './UserStore';
import Login from './Login';
import AddTodoItem from './AddTodoItem';
import TodoItemList from './TodoItemList';
import TimeTracker from './TimeTracker';

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

autorun(() => {
  todoItemStore.loadAll();
}, { scheduler: (run) => { setTimeout(run, 30000); } });


class App extends Component {
  componentDidMount() {
    userStore.getUser();
  }

  render() {
    if (todoItemStore.loading && !todoItemStore.all().length) {
      return <p>Loading…</p>;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Provider userStore={userStore} todoItemStore={todoItemStore}>
          <div className="App">
            <Login />
            <TimeTracker />
            <DragDropContextProvider backend={HTML5Backend}>
              <AddTodoItem create={todoItemStore.create} />
              <TodoItemList items={todoItemStore.all()} />
              {todoItemStore.error ? <p>Error loading items.</p> : null}
            </DragDropContextProvider>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default observer(App);
