import React, { Component } from 'react';

import { observer } from 'mobx-react';

import moment from 'moment';

import {
  Badge, Card, CardHeader, Typography, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FailIcon from '@material-ui/icons/Cancel';
import CancelIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/styles';

import { DragSource } from 'react-dnd';

import { ItemTypes } from '../Constants';

const styles = {
  root: {
    background: (props) => ((props.item.attributes.due
      && moment(props.item.attributes.due) < moment())
      ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'),
  },
};

const todoItemSource = {
  beginDrag(props) {
    return { item: props.item };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.updateStatus = this.updateStatus.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.snoozeItem = this.snoozeItem.bind(this);
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
      attributes,
    });
  }

  snoozeItem(days) {
    this.updateItem({ start: moment().add(days, 'days') });
  }

  handleClick(event) {
    this.setState({
      menuAnchorElement: event.currentTarget,
    });
  }

  handleClose(callback) {
    this.setState({
      menuAnchorElement: null,
    });
    if (callback && callback.apply) {
      callback();
    }
  }

  render() {
    const TodoMenuItem = ({ icon, text, onClick }) => (
      <MenuItem onClick={() => { this.handleClose(onClick); }}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </MenuItem>
    );

    const { classes, item, connectDragSource } = this.props;
    const { menuAnchorElement } = this.state;

    const due = item.attributes.due ? moment(item.attributes.due) : null;

    const header = (
      <Badge color="primary" badgeContent={item.attributes.streak}>
        <Typography variant="h6">{item.attributes.title}</Typography>
      </Badge>
    );

    const subheader = due ? (
      <Typography>
        {`Due ${due.fromNow()}`}
      </Typography>
    ) : null;

    return connectDragSource(
      <div>
        <Card className={classes.root}>
          <CardHeader
            title={header}
            subheader={subheader}
            disableTypography
            avatar={(
              <Checkbox
                checked={item.attributes.status === 'complete'}
                tabIndex={-1}
                disableRipple
                onChange={() => this.updateStatus('complete')}
              />
)}
            action={(
              <div>
                <IconButton aria-label="settings" onClick={this.handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={menuAnchorElement}
                  autoFocus
                  open={menuAnchorElement !== null}
                  onClose={this.handleClose}
                >
                  <TodoMenuItem icon=<CancelIcon /> text="Cancel" onClick={() => this.updateStatus('cancelled')} />
                  <TodoMenuItem icon=<FailIcon /> text="Fail" onClick={() => this.updateStatus('failed')} />
                  <TodoMenuItem icon=<DeleteIcon /> text="Delete" onClick={() => this.updateItem({ deleted: true })} />
                  <TodoMenuItem icon=<DeleteIcon /> text="Snooze 1 day" onClick={() => this.snoozeItem(1)} />
                  <TodoMenuItem icon=<DeleteIcon /> text="Snooze 2 days" onClick={() => this.snoozeItem(2)} />
                  <TodoMenuItem icon=<DeleteIcon /> text="Snooze 3 days" onClick={() => this.snoozeItem(3)} />
                  <TodoMenuItem icon=<DeleteIcon /> text="Snooze 1 week" onClick={() => this.snoozeItem(7)} />
                </Menu>
              </div>
)}
          />
        </Card>
      </div>,
    );
  }
}

const observed = observer(DragSource(ItemTypes.TODO_ITEM, todoItemSource, collect)(TodoItem));
export default withStyles(styles)(observed);
