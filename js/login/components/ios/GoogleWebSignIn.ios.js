/**
 * GoogleWebSignin.ios.js
 * @author kevin
 * the girl to our left has iphone in hand, ipad in lap and imac on desk.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight,
  AsyncStorage
} = React;
var Spinner = require('react-native-spinkit');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var SearchBar = require('./../../../shared/components/ios/SearchBar.ios.js');
var NewPostView = require('./../../../post/components/ios/NewPostView.ios.js');
var CreateBevyView = require('./../../../bevy/components/ios/CreateBevyView.ios.js');
var CommentView = require('./../../../post/components/ios/CommentView.ios.js');
var ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var UserStore = require('./../../../user/UserStore');

var GoogleWebSignIn = React.createClass({
	getInitialState: function() {
		return {
			url: this.props.url
		};
	},

	getAccessToken(ev) {
    console.log(ev);
		var title = ev.title.slice(0, 7);
    console.log(title);
		if(title == 'Loading') {
			// this is so janky if google changes their title format at all were screwed
      var auth_code = ev.title.slice(46);
      console.log('got auth code', code);
      var body = [
        'code=' + code,
        '&client_id=' + constants.google_client_id,
        '&client_secret=' + constants.google_client_secret,
        '&redirect_uri=' + constants.google_redirect_uri,
        '&grant_type=authorization_code'
      ].join('');
      fetch('https://www.googleapis.com/oauth2/v3/token', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      })
      .then(res => res.json())
      .then(res => {
        console.log('access token response', res);
        if(!_.isEmpty(res.error)) {
          console.log('access token error', res.error);
          return;
        }
        var access_token = res.access_token;
        console.log('got access token', access_token);
        this.getGoogleID(access_token);
		  });
    }
	},

  getGoogleID(access_token) {
    // get the google plus user, so we can get its id
    fetch(
      'https://www.googleapis.com/plus/v1/people/me' +
      '?access_token=' + access_token, {
    })
    .then(res => res.json())
    .then(res => {
      var google_id = res.id;
      console.log('got google id', google_id);
      // save this token so we dont have to go through that again
      // unless we have to
      AsyncStorage.setItem('google_id', google_id);
      // finally we can query our own api
      fetch(constants.apiurl + '/users/google/' + google_id)
      .then(res => res.json())
      .then(res => {
        this.onLoginSuccess(res);
      });
    });
  },

	onLoginSuccess(user) {
		console.log('success', user);

		UserStore.setUser(user);
		AppActions.load();
	},

	render: function() {
		return (
			<View style={styles.container}>
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
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                // blur all text inputs
                // go back
                this.props.loginNavigator.change('login');
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                back
              </Text>
            </TouchableHighlight>
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                {this.props.location}
              </Text>
            </View>
          }
          right={
          	<View style={ styles.navButtonRight } />
          }
        />
        <WebView
        	style={ styles.content }
        	url= { constants.siteurl + '/auth/google' }
        	scrollEnabled={ true }
        	scalePageToFit={ true }
        	startInLoadingState={ true }
        	contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        	onNavigationStateChange={(ev) => {
            console.log(ev);
          }}
        	renderLoading={() => {
        		return (
	        		<View style={styles.spinnerContainer}>
                <Spinner
                  isVisible={true}
                  size={40}
                  type={'Arc'}
                  color={'#2cb673'}
                />
              </View>
        		);
        	}}
        />
			</View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    height: 500
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
  scrollView: {
    flex: 1,
    flexDirection: 'column'
  },
  content: {
  	flex: 1,
  	height: 500
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

module.exports = GoogleWebSignIn;
