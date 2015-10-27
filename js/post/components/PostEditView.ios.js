/*PostEditView.ios.js
/* kevin made this
 * that party last night was off the crazy i wish we taped it. oh wait. dan did.
*/

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

var PostEditView = React.createClass({

  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: this.props.post.title,
      postImageURI: this.props.post.images[0]
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

  _renderPostImage() {
    if(_.isEmpty(this.state.postImageURI)) return <View />;
    return (
      <Image
        source={{ uri: this.state.postImageURI }}
        style={{
          flex: 1,
          width: window.width,
          height: 300
        }}
      />
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
                New Post
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                if(this.state.title.length <= 0) return; // dont post if text is empty
                PostActions.update( // send action
                  this.props.post._id,
                  this.state.title
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
        <View style={ styles.body }>
          <View style={ styles.bevyPicker }>
            {/*<TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.TAGPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <View style={styles.bevyPickerButton}>
                <Text style={ styles.postingTo }>Tag: </Text>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: 'bold', color: this.props.tag.color} }>{ this.props.tag.name }</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER);
              }}
              style={ styles.toBevyPicker }
            >
              <View style={styles.bevyPickerButton}>
                <Text style={ styles.postingTo }>Posting To:</Text>
                <Text style={ styles.bevyName }>{ this.props.selected.name }</Text>
              </View>
            </TouchableHighlight>*/}
          </View>
          <View style={ styles.input }>
            <Image
              style={ styles.inputProfileImage }
              source={{ uri: user.image_url }}
            />
            <TextInput 
              ref='input'
              multiline={ true }
              onChange={(ev) => {
                this.setState({
                  title: ev.nativeEvent.text
                });
              }}
              placeholder={ this.state.placeholderText }
              style={ styles.textInput }
            />
          </View>
          <View style={ styles.image }>
            { this._renderPostImage() }
          </View>
        </View>
        <View style={ styles.contentBar }>
            {/*<TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                //this.uploadImage();
                UIImagePickerManager.showLibrary({
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
              style={ styles.contentBarItem }
            >
              <Icon
                name='image'
                size={30}
                color='#666'
                style={ styles.contentBarIcon }
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                //this.uploadImage();
                UIImagePickerManager.showCamera({
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
              style={ styles.contentBarItem }
            >
              <Icon
                name='camera'
                size={32}
                color='#666'
                style={ styles.contentBarIcon }
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.CREATEEVENT);
              }}
              style={ styles.contentBarItem }
            >
              <Icon
                name='calendar'
                size={30}
                color='#666'
                style={ styles.contentBarIcon }
              />
            </TouchableHighlight>*/}
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  bevyPickerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  postingTo: {
    fontSize: 15,
    marginRight: 10,
    color: '#fff'
  },
  bevyName: {
    color: '#2CB673',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1
  },
  toBevyPicker: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.15)',
    padding: 5,
    marginRight: 10,
    borderRadius: 3
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
  bevyPickerButton: {
    flexDirection: 'row'
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

module.exports = PostEditView;