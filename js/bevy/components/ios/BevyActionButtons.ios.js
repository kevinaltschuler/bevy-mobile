/**
 * BevyActionButtons.ios.js
 * @author kevin
 * the actions for a bevy
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActionSheetIOS
} = React;
var Swiper = require('react-native-swiper-fork');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');

var BevyActionButtons = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    bevy: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: _.contains(this.props.user.bevies, this.props.bevy._id)
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: _.contains(nextProps.user.bevies, nextProps.bevy._id)
    });
  },

  _handleJoinLeave(index) {
    var bevy = this.props.bevy;
    if(index == 0) {
      if(this.state.joined) {
        BevyActions.leave(bevy._id);
        this.setState({
          joined: false
        })
      } else {
        if(bevy.settings.privacy == 'private') {
          //BoardActions.requestBoard(board._id)
        }
        else {
          BevyActions.join(bevy._id)
          this.setState({
            joined: true
          })
        }
      }
    }
  },

  showActionSheet() {
    var bevy = this.props.bevy;
    if(this.state.joined) {
      var joinOptions = ['Leave', 'Cancel'];
    } else {
      if(bevy.settings.privacy == 'private') {
       var joinOptions = ['Request To Join', 'Cancel'];
      }
      else {
        var joinOptions = ['Join', 'Cancel'];
      }
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options: joinOptions,
      cancelButtonIndex: 1,
    },
    buttonIndex => {
      this._handleJoinLeave(buttonIndex);
    });
  },

  inviteUsers() {
    this.props.mainNavigator.push(routes.MAIN.INVITEUSERS);
  },

  goToInfoView() {
    this.props.bevyNavigator.push(routes.BEVY.INFO);
  },

  render() {
    var bevy = this.props.bevy;
    var user = this.props.user;
    if(_.isEmpty(bevy)) {
      return <View/>;
    }

    var joinedText, joinedColor;
    if(this.state.joined) {
      joinedText = 'Joined';
      joinedColor = '#2CB673';
    } else {
      joinedText = 'Join';
      joinedColor = '#AAA';
    }

    return (
      <Swiper
        style={ styles.boardActions }
        height={ 50 }
        showsButtons={ false }
        loop={ false }
      >
        <View style={ styles.slide }>
          <TouchableOpacity
            style={ styles.actionWrapper }
            onPress={ this.showActionSheet }
            activeOpacity={ 0.5 }
          >
            <View style={ styles.action }>
              <Icon
                name='done'
                size={ 24 }
                color={ joinedColor }
              />
              <Text style={[ styles.actionText, { color: joinedColor }]}>
                { joinedText }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={0.5}
            onPress={ this.inviteUsers }
          >
            <View style={ styles.action }>
              <Icon
                name='person-add'
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                Invite
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={ 0.5 }
          >
            <View style={ styles.action }>
              <Icon
                name='search'
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                Search
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={ 0.5 }
            onPress={ this.goToInfoView }
          >
            <View style={ styles.action }>
              <Icon
                name='more-horiz'
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                Info
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Swiper>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -25
  },
  boardActions: {
    backgroundColor: '#fff'
  },
  slide: {
    flexDirection: 'row',
  },
  actionWrapper: {
    flex: 1,
    height: 50
  },
  action: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionText: {
    color: '#aaa',
    fontSize: 15
  }
});

module.exports = BevyActionButtons;
