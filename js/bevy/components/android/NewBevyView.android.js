/**
 * NewBevyView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Image,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var getSlug = require('speakingurl');

var NewBevyView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: '',
      description: '',
      slug: '',
      image: ''
    };
  },

  createBevy() {
    if(_.isEmpty(this.state.name)) {
      // dont let users create a bevy without a name
      ToastAndroid.show('Please enter a name for your bevy', ToastAndroid.SHORT);
      return;
    }
  },

  addImage() {

  },

  _renderTopBar() {
    return (
      <View style={ styles.topBar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={() => {
            // go back
            this.props.mainNavigator.pop();
          }}
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#000'
            />
          </View>
        </TouchableNativeFeedback>
        <Text style={ styles.topBarTitle }>Create New Bevy</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.createBevy }
        >
          <View style={ styles.createButton }>
            <Text style={ styles.createButtonText }>Create</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  _renderImageButton() {
    if(_.isEmpty(this.state.image)) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.addImage }
        >
          <View style={ styles.addImageButton }>
            <Icon
              name='add'
              size={ 50 }
              color='#AAA'
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <Image
          style={ styles.bevyImage }
          source={{ uri: this.state.image }}
        />
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderTopBar() }
        <ScrollView style={ styles.list }>
          <Text style={ styles.general }>General</Text>
          <View style={ styles.generalContainer }>
            <TextInput
              ref='Name'
              style={ styles.nameInput }
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
              underlineColorAndroid='#AAA'
            />
            <TextInput
              ref='Description'
              style={ styles.descriptionInput }
              value={ this.state.description }
              onChangeText={(text) => this.setState({ description: text })}
              autoCorrect={ false }
              placeholder='Bevy Description'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#AAA'
            />
          </View>
          <Text style={ styles.bevyURL }>Bevy URL</Text>
          <View style={ styles.slugContainer }>
            <TextInput
              ref='Slug'
              style={ styles.slugInput }
              value={ constants.siteurl + '/b/' + this.state.slug }
              onChangeText={(text) => 
                this.setState({ 
                  slug: text.slice((constants.siteurl.length + 3))
                })
              }
              onBlur={(ev) => {
                this.setState({
                  slug: getSlug(this.state.slug)
                });
              }}
              autoCorrect={ false }
              placeholder='Bevy URL'
              placeholderTextColor='#AAA'
              underlineColorAndroid='#AAA'
            />
          </View>
          <Text style={ styles.addImage }>Bevy Image</Text>
          { this._renderImageButton() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  topBar: {
    backgroundColor: '#FFF',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#000'
  },
  createButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  createButtonText: {
    color: '#2CB673'
  },
  list: {
    flex: 1,
    paddingTop: 10
  },
  general: {
    color: '#AAA',
    marginBottom: 4,
    marginLeft: 10
  },
  generalContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  nameInput: {
  },
  descriptionInput: {
  },
  bevyURL: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  slugContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 10
  },
  slugInput: {
  },
  addImage: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  addImageButton: {
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 10
  },
  bevyImage: {

  }
});

module.exports = NewBevyView;