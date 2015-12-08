/*
 * CreateBevyView.ios.js
 * @author kevin
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var BEVY = constants.BEVY;
var FILE = constants.FILE;
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var RefreshingIndicator =
  require('./../../../shared/components/ios/RefreshingIndicator.ios.js');

var CreateBevyView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
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

    FileStore.on(FILE.UPLOAD_COMPLETE, (filename) => {
      this.setState({
        bevyImage: filename
      });
    });
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.CREATED);
    FileStore.off(FILE.UPLOAD_COMPLETE);
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

  _renderBevyImageButton() {
    var middle = (_.isEmpty(this.state.bevyImage))
    ? (
      <Icon
        name='plus'
        size={ 30 }
        style={{ width: 30, height: 30 }}
        color='#ccc'
      />
    )
    : (
      <Image
        style={ styles.bevyImage }
        source={{ uri: this.state.bevyImage }}
      />
    );
    return (
      <TouchableHighlight
        style={ styles.bevyImageButton }
        underlayColor='rgba(0,0,0,0)'
        onPress={() => {
          UIImagePickerManager.showImagePicker({
            title: 'Choose Bevy Picture',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library...',
            returnBase64Image: false,
            returnIsVertical: false
          }, (type, response) => {
            if (type !== 'cancel') {
              //console.log(response);
              FileActions.upload(response);
            } else {
              //console.log('Cancel');
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
                New Bevy
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
                  (_.isEmpty(this.state.bevyImage)) ? constants.siteurl + '/img/logo_100.png' : this.state.bevyImage, // bevy image
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
    flex: 1,
    marginLeft: 10
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 10
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#fff',
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
