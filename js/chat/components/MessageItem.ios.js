'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image
} = React;

var _ = require('underscore');
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
    var nowDate = new Date();
    var diff = nowDate - createDate;
    var created = '';
    if(diff <= ( 1000 * 60 * 60 * 24)) {
      // within a day - only display hours and minutes
      created = 
        ((createDate.getHours() > 12 ) ? createDate.getHours() - 12 : createDate.getHours()) // 12 hr format
        + ':'
        + createDate.getMinutes()
        + ((createDate.getHours() > 12) ? ' PM' : ' AM');
    } else if (diff <= ( 1000 * 60 * 60 * 24 * 7)) {
      // within a week - only display short weekday
      var weekdayMap = [
        'Sun',
        'Mon',
        'Tues',
        'Wed',
        'Thurs',
        'Fri',
        'Sat'
      ];
      created = weekdayMap[createDate.getDay()];
    } else {
      // outside of a week - display month and day
      var monthMap = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      created = monthMap[createDate.getMonth() - 1] + ' ' + createDate.getDate();
    }

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
                source={{ uri: (_.isEmpty(author.image_url)) ? constants.siteurl + '/img/user-profile-icon.png' : author.image_url }}
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