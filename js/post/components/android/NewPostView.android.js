/**
 * NewPostView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  Image,
  TextInput,
  TouchableNativeFeedback,
  Navigator,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Dropdown = require('react-native-dropdown-android');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../../bevy/BevyStore');
var PostActions = require('./../../PostActions');

var NewPostView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      selectedBevy: (this.props.activeBevy._id == -1) ? this.props.myBevies[1] : this.props.activeBevy
    };
  },

  onSwitchBevy(bevy) {
    this.setState({
      selectedBevy: bevy
    });
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[
          routes.NEWPOST.INPUT
        ]}
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.NEWPOST.BEVYPICKER.name:
              return (
                <BevyPickerView 
                  newPostRoute={ route } 
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  onSwitchBevy={ this.onSwitchBevy }
                  { ...this.props } 
                />
              );
              break;
            case routes.NEWPOST.INPUT.name:
            default:
              return (
                <InputView 
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  { ...this.props }
                />
              )
              break;
          }
        }}
      />
    );
  }
});

var InputView = React.createClass({
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
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
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
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
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
          placeholderTextColor='#888'
          underlineColorAndroid='#EEE'
          value={ this.state.postInput }
          onChangeText={(text) => this.setState({ postInput: text })}
          textAlignVertical='top'
        />
        <View style={ styles.actionBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
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
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
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

var BevyPickerView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    onSwitchBevy: React.PropTypes.func
  },

  getInitialState() {
    var bevies = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      bevies: bevies.cloneWithRows(this.props.myBevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      bevies: this.state.bevies.cloneWithRows(nextProps.myBevies)
    });
  },

  onSwitchBevy(bevy) {
    this.props.onSwitchBevy(bevy);
    this.forceUpdate();
    this.props.newPostNavigator.pop();
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
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
          <Text style={ styles.topBarTitle }>Posting To...</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#AAA', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.postButton }>
              <Text style={ styles.postButtonText }>Done</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <ListView
          dataSource={ this.state.bevies }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            if(bevy._id == -1) return <View />;
            return (
              <BevyPickerItem
                key={ 'bevypickeritem:' + bevy._id }
                bevy={ bevy }
                onSwitchBevy={ this.onSwitchBevy }
                isSelected={ bevy._id == this.props.selectedBevy._id }
              />
            );
          }}
        />
      </View>
    );
  }
});

var BevyPickerItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    isSelected: React.PropTypes.bool,
    onSwitchBevy: React.PropTypes.func
  },

  _renderIcon() {
    if(!this.props.isSelected) return (
      <Icon
        name='check-box-outline-blank'
        size={ 30 }
        color='#2CB673'
      />
    );
    return (
      <Icon
        name='check-box'
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  render() {
    var image_url = BevyStore.getBevyImage(this.props.bevy._id);
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#CCC', false) }
        onPress={() => {
          this.props.onSwitchBevy(this.props.bevy);
        }} 
      >
        <View style={ styles.bevyPickerItem }>
          { this._renderIcon() }
          <Image 
            style={ styles.bevyImage }
            source={{ uri: image_url + '?w=50&h=50' }}
          />
          <Text style={ styles.bevyName }>{ this.props.bevy.name }</Text>
        </View>
      </TouchableNativeFeedback>
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
    color: '#333'
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
  },
  bevyPickerList: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bevyImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 10
  },
  bevyName: {
    flex: 1,
    textAlign: 'left',
    color: '#888'
  }
});

module.exports = NewPostView;