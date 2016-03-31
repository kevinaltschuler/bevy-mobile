/**
 * FeedbackView.ios.js
 *
 * View for submitting feedback for our app
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  AlertIOS,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');

var FeedbackView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: '',
      body: '',
      error: ''
    };
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  submit() {
    if(_.isEmpty(this.state.body)) {
      this.setState({ error: 'Please enter some feedback' });
      return;
    }

    this.NameInput.blur();
    this.BodyInput.blur();

    fetch(constants.siteurl + '/feedback', {
      method: 'POST',
      body: JSON.stringify({
        name: (_.isEmpty(this.state.name)) ? 'Anonymous' : this.state.name,
        body: this.state.body
      })
    })
    .then(res => res.json())
    .then(res => {
      AlertIOS.alert('Feedback sent!');
      this.setState(this.getInitialState());
    })
    .catch(err => {
      this.setState({ error: err });
    });
  },

  renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.errorContainer }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <View style={{
              width: 27,
              height: 48
            }}/>
            <Text style={ styles.title }>
              Submit Feedback
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.submit }
            >
              <View style={ styles.submitButton }>
                <Text style={ styles.submitButtonText }>
                  Submit
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={ styles.body }
          contentContainerStyle={ styles.bodyInner }
        >
          { this.renderError() }
          <TextInput
            ref={ ref => { this.NameInput = ref; }}
            style={ styles.nameInput }
            value={ this.state.name }
            onChangeText={ text => this.setState({ name: text })}
            autoCorrect={ false }
            autoCapitalize={ 'none' }
            placeholder='Name (Optional)'
            placeholderTextColor='#AAA'
          />
          <TextInput
            ref={ ref => { this.BodyInput = ref; }}
            style={ styles.bodyInput }
            value={ this.state.body }
            multiline={ true }
            onChangeText={ text => this.setState({ body: text })}
            placeholder='Feedback'
            placeholderTextColor='#AAA'
          />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
    width: 75,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonText: {
    fontSize: 17,
    color: '#FFF'
  },
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  bodyInner: {
    flex: 1,
    paddingTop: 10
  },
  errorContainer: {
    width: constants.width,
    height: 48,
    backgroundColor: '#DF4A32',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  errorText: {
    color: '#FFF',
    fontSize: 17
  },
  nameInput: {
    width: constants.width,
    height: 60,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    color: '#282828',
    fontSize: 17,
    marginBottom: 10
  },
  bodyInput: {
    width: constants.width,
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    color: '#282828',
    fontSize: 17,
    paddingVertical: 10,
    marginBottom: 10
  }
});

module.exports = FeedbackView;
