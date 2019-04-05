import { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import React from 'react';

const todoItemTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem());
    monitor.getItem().item.update({
      attributes: {
        order: props.order,
      }
    });
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isDragging: monitor.getItem() !== null,
  }
}

class TodoItemDropTarget extends Component {
  render() {
    const { connectDropTarget, isDragging } = this.props;

    return connectDropTarget(
      <div style={
        {
          backgroundColor: "#ff0000",
          position: "relative",
          top: "-40px",
          height: "80px",
          opacity: isDragging ? 0.1 : 0.0,
        }
      }></div>
    );
  }
}

export default DropTarget(ItemTypes.TODO_ITEM, todoItemTarget, collect)(TodoItemDropTarget);
