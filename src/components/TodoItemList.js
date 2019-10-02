import React from 'react';
import './App.css';

import { observer } from 'mobx-react';
import moment from 'moment';

import Infinite from 'react-infinite';

import TodoItem from './TodoItem';
import TodoItemDropTarget from './TodoItemDropTarget';

const TodoItemList = ({ items }) => {
  const scrollerHeight = 1200;

  return (
    <div style={{ height: scrollerHeight }}>
      <Infinite containerHeight={scrollerHeight} elementHeight={69}>
        {
          items.map((item, index, array) => {
            // We want to reorder items between this and next, but if we are the last, just add 1
            const reorderValuePrevious = index > 0
              ? (item.attributes.order + array[index - 1].attributes.order) / 2
              : item.attributes.order - 1;
            const reorderValueNext = (index + 1) < array.length
              ? (item.attributes.order + array[index + 1].attributes.order) / 2
              : item.attributes.order + 1;

            return (
              <div
                key={item.id}
                style={{ marginBottom: '-50px' }}
              >
                <TodoItemDropTarget direction="up" order={reorderValuePrevious} />
                <TodoItem item={item} />
                <TodoItemDropTarget direction="down" order={reorderValueNext} />
              </div>
            );
          })
        }
      </Infinite>
    </div>
  );
};

export default observer(TodoItemList);
