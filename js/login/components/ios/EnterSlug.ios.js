/**
 * LoginView.ios.js
 *
 * Entry point for the app if a user isn't logged in or found
 * Once logged in, MainView will catch the login success event
 * and navigate to the MainTabBar
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var USER = constants.USER;
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');

var EnterSlugView = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    message: React.PropTypes.string
  },

  getInitialState() {
    return {
      // textinput values that we track
      slug: '',
      // any errors with logging in or verification
      error: '',
      // used by UI to display loading indicator or not
      loading: false,
      // used to move view around keyboard
      keyboardSpace: 0
    }
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onError(error) {
    this.setState({ error: error });
  },

  submit() {
    if(this.state.loading) return;
    if(_.isEmpty(this.state.slug)) {
      return this.setState({ error: 'Please enter your group\'s Bevy domain' });
    } else {
      this.setState({ error: '' });
    }
    this.setState({
      loading: true
    });
    fetch(constants.apiurl + '/bevies/' + this.state.slug + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      setTimeout(() => {
        if(!_.isObject(res)) {
          this.setState({
            error: res,
            loading: false
          });
          return;
        }
        if(res.found) {
          // go to the bevys login page
          this.props.loginNavigator.push({
            name: routes.LOGIN.LOGIN,
            slug: this.state.slug
          })
        } else {
          this.setState({
            error: 'Group domain not found',
            verifying: false
          });
        }
      }, 250);
    })
    .catch(err => {
      this.setState({
        loading: false,
        error: err.toString()
      });
    });
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
    setTimeout(this.scrollToBottom, 300);
  },

  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
    setTimeout(this.scrollToTop, 300);
  },

  scrollToTop() {
    if(this.ScrollView == undefined) return;
    this.ScrollView.scrollTo(0, 0);
  },

  scrollToBottom() {
    // dont even try if the scroll view hasn't mounted yet
    if(this.ScrollView == undefined) return;

    var innerScrollView = this.ScrollView.refs.InnerScrollView;
    var scrollView = this.ScrollView.refs.ScrollView;

    requestAnimationFrame(() => {
      innerScrollView.measure((innerScrollViewX, innerScrollViewY,
        innerScrollViewWidth, innerScrollViewHeight) => {

        scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
          var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

          if(innerScrollViewHeight < scrollViewHeight) {
            return;
          }

          this.ScrollView.scrollTo(scrollTo, 0);
        });
      });
    });
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.errorContainer }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  render() {
    return (
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={[ styles.container, {
          marginBottom: this.state.keyboardSpace
        }]}
        contentContainerStyle={ styles.containerInner }
        keyboardShouldPersistTaps={ true }
        //scrollEnabled={ false }
      >
        <Image
          style={ styles.logo }
          source={ require('./../../../images/logo_100_reversed.png') }
        />
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Bevy
          </Text>
        </View>
        { this._renderError() }
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            ref={ref => { this.SlugInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            placeholder=''
            style={ styles.loginInput }
            onChangeText={ slug => this.setState({ slug: slug }) }
            placeholderTextColor='rgba(255,255,255,.5)'
          />
          <Text style={{color: '#fff', fontSize: 20}}>
            .joinbevy.com
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.loginButton }
          onPress={ this.submit }>
          <Text style={ styles.loginButtonText }>
            Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2CB673',
  },
  containerInner: {
    flexDirection: 'column',
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: constants.width / 4,
    paddingHorizontal: constants.width / 12
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  titleText: {
    fontSize: 28,
    color: '#fff'
  },
  logInTitle: {
    textAlign: 'center',
    fontSize: 17,
    color: '#666',
    marginBottom: 10
  },
  errorContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#df4a32',
    borderRadius: 5,
    marginBottom: 10
  },
  errorText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17
  },
  loginInput: {
    height: 50,
    paddingLeft: 16,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    borderRadius: 25,
    width: constants.width / 2,
    color: '#fff'
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    width: constants.width / 1.2
  },
  loginButtonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#666'
  },
});

module.exports = EnterSlugView;
