/**
 * SwitchAccountView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ToastAndroid,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var AccountItem = require('./AccountItem.ios.js');
var BackButton = require('./../../../shared/components/ios/BackButton.ios.js');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var UserActions = require('./../../../user/UserActions');

var SwitchUserView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
  },

  addAccount() {

  },

  select(account) {
    UserActions.switchUser(account._id);
    this.props.mainNavigator.pop();
  },

  _renderAccounts() {
    if(_.isEmpty(this.props.linkedAccounts)) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: constants.height - 56}}>
          <Text style={{color: '#888', fontSize: 20}}>
            No Linked Accounts yet!
          </Text>
        </View>
      )
    }
    var accounts = [];
    for(var key in this.props.linkedAccounts) {
      var account = this.props.linkedAccounts[key];
      accounts.push(
        <AccountItem
          key={ 'accountitem:' + key }
          account={ account }
          onSelect={ this.select }
        />
      );
    }
    return accounts;
  },

  render() {
    return (
      <View style={ styles.container }>
        <Navbar
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          left={
            <BackButton
              color='#fff'
              text='Back'
              onPress={()=>{
                this.props.mainNavigator.pop();
              }}
            />
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                Switch Accounts
              </Text>
            </View>
          }
          right={
            {/*<TouchableOpacity
              activeOpacity={.5}
              onPress={ this.addAccount }
            >
              <View style={ styles.addAccountButton }>
                <Icon
                  name='person-add'
                  size={ 30 }
                  color='#fff'
                />
              </View>
            </TouchableOpacity>*/}
          }
        />
        <ScrollView style={ styles.accountList }>
          { this._renderAccounts() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBar: {
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  title: {
    flex: 1,
    color: '#333',
    textAlign: 'center'
  },
  addAccountButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 5
  },
  navButtonLeft: {
    flex: 1,
    marginLeft: 8
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#ddd',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

module.exports = SwitchUserView;
