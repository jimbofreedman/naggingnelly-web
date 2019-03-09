import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import axios from 'axios';
import { ResourceStore } from '@reststate/mobx';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const token = '[the token you received from the POST request above]';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000/todo/api/',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${token}`,
  },
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

  handleToggle(todoItem) {

  }

  render() {
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
            todoItemStore.all().map(todoItem => (
              <ListItem key={todoItem.id} role={undefined} dense button onClick={this.handleToggle(todoItem)}>
                <Checkbox
                  checked={todoItem.attributes.completed !== null}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={todoItem.attributes.title} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Menu">
                    <MenuIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

export default observer(App);
