// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form } from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';
import { Paper, Button, Input } from '@material-ui/core';

class AddTodoItemForm extends Form {
  constructor(create) {
    super();

    this.create = create;
  }

  // eslint-disable-next-line class-methods-use-this
  plugins() {
    return {
      dvr: dvr(validatorjs),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  setup() {
    return {
      fields: [{
        name: 'title',
        placeholder: 'Add new item',
        rules: 'required|string',
        value: '',
      }],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  hooks() {
    return {
      onSuccess(form) {
        this.create({ attributes: { order: 0, ...form.values() } });
      },
      // onError(form) {
      //   console.log('All form errors', form.errors());
      // }
    };
  }
}

class AddTodoItem extends Component {
  constructor(props) {
    super(props);

    this.form = new AddTodoItemForm(props.create);
  }

  render() {
    return (
      <form>
        <Paper>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Input {...this.form.$('title').bind()} />
          <Button type="button" onClick={this.form.onSubmit}>Add</Button>
        </Paper>
      </form>
    );
  }
}

export default observer(AddTodoItem);
