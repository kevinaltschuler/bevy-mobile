'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  ListView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  StatusBarIOS,
  Navigator,
  TouchableHighlight,
  DeviceEventEmitter,
  DatePickerIOS,
  Modal
} = React;

var { BlurView, VibrancyView } = require('react-native-blur');

var Icon = require('react-native-vector-icons/Ionicons');
var Calendar = require('react-native-calendar');

var _ = require('underscore');
var routes = require('./../../routes');
var constants = require('./../../constants');
var FILE = constants.FILE;
var FileStore = require('./../../file/FileStore');
var FileActions = require('./../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var window = require('Dimensions').get('window');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var PostActions = require('./../PostActions');

var DatePickerModal = React.createClass({

  propTypes: {
    onSetDate: React.PropTypes.func,
    selected: React.PropTypes.object,
    date: React.PropTypes.Date
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible
    }
  },

  componentWillReceiveProps(nextProps) {
      this.setState({
        isVisible: nextProps.isVisible
      });
  },

  render() {
    return (
      <Modal
        visible={ this.state.isVisible }
        animated={ false }
        transparent={ true }
      >
        <BlurView blurType='dark' style={ styles.container }>
          <View style={ styles.panel }>
            <View style={ styles.topBar }>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.2)'
                style={ styles.closeButton }
                onPress={() => {
                  this.setState({
                    isVisible: false
                  });
                  this.props.onHide();
                }}
              >
                <Icon
                  name='ios-close-empty'
                  size={ 30 }
                  style={{ width: 30, height: 30 }}
                  color='#333'
                />
              </TouchableHighlight>

              <Text style={ styles.panelHeaderText }>Select Date</Text>
            </View>
            <Calendar
              eventDates={[]}   
              showControls={true}
              selectedDate={this.props.date}
              onDateSelect={this.onSetDate} 
            />
          </View>
        </BlurView>
      </Modal>
    );
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
  modal: {
    flexDirection: 'row',
    marginTop: constants.height / 4
  },
  topBar: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    width: 300,
    height: 600,
  },
  panelHeaderText: {
    fontSize: 20,
    color: '#666'
  },
});

module.exports = DatePickerModal;