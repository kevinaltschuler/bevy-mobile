/**
 * BevyInfoView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  Image,
  SwitchAndroid,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyBar = require('./BevyBar.android.js');
var BevyAdminItem = require('./BevyAdminItem.android.js');
var Dropdown = require('react-native-dropdown-android');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var BevyActions = require('./../../BevyActions');
var BevyStore = require('./../../BevyStore');

var BevyInfoView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      subscribed: _.contains(this.props.user.bevies, this.props.activeBevy._id),
      isAdmin: _.findWhere(this.props.activeBevy.admins, 
        { _id: this.props.user._id }) != undefined
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscribed: _.contains(nextProps.user.bevies, nextProps.activeBevy._id),
      isAdmin: _.findWhere(nextProps.activeBevy.admins, 
        { _id: nextProps.user._id }) != undefined     
    });
  },

  onBackButton() {
    this.props.bevyNavigator.pop();
    return true;
  },

  onToggleSubscribe(value) {
    this.setState({
      subscribed: value
    });
    if(value) {
      BevyActions.subscribe(this.props.activeBevy._id);
    } else {
      BevyActions.unsubscribe(this.props.activeBevy._id);
    }
  },

  goToRelated() {
    // go to related bevies view
    this.props.bevyNavigator.push(routes.BEVY.RELATED);
  },

  goToTags() {
    // go to tag view
    this.props.bevyNavigator.push(routes.BEVY.TAGS);
  },

  updateBevySettings(settings) {
    BevyActions.update(
      this.props.activeBevy._id,
      this.props.activeBevy.name,
      this.props.activeBevy.description,
      this.props.activeBevy.image_url,
      settings
    );
  },

  deleteBevy() {
    // delete bevy action
    BevyActions.destroy(this.props.activeBevy._id);
    // go back to frontpage
    BevyActions.switchBevy('-1');
  },

  getPostsExpireInIndex() {
    switch(this.props.activeBevy.settings.posts_expire_in) {
      case -1:
        return 0;
        break;
      case 1:
        return 1;
        break;
      case 2:
        return 2;
        break;
      case 5:
        return 3;
        break;
      case 7:
        return 4;
        break;
    }
  },

  _renderAdmins() {
    var bevyAdmins = this.props.activeBevy.admins;
    var admins = [];
    for(var key in bevyAdmins) {
      var admin = bevyAdmins[key];
      admins.push(
        <BevyAdminItem
          key={ 'bevyadminitem:' + admin._id }
          admin={ admin }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    if(_.isEmpty(admins)) {
      return (
        <Text style={ styles.noAdmins }>No Admins</Text>
      );
    } else return admins;
  },

  _renderBevySettings() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View>
        <Text style={ styles.settingTitle }>Bevy Settings</Text>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Privacy</Text>
          <Dropdown
            style={{ height: 20, width: 200}}
            values={[
              'Public',
              'Private'
            ]} 
            selected={ this.props.activeBevy.settings.privacy } 
            onChange={data => {
              var settings = this.props.activeBevy.settings;
              settings.privacy = data.selected;

              // if nothing has changed, dont send the action
              if(settings.privacy == this.props.activeBevy.settings.privacy)
                return;

              this.updateBevySettings(settings);
            }} 
          />
        </View>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Posts Expire In</Text>
          <Dropdown
            style={{ height: 20, width: 200 }}
            values={[
              'Never',
              '1 Day',
              '2 Days',
              '5 Days',
              '7 Days'
            ]}
            selected={ this.getPostsExpireInIndex() }
            onChange={data => {
              var posts_expire_in = data.selected;
              var settings = this.props.activeBevy.settings;
              switch(data.selected) {
                case 0:
                  posts_expire_in = -1
                  break;
                case 1:
                  posts_expire_in = 1;
                  break;
                case 2:
                  posts_expire_in = 2;
                  break;
                case 3:
                  posts_expire_in = 5;
                  break;
                case 4:
                  posts_expire_in = 7;
                  break;
              }
              settings.posts_expire_in = posts_expire_in;

              // dont do anything if nothing has changed
              if(posts_expire_in == this.props.activeBevy.settings.posts_expire_in) 
                return;

              this.updateBevySettings(settings);
            }}
          />
        </View>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Enable Group Chat</Text>
          <SwitchAndroid
            value={ this.props.activeBevy.settings.group_chat }
            onValueChange={value => {
              var settings = this.props.activeBevy.settings;
              settings.group_chat = value;

              // if nothing has changed, dont send the action
              if(settings.group_chat == this.props.activeBevy.settings.group_chat)
                  return;
              
              this.updateBevySettings(settings);
            }}
          />
        </View>
      </View>
    );
  },

  _renderDangerZone() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={{ flex: 1 }}>
        <Text style={ styles.settingTitle }>Danger Zone</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#ED8372') }
          onPress={ this.deleteBevy }
        >
          <View style={[ styles.settingItem, { backgroundColor: '#DF4A32' } ]}>
            <Text style={[ styles.settingText, { color: '#FFF' } ]}>Delete Bevy</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <ScrollView>
          <View style={ styles.header }>
            <Image
              source={ BevyStore.getBevyImage(this.props.activeBevy._id, 100, 100) }
              style={ styles.bevyImage }
            />
            <View style={ styles.bevyDetails }>
              <Text style={ styles.bevyName }>
                { this.props.activeBevy.name.trim() }
              </Text>
              <Text style={ styles.bevyDescription }>
                { this.props.activeBevy.description.trim() }
              </Text>
              <View style={ styles.bevyDetailsBottom }>
                <Icon
                  name='public'
                  size={ 16 }
                  color='#AAA'
                />
                <Text style={ styles.publicOrPrivate }>
                  { (this.props.activeBevy.settings.privacy == 1)
                      ? 'Private'
                      : 'Public' }
                </Text>
                <Icon
                  name='group'
                  size={ 16 }
                  color='#AAA'
                  style={{ marginLeft: 6 }}
                />
                <Text style={ styles.subCount }>
                  { this.props.activeBevy.subCount } Subscribers
                </Text>
              </View>
            </View>
          </View>
          <Text style={ styles.settingTitle }>General</Text>
          <View style={ styles.settingItem }>
            <Text style={ styles.settingText }>Subscribed</Text>
            <SwitchAndroid
              value={ this.state.subscribed }
              onValueChange={(value) => this.onToggleSubscribe(value)}
            />
          </View>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#EEE', false) }
            onPress={ this.goToRelated }
          >
            <View style={ styles.settingItem }>
              <Text style={ styles.settingText }>Related Bevies</Text>
              <Icon
                name='arrow-forward'
                size={ 30 }
                color='#AAA'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#EEE', false) }
            onPress={ this.goToTags }
          >
            <View style={ styles.settingItem }>
              <Text style={ styles.settingText }>Bevy Tags</Text>
              <Icon
                name='arrow-forward'
                size={ 30 }
                color='#AAA'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.settingTitle }>Admins</Text>
          { this._renderAdmins() }

          { this._renderBevySettings() }
          { this._renderDangerZone() }
          
          <View style={{ height: 15 }} />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    margin: 10,
    marginBottom: 0,
    borderRadius: 5
  },
  bevyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10
  },
  bevyDetails: {
    height: 100,
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bevyName: {
    fontSize: 22,
    color: '#888'
  },
  bevyDescription: {
    color: '#AAA',
    marginBottom: 5,
    flexWrap: 'wrap'
  },
  bevyDetailsBottom: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  publicOrPrivate: {
    marginHorizontal: 4,
  },
  subCount: {
    marginHorizontal: 4
  },

  settingTitle: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  settingItem: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  settingText: {
    flex: 1,
    color: '#666'
  }
});

module.exports = BevyInfoView;