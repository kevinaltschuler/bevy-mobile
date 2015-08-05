'use strict';

var routes = {
  MAIN: {
    LOGIN: { name: 'LoginNavigator' },
    TABBAR: { name: 'MainTabBar' },
    NEWPOST: { name: 'NewPost' },
    NEWBEVY: { name: 'NewBevy' },
    COMMENT: { name: 'Comment' }
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
    CONVERSATIONVIEW: { name: 'ConversationView' },
    INCHAT: { name: 'InChatView' }
  },

  PROFILE: {
    USER: { name: 'UserView' }
  },

  NOTIFICATION: {
    LIST: { name: 'NotificationList' }
  }
};

module.exports = routes;