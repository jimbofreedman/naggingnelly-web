import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../Constants';


const todoItemTarget = {
  drop(props, monitor) {
    monitor.getItem().item.update({
      attributes: {
        order: props.order,
      },
    });
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isDragging: monitor.getItem() !== null,
  };
}

class TodoItemDropTarget extends Component {
  render() {
    const { connectDropTarget, isDragging } = this.props;

    return connectDropTarget(
      <div style={
        {
          backgroundColor: '#ff0000',
          position: 'relative',
          top: '-25px',
          height: '50px',
          opacity: isDragging ? 0.1 : 0.0,
          pointerEvents: isDragging ? null : 'none',
        }
      }
      />,
    );
  }
}

export default DropTarget(ItemTypes.TODO_ITEM, todoItemTarget, collect)(TodoItemDropTarget);
