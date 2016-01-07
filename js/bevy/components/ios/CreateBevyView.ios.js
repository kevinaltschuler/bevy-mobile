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
  StyleSheet,
  ScrollView,
  SegmentedControlIOS
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var BEVY = constants.BEVY;
var FILE = constants.FILE;
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var getSlug = require('speakingurl');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var NativeModules = require('NativeModules');

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
      privacy: 'Public',
      creating: false,
      slug: ''
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

  _renderTitleDescription() {
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>General</Text>
        
        <View style={ styles.generalCard} >
          <TextInput
            style={ styles.bevyNameInput }
            ref='bevyName'
            value={ this.state.name }
            onChangeText={(text) => {
              this.setState({ 
                name: text,
                slug: getSlug(text)
              });
            }}
            autoCorrect={ false }
            placeholder='Bevy Name'
            placeholderTextColor='#AAA'
          />
        </View>
      </View>
    );
  },

  _renderSlug() {
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>Bevy Url</Text>
        
        <View style={ styles.generalCard} >
          <TextInput
            style={ styles.bevyNameInput }
            ref='BevySlug'
            onChangeText={(text) => 
              this.setState({ 
                slug: text.slice((constants.siteurl.length + 3))
              })
            }
            value={constants.siteurl + '/b/' + this.state.slug}
            onBlur={(ev) => {
              this.setState({
                slug: getSlug(this.state.slug)
              });
            }}
            autoCorrect={ false }
            placeholder='Bevy URL'
            placeholderTextColor='#AAA'
          />
        </View>
      </View>
    );
  },

  _renderImageInput() {
    var image = resizeImage(this.state.bevyImage, constants.width, constants.height);
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
        source={{ uri: image.url }}
      />
    );
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>Bevy Image</Text>
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
            }, (didCancel, response) => {
              if (didCancel) {
                //console.log(response);
                
              } else {
                //console.log('Cancel');
                FileActions.upload(response.uri);
                //console.log(response.uri);
              }
            });
          }}
        >
          { middle }
        </TouchableHighlight>
      </View>
    );
  },

  _renderPrivatePublic() {
    var privacyIndex = (this.state.privacy == 'Public') ? 1 : 0;
    var privacyIcon = (this.state.privacy == 'Public') ? 'android-globe' : 'android-lock';
    var privacyText = (this.state.privacy == 'Public')
    ? 'Anybody can view and post content to a Public Bevy'
    : 'Only approved members may view and post content to a Private Bevy'
    return (
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>Privacy</Text>
        <SegmentedControlIOS
          style={{
            backgroundColor: '#fff',
            marginBottom: 10,
            marginHorizontal: 20
          }}
          tintColor='#aaa'
          values={['Private', 'Public']}
          selectedIndex={privacyIndex}
          onValueChange={(ev) => {
            this.setState({
              privacy: ev
            });
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
            marginBottom: 40
          }}
        >

          <Text style={{color: '#888'}}>
            {privacyText}
          </Text>
        </View>
      </View>
    )
  },

  render() {
    return (
      <ScrollView style={ styles.container }>

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
                  (_.isEmpty(this.state.bevyImage)) ? constants.siteurl + '/img/logo_100.png' : this.state.bevyImage, // bevy image
                  this.state.slug,
                  this.state.privacy
                );

                // blur all text inputs
                this.refs.bevyName.blur();
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

          { this._renderTitleDescription() }

          { this._renderSlug() }

          { this._renderImageInput() }

          { this._renderPrivatePublic() }

        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
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
    flexDirection: 'column',
    backgroundColor: '#eee',
  },
  bevyImageButton: {
    width: constants.width,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 0
  },
  bevyImage: {
    width: constants.width,
    height: 120
  },
  bevyNameInput: {
    fontSize: 17,
    height: 48,
    width: constants.width,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
  descriptionInput: {
    fontSize: 17,
    height: 48,
    width: constants.width,
    paddingTop: 10
  },
  generalCard: {
    backgroundColor: '#fff',
    padding: 10
  },
  section: {
    marginTop: 20
  }
});

module.exports = CreateBevyView;
