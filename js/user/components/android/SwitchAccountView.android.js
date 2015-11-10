/**
 * SwitchAccountView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  TouchableNativeFeedback,
  ToastAndroid,
  BackAndroid,
  ProgressBarAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var AccountItem = require('./AccountItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;

var SwitchAccountView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    linkedAccounts: React.PropTypes.array
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      ds: ds.cloneWithRows(this.props.linkedAccounts),
      linkedAccounts: this.props.linkedAccounts,
      loading: false
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    UserStore.on(USER.LOADED, this.onUserLoaded);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    UserStore.off(USER.LOADED, this.onUserLoaded);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      ds: this.state.ds.cloneWithRows(nextProps.linkedAccounts),
      linkedAccounts: nextProps.linkedAccounts
    });
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  onUserLoaded() {
    // switch back to posts tab
    var tabActions = constants.getTabBarActions();
    tabActions.switchTab('POSTS');
    // pop back to tab bar view
    this.props.mainNavigator.pop();
    // reset loading flag
    this.setState({
      loading: false
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  addAccount() {
    ToastAndroid.show('Feature not Implemented Yet :(', ToastAndroid.SHORT);
  },

  switchAccount(account) {
    UserActions.switchUser(account._id);
    // flip loading flag
    this.setState({
      loading: true
    });
  },

  _renderLoading() {
    if(!this.state.loading) return <View />;
    return (
      <View style={ styles.loadingContainer }>
        <ProgressBarAndroid styleAttr='Small' />
        <Text style={ styles.loadingText }>
          Switching Accounts...
        </Text>
      </View>
    );
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
        { this._renderLoading() }
        <ListView
          dataSource={ this.state.ds }
          renderRow={account =>
            <AccountItem
              key={ 'accountitem:' + account._id }
              account={ account }
              onSelect={ this.switchAccount }
            />
          }
        />
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
  loadingContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  loadingText: {
    marginLeft: 10
  },
  addAccountButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  }
});

module.exports = SwitchAccountView;