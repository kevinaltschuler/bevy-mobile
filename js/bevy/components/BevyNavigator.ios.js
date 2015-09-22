/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
} = React;

var BackButton = require('./../../shared/components/BackButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var PostList = require('./../../post/components/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');
var SettingsView = require('./BevySettingsView.ios.js');

var dropdown = require('react-native-dropdown');

var _ = require('underscore');
var window = require('Dimensions').get('window');
var routes = require('./../../routes');

// get icons
var {
  Icon
} = require('react-native-icons');

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  getInitialState() {
    return {
      showTags: false
    }
  },

  render: function() {
    var view;
    switch(this.props.bevyRoute.name) {
      case routes.BEVY.INFO.name:
        view = (
          <InfoView
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.SETTINGS.name:
        view = (
          <SettingsView
            setting={ this.props.bevyRoute.setting }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.POSTLIST.name:
      default:
        view = (
          <PostList
            { ...this.props }
            showTags={ this.state.showTags }
          />
        );
        break;
    }
    
    var sortButton = (this.props.bevyRoute.name == routes.BEVY.POSTLIST.name)
    ? (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={() => {
          this.setState({
            showTags: true
          });
        }}
        style={{
          marginRight: 15
        }}
      >
        <Icon
          name='ion|ios-pricetag'
          size={20}
          color='#666'
          style={{
            width: 20,
            height: 20
          }}
        />
      </TouchableHighlight>
    )
    : <View />;

    var infoButton = (_.isEmpty(this.props.activeBevy) 
      || this.props.activeBevy.name == 'Frontpage' 
      || this.props.bevyRoute.name == routes.BEVY.INFO.name 
      || this.props.bevyRoute.name == routes.BEVY.SETTINGS.name )
    ? <View />
    : <InfoButton onPress={() => {
      this.props.bevyNavigator.push(routes.BEVY.INFO)
    }} />;

    var right = (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        { sortButton }
        { infoButton }
      </View>
    );

    var backButton = (this.props.bevyRoute.name == 'PostList')
    ? <View />
    : <BackButton text='Posts' color='#888' onPress={() => {
      this.props.bevyNavigator.pop();
    }} />;
    
    var center = this.props.activeBevy.name || 'Frontpage';
    if(this.props.bevyRoute.setting) {
      switch(this.props.bevyRoute.setting) {
        case 'posts_expire_in':
          center = 'Posts Expire In...';
          break;
        default:
          break;
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          bevyRoute={ this.props.bevyRoute }
          bevyNavigator={ this.props.bevyNavigator }
          left={ backButton }
          center={ center }
          right={ right }
          { ...this.props }
        />
        { view }
      </View>
    );
  }
});

var BevyNavigator = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function () {
    return (
      <Navigator
        navigator={ this.props.searchNavigator }
        initialRoute={ routes.BEVY.POSTLIST }
        initialRouteStack={[
          routes.BEVY.POSTLIST
        ]}
        renderScene={(route, navigator) => 
          <BevyView
            bevyRoute={ route }
            bevyNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: 'black'
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  sortMenu: {
    width: 30,
    height: 30
  }
});

module.exports = BevyNavigator;