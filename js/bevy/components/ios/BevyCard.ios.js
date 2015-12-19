/**
 * NewBevyButton.ios.js
 * kevin made this
 * the yung sauce villain
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

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');

var BevyCard = React.createClass({
    propTypes: {
        bevy: React.PropTypes.object,
    },


    render() {
        var bevy = this.props.bevy;

        var bevyImage = bevy.image_url || constants.siteurl + '/img/default_group_img.png' ;
        var defaultBevies = [
          '11sports', '22gaming', '3333pics',
          '44videos', '555music', '6666news', '777books'
        ];
        if(_.contains(defaultBevies, bevy._id)) {
          bevyImage = constants.apiurl + bevy.image_url;
        }

        return (
            <TouchableHighlight
              underlayColor='rgba(255,255,255,.5)'
              style={{
                width: 130, 
                height: 140, 
                marginVertical: 10,
                marginHorizontal: 10,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffset: {width: 0, height: 1.5},
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
              onPress={() => {
                console.log(bevy._id);
                BevyActions.switchBevy(bevy._id);
                this.props.mainNavigator.push(routes.BEVY.POSTLIST);
              }}
            >
              <View style={styles.bevyCard}>
                <Image style={ styles.bevyImage } source={{uri: bevyImage }}/>
                <View style={ styles.bevyName }>
                  <Text style={{color: '#555'}} key={'bevylistkey:' + bevy._id}>
                    { bevy.name }
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
        );
    }

});

var styles = StyleSheet.create({
  bevyImage: {
    width: 130,
    height: 110,
  },

  bevyCard: {
    flexDirection: 'column',
    width: 130,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderRadius: 8,
    overflow: 'hidden'
  },

  bevyName: {
    flex: 1,
    width: 130,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

});

module.exports = BevyCard;