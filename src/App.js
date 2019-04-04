import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import axios from 'axios';
import moment from 'moment';
import { ResourceStore } from '@reststate/mobx';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { DragSource, DropTarget } from 'react-dnd'

import config from './config';

import { ItemTypes } from './Constants';
import TodoItem from './TodoItem';
import TodoItemDropTarget from './TodoItemDropTarget';

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

    const items = todoItemStore.all().filter(item => item.attributes.status === 'open' && item.attributes.start < now);

    return (
      <div className="App">
        <DragDropContextProvider backend={HTML5Backend}>
          <TodoItemDropTarget id={null} /> { /* special case for dragging TodoItem to top of list - "after nothing" */ }
          {
            items
              .map(item => (
                <TodoItem key={item.id} item={item} />
              ))
          }
        </DragDropContextProvider>
      </div>
    );
  }
}

export default observer(App);
