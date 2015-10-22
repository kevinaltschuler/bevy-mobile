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
  ActionSheetIOS
} = React;

var BackButton = require('./../../shared/components/BackButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var PostList = require('./../../post/components/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');
var SettingsView = require('./BevySettingsView.ios.js');
var PostActions = require('./../../post/PostActions');

var _ = require('underscore');
var window = require('Dimensions').get('window');
var routes = require('./../../routes');

// get icons
var Icon = require('react-native-vector-icons/Ionicons');

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  getInitialState() {
    var color = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#777' : '#fff';
    var inverse = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#fff' : '#777';
    return {
      showTags: false,
      fontColor: color,
      showSort: false
    }
  },

  componentWillReceiveProps(nextProps) {
    var color = (nextProps.activeBevy._id == -1 && nextProps.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#777' : '#fff';
    var inverse = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#fff' : '#777';
    this.setState({
      fontColor: color
    })
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
            onHideTags={() => {
              this.setState({
                showTags: false
              })
            }}
            showSort={ this.state.showSort }
            onHideSort={()=>{
              this.setState({
                showSort: false
              })
            }}
          />
        );
        break;
    }
    
    var tagButton = (this.props.bevyRoute.name == routes.BEVY.POSTLIST.name)
    ? (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        onPress={() => {
          this.setState({
            showTags: true
          });
        }}
        style={{
          marginRight: 10,
          borderRadius: 17,
          width: 35,
          height: 35,
          padding: 6
        }}
      >
        <Icon
          name='ios-pricetag'
          size={25}
          color={this.state.fontColor}
          style={{
            width: 25,
            height: 25
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
    : <InfoButton
      color={this.state.fontColor} 
      onPress={() => {
      this.props.bevyNavigator.push(routes.BEVY.INFO)
    }} />;

    var sortButton = (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions({
            options: ['top', 'new', 'cancel'],
            cancelButtonIndex: 2
          },
          (buttonIndex) => {
            switch(buttonIndex) {
              case 0:
                var sortType = 'top';
                break;
              case 1:
                var sortType = 'new';
                break;
            }
            PostActions.sort(sortType);
          });
        }}
        style={{
          marginRight: 10,
          borderRadius: 17,
          width: 35,
          height: 35,
          padding: 6
        }}
      >
        <Icon
          name='android-funnel'
          size={25}
          color={this.state.fontColor}
          style={{
            width: 25,
            height: 25
          }}
        />
      </TouchableHighlight>
    );

    var right = (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        { sortButton }
        { tagButton }
        { infoButton }
      </View>
    );

    var backButton = (this.props.bevyRoute.name == 'PostList')
    ? <View />
    : <BackButton text='Posts' color={color} onPress={() => {
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
          activeBevy={ this.props.activeBevy }
          route={ this.props.bevyRoute.name }
          fontColor={ this.state.fontColor }
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
    backgroundColor: '#000'
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