/*BevyListButton.ios.js
* made by @altschulerkevin
*/
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  Image
} = React;

var Icon = require('FAKIconImage');

var styles = StyleSheet.create({
  bevyListButton: {
    paddingLeft: 45,
    width: 30,
    height: 30
  },

});

var BevyListButton = React.createClass({

  onPress: function() {
    this.props.menuActions.close();
  },

  render: function() {
  return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={this.onPress}
      >
        <Icon
          name='ion|ios-list-outline'
          size={30}
          color='white'
          style={styles.bevyListButton}
        />
    </TouchableHighlight>
    );
  },

});

module.exports = BevyListButton;