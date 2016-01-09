/**
 * BevyUserButtons.ios.js
 * @author kevin
 * the actions for a bevy
 */

'use strict';

var React = require('react-native');

var {
  View,
  TouchableHighlight,
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
    bevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: _.contains(this.props.user.bevies, this.props.bevy._id)
    }
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
      var joinOptions = ['leave', 'cancel'];
    } else {
      if(bevy.settings.privacy == 'private') {
       var joinOptions = ['request', 'cancel'];
      }
      else {
        var joinOptions = ['join', 'cancel'];
      }
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options: joinOptions,
      cancelButtonIndex: 1,
    },
    (buttonIndex) => {
      this._handleJoinLeave(buttonIndex);
    });
  },

  _onInvite() {
    this.props.mainNavigator.push(routes.MAIN.INVITEUSERS); 
  },

  render() {
    var bevy = this.props.bevy;
    var user = this.props.user;
    if(_.isEmpty(bevy)) {
      return <View/>;
    }
    var typeIcon = (bevy.settings.privacy == 'Private')
    ? 'lock'
    : 'public';
    
    if(this.state.joined) {
      var joinedText = 'joined';
      var joinedColor = '#2cb673';
    } else {
      if(bevy.settings.privacy == 'Private') {
        var joinedText = 'request';
      }
      else {
        var joinedText = 'join';
      }
      var joinedColor = '#aaa'
    }


    return (
      <Swiper style={styles.boardActions} height={50} showsButtons={false} loop={false}>
          <View style={styles.slide}>
            <TouchableHighlight 
              style={styles.actionWrapper} 
              onPress={this.showActionSheet} 
              underlayColor='rgba(0,0,0,.1)'
            >
              <View style={styles.action}>
                  <Icon name='done' size={24} color={joinedColor}/>
                  <Text style={[styles.actionText, {color: joinedColor}]}>
                    {joinedText}
                  </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight 
              style={styles.actionWrapper} 
              underlayColor='rgba(0,0,0,.1)'
              onPress={this._onInvite}
            >
              <View style={styles.action}>
                  <Icon name='person-add' size={24} color='#aaa'/>
                  <Text style={styles.actionText}>
                    invite
                  </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight 
              style={styles.actionWrapper} 
              underlayColor='rgba(0,0,0,.1)'
            >
              <View style={styles.action}>
                  <Icon name='search' size={24} color='#aaa'/>
                  <Text style={styles.actionText}>
                    Search
                  </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight 
              style={styles.actionWrapper} 
              underlayColor='rgba(0,0,0,.1)'
            >
              <View style={styles.action}>
                  <Icon name='more-horiz' size={24} color='#aaa'/>
                  <Text style={styles.actionText}>
                    Info
                  </Text>
              </View>
            </TouchableHighlight>
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
  boardImage: {
    flex: 1,
    height: 100,
  },
  boardTitle: {
    color: '#fff',
    paddingLeft: 10,
    paddingBottom: 0,
    fontSize: 20,
    fontWeight: 'bold'
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  boardDetails: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 10
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12
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
    color: '#aaa'
  }
});

module.exports = BevyActionButtons;