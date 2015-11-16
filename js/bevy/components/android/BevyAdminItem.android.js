/**
 * BevyAdminItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');

var BevyAdminItem = React.createClass({
  propTypes: {
    admin: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      actionBarOpen: false
    };
  },

  toggleActionBar() {
    this.setState({
      actionBarOpen: !this.state.actionBarOpen
    });
  },

  goToProfile() {
    // set route user
    var route = routes.MAIN.PROFILE;
    route.user = this.props.admin;
    // go to profile page
    this.props.mainNavigator.push(route);
  },

  removeAdmin() {

  },

  render() {
    return (
      <View style={ styles.container }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ this.toggleActionBar }
        >
          <View style={ styles.item }>
            <Image
              source={ UserStore.getUserImage(this.props.admin) }
              style={ styles.image }
            />
            <View style={ styles.details }>
              <Text style={ styles.name }>{ this.props.admin.displayName }</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <Collapsible duration={ 250 } collapsed={ !this.state.actionBarOpen }>
          <View style={ styles.actionBar }>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#62D487', false) }
              onPress={ this.goToProfile }
            >
              <View style={ styles.actionBarItem }>
                <Icon
                  name='person'
                  size={ 24 }
                  color='#FFF'
                />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#62D487', false) }
              onPress={() => {}}
            >
              <View style={ styles.actionBarItem }>
                <Icon
                  name='more-vert'
                  size={ 24 }
                  color='#FFF'
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </Collapsible>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  details: {
    height: 48,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //borderBottomColor: '#EEE',
    //borderBottomWidth: 1
  },
  name: {
    color: '#AAA',
    textAlign: 'left'
  },
  actionBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673'
  },
  actionBarItem: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = BevyAdminItem;