'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var routes = require('./../../routes');
var BevyActions = require('./../BevyActions');

var Navbar = require('./../../shared/components/Navbar.ios.js');

var CreateBevyView = React.createClass({
  render() {
    return (
      <View style={ styles.container }>
        <Navbar 
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          left={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                // go back
                this.props.mainNavigator.jumpTo(routes.MAIN.TABBAR);
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                Cancel
              </Text>
            </TouchableHighlight>
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                New Post
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                
              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Create
              </Text>
            </TouchableHighlight>
          }
        />
        <View style={ styles.body }>

        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  navButtonLeft: {
    flex: 1
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#ddd',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#ddd',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  body: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = CreateBevyView;