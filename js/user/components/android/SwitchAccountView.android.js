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
  TouchableNativeFeedback,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var AccountItem = require('./AccountItem.android.js');

var SwitchAccountView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    linkedAccounts: React.PropTypes.array
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  addAccount() {
    ToastAndroid.show('Feature not Implemented Yet :(', ToastAndroid.SHORT);
  },

  select(account) {
    ToastAndroid.show('Feature not Implemented Yet :(', ToastAndroid.SHORT);
  },

  _renderAccounts() {
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
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.goBack }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            Switch Accounts
          </Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.addAccount }
          >
            <View style={ styles.addAccountButton }>
              <Icon
                name='person-add'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
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
    paddingHorizontal: 8
  }
});

module.exports = SwitchAccountView;