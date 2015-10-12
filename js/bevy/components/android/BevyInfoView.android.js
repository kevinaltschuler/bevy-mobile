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

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');
var BevyActions = require('./../../BevyActions');

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

  render() {
    return (
      <ScrollView style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <View style={ styles.header }>
          <Image
            source={{ uri: this.props.activeBevy.image_url }}
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
                    : 'Public'
                }
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
        <View style={ styles.subscribe }>
          <Text style={ styles.subscribeText }>Subscribed</Text>
          <SwitchAndroid
            value={ this.state.subscribed }
            onValueChange={(value) => this.onToggleSubscribe(value)}
          />
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5
  },
  bevyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10
  },
  bevyDetails: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
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
    marginBottom: 4,
    marginLeft: 10
  },
  subscribe: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  subscribeText: {
    flex: 1,
    color: '#666'
  }
});

module.exports = BevyInfoView;