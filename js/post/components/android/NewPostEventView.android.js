/**
 * NewPostEventView.android.js
 * @author albert
 */

 'use strict';

 var React = require('react-native');
 var {
   View,
   Text,
   TextInput,
   Image,
   StyleSheet,
   ProgressBarAndroid,
   BackAndroid,
   ScrollView,
   ToastAndroid,
   TouchableNativeFeedback,
   TouchableHighlight
 } = React;
 var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');
 var Icon = require('./../../../shared/components/android/Icon.android.js');
 var Dropdown = require('react-native-dropdown-android');
 var DateAndroid = require('./../../../shared/apis/DateAndroid.android.js');
 var DialogAndroid = require('react-native-dialogs');

 var _ = require('underscore');
 var constants = require('./../../../constants');
 var routes = require('./../../../routes');
 var PostActions = require('./../../../post/PostActions');
 var PostStore = require('./../../../post/PostStore');
 var FileStore = require('./../../../file/FileStore');
 var FileActions = require('./../../../file/FileActions');
 var POST = constants.POST;
 var FILE = constants.FILE;

 var NewPostEventView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    selectedBevy: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      title: '',
      location: '',
      description: '',
      loading: false,
      image: {},
      date: new Date()
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
    this.goBack();
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
    this.setState({
      image: file
    });
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  onTitleChange(text) {
    this.setState({
      title: text
    });
  },
  onLocationChange(text) {
    this.setState({
      location: text
    });
  },
  onDescriptionChange(text) {
    this.setState({
      description: text
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  goToBevyPicker() {
    this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER);
  },

  showDateDialog() {
    DateAndroid.showDatepicker(
      error => { console.error(error) },
      (year, month, day) => {
        var date = this.state.date;
        date.setYear(year);
        date.setMonth(month);
        date.setDate(day);
        this.setState({
          date: date
        });
      }
    );
  },
  showTimeDialog() {
    DateAndroid.showTimepicker(
      error => { console.error(error) },
      (hour, minute) => {
        var date = this.state.date;
        date.setHours(hour);
        date.setMinutes(minute);
        this.setState({
          date: date
        });
      }
    );
  },

  startUploadImage() {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Change Profile Picture',
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

  submitPost() {
    PostActions.create(
      this.state.title,
      this.state.image,
      this.props.user,
      this.props.selectedBevy,
      'event',
      {
        date: this.state.date,
        location: this.state.location,
        description: this.state.description
      },
      null // tag
    );
  },

  _renderDate() {
    var monthMap = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var date = this.state.date;
    return monthMap[date.getMonth()] + ' ' + date.getDate()
      + ', ' + date.getFullYear();
  },
  _renderTime() {
    var date = this.state.date;
    var hour = date.getHours();
    var ampm;
    if(hour == 0) {
      hour = 12;
      ampm = 'AM'
    } else if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM'
    } else {
      ampm = 'AM'
    }
    var minutes = date.getMinutes();
    if(minutes < 10) {
      minutes = ' ' + minutes.toString();
    }
    return hour + ':' + minutes + ' ' + ampm;
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

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
           background={ TouchableNativeFeedback.Ripple('#62D487', false) }
           onPress={ this.goBack }
          >
           <View style={ styles.backButton }>
             <Icon
               name='arrow-back'
               size={ 30 }
               color='#FFF'
             />
           </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>New Event</Text>
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
        </View>
        <View style={ styles.postingToBar }>
          <Text style={ styles.postingTo }>Post To</Text>
          <TouchableNativeFeedback
           background={ TouchableNativeFeedback.Ripple('#DDD', false) }
           onPress={ this.goToBevyPicker }
          >
           <View style={ styles.bevyPickerButton }>
             <Text style={ styles.bevyPickerButtonText }>
               { this.props.selectedBevy.name }
             </Text>
           </View>
          </TouchableNativeFeedback>
          { this._renderLoading() }
        </View>
        <ScrollView style={ styles.body }>
          <View style={ styles.header }>
            <Image
              source={ _.isEmpty(this.state.image)
                ? require('./../../../images/default_event_img.png')
                : { uri: constants.apiurl + '/files/' + this.state.image.filename }}
              style={ styles.eventImage }
            />
            <View style={ styles.titleContainer }>
              <TextInput
                ref={ ref => { this.titleInput = ref }}
                style={ styles.titleInput }
                value={ this.state.title }
                onChangeText={ this.onTitleChange }
                placeholder='Event Title'
                placeholderTextColor='#FFF'
                underlineColorAndroid='#FFF'
              />
              <TouchableHighlight
                underlayColor='#AAA'
                onPress={ this.startUploadImage }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20
                }}
              >
                <View style={ styles.uploadButton }>
                  <Icon
                    name='photo-camera'
                    size={ 24 }
                    color='#FFF'
                  />
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={ styles.settingItem }>
            <Icon
              name='location-on'
              size={ 30 }
              color='#666'
            />
            <TextInput
              ref={ ref => { this.locationInput = ref }}
              style={ styles.locationInput }
              value={ this.state.location  }
              onChangeText={ this.onLocationChange }
              placeholder='Location'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#EEE'
            />
          </View>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.showDateDialog }
          >
            <View style={ styles.settingItem }>
              <Icon
                name='date-range'
                size={ 30 }
                color='#666'
              />
              <Text style={ styles.dateText }>
                { this._renderDate() }
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.showTimeDialog }
          >
            <View style={ styles.settingItem }>
              <Icon
                name='schedule'
                size={ 30 }
                color='#666'
              />
              <Text style={ styles.timeText }>
                { this._renderTime() }
              </Text>
            </View>
          </TouchableNativeFeedback>
          <View style={ styles.description }>
            <Icon
              name='info-outline'
              size={ 30 }
              color='#666'
            />
            <TextInput
              multiline={ true }
              ref={ ref => { this.descriptionInput = ref }}
              style={ styles.descriptionInput }
              value={ this.state.description }
              onChangeText={ this.onDescriptionChange }
              placeholder='Description'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#EEE'
            />
          </View>
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
  body: {
    flex: 1
  },
  header: {
    width: constants.width,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventImage: {
    width: constants.width,
    height: 150
  },
  titleContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: constants.width - 20
  },
  titleInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 20
  },
  uploadButton: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
    borderRadius: 20,
    elevation: 5
  },
  settingItem: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  locationInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    marginLeft: 8
  },
  dateText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8
  },
  timeText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8
  },
  description: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8
  },
  descriptionInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    marginLeft: 8
  }
 });

 module.exports = NewPostEventView;
