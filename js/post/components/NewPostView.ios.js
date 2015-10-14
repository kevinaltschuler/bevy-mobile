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
  DeviceEventEmitter
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

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
var BevyPickerView = require('./BevyPickerView.ios.js');
var InputView = require('./InputView.ios.js');

var PostActions = require('./../PostActions');

var NewPostView = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    user: React.PropTypes.object
  },

  getInitialState() {
    var selected;
    if(this.props.activeBevy._id != -1) {
      // if not frontpage, select active bevy
      selected = this.props.activeBevy;
    } else {
      // else, get the first non-frontpage bevy
      selected = this.props.myBevies[1];
    }
    return {
      selected: selected
    };
  },

  componentWillReceiveProps(nextProps) {
    var selected;
    if(nextProps.activeBevy._id != -1) {
      // if not frontpage, select active bevy
      selected = nextProps.activeBevy;
    } else {
      // else, get the first non-frontpage bevy
      selected = nextProps.myBevies[1];
    }
    this.setState({
      selected: selected
    });
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[
          routes.NEWPOST.INPUT
        ]}
        initialRoute={ routes.NEWPOST.INPUT }
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.NEWPOST.BEVYPICKER.name:
              return (
                <BevyPickerView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selected={ this.state.selected }
                  onSwitchBevy={(bevy) => {
                    navigator.jumpTo(routes.NEWPOST.INPUT);
                    this.setState({
                      selected: bevy
                    });
                  }}
                  { ...this.props }
                />
              );
              break;
            case routes.NEWPOST.INPUT.name:
            default:
              return (
                <InputView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selected={ this.state.selected }
                  { ...this.props }
                />
              );
              break;
          }
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  navButtonLeft: {
    flex: 1,
    padding: 10,
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17,
  },
  navButtonTextRight: {
    color: '#fff',
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
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyPicker: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10
  },
  postingTo: {
    fontSize: 15,
    marginRight: 10
  },
  bevyName: {
    flex: 1,
    color: '#2CB673',
    fontSize: 15,
    fontWeight: 'bold'
  },
  toBevyPicker: {
    alignSelf: 'flex-end'
  },
  input: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    flex: 1,
    marginBottom: 48,
    backgroundColor: '#fff'
  },
  inputProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  textInput: {
    flex: 1,
    fontSize: 15
  },
  contentBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: window.width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height: 48,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  contentBarItem: {
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center'
  },
  contentBarIcon: {
    width: 30,
    height: 30
  },
  bevyPickerList: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  bevyPickerImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  bevyPickerName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 15
  }
});

module.exports = NewPostView;