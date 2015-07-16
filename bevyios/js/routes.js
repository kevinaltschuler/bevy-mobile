'use strict';

var routes = {
  MAIN: {
    LOADING: { name: 'LoadingView', index: 0 },
    LOGIN: { name: 'LoginNavigator', index: 1 },
    TABBAR: { name: 'MainTabBar', index: 2 }
  },

  LOGIN: {
    LOGIN: { name: 'LoginView', index: 0 },
    FORGOT: { name: 'ForgotView', index: 1 },
    REGISTER: { name: 'RegisterView', index: 2 }
  }
};

module.exports = routes;