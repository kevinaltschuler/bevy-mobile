/**
 * NewPostInputView.android.js
 * @author albert
 * @flow 
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  TextInput,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Dropdown = require('react-native-dropdown-android');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../PostActions');

var NewPostInputView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    selectedBevy: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      selectedTag: 0,
      postInput: ''
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  submitPost() {
    // disallow empty post - for now
    if(_.isEmpty(this.state.postInput)) return;

    // send action
    PostActions.create(
      this.state.postInput, // title
      [], // images
      this.props.user, // author
      this.props.selectedBevy, // bevy to post to
      'default', // post type - this is just a normal post
      {}, // event - keep this empty
      this.props.selectedBevy.tags[this.state.selectedTag] // tag to post to
    );

    // clear state
    this.setState({
      selectedTag: 0,
      postInput: ''
    });

    // navigate back 
    // TODO: navigate to comment view?
    this.props.mainNavigator.pop();
  },

  render() {
    var tags = _.pluck(this.props.selectedBevy.tags, 'name');
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={() => {
              // go back
              this.props.mainNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#666'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>New Post</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.submitPost }
          >
            <View style={ styles.postButton }>
              <Icon
                name='send'
                size={ 30 }
                color='#2CB673'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={ styles.postingToBar }>
          <Text style={ styles.postingTo }>Post To</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => this.props.newPostNavigator.push(routes.NEWPOST.BEVYPICKER)}
          >
            <View style={ styles.bevyPickerButton }>
              <Text style={ styles.bevyPickerButtonText }>
                { this.props.selectedBevy.name }
              </Text>
              <Text style={ styles.bevyPickerButtonHintText }>
                Tap to Change
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={ styles.tagBar }>
          <View style={[ styles.tagCircle, { 
            backgroundColor: this.props.selectedBevy.tags[this.state.selectedTag].color
          }]}>
          </View>
          <Dropdown
            style={{ height: 20, width: 200}}
            values={ tags } 
            selected={ this.state.selectedTag } 
            onChange={(data) => {
              this.setState({
                selectedTag: data.selected
              });
            }} 
          />
        </View>
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
        <View style={ styles.actionBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={() => {}}
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
            onPress={() => {}}
          >
            <View style={ styles.addMediaButton }>
              <Icon
                name='image'
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
    backgroundColor: '#FFF',
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
  backButtonText: {
    color: '#000'
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#000'
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
    backgroundColor: '#2CB673',
    paddingLeft: 12,
    paddingRight: 12
  },
  postingTo: {
    color: '#FFF',
    marginRight: 10
  },
  bevyPickerButton: {
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bevyPickerButtonText: {
    textAlign: 'left',
    color: '#FFF'
  },
  bevyPickerButtonHintText: {
    textAlign: 'left',
    color: '#DDD'
  },
  tagBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  tagTitle: {
    color: '#333'
  },
  tagCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
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