import React, { Component } from 'react';
import './App.css';

import { inject, observer } from 'mobx-react';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';


@inject('user')
@observer
class App extends Component {
  componentDidMount() {
    const { user } = this.props;
    user.getUser();
  }

  render() {
    const { user } = this.props;

    if (user.loading) {
      return <div>Loading</div>;
    }

    if (!user.isLoggedIn) {
      return <LoginScreen />;
    }

    return <HomeScreen />;
  }
}

export default observer(App);
