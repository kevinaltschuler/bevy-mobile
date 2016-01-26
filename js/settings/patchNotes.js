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
  ios: [{
    version: '1.3.1',
    sections: [{
      header: 'New Features',
      bodyItems: [
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
        'Fix Notification read/unread logic',
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
