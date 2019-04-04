import { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import React from 'react';

const todoItemTarget = {
  drop(props, monitor) {
    console.log("move", props, monitor.getItemType(), monitor.getItem().id, "to", props.id);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

class TodoItemDropTarget extends Component {
  render() {
    const { id, connectDropTarget } = this.props;

    return connectDropTarget(
      <div>
        {id}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.TODO_ITEM, todoItemTarget, collect)(TodoItemDropTarget);
