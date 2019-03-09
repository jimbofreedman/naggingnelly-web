import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import axios from 'axios';
import { ResourceStore } from '@reststate/mobx';

import List from '@material-ui/core/List';

import TodoItem from './TodoItem';

const token = '[the token you received from the POST request above]';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000/todo/api/',
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

class App extends Component {
  componentDidMount() {
    todoItemStore.loadAll().then(todoItems => console.log("loaded", todoItems));
    console.log("loading");
  }

  render() {
    console.log("rendering list");

    if (todoItemStore.loading) {
      return <p>Loading…</p>;
    }

    if (todoItemStore.error) {
      return <p>Error loading posts.</p>;
    }

    return (
      <div className="App">
        <List>
          {
            todoItemStore.all().map(item => (
              <TodoItem key={item.id} item={item} />
            ))
          }
        </List>
      </div>
    );
  }
}

export default observer(App);
