'use strict';

var routes = {
  MAIN: {
    LOADING: { name: 'LoadingView', index: 0 },
    LOGIN: { name: 'LoginNavigator', index: 1 },
    TABBAR: { name: 'MainTabBar', index: 2 },
    NEWPOST: { name: 'NewPost', index: 3 },
    NEWBEVY: { name: 'NewBevy', index: 4 },
    NEWSUBBEVY: { name: 'NewSubBevy', index: 5 },
    COMMENT: { name: 'Comment', index: 6 }
  },

  NEWPOST: {
    INPUT: { name: 'input', index: 0 },
    BEVYPICKER: { name: 'bevypicker', index: 1 }
  },

  SEARCH: {
    IN: { name: 'in', index: 0 }, // searching
    OUT: { name: 'out', index: 1 } // not searching
  },

  LOGIN: {
    LOGIN: { name: 'LoginView', index: 0 },
    FORGOT: { name: 'ForgotView', index: 1 },
    REGISTER: { name: 'RegisterView', index: 2 }
  },

  BEVY: {
    POSTLIST: { name: 'PostList', index: 0 },
    INFO: { name: 'InfoView', index: 1 }
  },
  
  CHAT: {
    CONVERSATIONVIEW: { name: 'ConversationView', index: 0 },
    INCHAT: { name: 'InChatView', index: 1 }
  },

  PROFILE: {
    USER: { name: 'UserView', index: 0 }
  },

  NOTIFICATION: {
    LIST: { name: 'NotificationList', index: 0 }
  }
};

module.exports = routes;