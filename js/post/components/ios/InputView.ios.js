/**
 * InputView.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  DeviceEventEmitter
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var NewPostImageItem = require('./NewPostImageItem.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');

var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var FILE = constants.FILE;
var PostActions = require('./../../../post/PostActions');

var InputView = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: '',
      placeholderText: 'Drop a Line',
      images: [],
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this._onKeyboardShowed);
    DeviceEventEmitter.addListener('keyboardWillHide', this._onKeyboardHid);

    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
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
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  onUploadComplete(file) {
    console.log(file);
    var images = this.state.images;
    console.log(images);
    images.push(file);
    console.log(images);
    this.setState({
      images: images
    });
  },

  onUploadError(error) {
    console.log(error);
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
        FileActions.upload(response.uri);
      } else {
        //console.log('Cancel');
      }
    });
  },

  addImage() {
    //this.uploadImage();
    UIImagePickerManager.launchImageLibrary({
      returnBase64Image: false,
      returnIsVertical: true
    }, (didCancel, response) => {
      if (!didCancel) {
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  launchCamera() {
    //this.uploadImage();
    UIImagePickerManager.launchCamera({
      returnBase64Image: false,
      returnIsVertical: true
    }, (didCancel, response) => {
      if (!didCancel) {
        console.log(response);
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  goBack() {
    this.refs.input.blur();
    this.props.mainNavigator.pop();
  },

  submit() {
    if(this.state.title.length <= 0) return; // dont post if text is empty
    PostActions.create( // send action
      this.state.title,
      (_.isEmpty(this.state.images)) ? [] : this.state.images,
      this.props.user,
      this.props.activeBoard,
      null,
      null,
    );
    this.refs.input.setNativeProps({ text: '' }); // clear text
    this.refs.input.blur(); // unfocus text field
    //this.props.mainNavigator.pop(); // navigate back to main tab bar
  },

  _renderImages() {
    if(_.isEmpty(this.state.images)) {
      return (
        <View />
      );
    }

    var images = [];
    for(var key in this.state.images) {
      var image = this.state.images[key];
      images.push(
        <NewPostImageItem
          key={ 'inputimage:' + image.filename }
          image={ image }
          onRemove={ this.onImageItemRemove }
        />
      );
    }
    return (
      <View style={{
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginBottom: 6
      }}>
        <Text style={ styles.sectionTitle }>Images</Text>
        <ScrollView
          horizontal={ true }
          showHorizontalScrollIndicator={ true }
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          { images }
        </ScrollView>
      </View>
    );
  },

  render() {
    var user = this.props.user;
    var board = this.props.activeBoard;
    var containerStyle = {
      flex: 1,
      flexDirection: 'column',
      marginBottom: (this.state.keyboardSpace == 0) ? 0 : this.state.keyboardSpace,
      backgroundColor: '#eee'
    };
    if(board) {
      var boardImageUrl = board.image.path || constants.apiurl + '/img/default_board_img.png';
    }
    var boardName = (this.props.activeBoard) ? this.props.activeBoard.name : '';
    return (
      <View style={ containerStyle }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
            <Text style={ styles.title }>
              New Post
            </Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.submit }
            >
              <Icon
                name='add'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView style={ styles.body } contentContainerStyle={{flex: 1, marginBottom: 50}}>
          <View style={ styles.bevyPicker }>
            <Text style={ styles.sectionTitle }>Board</Text>
            <View style={styles.bevyNameContainer}>
              <Image source={{uri: boardImageUrl}} style={{borderRadius: 15, width: 30, height: 30}}/>
              <Text style={styles.bevyTitle}>
                {boardName}
              </Text>
            </View>
          </View>
          <Text style={ styles.sectionTitle }>Post</Text>
          <View style={ styles.input }>
            <Image
              style={styles.inputProfileImage}
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
            { this._renderImages() }
          </View>
        </ScrollView>
        <View style={ styles.contentBar }>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.addImage }
            style={ styles.contentBarItem }
          >
            <Icon
              name='photo'
              size={30}
              color='rgba(0,0,0,.3)'
              style={ styles.contentBarIcon }
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.launchCamera }
            style={ styles.contentBarItem }
          >
            <Icon
              name='add-a-photo'
              size={32}
              color='rgba(0,0,0,.3)'
              style={ styles.contentBarIcon }
            />
          </TouchableHighlight>
            {/*<TouchableHighlight
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this.props.newPostNavigator.push(routes.NEWPOST.CREATEEVENT);
              }}
              style={ styles.contentBarItem }
            >
              <Icon
                name='calendar'
                size={30}
                color='rgba(0,0,0,.3)'
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
    flexDirection: 'column',
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyPicker: {
    flexDirection: 'column',
    padding: 0,
    marginTop: 10,
    marginBottom: 15
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
  bevyNameContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  bevyTitle: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    marginLeft: 10
  },
  toBevyPicker: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    marginRight: 10,
    borderRadius: 3,
    height: 84,
    width: constants.width,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  input: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    flex: 1,
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: '#fff'
  },
  inputProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  textInput: {
    flex: 2,
    fontSize: 15,
  },
  contentBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: constants.width,
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
  },
  sectionTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = InputView;
