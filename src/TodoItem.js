import React, { Component } from 'react';

import { observer } from 'mobx-react';

import moment from 'moment';

import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FailIcon from '@material-ui/icons/Cancel';
import CancelIcon from '@material-ui/icons/RemoveCircle';
import ErrorIcon from '@material-ui/icons/Error';

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.updateStatus = this.updateStatus.bind(this);
  }

  updateStatus(newStatus) {
    const { item } = this.props;

    item.update({
      attributes: {
        status: newStatus,
      },
    })
  }

  render() {
    const { item } = this.props

    const due = item.attributes.due ? moment(item.attributes.due) : null;
    const overdue = due && due < moment() ? <ErrorIcon color="error" /> : null;

    return (
      <Card>
        <CardHeader
          title={item.attributes.title}
          action={<Checkbox
            checked={item.attributes.status === "complete"}
            tabIndex={-1}
            disableRipple
            onChange={() => this.updateStatus('complete')}
          />}
        />
        <CardContent>{overdue} {item.attributes.due} ({due ? due.fromNow() : ''}) [streak: {item.attributes.streak}]</CardContent>
        <CardActions>
          <IconButton aria-label="Menu" onClick={() => this.updateStatus('cancelled')}>
            <CancelIcon />
          </IconButton>
          <IconButton aria-label="Menu" onClick={() => this.updateStatus('failed')}>
            <FailIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default observer(TodoItem);

