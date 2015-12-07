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
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');

var MessageItem = React.createClass({
  propTypes: {
    message: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    hidePic: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      hidePic: false
    };
  },

  getInitialState() {
    return {
      collapsed: true
    };  
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
        ((createDate.getHours() > 12 ) 
          ? createDate.getHours() - 12 
          : (createDate.getHours() == 0)
            ? '12'
            : createDate.getHours()) 
        + ':'
        + ((createDate.getMinutes() < 10)
          ? '0' + createDate.getMinutes()
          : createDate.getMinutes())
        + ((createDate.getHours() > 11) ? ' PM' : ' AM');
    } else if (diff <= ( 1000 * 60 * 60 * 24 * 7)) {
      // within a week - only display short weekday
      var weekdayMap = [
        'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'
      ];
      created = weekdayMap[createDate.getDay()];
    } else {
      // outside of a week - display month and day
      var monthMap = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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
      <View style={{width: 10, height: 10}}/>
    );
  },

  _renderMessageBody() {
    var isMe = (this.props.user._id == this.props.message.author._id);
    var messageBodyStyle = (isMe) ? styles.messageBodyMe : styles.messageBody;
    var textAlign = (isMe) ? 'right' : 'left';
    var authorName = (isMe) ? 'Me' : this.props.message.author.displayName;
    var messageColor = (isMe) ? '#fff' : '#333';
    return (
      <View style={{
        backgroundColor: (isMe) ? '#2cb673' : '#fff',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 15,
        marginBottom: 3,
        flexWrap: 'wrap',
        //elevation: 2 // ADD IF YOU WANT SHADOWS FAM
      }}>
        <Text style={{ 
          textAlign: textAlign,
          color: messageColor,
          flexWrap: 'wrap'
        }}>
          { this.props.message.body }
          { '\n' }
        </Text>
      </View>
    );
  },

  render() {
    var message = this.props.message;
    var author = message.author;
    
    var isMe = (this.props.user._id == author._id);

    var authorImage = (this.props.hidePic)
    ? <View style={{height: 1, width: 40}}/>
    : <Image 
        source={ UserStore.getUserImage(author) }
        style={ styles.authorImage }
      />;
    
    return (
      <TouchableWithoutFeedback
        underlayColor='#FFF'
        onPress={() => this.setState({ collapsed: !this.state.collapsed })}
        delayLongPress={ 500 }
        onLongPress={() => {}}
      >
        <View style={{
          marginBottom: 5
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: (isMe) ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end'
          }}>
            { (isMe) ? this._renderMessageBody() : <View /> }
            { (isMe) ? this._renderTriangle() : <View /> }
            <TouchableWithoutFeedback
              onPress={ this.goToPublicProfile }
            >
              { authorImage }
            </TouchableWithoutFeedback>
            { (isMe) ? <View /> : this._renderTriangle() }
            { (isMe) ? <View /> : this._renderMessageBody() }
            
          </View>
          <Collapsible duration={ 250 } collapsed={ this.state.collapsed }>
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: (isMe)
                ? 'flex-end'
                : 'flex-start',
              marginRight: (isMe)
                ? 60
                : 0,
              marginLeft: (isMe)
                ? 0
                : 60
            }}>
              <Text style={{
                color: '#AAA'
              }}>
                { this._renderDate() }
              </Text>
            </View>
          </Collapsible>
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

var styles = StyleSheet.create({
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20
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