/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
 */

'use strict';

var React = require('react-native');
var _ = require('underscore');
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

//var BevyListButton = require('./BevyListButton.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var SearchButton = require('./SearchButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');

var routes = require('./../../routes');

var Navbar = require('./../../shared/components/Navbar.ios.js');

/*var Navbar = React.createClass({ 
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
    this.props.bevyNavigator.jumpTo(routes.BEVY.POSTLIST);
  },

  onInfo: function() {
    this.props.bevyNavigator.jumpTo(routes.BEVY.INFO);
  },

  onSearch: function() {
    this.props.bevyNavigator.jumpTo(routes.BEVY.SEARCH);
  },

  render: function() {

    var navbarText = 'Default';
    if(this.props.activeBevy)
      navbarText = this.props.activeBevy.name;

    var leftButton = (this.props.bevyRoute.name == 'PostList')
    ? <BevyListButton onPress={ this.toggleList } />
    : <BackButton onPress={ this.onBack } />;

    var infoButton = (this.props.activeBevy.name == 'Frontpage' || this.props.bevyRoute.name == 'InfoView')
    ? <View />
    : <InfoButton onPress={ this.onInfo } />;

    var searchButton = (this.props.bevyRoute.name == 'SearchView')
    ? <View />
    : <SearchButton onPress={ this.onSearch } />;

    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          { leftButton }
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }>{ navbarText }</Text>
        </View>
        <View style={ styles.right }>
          { searchButton }
          { infoButton }
        </View>
      </View>
    );
  }
});*/

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
            bevy={ this.props.activeBevy }
          />
        );
        break;
    }

    var infoButton = (this.props.activeBevy.name == 'Frontpage' || this.props.bevyRoute.name == 'InfoView')
    ? <View />
    : <InfoButton onPress={() => {
      this.props.bevyNavigator.jumpTo(routes.BEVY.INFO)
    }} />;

    var backButton = (this.props.bevyRoute.name == 'PostList')
    ? <View />
    : <BackButton onPress={() => {
      this.props.bevyNavigator.jumpTo(routes.BEVY.POSTLIST)
    }} />;

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          bevyRoute={ this.props.bevyRoute }
          bevyNavigator={ this.props.bevyNavigator }
          left={ backButton }
          center={ this.props.activeBevy.name }
          right={ infoButton }
          view={ view }
          { ...this.props }
        />
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
        navigator={ this.props.navigator }
        initialRoute={ routes.BEVY.POSTLIST }
        initialRouteStack={ _.toArray(routes.BEVY) }
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
  }
});

module.exports = BevyNavigator;