/*
* BevyInfoView.ios.js
* Kevin made this. 
* guess who just crawled out the muck or mire
*/
'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  CameraRoll
} = React;

var constants = require('./../../utils/constants.js');
var Icon = require('FAKIconImage');

var BevyInfoView = React.createClass({
  handleUpload: function(){

  },

  handleUploadError: function(){

  },

  render: function () {

    return (
      <View style={styles.container}>

            <View style={styles.infoRow} >
              <View style={styles.picButton}>
                <Image 
                  style={styles.profileImage}
                >
                  <TouchableOpacity 
                    activeOpacity={.8}
                    style={styles.cameraTouchable}
                    onPress={CameraRoll.getPhotos(null,this.handleUpload,this.handleUploadError)}
                  >
                    <Icon
                      name='ion|ios-camera-outline'
                      size={40}
                      color='white'
                      style={styles.cameraIcon}
                    />
                  </TouchableOpacity>
                </Image>
              </View>
              <View style={styles.profileDeetzColumn}>
                <Text style={styles.displayName}>
                  Bevy Name
                </Text>
                <Text style={styles.details}>
                  Bevy Description
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
            </View>

      </View>
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#2CB673',
    padding: 10
  },
  row: {
    flexDirection: 'row'
  },
  infoRow: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 300,
    marginTop: 20,
    marginBottom: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picButton: {
    width: 110,
    height: 110,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: 'white',
    paddingTop: 4,
    paddingLeft: 4
  },
  cameraTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  cameraIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  profileDeetzColumn: {
    marginTop: 10,
    justifyContent: 'center',
    marginLeft: 20
  },
  displayName: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  details: {
    color: 'white',
    textAlign: 'center'
  },
})

module.exports = BevyInfoView;