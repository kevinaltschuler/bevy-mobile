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
  TouchableOpacity,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');

var BevyCard = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  goToBevy() {
    BevyActions.switchBevy(this.props.bevy._id);
    var route = {
      name: routes.MAIN.BEVYNAV
    };
    this.props.mainNavigator.push(route);
  },

  render() {
    var bevyImageSource = BevyStore.getBevyImage(this.props.bevy.image, 256, 256);

    var publicPrivateIcon = (this.props.bevy.settings.privacy == 'Private')
      ? 'lock'
      : 'public';

    return (
      <TouchableOpacity
        activeOpacity={ 0.7 }
        style={ styles.container }
        onPress={ this.goToBevy }
      >
        <View style={ styles.bevyCard }>
          <Image
            style={ styles.bevyImage }
            source={ bevyImageSource }
          />
          <View style={ styles.bevyInfo }>
            <View style={ styles.bevyName }>
              <Text
                style={ styles.bevyNameText }
                numberOfLines={ 1 }
              >
                { this.props.bevy.name }
              </Text>
            </View>
            <View style={ styles.details}>
              <View style={ styles.infoItem }>
                <Text style={ styles.infoText }>
                  { this.props.bevy.subCount }
                </Text>
                <Icon
                  name='people'
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
      </TouchableOpacity>
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
    overflow: 'hidden',
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
    marginRight: 10,
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
    fontSize: 17,
    marginRight: 5
  }
});

module.exports = BevyCard;
