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
var BEVY = constants.BEVY;
var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var FileActions = require('./../../File/FileActions');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var ReadImageData = require('NativeModules').ReadImageData;
var Navbar = require('./../../shared/components/Navbar.ios.js');
var RefreshingIndicator = require('./../../shared/components/RefreshingIndicator.ios.js');

var CreateBevyView = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    subBevy: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      subBevy: false
    };
  },

  getInitialState() {
    return {
      bevyImage: '',
      name: '',
      description: '',
      creating: false
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.CREATED, (bevy) => {
      // switch bevies
      BevyActions.switchBevy(bevy._id);
      // navigate back
      this.props.mainNavigator.pop();

      this.setState({
        creating: false
      });
    });
  },

  componentWillUnmount() {
     BevyStore.off(BEVY.CREATED);
  },

  _renderLoadingView() {
    if(this.state.creating) {
      return (
        <View style={ styles.loadingView }>
          <RefreshingIndicator description='Creating Bevy...'/>
        </View>
      );
    } else {
      return <View />;
    }
  },

  _renderSubBevyHeader() {
    if(this.props.subBevy) {
      return (
        <View style={ styles.subBevyHeader }>
          <Text style={ styles.subBevyFor }>
            New Subbevy For
          </Text>
          <Text style={ styles.subBevyName }>
            { this.props.activeBevy.name }
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
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
                //this.props.mainNavigator.jumpTo(routes.MAIN.TABBAR);
                this.props.mainNavigator.pop();
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
                { (this.props.subBevy) ? 'New Subbevy' : 'New Bevy' }
              </Text>
            </View>
          }
          right={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                if(_.isEmpty(this.state.name)) return;

                // call action
                BevyActions.create(
                  this.state.name, // bevy name
                  this.state.description, // bevy description
                  constants.siteurl + '/img/logo_100.png', // bevy image
                  (this.props.subBevy) ? this.props.activeBevy._id : null // bevy parent
                );

                // blur all text inputs
                this.refs.bevyName.blur();
                this.refs.description.blur();
                this.setState({
                  creating: true
                });
              }}
              style={ styles.navButtonRight }>
              <Text style={ styles.navButtonTextRight }>
                Create
              </Text>
            </TouchableHighlight>
          }
        />


        <View style={ styles.body }>

          { this._renderLoadingView() }

          { this._renderSubBevyHeader() }

          <View style={ styles.top }>
            { this._renderBevyImageButton() }
            <View style={ styles.bevyNameInputWrapper }>
              <TextInput
                style={ styles.bevyNameInput }
                ref='bevyName'
                onChange={(ev) => {
                  this.setState({
                    name: ev.nativeEvent.text
                  });
                }}
                placeholder='Bevy Name'
              />
            </View>
          </View>

          <View style={ styles.bottom }>
            <TextInput
              style={ styles.descriptionInput }
              ref='description'
              onChange={(ev) => {
                this.setState({
                  description: ev.nativeEvent.text
                });
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
  loadingView: {
    marginTop: 20,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  subBevyHeader: {
    backgroundColor: '#eee',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  subBevyFor: {
    marginRight: 10,
    fontSize: 17,
    textAlign: 'left'
  },
  subBevyName: {
    flex: 1,
    textAlign: 'left',
    color: '#2CB673',
    fontWeight: 'bold',
    fontSize: 17
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