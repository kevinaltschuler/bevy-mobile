/**
 * NewBevyButton.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../../bevy/BevyActions');

var BevyCard = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object
  },

  goToBevy() {
    console.log(this.props.bevy._id);
    BevyActions.switchBevy(this.props.bevy._id);
    this.props.mainNavigator.push(routes.BEVY.POSTLIST);
  },

  render() {
    var bevy = this.props.bevy;
    var bevyImageURL = (_.isEmpty(this.props.bevy.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(this.props.bevy.image, 256, 256).url;

    var publicPrivateIcon = (this.props.bevy.settings.privacy == 'Private')
      ? 'android-lock'
      : 'android-globe';

    var bevyName = bevy.name;

    if(bevyName.length > 30) {
      bevyName = bevyName.substring(0,30);
    }

    return (
      <TouchableHighlight
        underlayColor='rgba(255,255,255,.5)'
        style={ styles.container }
        onPress={ this.goToBevy }
      >
        <View style={styles.bevyCard}>
          <Image style={ styles.bevyImage } source={{ uri: bevyImageURL }}/>
          <View style={ styles.bevyInfo }>
            <View style={styles.bevyName}>
              <Text style={ styles.bevyNameText }>
                { bevyName }
              </Text>
            </View>
            <View style={ styles.details}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>
                  { this.props.bevy.subCount }
                </Text>
                <Icon
                  name='android-people'
                  size={ 24 }
                  color='#555'
                />
              </View>
              <View style={ styles.infoItem }>
                <Icon
                  name={ publicPrivateIcon }
                  size={ 24 }
                  color='#555'
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    paddingHorizontal: 20,
    height: 160,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  bevyCard: {
    flexDirection: 'column',
    flex: 1,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden'
  },
  bevyImage: {
    flex: 2
  },
  bevyInfo: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingLeft: 10,
    flexDirection: 'row'
  },
  bevyName: {
    overflow: 'hidden',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'nowrap'
  },
  bevyNameText: {
    color: '#555',
    fontSize: 20,
  },
  details: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center'
  },

  infoText: {
    color: '#555',
    fontSize: 14,
    marginRight: 5
  }

});

module.exports = BevyCard;
