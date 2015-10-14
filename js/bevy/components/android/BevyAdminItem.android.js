/**
 * BevyAdminItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var BevyAdminItem = React.createClass({
  propTypes: {
    admin: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  render() {
    return (
      <View style={ styles.container }>
        <Image
          source={{ uri: this.props.admin.image_url }}
          style={ styles.image }
        />
        <View style={ styles.details }>
          <Text style={ styles.name }>{ this.props.admin.displayName }</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  details: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  name: {
    color: '#AAA',
    textAlign: 'left'
  }
});

module.exports = BevyAdminItem;