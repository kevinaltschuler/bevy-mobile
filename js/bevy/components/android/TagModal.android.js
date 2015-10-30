/**
 * TagModal.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  BackAndroid,
  StyleSheet
} = React;
var TagModalItem = require('./TagModalItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var BevyActions = require('./../../BevyActions');

var TagModal = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeTags: React.PropTypes.array
  },

  getInitialState() {
    return {
      visible: false,
      tags: [],
      activeTags: []
    };
  },

  componentDidMount() {
    var actions = {
      show: this.show,
      hide: this.hide
    };
    constants.setTagModalActions(actions);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    this.hide();
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeTags: nextProps.activeTags
    });
  },

  onBackButton() {
    if(this.state.visible) {
      this.setState({ visible: false });
      return true;
    } else return false;
  },

  show(tags) {
    this.setState({
      visible: true,
      tags: tags,
      activeTags: this.props.activeTags
    });
  },

  hide() {
    this.setState({
      visible: false,
      tags: [],
      activeTags: []
    });
  },

  onTagSelect(tag) {
    var activeTags = this.state.activeTags;
    if(_.contains(this.state.activeTags, tag)) {
      // if its already selected, deselect it
      activeTags = _.reject(activeTags, ($tag) => $tag.name == tag.name);
    } else {
      // if its not selected, select it
      activeTags.push(tag);
    }
    // set the state
    this.setState({
      activeTags: activeTags
    });
    BevyActions.updateTags(activeTags);
  },

  _renderTags() {
    var tags = [];
    for(var key in this.state.tags) {
      var tag = this.state.tags[key];
      tags.push(
        <TagModalItem
          key={ 'tagmodalitem:' + key }
          tag={ tag }
          index={ key }
          selected={ _.contains(this.state.activeTags, tag) }
          onSelect={ this.onTagSelect }
        />
      );
    }
    return tags;
  },

  render() {
    if(!this.state.visible) return <View />;
    return (
      <View style={ styles.container }>
        <TouchableWithoutFeedback
          onPress={ this.hide }
        >
          <View style={ styles.backdrop } />
        </TouchableWithoutFeedback>
        <View style={ styles.modal }>
          <Text style={ styles.title }>
            Tags of { this.props.activeBevy.name }
          </Text>
          <ScrollView style={ styles.tagList }>
            { this._renderTags() }
          </ScrollView>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    opacity: 0.5
  },
  modal: {
    width: constants.width * (2/3),
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 5
  },
  title: {
    color: '#AAA',
    textAlign: 'center'
  },
  tagList: {

  }
});

module.exports = TagModal;