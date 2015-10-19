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
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyBar = require('./BevyBar.android.js');
var BevyAdminItem = require('./BevyAdminItem.android.js');

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
    bevyRoute: React.PropTypes.object
  },

  getInitialState() {
    var user = UserStore.getUser();
    return {
      subscribed: _.contains(user.bevies, this.props.activeBevy._id)
    };
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

  deleteBevy() {
    // delete bevy
    // check if admin
    // call action
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
        />
      );
    }
    if(_.isEmpty(admins)) {
      return (
        <Text style={ styles.noAdmins }>No Admins</Text>
      );
    } else return admins;
  },

  render() {
    var image_url = BevyStore.getBevyImage(this.props.activeBevy._id);
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
              source={{ uri: image_url }}
              style={ styles.bevyImage }
            />
            <View style={ styles.bevyDetails }>
              <Text style={ styles.bevyName }>
                { this.props.activeBevy.name.trim() }
              </Text>
              <Text style={ styles.bevyDescription } numberOfLines={ 3 }>
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
          <Text style={ styles.settingTitle }>Danger Zone</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#ED8372') }
            onPress={ this.deleteBevy }
          >
            <View style={[ styles.settingItem, { backgroundColor: '#DF4A32' } ]}>
              <Text style={[ styles.settingText, { color: '#FFF' } ]}>Delete Bevy</Text>
            </View>
          </TouchableNativeFeedback>
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
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bevyName: {
    fontSize: 22,
    color: '#888'
  },
  bevyDescription: {
    color: '#AAA'
  },
  bevyDetailsBottom: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  publicOrPrivate: {
    marginHorizontal: 4
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