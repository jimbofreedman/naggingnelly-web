import React, { Component } from 'react';
import './App.css';

import { observer } from 'mobx-react';
import moment from 'moment';

import TodoItem from './TodoItem';
import TodoItemDropTarget from './TodoItemDropTarget';

class TodoItemList extends Component {
  render() {
    const now = moment().format();

    const items = this.props.items
      .filter(item => !item.attributes.deleted &&
        item.attributes.status === 'open' &&
        (!item.attributes.start || item.attributes.start < now))
      .sort((a, b) => a.attributes.order - b.attributes.order);

    if (items.length === 0) {
      return <p>No items</p>;
    }

    return (
      <div>
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
      </div>
    );
  }
}

export default observer(TodoItemList);
