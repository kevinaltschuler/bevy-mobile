/**
 * Browser.ios.js
 *
 * WebView wrapper for browsing web pages in-app
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  WebView,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var Browser = React.createClass({
  propTypes: {
    initialURL: React.PropTypes.string,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      initialURL: 'https://google.com'
    };
  },

  getInitialState() {
    return {
      canGoBack: false,
      canGoForward: false,
      url: this.props.initialURL,
      status: '',
      loading: true
    };
  },

  goBack() {
    if(this.state.canGoBack) {
      this.WebView.goBack();
    } else {
      this.props.mainNavigator.pop();
    }
  },

  goForward() {
    if(this.state.canGoForward) {
      this.WebView.goForward();
    }
  },

  refresh() {
    this.WebView.reload();
  },

  _renderLoading() {
    return (
      <View style={ styles.spinnerContainer }>
        <Spinner
          isVisible={ true }
          size={ 60 }
          type={ '9CubeGrid' }
          color={ '#2CB673' }
        />
      </View>
    );
  },

  onNavigate(ev) {
    this.setState({
      canGoBack: ev.canGoBack,
      canGoForward: ev.canGoForward,
      url: ev.url,
      status: ev.title,
      loading: ev.loading
    })
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goForward }
            >
              <Icon
                name='arrow-forward'
                size={ 30 }
                color={(this.state.canGoForward)
                  ? '#FFF' : 'rgba(255,255,255,0.5)' }
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.refresh }
            >
              <Icon
                name='refresh'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text
              style={ styles.title }
              numberOfLines={ 1 }
            >
              { this.state.url }
            </Text>
          </View>
        </View>
        <WebView
          ref={ ref => { this.WebView = ref; }}
          source={{ uri: this.props.initialURL }}
          renderLoading={ this._renderLoading }
          startInLoadingState={ true }
          allowsInlineMediaPlayback={ true }
          onNavigationStateChange={ this.onNavigate }
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
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF',
    marginRight: 20
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinnerContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height - 300
  },
});

module.exports = Browser;
