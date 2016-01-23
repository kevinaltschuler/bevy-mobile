/**
 * InputView.ios.js
 *
 * Entry view where the user creates new posts by entering text
 * and uploading images
 * Also doubles as the edit post view, for editing text and
 * removing images
 *
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
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = NativeModules.UIImagePickerManager;
var NewPostImageItem = require('./NewPostImageItem.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var FILE = constants.FILE;
var POST = constants.POST;

var hintTexts = [
  "What's on your mind?",
  "What's up?",
  "How's it going?",
  "What's new?",
  "How are you doing today?",
  "Share your thoughts",
  "Drop some knowledge buddy",
  "Drop a line",
  "What's good?",
  "What do you have to say?",
  "Spit a verse",
  "What would your mother think?",
  "Tell me about yourself",
  "What are you thinking about?",
  "Gimme a bar",
  "Lets talk about our feelings",
  "Tell me how you really feel",
  "How was last night?",
  "What's gucci?",
  "Anything worth sharing?",
];

var InputView = React.createClass({
  propTypes: {
    newPostNavigator: React.PropTypes.object,
    newPostRoute: React.PropTypes.object,
    postingToBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,

    // used for editing
    editing: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      keyboardSpace: 0,
      title: (this.props.editing)
        ? this.props.post.title
        : '',
      placeholderText: hintTexts[Math.floor(Math.random() * hintTexts.length)],
      images: (this.props.editing)
        ? this.props.post.images
        : [],
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
    PostStore.on(POST.POST_CREATED, this.onPostCreated);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
    PostStore.off(POST.POST_CREATED, this.onPostCreated);
  },

  onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({ keyboardSpace: height });
  },
  onKeyboardHide(ev) {
    this.setState({ keyboardSpace: 0 });
  },

  onUploadComplete(image) {
    var images = this.state.images;
    images.push(image);
    this.setState({ images: images });
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
    UIImagePickerManager.launchImageLibrary({
      returnBase64Image: false,
      returnIsVertical: true
    }, (response) => {
      if (!response.didCancel) {
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  launchCamera() {
    UIImagePickerManager.launchCamera({
      returnBase64Image: false,
      returnIsVertical: true
    }, (response) => {
      if (!response.didCancel) {
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  goBack() {
    this.TitleInput.blur();
    this.props.mainNavigator.pop();
  },

  goToBoardPickerView() {
    this.props.newPostNavigator.push(routes.NEWPOST.BOARDPICKER);
  },

  submit() {
    // dont post if text and images are empty
    if(this.state.title.length <= 0 && this.state.images.length <= 0) return;

    if(this.props.editing) {
      PostActions.update(
        this.props.post._id,
        this.state.title,
        this.state.images,
        null //event
      );
    } else {
      PostActions.create(
        this.state.title,
        (_.isEmpty(this.state.images)) ? [] : this.state.images,
        this.props.user,
        this.props.postingToBoard,
        null, // type
        null, // event
      );
    }

    // unfocus text field
    this.TitleInput.blur();

    // if we're editing the post, then go directly to the comment view
    // because we already have the post that the comment view needs
    //
    // if we're creating a new post, then the onPostCreated function will
    // go to the comment view once the new post has been created on the server
    if(this.props.editing) {
      var route = routes.MAIN.COMMENT;

      // optimistic update
      var post = this.props.post;
      post.title = this.state.title;
      post.images = this.state.images;

      this.goToCommentView(post);
    }
  },

  onPostCreated(newPost) {
    // go to comment view
    this.goToCommentView(newPost);
  },

  goToCommentView(post) {
    var route = routes.MAIN.COMMENT;
    route.post = post;

    var currentRoutes = this.props.mainNavigator.getCurrentRoutes();
    // if the comment route is already in the route stack,
    // then pushing another copy of it will crash the app.
    //
    // remove that previous comment route and push it to
    // the front of the stack
    if(_.findWhere(currentRoutes, { name: routes.MAIN.COMMENT.name }) != undefined) {
      var commentViewIndex = currentRoutes.length - 2;
      // rerender the comment view with our fresh post
      this.props.mainNavigator.replaceAtIndex(route, commentViewIndex);
      // go back
      this.props.mainNavigator.pop();
    } else {
      this.props.mainNavigator.replace(route);
    }
  },

  onImageItemRemove(image) {
    var images = this.state.images;
    images = _.reject(images, ($image) => $image.filename == image.filename);
    this.setState({
      images: images
    });
  },

  _renderBoardItem() {
    var board = (this.props.editing)
      ? this.props.post.board
      : this.props.postingToBoard;

    var boardImageURL = (_.isEmpty(board.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(board.image, 80, 80).url;

    if(this.props.editing) {
      return (
        <View style={ styles.boardItemDetails }>
          <Image
            source={{ uri: boardImageURL }}
            style={ styles.boardImage }
          />
          <Text style={styles.boardName}>
            { board.name }
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={ this.goToBoardPickerView }
          activeOpacity={ 0.5 }
        >
          <View style={ styles.boardItemDetails }>
            <Image
              source={{ uri: boardImageURL }}
              style={ styles.boardImage }
            />
            <Text
              style={ styles.boardName }
              numberOfLines={ 2 }
            >
              { board.name }
            </Text>
            <Icon
              name='chevron-right'
              size={ 48 }
              color='#888'
              style={{
                marginLeft: 10
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }
  },

  _renderImages() {
    if(_.isEmpty(this.state.images)) return <View />;

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
      <View style={ styles.imageBar }>
        <Text style={ styles.sectionTitle }>
          Images
        </Text>
        <ScrollView
          horizontal={ true }
          showHorizontalScrollIndicator={ true }
          contentContainerStyle={ styles.imageScrollBar }
        >
          { images }
        </ScrollView>
      </View>
    );
  },

  render() {
    var authorImageURL = (_.isEmpty(this.props.user.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.user.image, 64, 64).url;

    return (
      <View style={[ styles.container, {
        marginBottom: (this.state.keyboardSpace == 0) ? 0 : this.state.keyboardSpace
      }]}>
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
            <View style={{
              width: 27,
              height: 48
            }}/>
            <Text style={ styles.title }>
              {(this.props.editing)
                ? 'Edit Post'
                : 'New Post'}
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.submit }
            >
              <View style={ styles.createButton }>
                <Text style={ styles.createButtonText }>
                  Create
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={ styles.body }
          contentContainerStyle={{
            flex: 1,
            paddingBottom: 20
          }}
        >
          <View style={ styles.boardItem }>
            <Text style={ styles.sectionTitle }>Board</Text>
            { this._renderBoardItem() }
          </View>
          <Text style={ styles.sectionTitle }>Post</Text>
          <View style={ styles.input }>
            <Image
              style={styles.inputProfileImage}
              source={{ uri: authorImageURL }}
            />
            <TextInput
              ref={ ref => { this.TitleInput = ref; }}
              multiline={ true }
              value={ this.state.title }
              onChangeText={ text => this.setState({ title: text }) }
              placeholder={ this.state.placeholderText }
              placeholderTextColor='#AAA'
              style={ styles.textInput }
            />
          </View>
          { this._renderImages() }
        </ScrollView>
        <View style={ styles.contentBar }>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.addImage }
            style={ styles.contentBarItem }
          >
            <Icon
              name='photo'
              size={ 36 }
              color='rgba(0,0,0,.3)'
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0)'
            onPress={ this.launchCamera }
            style={ styles.contentBarItem }
          >
            <Icon
              name='add-a-photo'
              size={ 36 }
              color='rgba(0,0,0,.3)'
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
  createButton: {
    width: 75,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 17
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 40
  },
  boardItem: {
    flexDirection: 'column',
    padding: 0,
    marginTop: 10,
    marginBottom: 15
  },
  boardName: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    marginLeft: 15,
  },
  boardImage: {
    borderRadius: 30,
    width: 60,
    height: 60
  },
  boardItemDetails: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: '#fff'
  },
  inputProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  textInput: {
    flex: 2,
    fontSize: 17,
  },

  imageBar: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 6,
    flex: 1,
    minHeight: 100,
  },
  imageScrollBar: {
    flexDirection: 'row',
    alignItems: 'center'
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
    height: 60,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  contentBarItem: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = InputView;
