import React from 'react';
import './App.css';

import { observer } from 'mobx-react';
import moment from 'moment';

import TodoItem from './TodoItem';
import TodoItemDropTarget from './TodoItemDropTarget';

const TodoItemList = ({ items }) => {
  const now = moment().format();

  const sortedItems = items
    .filter((item) => !item.attributes.deleted
      && item.attributes.status === 'open'
      && (!item.attributes.start || item.attributes.start < now))
    .sort((a, b) => a.attributes.order - b.attributes.order);

  if (sortedItems.length === 0) {
    return <p>No items</p>;
  }

  return (
    <div>
      <TodoItemDropTarget order={sortedItems[0].attributes.order - 1} />
      {
        sortedItems.map((item, index, array) => {
          // We want to reorder items between this and the next, but if we are the last, just add 1
          const reorderValue = (index + 1) < array.length
            ? (item.attributes.order + array[index + 1].attributes.order) / 2
            : item.attributes.order + 1;

          return (
            <div
              key={item.id}
              style={{
                marginTop: '-25px', marginBottom: '-45px',
              }}
            >
              <TodoItem item={item} />
              <TodoItemDropTarget order={reorderValue} />
            </div>
          );
        })
      }
    </div>
  );
};

export default observer(TodoItemList);
