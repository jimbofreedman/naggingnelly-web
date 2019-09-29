import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button } from '@material-ui/core';
import AddTodoItem from '../AddTodoItem';
import TodoItemList from '../TodoItemList';
import TimeTracker from '../TimeTracker';

@inject('user', 'todoItems')
@observer
class HomeScreen extends Component {
  componentDidMount() {
    const { todoItems } = this.props;
    todoItems.loadAll();
  }

  render() {
    const { user, todoItems } = this.props;

    if (todoItems.loading && !todoItems.all().length) {
      return <p>Loading…</p>;
    }

    return (
      <div>
        <Button type="button" onClick={user.logout}>Logout</Button>
        <TimeTracker />
        <DragDropContextProvider backend={HTML5Backend}>
          <AddTodoItem create={todoItems.create} />
          <TodoItemList items={todoItems.all()} />
          {todoItems.error ? <p>Error loading items.</p> : null}
        </DragDropContextProvider>
      </div>
    );
  }
}

export default observer(HomeScreen);
