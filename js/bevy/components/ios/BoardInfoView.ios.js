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
  AlertIOS,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var AdminItem = require('./AdminItem.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = NativeModules.UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BoardActions = require('./../../../bevy/BoardActions');
var BevyStore = require('./../../../bevy/BevyStore');
var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var FILE = constants.FILE;

var BoardSettingsView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAdmin: _.findWhere(this.props.activeBoard.admins, { _id: this.props.user._id }) != undefined,
      name: this.props.activeBoard.name,
      description: this.props.activeBoard.description,
      image: this.props.activeBoard.image
    }
  },

  componentWillReceiveProps(nextProps) {
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
  },

  onUploadComplete(image) {
    this.setState({ image: image });
    BoardActions.update(this.props.activeBoard._id, this.state.name, this.state.description, image);
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  changeName() {
    AlertIOS.prompt(
      'Change Board Name',
      null,
      [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Save',
        style: 'default',
        onPress: (name) => {
          BoardActions.update(this.props.activeBoard._id, name);
          this.setState({ name: name });
        }
      }],
      'plain-text',
      this.state.name
    );
  },
  changeDescription() {
    AlertIOS.prompt(
      'Change Board Description',
      null,
      [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Save',
        style: 'default',
        onPress: (desc) => {
          BoardActions.update(this.props.activeBoard._id, this.state.name, desc);
          this.setState({ description: desc });
        }
      }],
      'plain-text',
      this.state.description
    );
  },
  changeImage() {
    this.showImagePicker();
  },

  showImagePicker() {
    UIImagePickerManager.showImagePicker({
      title: 'Choose Bevy Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (type, response) => {
      if(response) {
        //console.log(response);
        FileActions.upload(response);
      } else {
        //console.log('Cancel');
      }
    });
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
    var background = (_.isEmpty(this.state.image)
      || this.state.image.path == constants.siteurl + '/img/default_board_img.png')
    ? <View style={ styles.greyRect } />
    : (
      <Image
        style={ styles.boardImage }
        source={{ uri: resizeImage(this.state.image, constants.width, 300).url }}
      />
    );
    return (
      <View style={ styles.imageButton }>
        { background }
      </View>
    );
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

  renderSettings() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={ styles.sectionTitle }>
          Board Settings
        </Text>
        <SettingsItem
          title='Change Board Name'
          icon={
            <Icon
              name='edit'
              color='#AAA'
              size={ 30 }
            />
          }
          onPress={ this.changeName }
        />
        <SettingsItem
          title='Change Board Description'
          icon={
            <Icon
              name='edit'
              color='#AAA'
              size={ 30 }
            />
          }
          onPress={ this.changeDescription }
        />
        <SettingsItem
          title='Change Board Image'
          icon={
            <Icon
              name='add-a-photo'
              color='#AAA'
              size={ 30 }
            />
          }
          onPress={ this.changeImage }
        />
      </View>
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
          style={ styles.scrollContainer }
        >
          <Text style={ styles.sectionTitle }>
            Board Name
          </Text>
          <View style={ styles.textContainer }>
            <Text style={ styles.boardText }>
              { this.props.activeBoard.name }
            </Text>
          </View>
          <Text style={ styles.sectionTitle }>
            Board Description
          </Text>
          <View style={ styles.descriptionContainer }>
            <Text style={ styles.boardDescription }>
              { this.props.activeBoard.description }
            </Text>
          </View>
          <Text style={ styles.sectionTitle }>
            Board Type
          </Text>
          { this._renderBoardType() }
          <Text style={ styles.sectionTitle }>
            Board Image
          </Text>
          { this._renderImageButton() }
          <Text style={ styles.sectionTitle }>
            Board Admins
          </Text>
          { this._renderAdmins() }
          { this.renderSettings() }
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column',
    paddingBottom: 15
  },
  sectionTitle: {
    color: '#999',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15
  },
  textContainer: {
    backgroundColor: '#FFF',
    width: constants.width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  descriptionContainer: {
    backgroundColor: '#FFF',
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  boardText: {
    color: '#666',
    fontSize: 17
  },
  boardDescription: {
    flex: 1,
    flexWrap: 'wrap',
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
  }
});

module.exports = BoardSettingsView;
