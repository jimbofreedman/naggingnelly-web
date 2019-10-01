import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Button } from '@material-ui/core';
import AddTodoItem from '../components/AddTodoItem';
import TodoItemList from '../components/TodoItemList';
import TimeTracker from '../components/TimeTracker';

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
        <AddTodoItem create={todoItems.create} />
        <TodoItemList items={todoItems.all()} />
        {todoItems.error ? <p>Error loading items.</p> : null}
      </div>
    );
  }
}

export default observer(HomeScreen);
