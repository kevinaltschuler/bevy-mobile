/**
 * NewPostInputView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  Image,
  TouchableNativeFeedback,
  TextInput,
  BackAndroid,
  ProgressBarAndroid,
  StyleSheet,
  ToastAndroid,
  DeviceEventEmitter
} = React;
var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');
var Icon = require('./../../../shared/components/android/Icon.android.js');
var Dropdown = require('react-native-dropdown-android');
var NewPostImageItem = require('./NewPostImageItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var POST = constants.POST;
var FILE = constants.FILE;

var NewPostInputView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    selectedBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    editing: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getInitialState() {
    var tagIndex = 0;
    if(this.props.editing) {
      for(var key in this.props.post.bevy.tags) {
        var tag = this.props.post.bevy.tags[key];
        if(tag.name == this.props.post.tag.name) {
          tagIndex = key;
          break;
        }
      }
    }
    return {
      selectedTag: (this.props.editing)
        ? tagIndex
        : 0,
      postInput: (this.props.editing)
        ? this.props.post.title
        : '',
      loading: false,
      images: (this.props.editing)
        ? this.props.post.images
        : [],
      inputFocused: false
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    PostStore.on(POST.POST_CREATED, this.onPostCreated);
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    PostStore.off(POST.POST_CREATED, this.onPostCreated);
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  onPostCreated(post) {
    // switch to comment view of new post
    var route = routes.MAIN.COMMENT;
    route.post = post;
    this.props.mainNavigator.replace(route);

    // clear state
    this.setState(this.getInitialState());
  },

  onUploadComplete(file) {
    var images = this.state.images;
    images.push(file);
    this.setState({
      images: images
    });
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  openCamera() {
    ImagePickerManager.launchCamera({}, this.uploadImage);
  },

  openImageLibrary() {
    ImagePickerManager.launchImageLibrary({}, this.uploadImage);
  },

  uploadImage(cancelled, response) {
    console.log(cancelled, response);
    if(cancelled) return;
    FileActions.upload(response.uri);
  },

  onImageItemRemove(image) {
    var images = this.state.images;
    images = _.reject(images, ($image) => $image.filename == image.filename);
    this.setState({
      images: images
    });
  },

  openNewEventView() {
    if(this.props.editing) return;

    this.props.newPostNavigator.replace(routes.NEWPOST.CREATEEVENT);
  },

  finishEditing() {
    // disallow empty post and empty images
    if(_.isEmpty(this.state.postInput) && _.isEmpty(this.state.images)) {
      ToastAndroid.show('Please Enter a Title or Attach Images to your Post',
        ToastAndroid.SHORT);
      return;
    }

    PostActions.update(
      this.props.post._id, // _id
      this.state.postInput, // title
      this.state.images, // images
      this.props.post.bevy.tags[this.state.selectedTag], // tag
      {} // event
    );

    // nav to comment view
    var route = routes.MAIN.COMMENT;
    var post = this.props.post;
    post.title = this.state.postInput;
    post.images = this.state.images;
    post.tag = this.props.post.bevy.tags[this.state.selectedTag];
    route.post = post;
    this.props.mainNavigator.replace(route);

    // clear state
    this.setState({
      selectedTag: 0,
      postInput: '',
      images: [],
      loading: true // flip loading flag
    });
  },

  submitPost() {
    // disallow empty post and empty images
    if(_.isEmpty(this.state.postInput) && _.isEmpty(this.state.images)) {
      ToastAndroid.show('Please Enter a Title or Attach Images to your Post',
        ToastAndroid.SHORT);
      return;
    }

    // send action
    PostActions.create(
      this.state.postInput, // title
      this.state.images, // images
      this.props.user, // author
      this.props.selectedBevy, // bevy to post to
      'default', // post type - this is just a normal post
      {}, // event - keep this empty
      this.props.selectedBevy.tags[this.state.selectedTag] // tag to post to
    );

    // clear state
    this.setState({
      selectedTag: 0,
      postInput: '',
      images: [],
      loading: true // flip loading flag
    });
  },

  _renderPostButton() {
    if(this.props.editing) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#62D487', false) }
          onPress={ this.finishEditing }
        >
          <View style={ styles.postButton }>
            <Text style={{
              color: '#FFF',
              fontSize: 16
            }}>
              Done
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#62D487', false) }
        onPress={ this.submitPost }
      >
        <View style={ styles.postButton }>
          <Icon
            name='send'
            size={ 30 }
            color='#FFF'
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderPostingToBar() {
    if(this.props.editing) return <View />;
    return (
      <View style={ styles.postingToBar }>
        <Text style={ styles.postingTo }>Post To</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={() => this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER)}
        >
          <View style={ styles.bevyPickerButton }>
            <Text style={ styles.bevyPickerButtonText }>
              { this.props.selectedBevy.name }
            </Text>
          </View>
        </TouchableNativeFeedback>
        { this._renderLoading() }
      </View>
    );
  },

  _renderLoading() {
    if(!this.state.loading) return <View />;
    return (
      <View style={ styles.loadingContainer }>
        <ProgressBarAndroid styleAttr='SmallInverse' />
        <Text style={ styles.loadingText }>
          Creating...
        </Text>
      </View>
    );
  },

  _renderImages() {
    if(_.isEmpty(this.state.images) || this.state.inputFocused) {
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
        <Text style={{
          color: '#AAA',
          fontSize: 16,
          marginBottom: 6
        }}>
          Images
        </Text>
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
    var tags = (this.props.editing)
      ? _.pluck(this.props.post.bevy.tags, 'name')
      : _.pluck(this.props.selectedBevy.tags, 'name');

    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={ this.onBackButton }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>
            { (this.props.editing) ? 'Edit Post' : 'New Post' }
          </Text>
          { this._renderPostButton() }
        </View>
        { this._renderPostingToBar() }
        <View style={ styles.tagBar }>
          <View style={[ styles.tagCircle, {
            backgroundColor: (this.props.editing)
              ? this.props.post.bevy.tags[this.state.selectedTag].color
              : this.props.selectedBevy.tags[this.state.selectedTag].color
          }]}>
          </View>
          <Dropdown
            style={{ height: 30, width: 200}}
            values={ tags }
            selected={ parseInt(this.state.selectedTag) }
            onChange={ data => {
              this.setState({
                selectedTag: data.selected
              });
            }}
          />
        </View>
        <ScrollView>
          <TextInput
            ref='Input'
            style={ styles.postInput }
            autoCorrect={ false }
            multiline={ true }
            placeholder='Drop a Line...'
            placeholderTextColor='#AAA'
            underlineColorAndroid='#EEE'
            value={ this.state.postInput }
            onChangeText={(text) => this.setState({ postInput: text })}
            textAlignVertical='top'
          />
        </ScrollView>
        { this._renderImages() }
        <View style={ styles.actionBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.openCamera }
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='camera-alt'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.openImageLibrary }
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='image'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.openNewEventView }
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='event'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  topBar: {
    backgroundColor: '#2CB673',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10
  },
  backButtonText: {
    color: '#000'
  },
  topBarTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 18
  },
  postButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  postButtonText: {
    color: '#2CB673'
  },
  postingToBar:{
    height: 40,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  postingTo: {
    color: '#AAA',
    marginRight: 10,
    fontSize: 16
  },
  bevyPickerButton: {
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  bevyPickerButtonText: {
    textAlign: 'left',
    color: '#666',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginLeft: 10,
    color: '#FFF'
  },
  tagBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  tagTitle: {
    color: '#333'
  },
  tagCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F00',
    marginRight: 10
  },
  postInput: {
    flex: 1,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    color: '#333',
    fontSize: 16
  },
  actionBar: {
    height: 48,
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center'
  },
  addMediaButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  }
});

module.exports = NewPostInputView;
