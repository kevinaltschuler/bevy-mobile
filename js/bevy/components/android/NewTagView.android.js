/**
 * NewTagView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableNativeFeedback,
  ToastAndroid,
  StyleSheet
} = React;
var BevyBar = require('./BevyBar.android.js');
var NewTagViewColorItem = require('./NewTagViewColorItem');
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var BevyActions = require('./../../../bevy/BevyActions');

var NewTagView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: '',
      color: '#F44336'
    };
  },

  create() {
    if(_.isEmpty(this.state.name)) {
      ToastAndroid.show('Please Enter A Name For Your Tag', ToastAndroid.SHORT);
      return;
    }

    BevyActions.addTag(
      this.props.activeBevy._id,
      this.state.name,
      this.state.color
    );

    this.props.bevyNavigator.pop();
  },

  onNameChange(text) {
    this.setState({
      name: text
    });
  },

  onColorItemSelect(color) {
    this.setState({
      color: color
    });
  },

  _renderColorButtons() {
    var colorButtons = [];
    var colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
      '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
    ];
    for(var key in colors) {
      var color = colors[key];
      colorButtons.push(
        <NewTagViewColorItem
          key={ 'newtagviewcoloritem:' + color }
          color={ color }
          onSelect={ this.onColorItemSelect }
        />
      );
    }
    return colorButtons;
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <Text style={ styles.title }>
          Add Tag for { this.props.activeBevy.name }
        </Text>
        <View style={{
          backgroundColor: this.state.color,
          paddingHorizontal: 10,
          marginHorizontal: 10,
          borderRadius: 5,
          marginBottom: 10
        }}>
          <TextInput
            ref={ref => { this.nameInput = ref; }}
            style={ styles.nameInput }
            value={ this.state.name }
            placeholder='Tag Name'
            placeholderTextColor='#FFF'
            underlineColorAndroid='#FFF'
            onChangeText={ this.onNameChange }
          />
        </View>
        <Text style={ styles.inputTitle }>
          Tag Color
        </Text>
        <ScrollView
          ref={ref => { this.colorScroll = ref; }}
          style={ styles.colorButtonList }
          horizontal={ true }
        >
          { this._renderColorButtons() }
        </ScrollView>
        <TouchableNativeFeedback
          onPress={ this.create }
        >
          <View style={ styles.createButton }>
            <Icon
              name='add'
              size={ 36 }
              color='#FFF'
            />
            <Text style={ styles.createButtonText }>
              Create Tag
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  title: {
    color: '#888',
    marginHorizontal: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10
  },
  inputTitle: {
    color: '#AAA',
    paddingHorizontal: 10,
    marginLeft: 10,
    marginBottom: 8
  },
  nameInput: {
    color: '#FFF',
    fontSize: 16
  },
  colorButtonList: {
    height: 60
  },
  createButton: {
    backgroundColor: '#2CB673',
    height: 48,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10
  }
});

module.exports = NewTagView;
