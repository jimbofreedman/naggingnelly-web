import React, { Component } from 'react';
import './App.css';

import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import axios from 'axios'
import { ResourceStore } from '@reststate/mobx';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import config from './config';

import AddTodoItem from "./AddTodoItem";
import TodoItemList from './TodoItemList';

const token = '[the token you received from the POST request above]';

const httpClient = axios.create({
  baseURL: config.api.endpoint,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${token}`,
  },
});

httpClient.interceptors.request.use((config) => {
  const url = config.url[config.url.length - 1] === '?' ? config.url.substr(0, config.url.length-1) : config.url;
  config.url = url[url-1] === '/' ? url : url + '/';
  return config;
});

const todoItemStore = new ResourceStore({
  name: 'todoItems',
  httpClient,
});

autorun(() => {
    todoItemStore.loadAll().then(todoItems => console.log("loaded", todoItems))
  }, { scheduler: run => { setTimeout(run, 30000) }}
);


class App extends Component {
  componentDidMount() {
    todoItemStore.loadAll().then(todoItems => console.log("loaded", todoItems));
    console.log("loading");
  }

  render() {
    console.log("Render app");

    if (todoItemStore.loading) {
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
