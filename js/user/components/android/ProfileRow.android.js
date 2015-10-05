/**
 * ProfileRow.android.js
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

var _ = require('underscore');

var ProfileRow = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    height: React.PropTypes.number,
    imageSize: React.PropTypes.number,
    nameColor: React.PropTypes.string,
    emailColor: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      user: {
        displayName: 'default name',
        email: 'default email'
      },
      height: 48,
      imageSize: 30,
      nameColor: '#FFF',
      emailColor: '#FFF',
      style: {}
    };
  },

  _renderEmail() {
    if(_.isEmpty(this.props.user.email)) return <View />;
    else return (
      <Text style={[ styles.email, { color: this.props.emailColor } ]}>{ this.props.user.email }</Text>
    );
  },

  render() {
    return (
      <View style={[ styles.container, { height: this.props.height }, this.props.style ]}>
        <Image
          //source={{ uri: this.props.user.image_url }}
          source={{ uri: 'http://joinbevy.com/img/user-profile-icon.png' }}
          style={[ styles.profileImage, { width: this.props.imageSize, height: this.props.imageSize, borderRadius: this.props.imageSize / 2 } ]}
        />
        <View style={ styles.profileDetails }>
          <Text style={[ styles.displayName, { color: this.props.nameColor } ]}>{ this.props.user.displayName }</Text>
          { this._renderEmail() }
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  profileImage: {
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  displayName: {
  },
  email: {
  }
});

module.exports = ProfileRow;