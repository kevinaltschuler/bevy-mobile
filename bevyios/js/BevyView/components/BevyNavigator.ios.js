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

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var PostList = require('./../../PostList/components/PostList.ios.js');

var Icon = require('FAKIconImage');

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

  render: function() {

    var navbarText = 'Default';
    if(this.props.activeBevy)
      navbarText = this.props.activeBevy.name;

    var bevyListButton = (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={this.toggleList}
      >
        <Icon
          name='ion|ios-drag'
          size={30}
          color='white'
          style={styles.bevyListButton}
        />
      </TouchableHighlight>
    );

    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          { bevyListButton }
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }>{ navbarText }</Text>
        </View>
        <View style={ styles.right }>
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
          disableGestures={true}
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

    console.log('bevy nav props', this.props);

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
    backgroundColor: 'black',
    width: 600
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
  backButtonContainer: {
  },
  backButton: {
    width: 12,
    height: 19,
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
    height: 64,
    width: 32,
  },
  bevyListButton: {
    paddingLeft: 45,
    width: 30,
    height: 30
  },
});

module.exports = BevyNavigator;