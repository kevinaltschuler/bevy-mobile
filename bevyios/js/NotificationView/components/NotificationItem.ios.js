/**
 * NotificationItem.js
 * kevin made this 
 * I heard albert eats deer poop
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;

var Icon = require('FAKIconImage');

var NotificationItem = React.createClass({

  propTypes: {
    notification: React.PropTypes.object
  },

  render: function () {

    var notification = this.props.notification;
    var event = notification.event;
    var data = notification.data;

    var body;

    switch(event) {
      case 'invite:email':

        var bevy_name = data.bevy_name;
        var bevy_img = data.bevy_img;
        var inviter_name = data.inviter_name;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={styles.left} 
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: bevy_img }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      Invite to { bevy_name } from { inviter_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight 
              underlayColor='rgba(0,0,0,.1)'
              style={styles.right}
            >
              <View style={styles.textWrapper}>
                <Text>
                  Join
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );

        break;
      case 'post:create':

        var author_name = data.author_name;
        var author_img = data.author_img;
        var bevy_id = data.bevy_id;
        var bevy_name = data.bevy_name;
        var post_title = data.post_title;
        var post_id = data.post_id;
        var post_created = data.post_created;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={styles.left} 
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_img }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      Post to { bevy_name } by { author_name }
                    </Text>
                    <Text style={styles.subTitleText}>
                      { post_title }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight 
              underlayColor='rgba(0,0,0,.1)'
              style={styles.right}
            >
              <View style={styles.textWrapper}>
                <Text>
                  View
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );
        break;
      case 'bevy:requestjoin':

        var user_id = data.user_id;
        var user_name = data.user_name;
        var user_image = data.user_image;
        var bevy_id = data.bevy_id;
        var bevy_name = data.bevy_name;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={styles.left} 
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: user_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      Request to join { bevy_name }
                    </Text>
                    <Text style={styles.subTitleText}>
                      From { user_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight 
              underlayColor='rgba(0,0,0,.1)'
              style={styles.right}
            >
              <View style={styles.textWrapper}>
                <Text>
                  Accept
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );

        break;
      case 'post:reply':

        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var bevy_name = data.bevy_name;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={styles.left} 
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      { author_name } replied to your post { post_title }
                    </Text>
                    <Text style={styles.subTitleText}>
                      In { bevy_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight 
              underlayColor='rgba(0,0,0,.1)'
              style={styles.right}
            >
              <View style={styles.textWrapper}>
                <Text>
                  View
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );

        break;
      case 'post:commentedon':

        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var bevy_name = data.bevy_name;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={styles.left} 
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      { author_name } commented on a post you commented on
                    </Text>
                    <Text style={styles.subTitleText}>
                      In { bevy_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight 
              underlayColor='rgba(0,0,0,.1)'
              style={styles.right}
            >
              <View style={styles.textWrapper}>
                <Text>
                  View
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        );

        break;
      default:
        body = (
          <View />
        );
        break;
    }

    return (
      <View style={styles.notificationCard}>
        { body }
        <TouchableHighlight 
          underlayColor='rgba(0,0,0,.1)'
          style={styles.dismiss}
        >
          <View style={styles.textWrapper}>
            <Text>
              Dismiss
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
   notificationCard: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 60
  },
  notificationBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  row: {
    flexDirection: 'row'
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  rightRow: {
  	flex: 1,
  	flexDirection: 'row',
  	justifyContent: 'space-between'
  },
  titleTextColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#282929'
  },
  left: {
    padding: 10,
    flex: 3
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  dismiss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120
  },
  textWrapper: {
    width: 60,
    textAlign: 'center'
  }
})

module.exports = NotificationItem;
