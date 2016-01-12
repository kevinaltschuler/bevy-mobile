/**
 * NewBoardView.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  SegmentedControlIOS
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var RefreshingIndicator =
  require('./../../../shared/components/ios/RefreshingIndicator.ios.js');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var BEVY = constants.BEVY;
var BOARD = constants.BOARD;
var FILE = constants.FILE;
var BevyActions = require('./../../../bevy/BevyActions');
var BoardActions = require('./../../../board/BoardActions');
var BevyStore = require('./../../../bevy/BevyStore');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var getSlug = require('speakingurl');

var NewBoardView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      boardImage: '',
      name: '',
      description: '',
      creating: false,
      type: 'discussion'
    };
  },

  componentDidMount() {
    BevyStore.on(BOARD.CREATED, this.onBoardCreate);
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onFileUpload);
  },

  componentWillUnmount() {
    BevyStore.off(BOARD.CREATED, this.onBoardCreate);
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onFileUpload);
  },

  onBoardCreate(board) {
    // switch bevies
    BoardActions.switchBoard(board._id);
    console.log('made it here');
    // navigate back
    this.props.mainNavigator.pop();

    this.setState({
      creating: false
    });
  },

  onFileUpload(file) {
    this.setState({
      boardImage: file
    });
  },

  goBack() {
    this.BoardNameInput.blur();
    this.BoardDescInput.blur();
    this.props.mainNavigator.pop();
  },

  createBoard() {
    if(_.isEmpty(this.state.name)) return;

    // call action
    BevyActions.createBoard(
      this.state.name, // bevy name
      this.state.description,
      (_.isEmpty(this.state.boardImage))
        ? { filename: constants.siteurl + '/img/default_board_img.png', foreign: true }
        : this.state.boardImage, // bevy image
      this.props.activeBevy._id,
      this.state.type.toLowerCase()
    );

    // blur all text inputs
    this.BoardNameInput.blur();
    this.BoardDescInput.blur();
    this.setState({
      creating: true
    });
  },

  showImagePicker() {
    UIImagePickerManager.showImagePicker({
      title: 'Choose Board Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (didCancel, response) => {
      if (didCancel) {
        //console.log(response);

      } else {
        //console.log('Cancel');
        FileActions.upload(response.uri);
        //console.log(response.uri);
      }
    });
  },

  _renderLoadingView() {
    if(this.state.creating) {
      return (
        <View style={ styles.loadingView }>
          <RefreshingIndicator description='Creating Board...'/>
        </View>
      );
    } else {
      return <View />;
    }
  },

  _renderBevyItem() {
    var bevyImageURL = (_.isEmpty(this.props.activeBevy.image))
      ? constants.siteurl + '/img/logo_200.png'
      : resizeImage(this.props.activeBevy.image, 128, 128).url;

    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>
          Creating Board For
        </Text>
        <View style={ styles.bevyItem }>
          <Image
            source={{ uri: bevyImageURL }}
            style={ styles.bevyImage }
          />
          <Text style={ styles.bevyName }>
            { this.props.activeBevy.name }
          </Text>
        </View>
      </View>
    );
  },

  _renderTitleDescription() {
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>General</Text>
        <View style={ styles.generalCard} >
          <TextInput
            style={ styles.boardNameInput }
            ref={ ref => { this.BoardNameInput = ref; }}
            value={ this.state.name }
            onChangeText={text => {
              this.setState({ name: text });
            }}
            autoCorrect={ false }
            placeholder='Board Name'
            placeholderTextColor='#AAA'
          />
          <View style={{
            width: constants.width,
            height: 1,
            backgroundColor: '#EEE'
          }}/>
          <TextInput
            style={ styles.boardDescriptionInput }
            ref={ ref => { this.BoardDescInput = ref; }}
            value={ this.state.description }
            onChangeText={text => {
              this.setState({ description: text });
            }}
            autoCorrect={ false }
            placeholder='Board Description'
            placeholderTextColor='#AAA'
          />
        </View>
      </View>
    );
  },

  _renderImageInput() {
    var image = resizeImage(this.state.boardImage, constants.width, 200);
    var middle = (_.isEmpty(this.state.boardImage))
    ? (
      <Icon
        name='add-a-photo'
        size={ 30 }
        color='#ccc'
      />
    ) : (
      <Image
        style={ styles.boardImage }
        source={{ uri: image.url }}
      />
    );
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>Board Image</Text>
        <TouchableHighlight
          style={ styles.boardImageButton }
          underlayColor='rgba(0,0,0,0)'
          onPress={ this.showImagePicker }
        >
          { middle }
        </TouchableHighlight>
      </View>
    );
  },

  _renderType() {
    var typeIndex, typeIcon, typeText;
    switch(this.state.type) {
      case 'discussion':
        typeIndex = 1;
        typeIcon = 'forum';
        typeText = 'Anybody may post content to a Discussion Board';
        break;
      case 'announcement':
        typeIndex = 0;
        typeIcon = 'flag';
        typeText = 'Only admins may post content to an announcements Board';
        break;
      case 'event':
        break;
    }

    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>Board Type</Text>
        <SegmentedControlIOS
          style={{
            backgroundColor: '#fff',
            marginBottom: 10,
            marginHorizontal: 20
          }}
          tintColor='#aaa'
          values={['Announcement', 'Discussion']}
          selectedIndex={ typeIndex }
          onValueChange={ev => {
            this.setState({
              type: ev.toLowerCase()
            });
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
            marginBottom: 40
          }}
        >
          <Text style={{color: '#888'}}>
            {typeText}
          </Text>
        </View>
      </View>
    )
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }} />
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
              New Board
            </Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.createBoard }
            >
              <Icon
                name='done'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView>
          <View style={ styles.body }>
            { this._renderLoadingView() }
            { this._renderBevyItem() }
            { this._renderTitleDescription() }
            { this._renderImageInput() }
            { this._renderType() }
          </View>
        </ScrollView>
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
  loadingView: {
    marginTop: 20,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
  },
  bevyItem: {
    backgroundColor: '#FFF',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  bevyImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  bevyName: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  boardImageButton: {
    width: constants.width,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 0
  },
  boardImage: {
    width: constants.width,
    height: 120
  },
  boardNameInput: {
    fontSize: 17,
    height: 48,
    width: constants.width,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
  boardDescriptionInput: {
    fontSize: 17,
    height: 48,
    width: constants.width,
    paddingTop: 10
  },
  generalCard: {
    backgroundColor: '#fff',
    padding: 10
  },
  section: {
    marginTop: 20
  }
});

module.exports = NewBoardView;
