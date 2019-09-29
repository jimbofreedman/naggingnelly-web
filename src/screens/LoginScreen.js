// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';
import {
  Paper, Button, TextField,
} from '@material-ui/core';

class LoginForm extends Form {
  constructor(doLogin) {
    super();

    this.doLogin = doLogin;
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
        name: 'email',
        placeholder: 'E-mail',
        rules: 'required|string',
        value: '',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password',
        rules: 'required|string',
        value: '',
      }],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  hooks() {
    return {
      onSuccess(form) {
        this.doLogin(form.values());
      },
    };
  }
}

@inject('user')
@observer
class Login extends Component {
  constructor(props) {
    super(props);

    this.form = new LoginForm(props.user.login);
  }

  render() {
    return (
      <form>
        <Paper>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <TextField {...this.form.$('email').bind()} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <TextField {...this.form.$('password').bind()} />
          <Button type="button" onClick={this.form.onSubmit}>Login</Button>
        </Paper>
      </form>
    );
  }
}

export default Login;
