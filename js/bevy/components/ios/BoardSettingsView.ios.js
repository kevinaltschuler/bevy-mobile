/**
 * BoardSettingsView.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  NativeModules,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UIImagePickerManager = NativeModules.UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var BoardActions = require('./../../../board/BoardActions');
var FILE = constants.FILE;

var BoardSettingsView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: this.props.activeBoard.name,
      description: this.props.activeBoard.description,
      image: this.props.activeBoard.image,
      settings: this.props.activeBoard.settings
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.activeBoard.name,
      description: nextProps.activeBoard.description,
      image: nextProps.activeBoard.image,
      settings: nextProps.activeBoard.settings
    });
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUpload);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUpload);
  },

  onUpload(image) {
    this.setState({ image: image });
  },

  goBack() {
    this.props.bevyNavigator.pop();
    this.setState(this.getInitialState());
  },

  showImagePicker() {
    UIImagePickerManager.showImagePicker({
      title: 'Choose Bevy Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, response => {
      if (!response.didCancel) {
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  submit() {
    BoardActions.update(
      this.props.activeBoard._id, // board id
      this.state.name, // name
      this.state.description, // description
      this.state.image, // image
      this.state.settings // settings
    );
    this.goBack();
  },

  _renderImageButton() {
    var background = (_.isEmpty(this.state.image))
    ? (
      <View style={ styles.greyRect } />
    ) : (
      <Image
        style={ styles.boardImage }
        source={{ uri: resizeImage(this.state.image, constants.width, 300).url }}
      />
    );
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.imageButton }
        onPress={ this.showImagePicker }
      >
        <View style={ styles.imageButton }>
          { background }
          <View style={ styles.darkener } />
          <Icon
            name='add-a-photo'
            size={ 48 }
            color='#FFF'
            style={ styles.addIcon }
          />
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              Board Settings
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <ScrollView style={ styles.container }>
          <Text style={ styles.sectionTitle }>
            Board Name
          </Text>
          <TextInput
            ref={ ref => { this.NameInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            style={ styles.textInput }
            value={ this.state.name }
            onChangeText={ text => this.setState({ name: text }) }
            placeholder='Board Name'
            placeholderTextColor='#AAA'
          />
          <Text style={ styles.sectionTitle }>
            Board Description
          </Text>
          <TextInput
            ref={ ref => { this.DescInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            style={ styles.textInput }
            value={ this.state.description }
            onChangeText={ text => this.setState({ description: text }) }
            placeholder='Board Description'
            placeholderTextColor='#AAA'
          />
          <Text style={ styles.sectionTitle }>
            Board Image
          </Text>
          { this._renderImageButton() }
          <Text style={ styles.sectionTitle }>
            Parent Bevy
          </Text>
          <View style={ styles.bevyItem }>
            <Image
              style={ styles.bevyImage }
              source={{ uri: (_.isEmpty(this.props.activeBevy.image))
                ? constants.siteurl + '/img/default_board_img.png'
                : resizeImage(this.props.activeBevy.image, 128, 128).url
              }}
            />
            <Text style={ styles.bevyName }>
              { this.props.activeBevy.name }
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={ 0.5 }
            onPress={ this.submit }
            style={ styles.saveButton }
          >
            <Text style={ styles.saveButtonText }>
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
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
  sectionTitle: {
    color: '#999',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15
  },
  textInput: {
    backgroundColor: '#FFF',
    width: constants.width,
    height: 60,
    fontSize: 17,
    color: '#666',
    paddingHorizontal: 15
  },
  imageButton: {
    width: constants.width,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  greyRect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 150,
    backgroundColor: '#EEE'
  },
  boardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 150
  },
  darkener: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  addIcon: {
    backgroundColor: 'transparent'
  },
  bevyItem: {
    backgroundColor: '#FFF',
    width: constants.width,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  bevyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  bevyName: {
    color: '#666',
    fontSize: 17
  },
  saveButton: {
    width: constants.width,
    height: 60,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 15
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17
  }
});

module.exports = BoardSettingsView;
