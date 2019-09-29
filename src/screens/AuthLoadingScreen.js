import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('userStore')
@observer
class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    const { userStore } = this.props;
    userStore.getUser();
  }

  render() {
    return <div>Checking Login</div>;
  }
}

export default AuthLoadingScreen;
