/**
 * MessageItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');

var MessageItem = React.createClass({
  propTypes: {
    message: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  goToPublicProfile() {
    if(this.props.message.author._id == this.props.user._id) {
      // dont do this for yourself
      return;
    }
    var route = routes.MAIN.PROFILE;
    route.user = this.props.message.author;
    this.props.mainNavigator.push(route);
  },

  _renderDate() {
    var message = this.props.message;
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
        + ((createDate.getHours() > 11) ? ' PM' : ' AM');
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
    return created;
  },

  _renderTriangle() {
    var isMe = (this.props.user._id == this.props.message.author._id);
    var triangleImage = (isMe) 
      ? '/img/triangle_right.png' 
      : '/img/triangle_left.png';
    return (
      <Image 
        source={{ uri: constants.siteurl + triangleImage, tintColor: '#fff' }}
        style={ styles.arrow } 
      />
    );
  },

  _renderMessageBody() {
    var isMe = (this.props.user._id == this.props.message.author._id);
    var messageBodyStyle = {
      backgroundColor: '#fff',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5
    };
    var textAlign = (isMe) ? 'right' : 'left';
    var authorName = (isMe) ? 'Me' : this.props.message.author.displayName;
    return (
      <View style={ messageBodyStyle }>
        <Text style={{ textAlign: textAlign }}>
          { this.props.message.body }
          { '\n' }
          <Text style={ styles.authorName }>
            { authorName } · { this._renderDate() }
          </Text>
        </Text>
      </View>
    );
  },

  render() {
    var message = this.props.message;
    var author = message.author;
    
    var isMe = (this.props.user._id == author._id);
    var containerStyle = (isMe) ? styles.containerMe : styles.container;
    
    return (
      <View style={ containerStyle }>
        { (isMe) ? this._renderMessageBody() : <View /> }
        { (isMe) ? this._renderTriangle() : <View /> }
        <TouchableWithoutFeedback
          onPress={ this.goToPublicProfile }
        >
          <Image 
            source={{ uri: (_.isEmpty(author.image_url)) 
              ? constants.siteurl + '/img/user-profile-icon.png' 
              : author.image_url 
            }}
            style={ styles.authorImage }
          />
        </TouchableWithoutFeedback>
        { (isMe) ? <View /> : this._renderTriangle() }
        { (isMe) ? <View /> : this._renderMessageBody() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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