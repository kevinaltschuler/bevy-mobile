'use strict';

var routes = {
  MAIN: {
    TABBAR: { name: 'MainTabBar' },
    NEWPOST: { name: 'NewPost' },
    NEWBEVY: { name: 'NewBevy' },
    COMMENT: { name: 'Comment' },
    PROFILE: { name: 'Profile' }
  },

  NEWPOST: {
    INPUT: { name: 'input' },
    BEVYPICKER: { name: 'bevypicker' }
  },

  SEARCH: {
    IN: { name: 'in' }, // searching
    OUT: { name: 'out' } // not searching
  },

  LOGIN: {
    LOGIN: { name: 'LoginView' },
    FORGOT: { name: 'ForgotView' },
    REGISTER: { name: 'RegisterView' }
  },

  BEVY: {
    POSTLIST: { name: 'PostList' },
    INFO: { name: 'InfoView' },
    SETTINGS: { name: 'BevySettings' }
  },
  
  CHAT: {
    LISTVIEW: { name: 'ListView'},
    CHATVIEW: { name: 'ChatView' }
  },

  PROFILE: {
    USER: { name: 'UserView' }
  },

  NOTIFICATION: {
    LIST: { name: 'NotificationList' }
  }
};

module.exports = routes;