import { observable, action, computed } from 'mobx';

export default class UserStore {
  @observable user = null;

  @observable loading = true;

  constructor(httpClient) {
    this.httpClient = httpClient;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  @computed get isLoggedIn() {
    return this.user != null;
  }

  @action login(credentials) {
    this.httpClient.post('auth/login', {
      data: {
        type: 'loginViews',
        attributes: credentials,
      },
    }).then(() => {
      this.getUser();
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  }

  @action logout() {
    this.httpClient.post('auth/logout', {
      data: {
        type: 'logoutViews',
      },
    }).then(() => {
      this.user = null;
    });
    // .catch((error) => {
    //
    // });
  }

  @action getUser() {
    this.loading = true;
    this.httpClient.get('users/me').then((response) => {
      this.user = response.data.data;
    })
    // .catch((error) => {
    //   console.log(error);
    // });
      .finally(() => {
        this.loading = false;
      });
  }
}
