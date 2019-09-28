import React, { Component } from 'react';
import './App.css';

import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import axios from 'axios';
import { ResourceStore } from '@reststate/mobx';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import theme from './theme';

import config from './config';

import AddTodoItem from './AddTodoItem';
import TodoItemList from './TodoItemList';

const token = '[the token you received from the POST request above]';

const httpClient = axios.create({
  baseURL: config.api.endpoint,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${token}`,
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

autorun(() => {
  todoItemStore.loadAll();
}, { scheduler: (run) => { setTimeout(run, 30000); } });


class App extends Component {
  componentDidMount() {
    todoItemStore.loadAll();
  }

  render() {
    if (todoItemStore.loading && !todoItemStore.all().length) {
      return <p>Loading…</p>;
    }

    if (todoItemStore.error) {
      return <p>Error loading items.</p>;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <DragDropContextProvider backend={HTML5Backend}>
            <AddTodoItem create={todoItemStore.create} />
            <TodoItemList items={todoItemStore.all()} />
          </DragDropContextProvider>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default observer(App);
