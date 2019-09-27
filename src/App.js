import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import axios from 'axios';
import moment from 'moment';
import { ResourceStore } from '@reststate/mobx';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import config from './config';

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
    console.log("Render app");

    if (todoItemStore.loading) {
      return <p>Loading…</p>;
    }

    if (todoItemStore.error) {
      return <p>Error loading items.</p>;
    }

    const now = moment().format();

    const items = todoItemStore.all()
      .filter(item => !item.attributes.deleted &&
        item.attributes.status === 'open' &&
        (!item.attributes.start || item.attributes.start < now))
      .sort((a, b) => a.attributes.order - b.attributes.order);

    if (items.length === 0) {
      return <p>No items</p>;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <DragDropContextProvider backend={HTML5Backend}>
            <TodoItemDropTarget order={items[0].attributes.order - 1} />
            {
              items.map((item, index, array) => {

                // We want to reorder items between this and the next, but if we are the last, just add 1
                const reorderValue = (index + 1) < array.length ?
                  (item.attributes.order + array[index + 1].attributes.order) / 2 :
                  item.attributes.order + 1;

                return (
                  <div key={item.id} style={{
                    marginTop: "-40px",
                  }}>
                    <TodoItem item={item} />
                    <TodoItemDropTarget order={reorderValue} />
                  </div>
                )
              })
            }
          </DragDropContextProvider>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default observer(App);
