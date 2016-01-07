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

var Icon = require('react-native-vector-icons/Ionicons');

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
        var bevyName = bevy.name;

        var bevyImage = bevy.image.path || constants.siteurl + '/img/default_group_img.png' ;

        if(bevyName.length > 20) {
          bevyName = bevyName.substr(0,20);
          bevyName = bevyName.concat('...');
        }

        var publicPrivateIcon = (bevy.settings.privacy == 'Private')
        ?'android-lock'
        :'android-globe';

        return (
            <TouchableHighlight
              underlayColor='rgba(255,255,255,.5)'
              style={{
                width: constants.width / 1.3, 
                height: 160, 
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
                  <Text style={{color: '#555', fontSize: 20}} key={'bevylistkey:' + bevy._id}>
                    { bevyName }
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {/*<View style={styles.infoItem}> 
                      <Text style={styles.infoText}>
                        {bevy.subCount}
                      </Text>
                      <Icon name='android-people' size={24} color='#555' />
                    </View>*/}
                    <View style={styles.infoItem}> 
                      <Icon name={publicPrivateIcon} size={24} color='#555' />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
        );
    }

});

var styles = StyleSheet.create({
  bevyImage: {
    width: constants.width / 1.3,
    height: 110,
  },

  bevyCard: {
    flexDirection: 'column',
    width: constants.width / 1.3,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden'
  },

  bevyName: {
    flex: 1,
    width: constants.width / 1.3,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingLeft: 10,
    flexDirection: 'row'
  },

  infoItem: {
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center'
  },

  infoText: {
    color: '#555',
    fontSize: 18,
    marginRight: 5
  }

});

module.exports = BevyCard;