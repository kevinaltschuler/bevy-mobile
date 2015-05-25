/**
 * tabBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var TabBar = React.createClass({
  render: function() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
         title="Blue Tab"
         selected={this.state.selectedTab === 'blueTab'}
         onPress={() => {
           this.setState({
             selectedTab: 'blueTab',
           });
         }}>
         {this._renderContent('#414A8C', 'Blue Tab')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
         systemIcon="history"
         badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
         selected={this.state.selectedTab === 'redTab'}
         onPress={() => {
           this.setState({
             selectedTab: 'redTab',
             notifCount: this.state.notifCount + 1,
           });
         }}>
         {this._renderContent('#783E33', 'Red Tab')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
         systemIcon="more"
         selected={this.state.selectedTab === 'greenTab'}
         onPress={() => {
           this.setState({
             selectedTab: 'greenTab',
             presses: this.state.presses + 1
           });
         }}>
         {this._renderContent('#21551C', 'Green Tab')}
        </TabBarIOS.Item>
      </TabBarIOS>);
    },

});

module.exports = TabBar;
