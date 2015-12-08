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
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var FILE = constants.FILE;
var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var window = require('Dimensions').get('window');
var PostActions = require('./../../../post/PostActions');

var TagPickerView = React.createClass({
  propTypes: {
    onSelectTag: React.PropTypes.func,
    selected: React.PropTypes.object
  },

  getInitialState() {
    var tags = this.props.selected.tags;
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(tags),
      tag: this.props.tag
    };
  },

  componentWillReceiveProps(nextProps) {
    var tags = nextProps.selected.tags;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tags)
    });
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
              alignItems: 'center'
            }}
            left={
              <TouchableHighlight
                underlayColor={'rgba(0,0,0,0)'}
                onPress={() => {
                  this.props.newPostNavigator.pop();
                }}
                style={ styles.navButtonLeft }>
                <Text style={ styles.navButtonTextLeft }>
                  Cancel
                </Text>
              </TouchableHighlight>
            }
            center={
              <View style={ styles.navTitle }>
                <Text style={ styles.navTitleText }>
                  Tag: {this.state.tag.name}
                </Text>
              </View>
            }
            right={
              <View/>
            }
          />
        <ListView
          dataSource={ this.state.dataSource }
          style={ styles.bevyPickerList }
          renderRow={(tag) => {
            return (
              <TouchableHighlight
                underlayColor='rgba(0,0,0,.1)'
                onPress={() => {
                  this.props.onSelectTag(tag);
                }.bind(this)}
              >
                <View style={ styles.bevyPickerItem }>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: tag.color
                  }}/>
                  <Text style={ styles.bevyPickerName }>
                    { tag.name }
                  </Text>
                </View>
              </TouchableHighlight>
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

module.exports = TagPickerView;
