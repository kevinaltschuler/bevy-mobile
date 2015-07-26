'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var routes = require('./../../routes');
var constants = require('./../../constants');
var BevyActions = require('./../BevyActions');
var FileActions = require('./../../File/FileActions');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var ReadImageData = require('NativeModules').ReadImageData;
var Navbar = require('./../../shared/components/Navbar.ios.js');

var CreateBevyView = React.createClass({

  getInitialState() {
    return {
      bevyImage: ''
    };
  },

  _renderBevyImageButton() {
    var middle = (_.isEmpty(this.state.bevyImage))
    ? (
      <Icon
        name='ion|plus'
        size={ 30 }
        style={{ width: 30, height: 30 }}
        color='#ccc'
      />
    )
    : (
      <Image
        style={ styles.bevyImage }
        source={{ uri: this.state.bevyImage.uri }}
      />
    );
    return (
      <TouchableHighlight
        style={ styles.bevyImageButton }
        underlayColor='rgba(0,0,0,0)'
        onPress={() => {
          UIImagePickerManager.showImagePicker({
              'title': 'Select Profile Picture',
              'cancelButtonTitle': 'Cancel',
              'takePhotoButtonTitle': 'Take Photo...',
              'chooseFromLibraryButtonTitle': 'Choose from Library...'
            }, (type, response) => {
            if (type !== 'cancel') {
              var source = {};
              if (type === 'data') { 
                // New photo taken -  response is the 64 bit encoded image data string
                response = 'data:image/jpeg;base64,' + response;
                FileActions.upload(response);
                source.isStatic = true;
              } else { 
                // Selected from library - response is the URI to the local file asset
                ReadImageData.readImage(response, (data) => {
                  data = 'data:image/jpeg;base64,' + data;
                  FileActions.upload(data, response);
                });
              }
              source.uri = response;
              this.setState({ bevyImage: source });
            }
          });
        }}
      >
        { middle }
      </TouchableHighlight>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Navbar 
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          left={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                // go back
                // blur all text inputs
                this.refs.bevyName.blur();
                this.refs.description.blur();
                this.props.mainNavigator.jumpTo(routes.MAIN.TABBAR);
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                Cancel
              </Text>
            </TouchableHighlight>
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                New Bevy
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                // call action
              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Create
              </Text>
            </TouchableHighlight>
          }
        />


        <View style={ styles.body }>

          <View style={ styles.top }>
            { this._renderBevyImageButton() }
            <View style={ styles.bevyNameInputWrapper }>
              <TextInput
                style={ styles.bevyNameInput }
                ref='bevyName'
                onChange={() => {

                }}
                placeholder='Bevy Name'
              />
            </View>
          </View>

          <View style={ styles.bottom }>
            <TextInput
              style={ styles.descriptionInput }
              ref='description'
              onChange={() => {

              }}
              placeholder='Description'
              multiline={ true }
            />
          </View>

        </View>


      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  navButtonLeft: {
    flex: 1
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#ddd',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#ddd',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  body: {
    flex: 1,
    flexDirection: 'column'
  },

  top: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  bevyImageButton: {
    marginRight: 10,
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20
  },
  bevyImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  bevyNameInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  bevyNameInput: {
    flex: 1,
    fontSize: 17,
    height: 32
  },

  bottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  descriptionInput: {
    flex: 1,
    fontSize: 17
  }
});

module.exports = CreateBevyView;