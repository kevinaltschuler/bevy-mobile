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
var PostStore = require('./../../post/PostStore');

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
    var btnColor = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? 'rgba(0,0,0,.2)' : '#fff';
    var btnTextColor = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#fff' : 'rgba(0,0,0,.6)';
    var titleColor = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? 'rgba(0,0,0,.3)' : '#fff';
    return {
      showTags: false,
      fontColor: btnColor,
      inverseColor: btnTextColor,
      showSort: false,
      titleColor: titleColor,
      scrollY: null,
      navHeight: 0
    }
  },

  componentWillReceiveProps(nextProps) {
    var btnColor = (nextProps.activeBevy._id == -1 && nextProps.bevyRoute.name == routes.BEVY.POSTLIST.name) ? 'rgba(0,0,0,.2)' : '#fff';
    var btnTextColor = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? '#fff' : 'rgba(0,0,0,.6)';
    var titleColor = (this.props.activeBevy._id == -1 && this.props.bevyRoute.name == routes.BEVY.POSTLIST.name) ? 'rgba(0,0,0,.3)' : '#fff';
    this.setState({
      fontColor: btnColor,
      inverseColor: btnTextColor,
      titleColor: titleColor
    })
  },

  onScroll(y) {
    // if theres nothing to compare it to yet, just set it and return
    if(this.state.scrollY == null || y < 0) {
      this.setState({
        scrollY: y,
        navHeight: 0
      });
      return;
    }
    //get the change in scroll
    var diff = (this.state.scrollY - y);
    if(diff > 15) diff = 15;
    if(diff < -15) diff = -15;
    //modify the navheight based on that
    var navHeight = (this.state.navHeight - diff);
    //set bounds
    if(navHeight < 0) navHeight = 0;
    if(navHeight > 40) navHeight = 40;
    //console.log(navHeight);
    //update data
    this.setState({
      scrollY: y,
      navHeight: navHeight
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
            onScroll={this.onScroll}
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
          borderRadius: 2,
          paddingHorizontal: 5,
          paddingVertical: 5,
          backgroundColor: this.state.fontColor
        }}
      >
        <Text style={{ fontSize: 12, color: this.state.inverseColor }}>
          Tags
        </Text>
      </TouchableHighlight>
    )
    : <View />;

    if(this.props.activeBevy._id == -1)
      tagButton = <View/>;

    var infoButton = (_.isEmpty(this.props.activeBevy) 
      || this.props.activeBevy.name == 'Frontpage' 
      || this.props.bevyRoute.name == routes.BEVY.INFO.name 
      || this.props.bevyRoute.name == routes.BEVY.SETTINGS.name )
    ? <View />
    : <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        onPress={() => {
          this.props.bevyNavigator.push(routes.BEVY.INFO)
        }} 
        style={{
          marginRight: 10,
          borderRadius: 2,
          paddingHorizontal: 5,
          paddingVertical: 5,
          backgroundColor: this.state.fontColor
        }}
      >
        <Text style={{ fontSize: 12, color: this.state.inverseColor }}>
          Info
        </Text>
      </TouchableHighlight>;

    var sortButton = (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions({
            options: ['Top', 'New', 'cancel'],
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
          borderRadius: 2,
          paddingHorizontal: 5,
          paddingVertical: 5,
          backgroundColor: this.state.fontColor
        }}
      >
        <Text style={{ fontSize: 12, color: this.state.inverseColor }}>
          {PostStore.sortType.charAt(0).toUpperCase() + PostStore.sortType.slice(1)}
        </Text>
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

    var center = <View/>;
    if(this.props.bevyRoute.setting) {
      switch(this.props.bevyRoute.setting) {
        case 'posts_expire_in':
          center = 'Posts Expire In...';
          break;
        default:
          break;
      }
    }

    var title = this.props.activeBevy.name || 'Frontpage';

    var left = (this.props.bevyRoute.name == 'PostList')
    ? <Text style={{color: this.state.titleColor, fontSize: 18, marginLeft: 10}}>{title}</Text>
    : <BackButton text='Posts' color={color} onPress={() => {
      this.props.bevyNavigator.pop();
    }} />;

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          bevyRoute={ this.props.bevyRoute }
          bevyNavigator={ this.props.bevyNavigator }
          left={ left }
          center={ center }
          right={ right }
          activeBevy={ this.props.activeBevy }
          route={ this.props.bevyRoute.name }
          fontColor={ this.state.fontColor }
          { ...this.props }
          styleBottom={{
            backgroundColor: '#fff',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: .5,
            borderBottomColor: '#ddd',
            marginTop: 0 - this.state.navHeight
          }}
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