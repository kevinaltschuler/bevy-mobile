'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  Image
} = React;

var constants = require('./../../constants');

var MessageItem = React.createClass({

  propTypes: {
    message: React.PropTypes.object,
    user: React.PropTypes.object
  },

  render: function() {
    var message = this.props.message;
    var author = message.author;
    var user = this.props.user;

    var createDate = new Date(message.created);
    var dateOptions = {
      year: undefined,
      weekday: undefined,
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    if(new Date(Date.now()).getDay() == createDate.getDay()) {
      dateOptions.month = undefined;
      dateOptions.day = undefined;
    }
    else if(Date.now() - createDate.getTime() <= ( 1000 * 60 * 60 * 24 * 7 )) {
      // if within this week
      dateOptions.month = undefined;
      dateOptions.day = undefined;
      dateOptions.weekday = 'short';
    }
    var created = createDate.toLocaleString('en-US', dateOptions);

    var messageBodyStyle = {
      backgroundColor: '#fff',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5
    };
    if(message.body.length >= 32) {
      messageBodyStyle.flex = 1;
    }

    var isMe = (user._id == author._id);

    return (
      <View>
        { (isMe) 
          ? (
            <View style={ styles.containerMe }>
              <View style={ messageBodyStyle }>
                <Text style={{ textAlign: 'right' }}>
                  { message.body}
                  { '\n' }
                  <Text style={ styles.authorName }>
                    { created }
                  </Text>
                </Text>
              </View>
              <Image 
                source={{ uri: constants.siteurl + '/img/triangle_right.png', tintColor: '#fff' }}
                style={ styles.arrow } 
              />
              <Image 
                source={{ uri: author.image_url }}
                style={ styles.authorImage }
              />
            </View>
          ) 
          : (
            <View style={ styles.container }>
              <Image 
                source={{ uri: author.image_url }}
                style={ styles.authorImage }
              />
              <Image 
                source={{ uri: constants.siteurl + '/img/triangle_left.png', tintColor: '#fff' }}
                style={ styles.arrow } 
              />
              <View style={ messageBodyStyle }>
                <Text style={{ textAlign: 'left' }}>
                  { message.body }
                  { '\n' }
                  <Text style={ styles.authorName }>
                    { author.displayName } · { created }
                  </Text>
                </Text>
              </View>
            </View>
          )
        }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 5
  },
  containerMe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 5
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  messageBody: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  messageBodyMe: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  messageTextContainer: {
    //flexDirection: 'row',
    //flex: 1
  },
  messageText: {

  },
  arrow: {
    width: 10,
    height: 10
  },
  authorName: {
    fontSize: 10,
    color: '#666'
  }
});

module.exports = MessageItem;