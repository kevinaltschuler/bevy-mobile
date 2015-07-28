/*
* BevyInfoView.ios.js
* Kevin made this. 
* guess who just crawled out the muck or mire
*/
'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  CameraRoll
} = React;

var {
  Icon
} = require('react-native-icons');

var constants = require('./../../constants.js');

var InfoView = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object
  },

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
              source={{ uri: this.props.activeBevy.image_url }}
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
              { this.props.activeBevy.name }
            </Text>
            <Text style={styles.details}>
              { this.props.activeBevy.description }
            </Text>
          </View>

        </View>

        <View style={styles.actionRow}>
        </View>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#eee',
    padding: 10
  },
  row: {
    flexDirection: 'row'
  },
  infoRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: '#666',
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15
  },
  displayName: {
    fontSize: 24,
    textAlign: 'left'
  },
  details: {
    fontSize: 17,
    textAlign: 'left'
  },
})

module.exports = InfoView;