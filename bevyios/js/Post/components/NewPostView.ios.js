'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  ListView,
  StyleSheet,
  StatusBarIOS,
  Navigator,
  TouchableHighlight
} = React;

var {
  Icon
} = require('react-native-icons');

var _ = require('underscore');
var routes = require('./../../routes');
var constants = require('./../../constants');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var Navbar = require('./../../shared/components/Navbar.ios.js');

var NewPostView = React.createClass({

  getInitialState() {
    return {
      postToBevy: this.props.activeBevy
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      postToBevy: nextProps.activeBevy
    });
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={ _.toArray(routes.NEWPOST) }
        initialRoute={ routes.NEWPOST.INPUT }
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.NEWPOST.BEVYPICKER.name:
              return (
                <BevyPickerView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selected={ this.state.postToBevy }
                  onSwitchBevy={(bevy) => {
                    navigator.jumpTo(routes.NEWPOST.INPUT);
                    this.setState({
                      postToBevy: bevy
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
                  selected={ this.state.postToBevy }
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

var InputView = React.createClass({

  propTypes: {
    selected: React.PropTypes.object
  },

  getInitialState() {
    return {
      keyboardSpace: 0
    };
  },

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, (frames) => {
      this.setState({
        keyboardSpace: frames.end.height
      });
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 0
      });
    });
  },

  onChangeText() {

  },

  render() {
    var user = constants.getUser();
    var containerStyle = {
      flex: 1,
      flexDirection: 'column',
      marginBottom: (this.state.keyboardSpace == 0) ? 0 : this.state.keyboardSpace,
    };
    return (
      <View style={ containerStyle }>
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
                this.refs.input.blur();
                this.props.mainNavigator.jumpTo(routes.MAIN.TABBAR);
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
                New Post
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {

              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Post
              </Text>
            </TouchableHighlight>
          }
        />
        <View style={ styles.body }>
          <View style={ styles.bevyPicker }>
            <Text style={ styles.postingTo }>Posting To:</Text>
            <Text style={ styles.bevyName }>{ this.props.selected.name }</Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.jumpTo(routes.NEWPOST.BEVYPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <Icon
                name='ion|chevron-right'
                size={30}
                color='#666'
                style={{ width: 30, height: 30 }}
              />
            </TouchableHighlight>
          </View>
          <View style={ styles.input }>
            <Image
              style={ styles.inputProfileImage }
              source={{ uri: user.image_url }}
            />
            <TextInput 
              ref='input'
              multiline={ true }
              onChangeText={ this.onChangeText }
              placeholder='Drop a Line'
              style={ styles.textInput }
            />
          </View>
          <View style={ styles.contentBar }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {

              }}
              style={ styles.contentBarItem }
            >
              <Icon
                name='ion|image'
                size={30}
                color='#666'
                style={ styles.contentBarIcon }
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {

              }}
              style={ styles.contentBarItem }
            >
              <Icon
                name='ion|camera'
                size={30}
                color='#666'
                style={ styles.contentBarIcon }
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
});

var BevyPickerView = React.createClass({

  propTypes: {
    onSwitchBevy: React.PropTypes.func,
    selected: React.PropTypes.object
  },

  getInitialState() {
    var bevies = this.props.allBevies;
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevies = nextProps.allBevies;
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
                  this.props.newPostNavigator.jumpTo(routes.NEWPOST.INPUT);
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
              <TouchableHighlight
                underlayColor={'rgba(0,0,0,0)'}
                onPress={() => {
                  this.props.newPostNavigator.jumpTo(routes.NEWPOST.INPUT);
                }}
                style={ styles.navButtonRight }>
                <Text style={ styles.navButtonTextRight }>
                  Done
                </Text>
              </TouchableHighlight>
            }
          />
        <ListView
          dataSource={ this.state.dataSource }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            var imageUri = bevy.image_url || constants.apiurl + '/img/logo_100.png';
            return (
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={() => {
                  this.props.onSwitchBevy(bevy);
                }}
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
    flex: 1
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#ddd',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10
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