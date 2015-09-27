'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  LinkingIOS,
  Modal
} = React;
var {
  Icon
} = require('react-native-icons');

var LoginNavigator = require('./LoginNavigator.ios.js');

var _ = require('underscore');
var constants = require('./../../constants');
var AppActions = require('./../../app/AppActions');
var UserStore = require('./../../user/UserStore');

var LoginModal = React.createClass({

  propTypes: {
    isOpen: React.PropTypes.bool,
    message: React.PropTypes.string,
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      isOpen: this.props.isOpen,
      message: this.props.message
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen,
      message: nextProps.message
    });
  },

  close() {
    console.log('close modal');
    this.props.authModalActions.close();
  },

  render() {
    return <View/>;
    /*return (
      <Modal
        forceToFront={ true }
        isVisible={ this.state.isOpen }
        style={ styles }
        backdropType="blur"
        backdropBlur="dark"
        customCloseButton={
          <TouchableHighlight
            underlayColor='rgba(255,255,255,0.1)'
            style={ styles.closeButton }
            onPress={ this.close }
          >
            <View style={ styles.closeButtonContainer }>
              <Text style={ styles.closeButtonText }>Close</Text>
              <Icon
                name='ion|ios-close-empty'
                size={ 30 }
                color='#fff'
                style={{ width: 30, height: 30 }}
              />
            </View>
          </TouchableHighlight>
        }
        onPressBackdrop={() => {
          //console.log('backdrop pressed');
          //this.setState({
          //  isOpen: false
          //});
        }}
        onClose={ this.close }
      >
        <LoginNavigator authModalActions={ this.props.authModalActions } { ...this.state } />
      </Modal>
    );*/
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
    alignItems: 'flex-start'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: '#000',
    opacity: 0.5
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 100,
    marginLeft: 30,
    marginRight: 30
  },

  closeButton: {
    position: 'absolute',
    borderColor: '#fff',
    borderRadius: 2,
    borderWidth: 1,
    right: 20,
    top: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 17,
    color: '#fff'
  },
});

module.exports = LoginModal;