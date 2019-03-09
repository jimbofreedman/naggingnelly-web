import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import axios from 'axios';
import moment from 'moment';
import { ResourceStore } from '@reststate/mobx';

import List from '@material-ui/core/List';

import config from './config';

import TodoItem from './TodoItem';

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

class App extends Component {
  componentDidMount() {
    todoItemStore.loadAll().then(todoItems => console.log("loaded", todoItems));
    console.log("loading");
  }

  render() {
    if (todoItemStore.loading) {
      return <p>Loading…</p>;
    }

    if (todoItemStore.error) {
      return <p>Error loading posts.</p>;
    }

    const now = moment().format();

    return (
      <div className="App">
        <List>
          {
            todoItemStore.all()
              .filter(item => item.attributes.status === 'open' && item.attributes.start < now)
              .map(item => (
                <TodoItem key={item.id} item={item} />
              ))
          }
        </List>
      </div>
    );
  }
}

export default observer(App);
