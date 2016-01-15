/**
 * MessageItem.ios.js
 * @author albert
 * @author kevin
 *
 * using inline styles here because they rely so much on
 * its props and state
 *
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ActionSheetIOS,
  Clipboard,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var ChatActions = require('./../../../chat/ChatActions');

var MessageItem = React.createClass({
  propTypes: {
    message: React.PropTypes.object,
    user: React.PropTypes.object,
    hidePic: React.PropTypes.bool,
    showName: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      message: {},
      hidePic: false,
      showName: true
    }
  },

  getInitialState() {
    return {
      collapsed: true,
      wrap: false,
      isMe: this.props.user._id == this.props.message.author._id
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isMe: nextProps.user._id == nextProps.message.author._id
    });
  },

  componentDidMount() {
    this.measureMessageBody();
  },

  measureMessageBody() {
    setTimeout(() => {
      if(!this.MessageBody) return;
      this.MessageBody.measure((ox, oy, width, height, px, py) => {
        if(width >= (constants.width - 80)) {
          this.setState({ wrap: true });
        }
      });
    }, 0);
  },

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  },

  longPress() {
    var options = ['Cancel', 'Copy Message'];
    if(this.state.isMe) {
      options.push('Delete Message');
    } else {
      options.push('View ' + this.props.message.author.displayName + "'s Profile");
    }
    ActionSheetIOS.showActionSheetWithOptions({
      options: options,
      cancelButtonIndex: 0
    }, buttonIndex => {
      if(buttonIndex == 1) {
        this.copyMessage();
      }
      if(this.state.isMe) {
        if(buttonIndex == 2) {
          this.deleteMessage();
        }
      } else {
        if(buttonIndex == 2) {
          this.goToAuthorProfile();
        }
      }
    })
  },

  copyMessage() {
    Clipboard.setString(this.props.message.body);
  },

  deleteMessage() {
    ChatActions.deleteMessage(this.props.message._id);
  },

  goToAuthorProfile() {
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.message.author;
    this.props.mainNavigator.push(route);
  },

  _renderCreated() {
    var createDate = new Date(this.props.message.created);
    var nowDate = new Date();
    var diff = nowDate - createDate;

    var weekdayMap = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    var monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var created = '';

    if(diff <= ( 1000 * 60 * 60 * 24)) {
      // within a day - only display hours and minutes
      created =
        ((createDate.getHours() > 12 )
          ? createDate.getHours() - 12
          : createDate.getHours()) // 12 hr format
        + ':'
        + ((createDate.getMinutes() < 10)
          ? '0' + createDate.getMinutes()
          : createDate.getMinutes())
        + ((createDate.getHours() > 11) ? ' PM' : ' AM');
    } else if (diff <= ( 1000 * 60 * 60 * 24 * 7)) {
      // within a week - only display short weekday
      created = weekdayMap[createDate.getDay()];
    } else {
      // outside of a week - display month and day
      created = monthMap[createDate.getMonth() - 1] + ' ' + createDate.getDate();
    }
    return created;
  },

  _renderImage() {
    if(this.props.hidePic) return <View style={{height: 5, width: 50}}/>;

    var authorImageURL = (_.isEmpty(this.props.message.author.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.message.author.image, 64, 64).url;

    return (
      <Image
        source={{ uri: authorImageURL }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'rgba(0,0,0,0)'
        }}
      />
    );
  },

  _renderName() {
    if(!this.props.showName) return <View />;
    return (
      <Text
        style={{
          width: constants.width,
          flexDirection: 'column',
          textAlign: (this.state.isMe) ? 'right' : 'left',
          paddingHorizontal: 60,
          color: 'rgba(0,0,0,.3)',
          fontSize: 15
        }}
      >
        { (this.state.isMe) ? 'Me' : this.props.message.author.displayName }
      </Text>
    );
  },

  render() {
    return (
      <TouchableOpacity
        activeOpacity={ .5 }
        onPress={ this.toggleCollapsed }
        delayLongPress={ 750 }
        onLongPress={ this.longPress }
      >
        <View style={{
          flexDirection: 'column',
          alignItems: (this.state.isMe) ? 'flex-end' : 'flex-start',
          justifyContent: (this.state.isMe) ? 'flex-end' : 'flex-start',
          backgroundColor: 'rgba(0,0,0,0)'
        }}>
          { this._renderName() }
          <View style={{
            flexDirection: 'row',
            justifyContent: (this.state.isMe) ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            paddingBottom: 0,
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0)',
            width: constants.width - 80,
            marginTop: (this.props.hidePic) ? 8 : 0
          }}>
            { (this.state.isMe) ? <View /> : this._renderImage() }
            { (this.state.isMe) ? <View /> : <View style={{ width: 10 }} /> }
            <View
              style={{
                backgroundColor: '#rgba(0,0,0,.2)',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 14,
                flexWrap: 'wrap',
                flex: (this.state.wrap) ? 1 : 0,
                backgroundColor: (this.state.isMe) ? '#2CB673' : '#EEE'
              }}
              ref={ref => { this.MessageBody = ref; }}
            >
              <Text style={{
                textAlign: (this.state.isMe) ? 'right' : 'left',
                color: (this.state.isMe) ? '#fff' : '#333',
                flex: 1,
                fontSize: 17
              }}>
                { this.props.message.body}
              </Text>
            </View>
            { (this.state.isMe) ? <View style={{ width: 10 }} /> : <View /> }
            { (this.state.isMe) ? this._renderImage() : <View /> }
          </View>
          <Collapsible collapsed={ this.state.collapsed } >
            <Text style={{
              fontSize: 15,
              color: '#888',
              marginBottom: 5,
              marginTop: 5,
              marginRight: (this.state.isMe) ? 50 : 0,
              marginLeft: (this.state.isMe) ? 0 : 50
            }}>
              {(this.state.isMe) ? 'Me' : this.props.message.author.displayName }
              {' · '}
              { this._renderCreated() }
            </Text>
          </Collapsible>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
});

module.exports = MessageItem;
