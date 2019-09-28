import React, { Component } from 'react';

import { observer } from 'mobx-react';

import moment from 'moment';

import { Badge, Card, CardHeader, CardContent, CardActions, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FailIcon from '@material-ui/icons/Cancel';
import CancelIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
  handleClick(event) {
    this.setState({
      menuAnchorElement: event.currentTarget,
    })
  }

  handleClose(callback) {
    this.setState({
      menuAnchorElement: null,
    });
    if (callback && callback.apply) {
      callback();
    }
  }

  constructor(props) {
    super(props);

    this.updateStatus = this.updateStatus.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      menuAnchorElement: null,
    };
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
    const TodoMenuItem = ({icon, text, onClick}) => {
      return (
        <MenuItem onClick={() => {this.handleClose(onClick)}}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} />
        </MenuItem>
      );
    };

    const { item, connectDragSource } = this.props

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment() ? <ErrorIcon color="error" /> : null;

    const header = (<Badge color="primary" badgeContent={item.attributes.streak}>
      <Typography variant="h6">{item.attributes.title}</Typography>
    </Badge>);

    return connectDragSource(
      <div>
        <Card>
          <CardHeader
            title={header}
            disableTypography={true}
            avatar={
              <Checkbox
                checked={item.attributes.status === 'complete'}
                tabIndex={-1}
                disableRipple
                onChange={() => this.updateStatus('complete')}
              />
            }
            action={
              <div>
                <IconButton aria-label="settings" onClick={this.handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.menuAnchorElement}
                  autoFocus
                  open={this.state.menuAnchorElement !== null}
                  onClose={this.handleClose}
                >
                  <TodoMenuItem icon=<CancelIcon /> text={"Cancel"} onClick={() => this.updateStatus('cancelled')} />
                  <TodoMenuItem icon=<FailIcon /> text={"Fail"} onClick={() => this.updateStatus('failed')} />
                  <TodoMenuItem icon=<DeleteIcon /> text={"Delete"} onClick={() => this.updateItem({ deleted: true })} />
                </Menu>
              </div>

            }
          />
          {due ? <CardContent>
            <Typography variant="subtitle2">
              {overdue} {due ? `Due ${due.fromNow()}` : ''}
            </Typography>
          </CardContent> : null}
        </Card>
      </div>
    );
  }
}

export default observer(DragSource(ItemTypes.TODO_ITEM, todoItemSource, collect)(TodoItem));

