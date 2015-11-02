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

var PostActions = require('./../PostActions');

var BevyPickerView = React.createClass({

  propTypes: {
    onSwitchBevy: React.PropTypes.func,
    selected: React.PropTypes.object
  },

  getInitialState() {
    var bevies = this.props.myBevies;
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies),
      selected: this.props.selected
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevies = nextProps.myBevies;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(bevies)
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
                  Posting To...
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
          renderRow={(bevy) => {
            var imageUri = bevy.image_url || constants.apiurl + '/img/logo_100.png';
            var defaultBevies=['11sports', '22gaming', '3333pics', '44videos', '555music', '6666news', '777books'];
            if(_.contains(defaultBevies, bevy._id)) {
              imageUri = constants.apiurl + bevy.image_url;
            }
            if(bevy._id == -1) return <View />; // disallow posting to frontpage
            return (
              <TouchableHighlight
                underlayColor='rgba(0,0,0,.1)'
                onPress={() => {
                  this.props.onSwitchBevy(bevy);
                }.bind(this)}
              >
                <View style={ styles.bevyPickerItem }>
                  <Image
                    style={ styles.bevyPickerImage }
                    source={{ uri: imageUri }}
                  />
                  <Text style={ styles.bevyPickerName }>
                    { bevy.name }
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

module.exports = BevyPickerView;