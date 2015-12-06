/**
 * BevyBar.android.js
 * the navigation bar used in PostList
 * 
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../BevyStore');
var PostActions = require('./../../../post/PostActions');

var BevyBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    showActions: React.PropTypes.bool,
    height: React.PropTypes.number,
    disappearing: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      showActions: true,
      height: 0,
      disappearing: false
    };
  },

  getInitialState() {
    return {
      iconColor: (this.props.activeBevy._id == -1)
        ? '#888'
        : '#FFF'
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      iconColor: (nextProps.activeBevy._id == -1) 
        ? '#888' 
        : '#FFF'
    });
  },

  goBack() {
    this.props.bevyNavigator.pop();
  },

  goToInfoView() {
    // go to the info view
    this.props.bevyNavigator.push(routes.BEVY.INFO);
  },

  openSortSheet() {
    constants.getActionSheetActions().show(
      [
        'Top',
        'New'
      ],
      function(key) {
        switch(key) {
          case '0':
            PostActions.sort('top');
            break;
          case '1':
            PostActions.sort('new');
            break;
        }
      }.bind(this),
      'Sort Posts By:'
    );
  },

  openTagModal() {
    var actions = constants.getTagModalActions();
    actions.show(this.props.activeBevy.tags);
  },

  refreshPosts() {
    PostActions.fetch(this.props.activeBevy._id);
  },

  _renderImage() {
    if(this.props.activeBevy._id == -1 || _.isEmpty(this.props.activeBevy.image_url)) {
      var bgColor = (this.props.activeBevy._id == -1)
        ? '#FFF'
        : '#AAA';
      return <View style={[ styles.bevyImageWrapperDefault, { 
        backgroundColor: bgColor
      }]} />;
    } else {
      return (
        <View style={ styles.bevyImageWrapper }>
          <Image
            source={ BevyStore.getBevyImage(this.props.activeBevy._id, 300, 300) }
            style={ styles.bevyImage }
          />
          <View style={ styles.imageDarkener } />
        </View>
      );
    }
  },

  _renderBackButton() {
    if(this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.goBack }
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color={ this.state.iconColor }
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else return <View />;
  },

  _renderInfoButton() {
    if(!this.props.showActions) return <View />;
    if(  this.props.activeBevy._id == -1 
      || this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) 
      return <View />;
    else return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.goToInfoView }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='info'
            size={ 30 }
            color={ this.state.iconColor }
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderSortButton() {
    if(!this.props.showActions) return <View />;
    if(  this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) 
      return <View />;
    else return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.openSortSheet }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='sort'
            size={ 30 }
            color={ this.state.iconColor }
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderTagButton() {
    if(!this.props.showActions) return <View />;
    if(  this.props.activeBevy._id == -1 
      || this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) 
      return <View />;
    else return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.openTagModal }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='label'
            size={ 30 }
            color={ this.state.iconColor }
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderRefreshButton() {
    if(!this.props.showActions) return <View />;
    if(this.props.bevyRoute.name == routes.BEVY.INFO.name
      || this.props.bevyRoute.name == routes.BEVY.RELATED.name
      || this.props.bevyRoute.name == routes.BEVY.TAGS.name) 
      return <View />; 
    else return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.refreshPosts }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='refresh'
            size={ 30 }
            color={ this.state.iconColor }
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    var disappearingStyle = (this.props.disappearing)
    ? {
      top: (this.props.height * -1) - 5,
      position: 'absolute'
    } : {};

    if(_.isEmpty(this.props.activeBevy)) return <View />;
    else return (
      <View style={[styles.container, disappearingStyle ]}>
        { this._renderImage() }
        { this._renderBackButton() }
        <Text style={[ styles.bevyName, { color: this.state.iconColor } ]}>
          { 
            _.isEmpty(this.props.activeBevy.name)
            ? 'Loading...'
            : this.props.activeBevy.name 
          }
        </Text>
        { this._renderTagButton() }
        { this._renderSortButton() }
        { this._renderRefreshButton() }
        { this._renderInfoButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  bevyImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48
  },
  bevyImageWrapperDefault: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#AAA',
    borderTopColor: '#EEE',
    borderTopWidth: 1
  },
  bevyImage: {
    width: constants.width,
    height: 48
  },
  imageDarkener: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#000',
    opacity: 0.5
  },
  bevyName: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
    color: '#FFF',
    marginLeft: 15
  },
  infoButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  }
});

module.exports = BevyBar;