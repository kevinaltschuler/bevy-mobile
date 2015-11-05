'use strict';

var routes = {
  MAIN: {
    TABBAR: { name: 'MainTabBar' },
    NEWPOST: { name: 'NewPost' },
    NEWBEVY: { name: 'NewBevy' },
    COMMENT: { name: 'Comment' },
    PROFILE: { name: 'Profile' },
    MAP: { name: 'Map' },
    LOGIN: { name: 'Login' },
    MESSAGEVIEW: { name: 'Messages' },
    SWITCHACCOUNT: { name: 'SwitchAccount' },
    EDITPOST: {name: 'EditPost'},
    NEWTHREAD: { name: 'NewThread' },
    THREADSETTINGS: { name: 'ThreadSettings' }
  },

  NEWPOST: {
    INPUT: { name: 'input' },
    BEVYPICKER: { name: 'bevypicker' },
    CREATEEVENT: { name: 'createevent' },
    DATEPICKER: { name: 'datepicker' },
    TAGPICKER: { name: 'tagpicker' }
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
    RELATED: { name: 'related' },
    TAGS: { name: 'tags' },
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