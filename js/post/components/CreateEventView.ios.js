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
  TouchableOpacity
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
var DatePickerModal = require('./DatePickerModal.ios.js');
var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var PostActions = require('./../PostActions');

var CreateEventView = React.createClass({

  propTypes: {
    selected: React.PropTypes.object, 
    user: React.PropTypes.object,
    date: React.PropTypes.Date
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: '',
      postImageURI: 'http://api.joinbevy.com/img/default_event_img.png',
      placeholderText: 'Drop a Line',
      datePicker: false,
      date: new Date(Date.now())
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this._onKeyboardShowed);
    DeviceEventEmitter.addListener('keyboardWillHide', this._onKeyboardHid);

    // file upload events
    FileStore.on(FILE.UPLOAD_COMPLETE, (filename) => {
      console.log('caught upload', filename)
      this.setState({
        postImageURI: filename,
        placeholderText: 'Say Something About This Image'
      });
    });
  },

  _onKeyboardShowed(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({
      keyboardSpace: height
    });
  },

  _onKeyboardHid(ev) {
    this.setState({
      keyboardSpace: 0
    });
  },

  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE);
  },

  setDate(date) {
    this.setState({
      date: date
    })
  },

  uploadImage() {
    UIImagePickerManager.showImagePicker({
      title: 'Upload Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (type, response) => {
      if (type !== 'cancel') {
        //console.log(response);
        FileActions.upload(response);
      } else {
        //console.log('Cancel');
      }
    });
  },

  hideDatePicker() {
    this.setState({
      datePicker: false
    });

  },

  _renderPostImage() {
    if(_.isEmpty(this.state.postImageURI)) return <View />;
    return (
        <Image
          source={{ uri: this.state.postImageURI }}
          style={{
            flex: 1,
            height: 150,
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
          }}
        >
          <TouchableHighlight
            underlayColor='rgba(0,0,0,.2)'
            style={{borderRadius: 25, width: 50, height: 50}}
            onPress={() => {
              UIImagePickerManager.showImagePicker({
                  returnBase64Image: false,
                  returnIsVertical: true
                }, (type, response) => {
                  if (type !== 'cancel') {
                    //console.log(response);
                    FileActions.upload(response);
                  } else {
                    //console.log('Cancel');
                  }
              });
            }}
          >
            <Icon
              name='edit'
              size={30}
              color='#fff'
              style={{ padding: 10, width: 50, height: 50 }}
            />
          </TouchableHighlight>
        </Image>
    );
  },

  render() {
    var user = this.props.user;
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
                this.props.mainNavigator.pop();
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
                New Event
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                if(this.state.title.length <= 0) return; // dont post if text is empty
                PostActions.create( // send action
                  this.state.title,
                  (_.isEmpty(this.state.postImageURI)) ? [] : [this.state.postImageURI],
                  this.props.user,
                  this.props.selected
                );
                this.refs.input.setNativeProps({ text: '' }); // clear text
                this.refs.input.blur(); // unfocus text field
                this.props.mainNavigator.pop(); // navigate back to main tab bar
              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Post
              </Text>
            </TouchableHighlight>
          }
        />
        <DatePickerModal
          date={ this.state.date }
          onHide={ this.hideDatePicker }
          isVisible={ this.state.datePicker }
          onSetDate={(date) => {
            this.setState({
              date: date
            });
          }}
          { ...this.props }
        />
        <View style={ styles.body }>
          <View style={ styles.bevyPicker }>
            <Text style={ styles.postingTo }>Posting To:</Text>
            <Text style={ styles.bevyName }>{ this.props.selected.name }</Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <Icon
                name='chevron-right'
                size={30}
                color='#666'
                style={{ width: 30, height: 30 }}
              />
            </TouchableHighlight>
          </View>
          <ScrollView style={ styles.input }>
            { this._renderPostImage() }
            <TextInput 
              ref='input'
              multiline={ true }
              onChange={(ev) => {
                this.setState({
                  title: ev.nativeEvent.text
                });
              }}
              placeholder='title'
              style={ styles.textInput }
            />
            <SettingsItem 
              checked={false}
              onPress={() => {
                this.setState({
                  datePicker: true
                });
              }}
              title='date'
            />
            <SettingsItem 
              checked={false}
              onPress={() => {}}
              title='location'
            />
          </ScrollView>
        </View>
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
  toBevyPicker: {
    alignSelf: 'flex-end'
  },
  input: {
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
    fontSize: 17,
    height: 40,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
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

module.exports = CreateEventView;