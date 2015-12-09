/**
 * NewBevyView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ToastAndroid,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');
var DialogAndroid = require('react-native-dialogs');

var _ = require('underscore');
var constants = require('./../../../constants');
var getSlug = require('speakingurl');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../BevyActions');
var BevyStore = require('./../../BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;
var BEVY = constants.BEVY;

var NewBevyView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: '',
      description: '',
      slug: '',
      image: {},
      creating: false,
      error: ''
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.CREATED, this.onBevyCreated);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
  },
  componentWillUnmount() {
    BevyStore.off(BEVY.CREATED, this.onBevyCreated);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  onBevyCreated(bevy) {
    // subscribe to the new bevy
    BevyActions.subscribe(bevy._id);
    // switch bevies
    BevyActions.switchBevy(bevy._id);
    // navigate back
    this.props.mainNavigator.pop();
    // reset state
    this.setState(this.getInitialState());
  },

  onUploadComplete(file) {
    this.setState({
      image: file
    });
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  createBevy() {
    if(_.isEmpty(this.state.name)) {
      this.setState({
        error: 'Please Enter A Name For Your Bevy'
      });
      return;
    }
    // force blur url field to make sure the slug is valid
    this.refs.Slug.blur();

    // call action
    BevyActions.create(
      this.state.name, // bevy name
      this.state.description, // bevy description
      (_.isEmpty(this.state.image)) 
        ? constants.siteurl + '/img/logo_100.png' 
        : this.state.image, // bevy image
      this.state.slug
    );

     // blur all text inputs
    this.refs.Name.blur();
    this.refs.Description.blur();
    this.setState({
      error: '',
      creating: true
    });
  },

  addImage() {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Add Bevy Image',
      items: [
        'Take a Picture',
        'Choose from Library'
      ],
      cancelable: true,
      itemsCallback: (index, item) => {
        if(index == 0)
          this.openCamera();
        else
          this.openImageLibrary();
      }
    });
    dialog.show();
  },

  removeImage() {
    this.setState({
      image: {}
    });
  },

  openCamera() {
    ImagePickerManager.launchCamera({}, this.uploadImage);
  },
  openImageLibrary() {
    ImagePickerManager.launchImageLibrary({}, this.uploadImage);
  },
  uploadImage(cancelled, response) {
    if(cancelled) return;
    FileActions.upload(response.uri);
  },

  _renderTopBar() {
    return (
      <View style={ styles.topBar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#62D487', false) }
          onPress={() => {
            // go back
            this.props.mainNavigator.pop();
          }}
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </View>
        </TouchableNativeFeedback>
        <Text style={ styles.topBarTitle }>Create New Bevy</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#62D487', false) }
          onPress={ this.createBevy }
        >
          <View style={ styles.createButton }>
            <Text style={ styles.createButtonText }>Create</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  _renderImageButton() {
    if(_.isEmpty(this.state.image)) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.addImage }
        >
          <View style={ styles.addImageButton }>
            <Icon
              name='add'
              size={ 50 }
              color='#AAA'
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      var image = resizeImage(this.state.image, constants.width, constants.height);
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={ this.removeImage }
        >
          <View style={{
            width: image.width,
            height: image.height
          }}>
            <Image
              style={[ styles.bevyImage, {
                width: image.width,
                height: image.height
              }]}
              source={{ 
                uri: image.url
              }}
            />
          </View>
        </TouchableNativeFeedback>
      );
    }
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.error }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderTopBar() }
        <ScrollView style={ styles.list }>
          { this._renderError() }
          <Text style={ styles.general }>General</Text>
          <View style={ styles.generalContainer }>
            <TextInput
              ref='Name'
              style={ styles.nameInput }
              value={ this.state.name }
              onChangeText={(text) => {
                this.setState({ 
                  name: text,
                  slug: getSlug(text)
                });
              }}
              autoCorrect={ false }
              placeholder='Bevy Name'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#AAA'
            />
            <TextInput
              ref='Description'
              style={ styles.descriptionInput }
              value={ this.state.description }
              onChangeText={(text) => this.setState({ description: text })}
              autoCorrect={ false }
              placeholder='Bevy Description'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#AAA'
            />
          </View>
          <Text style={ styles.bevyURL }>Bevy URL</Text>
          <View style={ styles.slugContainer }>
            <TextInput
              ref='Slug'
              style={ styles.slugInput }
              value={ constants.siteurl + '/b/' + this.state.slug }
              onChangeText={(text) => 
                this.setState({ 
                  slug: text.slice((constants.siteurl.length + 3))
                })
              }
              onBlur={(ev) => {
                this.setState({
                  slug: getSlug(this.state.slug)
                });
              }}
              autoCorrect={ false }
              placeholder='Bevy URL'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#AAA'
            />
          </View>
          <Text style={ styles.addImage }>Bevy Image</Text>
          { this._renderImageButton() }
        </ScrollView>
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
    paddingLeft: 12,
    paddingRight: 12
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18
  },
  createButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  createButtonText: {
    color: '#FFF'
  },
  list: {
    flex: 1,
    paddingTop: 10
  },
  error: {
    backgroundColor: '#DF4A32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10
  },
  errorText: {
    color: '#FFF'
  },
  general: {
    color: '#AAA',
    marginBottom: 4,
    marginLeft: 10
  },
  generalContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  nameInput: {
  },
  descriptionInput: {
  },
  bevyURL: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  slugContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  slugInput: {
  },
  addImage: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  addImageButton: {
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 10
  },
  bevyImage: {
  }
});

module.exports = NewBevyView;