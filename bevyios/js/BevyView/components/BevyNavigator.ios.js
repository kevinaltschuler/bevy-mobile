/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
 */

'use strict';

var React = require('react-native');
var window = require('Dimensions').get('window');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./BevyList.ios.js');
var PostList = require('./../../PostList/components/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');
var SearchView = require('./SearchView.ios.js');

var BevyListButton = require('./BevyListButton.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var SearchButton = require('./SearchButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');

var Navbar = React.createClass({ 
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object
  },

  toggleList: function() {
    this.props.menuActions.toggle();
  },

  onBack: function() {
    this.props.bevyNavigator.push({
      name: 'PostList',
      index: 1
    });
  },

  onInfo: function() {
    this.props.bevyNavigator.push({
      name: 'InfoView',
      index: 1
    });
  },

  onSearch: function() {
    this.props.bevyNavigator.push({
      name: 'SearchView',
      index: 1
    });
  },

  render: function() {

    var navbarText = 'Default';
    if(this.props.activeBevy)
      navbarText = this.props.activeBevy.name;

    var leftButton = (this.props.bevyRoute.name == 'PostList')
    ? (
      <BevyListButton
        onPress={ this.toggleList }
      />
    )
    : (
      <BackButton
        onPress={ this.onBack }
      />
    );

    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          { leftButton }
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }>{ navbarText }</Text>
        </View>
        <View style={ styles.right }>
          <SearchButton 
            onPress={ this.onSearch }
          />
          <InfoButton 
            onPress={ this.onInfo }
          />
        </View>
      </View>
    );
  }
});

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function() {
    var view;
    switch(this.props.bevyRoute.name) {
      case 'InfoView':
        view = (
          <InfoView
            bevy={ this.props.activeBevy }
          />
        );
        break;
      case 'SearchView':
        view = (
          <SearchView

          />
        );
        break;
      case 'PostList':
      default:
        view = (
          <PostList
            posts={ this.props.allPosts }
          />
        );
        break;
    }

    var bevyList = (
      <BevyList 
        allBevies={ this.props.allBevies }
        activeBevy={ this.props.activeBevy }
        allPosts={ this.props.allPosts }
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <SideMenu 
          menu={bevyList}
          disableGestures={ true }
          touchToClose={ true }
          openMenuOffset={ 300 }
        >
          <Navbar 
            bevyRoute={ this.props.bevyRoute }
            bevyNavigator={ this.props.bevyNavigator }
            { ...this.props }
          />
          { view }
        </SideMenu>
      </View>
    );
  }
});

var BevyNavigator = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function () {
    return (
      <Navigator
        initialRoute={{ name: 'PostList', index: 0 }}
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
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navbarText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    height: 32,
    width: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 32,
    width: 64,
  }
});

module.exports = BevyNavigator;