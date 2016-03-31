/**
 * patchNotes.js
 *
 * simple file for patch notes
 * used by PatchNotesView
 *
 * @author albert
 * @flow
 */

'use strict';

module.exports = {
  ios: [
  {
    version: '2.0.0',
    sections: [{
      header: 'New Features',
      bodyItems: [
        "Brand new layout",
        "Sign in to your bevy's subdomain"
      ]
    }]
  },
  {
    version: '1.3.76',
    sections: [{
      header: 'New Features',
      bodyItems: [
        "Add Discover Card to a new user's Bevy list",
      ]
    }, {
      header: 'Bug Fixes',
      bodyItems: [
        'Fix static image loading',
        "Fix border widths across different device resolutions",
        "Fix loading and state errors in the Image Overlay Gallery View",
        "UX improvements in the search tab",
        "Fix errors with voting on posts",
        "Fix messaging user from their profile",
        "Add more alert errors across app",
        "Cleared up errors and warnings relating to the keyboard opening and closing",
        "Fix errors when signing out of an acccount logged in with Google",
        'UX improvements in login stack views',
        'Improve memory usage of views across app',
        'Fix crashes with joining/leaving a bevy',
        "General UI improvements"
      ]
    }]
  },
  {
    version: '1.3.75',
    sections: [{
      header: 'New Features',
      bodyItems: [
        "Added Gallery View to the Image Overlay"
      ]
    }, {
      header: 'Bug Fixes',
      bodyItems: [
        "Improve performance when creating new posts",
        "Remove swiper components",
        "Fix post deletion",
        "Fix height of TextInput in the NewPostView",
        "Smoother post search transitions",
        "Misc UI Fixes"
      ]
    }]
  },
  {
    version: '1.3.74',
    sections: [{
      header: 'New Features',
      bodyItems: [
        "Highlight the active board in the bevy side menu"
      ]
    }, {
      header: 'Bug Fixes',
      bodyItems: [
        "Fix crashes with post search",
        "Fixes with the comment count, adding, and deleting comments",
        "Fixes with an empty thread image",
        "Redo routing structure for more robust app routing"
      ]
    }]
  },
  {
    version: '1.3.73',
    sections: [{
      header: 'New Features',
      bodyItems: [
        "Add post search functionality",
        'Added support for refreshing access tokens after access tokens expired',
        "Added 'Delete Board' Button to Board Settings View",
        "Integrated in-app browser to view posted links",
        "Added links section to posts",
        "Added a board picker to the new post view",
        "Added a show more button on posts to view longer posts",
        "Added Feedback view for an easy way to give feedback",
        "Added more settings to Bevy Settings View",
        "Added badge next to the notification tab bar item",
        "Added patch notes page"
      ]
    }, {
      header: 'Bug Fixes',
      bodyItems: [
        'Improve image loading performance',
        'Fix notification read/unread logic',
        'Fix performance and refresh issues in the notifications tab',
        'Fix issues in New Board View',
        'UI fixes and better performance for viewing private bevies',
        "Fixes for changing settings of a group chat",
        "Performance and clean up of the search tab",
        "Performance improvement with searching in general",
        "Fix errors with keyboard opening and closing",
        "Fix errors with deleting comments",
        "Fixes for the Image Popover layout",
        "Performance fixes in Invite User View",
        'General UI fixes'
      ]
    }]
  }],
  android: [

  ]
};
