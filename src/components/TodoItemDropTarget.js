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
    const { direction, connectDropTarget, isDragging } = this.props;

    return connectDropTarget(
      <div style={
        {
          backgroundColor: '#808000',
          position: 'relative',
          top: direction === 'up' ? '25px' : '-25px',
          height: '25px',
          marginTop: direction === 'up' ? '-25px' : '0px',
          marginBottom: direction === 'up' ? '0px' : '-25px',
          opacity: isDragging ? 0.1 : 0.0,
          pointerEvents: isDragging ? null : 'none',
        }
      }
      />,
    );
  }
}

export default DropTarget(ItemTypes.TODO_ITEM, todoItemTarget, collect)(TodoItemDropTarget);
