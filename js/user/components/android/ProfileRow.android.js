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
  TouchableWithoutFeedback,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');

var ProfileRow = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    height: React.PropTypes.number,
    imageSize: React.PropTypes.number,
    nameColor: React.PropTypes.string,
    emailColor: React.PropTypes.string,
    style: React.PropTypes.object,
    big: React.PropTypes.bool
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
      emailColor: '#AAA',
      style: {},
      big: false
    };
  },

  openProfileImage() {
    if(_.isEmpty(this.props.user.image)) return;
    var actions = constants.getImageModalActions();
    constants.setImageModalImages([this.props.user.image]);
    actions.show();
  },

  render() {
    if(this.props.big) {
      return (
        <View style={{
          backgroundColor: '#FFF',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 10,
          paddingRight: 10,
          elevation: 2
        }}>
          <TouchableWithoutFeedback
            onPress={ this.openProfileImage }
          >
          <Image
            source={ UserStore.getUserImage(this.props.user, 60, 60) }
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              marginRight: 10
            }}
          />
          </TouchableWithoutFeedback>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: '#000',
              fontSize: 18
            }}>
              { this.props.user.displayName }
            </Text>
            <Text style={{
              color: '#888',
              fontSize: 16
            }}>
              { (_.isEmpty(this.props.user.email))
              ? 'No Email'
              : this.props.user.email }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[ styles.container, { 
        height: this.props.height 
      }, this.props.style ]}>
        <Image
          source={ UserStore.getUserImage(this.props.user, 30, 30) }
          style={[ styles.profileImage, { 
            width: this.props.imageSize, 
            height: this.props.imageSize, 
            borderRadius: this.props.imageSize / 2 } 
          ]}
        />
        <View style={ styles.profileDetails }>
          <Text style={[ styles.displayName, { color: this.props.nameColor } ]}>
            { this.props.user.displayName }
          </Text>
          <Text style={[ styles.email, { color: this.props.emailColor } ]}>
            { (_.isEmpty(this.props.user.email))
              ? 'No Email'
              : this.props.user.email }
          </Text>
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