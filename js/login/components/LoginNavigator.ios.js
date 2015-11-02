/**
 * LoginNavigator.ios.js
 * not using native navigator because of height/layout issues
 * so no fancy animations here
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var BlurView = require('react-native-blur').BlurView;

var LoginView = require('./LoginView.ios.js');
var RegisterView = require('./RegisterView.ios.js');
var ForgotView = require('./ForgotView.ios.js');

var constants = require('./../../constants');
var routes = require('./../../routes');

var LoginNavigator = React.createClass({

  propTypes: {
    authModalActions: React.PropTypes.object,
    close: React.PropTypes.func
  },

  getInitialState() {
    return {
      currentRoute: 'login'
    };
  },

  changeRoute(route) {
    this.setState({
      currentRoute: route
    });
  },

  render: function () {

    var navigator = {
      change: this.changeRoute
    };

    var content = <View/>;
    var title = 'log in';

    switch(this.state.currentRoute) {
      case 'register':
        title = 'register';
        content = <RegisterView 
          { ...this.props } 
          close={ this.props.close }
          loginNavigator={ navigator } 
          authModalActions={ this.props.authModalActions }
        />;
        break;
      case 'forgot':
        title = 'forgot my password'; 
        content = <ForgotView 
          { ...this.props } 
          close={this.props.close}
          loginNavigator={ navigator }
          authModalActions={ this.props.authModalActions }
        />;
        break;
      case 'login':
      default:
        title = 'login';
        content = <LoginView 
          { ...this.props }
          close={ this.props.close } 
          loginNavigator={ navigator }
          authModalActions={ this.props.authModalActions }
        />;
        break;
    }
    return <BlurView blurType='dark' style={styles.container}>
            <View style={ styles.panel }>
                <View style={ styles.topBar }>
                  <TouchableHighlight
                    underlayColor='rgba(0,0,0,0.2)'
                    style={ styles.closeButton }
                    onPress={() => {
                      this.props.close()
                    }}
                  >
                    <Icon
                      name='ios-close-empty'
                      size={ 30 }
                      style={{ width: 30, height: 30 }}
                      color='#333'
                    />
                  </TouchableHighlight>
                  <Text style={ styles.panelHeaderText }>{title}</Text>
                </View>
              { content }
            </View>
          </BlurView>;
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  panel: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    width: constants.width * 2 / 3,
  },
  topBar: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    flex: 1,
    width: constants.width * 2 / 4
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 17,
    color: '#fff'
  },
  panelHeaderText: {
    fontSize: 20,
    color: '#666',
    flex: 2,
    marginLeft: 20
  },
});


module.exports = LoginNavigator;
