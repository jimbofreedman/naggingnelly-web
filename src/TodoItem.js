import React, { Component } from 'react';

import { observer } from 'mobx-react';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    const { item } = this.props;

    item.update({
      attributes: {
        status: item.attributes.status === 'open' ? 'complete' : 'open',
      },
    }).then(() => {
      // this.forceUpdate();
    });
  }

  componentWillReact() {
    console.log("I will re-render, since the todo has changed!");
  }

  render() {
    const { item } = this.props;

    console.log(item.attributes.status, item.attributes.due);

    return (
      <ListItem role={undefined} dense button onClick={this.handleToggle}>
        <Checkbox
          checked={item.attributes.status === "complete"}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={item.attributes.title + item.attributes.due} />
        <ListItemSecondaryAction>
          <IconButton aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default observer(TodoItem);
