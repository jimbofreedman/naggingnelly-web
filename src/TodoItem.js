import React, { Component } from 'react';

import { observer } from 'mobx-react';

import moment from 'moment';

import { Card, CardHeader, CardContent, CardActions, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FailIcon from '@material-ui/icons/Cancel';
import CancelIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import { DragSource } from 'react-dnd';

import { ItemTypes } from './Constants';

const todoItemSource = {
  beginDrag(props) {
    return { item: props.item };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.updateStatus = this.updateStatus.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  updateStatus(newStatus) {
    this.updateItem({ status: newStatus });
  }

  updateItem(attributes) {
    const { item } = this.props;

    item.update({
      attributes
    })
  }

  render() {
    const { item, connectDragSource } = this.props

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment() ? <ErrorIcon color="error" /> : null;

    return connectDragSource(
      <div>
        <Card>
          <CardHeader
            title={item.attributes.title}
            titleTypographyProps={{
              variant: 'h6',
            }}
            action={<Checkbox
              checked={item.attributes.status === 'complete'}
              tabIndex={-1}
              disableRipple
              onChange={() => this.updateStatus('complete')}
            />}
          />
          <CardContent>
            <Typography variant="subtitle2">
              {overdue} {due ? `Due ${due.fromNow()}` : ''} [streak: {item.attributes.streak}]
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="Menu" onClick={() => this.updateItem({ deleted: true })}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="Menu" onClick={() => this.updateStatus('cancelled')}>
              <CancelIcon />
            </IconButton>
            <IconButton aria-label="Menu" onClick={() => this.updateStatus('failed')}>
              <FailIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default observer(DragSource(ItemTypes.TODO_ITEM, todoItemSource, collect)(TodoItem));

