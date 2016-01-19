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
var AdminItem = require('./AdminItem.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var BoardActions = require('./../../../bevy/BoardActions');
var FILE = constants.FILE;

var BoardSettingsView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      editing: false
    };
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
    // blur inputs if they exist
    if(this.props.editing) {
      this.NameInput.blur();
      this.DescInput.blur();
    }
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

  _renderBoardName() {
    if(this.props.editing) {
      return (
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
      );
    } else {
      return (
        <View style={ styles.textContainer }>
          <Text style={ styles.boardText }>
            { this.state.name }
          </Text>
        </View>
      );
    }
  },

  _renderBoardDescription() {
    if(this.props.editing) {
      return (
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
      );
    } else {
      return (
        <View style={ styles.textContainer }>
          <Text style={ styles.boardText }>
            { this.state.description }
          </Text>
        </View>
      );
    }
  },

  _renderBoardType() {
    var iconName;
    switch(this.props.activeBoard.type) {
      case 'announcement':
        iconName = 'flag';
        break;
      case 'discussion':
        iconName = 'forum';
        break;
    }
    return (
      <View style={ styles.boardType }>
        <Icon
          name={ iconName }
          size={ 30 }
          color='#888'
          style={ styles.boardTypeIcon }
        />
        <Text style={ styles.boardTypeText }>
          { this.props.activeBoard.type.charAt(0).toUpperCase()
            + this.props.activeBoard.type.slice(1) }
        </Text>
      </View>
    );
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
    if(this.props.editing) {
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
    } else {
      return (
        <View style={ styles.imageButton }>
          { background }
        </View>
      );
    }
  },

  _renderAdmins() {
    var admins = [];
    for(var key in this.props.activeBoard.admins) {
      var admin = this.props.activeBoard.admins[key];
      admins.push(
        <AdminItem
          key={ 'adminitem:' + key }
          admin={ admin }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    return admins;
  },

  _renderSaveButton() {
    if(!this.props.editing) return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.submit }
        style={ styles.saveButton }
      >
        <Text style={ styles.saveButtonText }>
          Save Changes
        </Text>
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
              {(this.props.editing)
                ? 'Board Settings'
                : 'Board Info'}
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <ScrollView
          style={ styles.container }
          contentContainerStyle={{
            paddingBottom: 20
          }}
        >
          <Text style={ styles.sectionTitle }>
            Board Name
          </Text>
          { this._renderBoardName() }
          <Text style={ styles.sectionTitle }>
            Board Description
          </Text>
          { this._renderBoardDescription() }
          <Text style={ styles.sectionTitle }>
            Board Type
          </Text>
          { this._renderBoardType() }
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
          <Text style={ styles.sectionTitle }>
            Board Settings
          </Text>
          <SettingsItem
            title='Show Group Chat'
            checked={ this.props.activeBoard.settings.group_chat }
          />
          <Text style={ styles.sectionTitle }>
            Board Admins
          </Text>
          { this._renderAdmins() }
          { this._renderSaveButton() }
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
  textContainer: {
    backgroundColor: '#FFF',
    width: constants.width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  boardText: {
    color: '#666',
    fontSize: 17
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
  boardType: {
    backgroundColor: '#FFF',
    width: constants.width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  boardTypeIcon: {
    marginRight: 15
  },
  boardTypeText: {
    flex: 1,
    color: '#888',
    fontSize: 17,
    textAlign: 'left'
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
