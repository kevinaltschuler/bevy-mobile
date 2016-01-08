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
  TouchableOpacity,
  ActionSheetIOS
} = React;
var BackButton = require('./../../../shared/components/ios/BackButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');
var BevyNavbar = require('./BevyNavbar.ios.js');
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');
var SettingsView = require('./BevySettingsView.ios.js');
var MyBevies = require('./MyBevies.ios.js');
var Icon = require('react-native-vector-icons/Ionicons');
var SideMenu = require('react-native-side-menu');

var _ = require('underscore');
var window = require('Dimensions').get('window');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var BevySideMenu = require('./BevySideMenu.ios.js');

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      showTags: false,
      showSort: false,
      scrollY: null,
      navHeight: 0,
      sideMenuOpen: false,
    }
  },

  componentWillReceiveProps(nextProps) {

  },

  closeSideMenu() {
    this.setState({
      sideMenuOpen: false
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
      case routes.BEVY.BOARDVIEW.name:
      default: 
        view = (
          <PostList
            { ...this.props }
            user={ this.props.user }
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

    var bottomHeight = 40;

    switch(this.props.bevyRoute.name) {
      case routes.BEVY.INFO.name:
        var right = <View/>;
        var fontColor = '#999';
        var center = 'Info';
        var left = (
          <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={() => {
                this.props.bevyNavigator.pop();
              }}
              style={ styles.backButtonContainer }
            >
              <View style={ styles.backButton }>
                <Icon
                  name='ios-arrow-left'
                  size={ 30 }
                  color={ fontColor }
                  style={ styles.backButtonIcon }
                />
              </View>
            </TouchableOpacity>
        );
        break;
      case routes.BEVY.SETTINGS.name:
        var right = <View/>;
        var fontColor = '#999';
        var center = 'Settings';
        var left = (
          <BackButton 
            text='' 
            color={fontColor} 
            onPress={() => {
              this.props.bevyNavigator.pop();
            }} 
          />
        );        
        break;
      default:
      case routes.BEVY.POSTLIST.name:
        var fontColor = '#fff';
        var bottomHeight = 80;
        var tagButton = (
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
              backgroundColor: fontColor
            }}
          >
            <Text style={{ fontSize: 12, color: this.state.inverseColor }}>
              Tags
            </Text>
          </TouchableHighlight>
        );

        var sideMenuButton = (
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            onPress={() => {
              this.setState({
                sideMenuOpen: !this.state.sideMenuOpen
              })
            }}
            style={{
              marginRight: 10,
              borderRadius: 2,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
          >
              <Icon
                name='ios-drag'
                size={ 30 }
                color={ fontColor }
                style={{}}
              />
          </TouchableHighlight>
        )

        var sortButton = (
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0.1)'}
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions({
                options: ['Top', 'New', 'Cancel'],
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
              backgroundColor: fontColor
            }}
          >
            <Text style={{ fontSize: 12, color: this.state.inverseColor }}>
              {PostStore.sortType.charAt(0).toUpperCase() + PostStore.sortType.slice(1)}
            </Text>
          </TouchableHighlight>
        );
        var right = (
          <View 
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {/* tagButton }
            { sortButton */}
            {/* infoButton */}
            {sideMenuButton}
          </View>
        );
        var center = this.props.activeBevy.name || '';
        var left = (
          <View style={{height: 47}}>
            <BackButton 
              text='' 
              color={fontColor} 
              onPress={() => {
                this.props.mainNavigator.pop();
              }} 
            />
          </View>
        );
        break;
    }

    if(this.props.activeBevy._id == -1)
      tagButton = <View/>;

    if(this.props.bevyRoute.setting) {
      switch(this.props.bevyRoute.setting) {
        case 'posts_expire_in':
          center = 'Posts Expire In...';
          break;
        default:
          break;
      }
    }

    if(center.length > 30) {
      center = center.substr(0,30);
      center = center.concat('...');
    }

    var menu = <BevySideMenu {...this.props} closeSideMenu={this.closeSideMenu}/>;

    return (
      <SideMenu 
        menu={menu} 
        menuPosition='right'
        onChange={(isOpen) => {
          this.setState({
            sideMenuOpen: isOpen
          })
        }}
        isOpen={this.state.sideMenuOpen}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <BevyNavbar
            bottomHeight={bottomHeight}
            bevyRoute={ this.props.bevyRoute }
            bevyNavigator={ this.props.bevyNavigator }
            left={ left }
            center={<Text style={{color: fontColor, fontSize: 18, marginLeft: 10, fontWeight: 'bold'}}>{center}</Text>}
            right={ right }
            activeBevy={ this.props.activeBevy }
            activeBoard={ this.props.activeBoard }
            route={ this.props.bevyRoute.name }
            fontColor={ fontColor }
            { ...this.props }
            styleParent={{
              height: bottomHeight + 20
            }}
            styleBottom={{
              backgroundColor: '#fff',
              height: 40,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: '#eee',
              marginTop: 0 
            }}
          />
            { view }
        </View>
      </SideMenu>
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
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 39,
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 5
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  backButtonIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    height: 30
  },
});

module.exports = BevyNavigator;
