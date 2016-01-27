'use strict';

var routes = {
  MAIN: {
    LOADING: { name: 'loading'},
    TABBAR: { name: 'MainTabBar' },
    NEWPOST: { name: 'NewPost' },
    EDITPOST: { name: 'EditPost' },
    NEWBEVY: { name: 'NewBevy' },
    NEWBOARD: { name: 'NewBoard' },
    COMMENT: { name: 'Comment' },
    PROFILE: { name: 'Profile' },
    BEVYNAV: { name: 'BevyNav' },
    MAP: { name: 'Map' },
    LOGIN: { name: 'Login' },
    MESSAGEVIEW: { name: 'Messages' },
    SWITCHACCOUNT: { name: 'SwitchAccount' },
    NEWTHREAD: { name: 'NewThread' },
    THREADSETTINGS: { name: 'ThreadSettings' },
    ADDUSER: { name: 'AddUser' }, // FOR ANDROID
    INVITEUSERS: { name: 'InviteUsers'},
    WEBVIEW: { name: 'WebView' },
    FEEDBACK: { name: 'FeedbackView' },
    PATCHNOTES: { name: 'PatchNotes' },
    ADDPEOPLE: { name: 'AddPeople' }
  },

  NEWPOST: {
    INPUT: { name: 'input' },
    BOARDPICKER: { name: 'boardpicker' },
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
    BEVYVIEW: { name: 'BevyView' },
    INFO: { name: 'InfoView' },
    SETTINGS: { name: 'BevySettings' },
    MYBEVIES: { name: 'MyBevies' },
    BOARDSETTINGS: { name: 'BoardSettings' },
    BOARDINFO: { name: 'BoardInfo' }
  },

  CHAT: {
    THREADLIST: { name: 'ThreadList' },
    ADDPEOPLE: { name: 'AddPeople' },
    THREADSETTINGS: { name: 'ThreadSettings' },
    MESSAGEVIEW: { name: 'MessageView' }
  },

  PROFILE: {
    USER: { name: 'UserView' }
  }
};

module.exports = routes;
