/**
 * BevySettingsView.ios.js
 * @author albert
 * kevin is a ween
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableHighlight
} = React;
var {
  Icon
} = require('react-native-vector-icons');

var _ = require('underscore');

var BevySettingsView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    setting: React.PropTypes.string
  },

  getInitialState() {
    var settings = [];
    switch(this.props.setting) {
      case 'posts_expire_in':
        settings = [
          { title: '7 Days', value: 7, active: false },
          { title: '5 Days', value: 5, active: false },
          { title: '2 Days', value: 2, active: false },
          { title: '1 Days', value: 1, active: false }
        ];
        // find and set the active setting
        var setting = _.findWhere(settings, { value: this.props.activeBevy.settings.posts_expire_in });
        setting.active = true;
        break;
      default:
        break;
    }
    return {
      settings: settings
    };
  },

  changeSetting(setting) {
    var settings = this.state.settings;
    // set the new one to active
    settings.forEach(function($setting) {
      if($setting.value == setting.value) $setting.active = true;
      else $setting.active = false;
    });
    this.setState({
      settings: settings
    });

    // call the bevy update action
  },

  _renderSettings() {
    switch(this.props.setting) {
      case 'posts_expire_in':
        return (
          <ScrollView style={ styles.actionRow }>
            { _.map(this.state.settings, function(setting) {
              var check = (setting.active)
              ? (
                <Icon
                  name='ios-checkmark-empty'
                  color='#2CB673'
                  size={ 35 }
                  style={{ width: 35, height: 35 }}
                />
              )
              : null;
              return (
                <TouchableHighlight
                  key={'setting:' + setting.value }
                  underlayColor='rgba(0,0,0,0.1)'
                  style={[ styles.switchContainer ]}
                  onPress={() => {
                    this.changeSetting(setting);
                  }}
                >
                  <View style={ styles.settingContainer }>
                    <Text style={ styles.settingDescription }>
                      { setting.title }
                    </Text>
                    { check }
                  </View>
                </TouchableHighlight>
              );
            }.bind(this))}
          </ScrollView>
        );
        break;
      default:
        return <View />
        break;
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderSettings() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    flexDirection: 'column'
  },
  actionRow: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  switchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingsTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
  settingDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  settingValue: {
    alignSelf: 'flex-end',
    fontSize: 17,
    color: '#888'
  },
});

module.exports = BevySettingsView;
