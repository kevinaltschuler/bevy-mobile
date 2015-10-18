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
  StyleSheet
} = React;
var TagModalItem = require('./TagModalItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');

var TagModal = React.createClass({
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
  },
  componentWillUnmount() {

  },

  show(tags) {
    this.setState({
      visible: true,
      tags: tags,
      activeTags: _.map(tags, (tag, index) => index)
    });
    console.log(this.state.activeTags);
  },

  hide() {
    this.setState({
      visible: false,
      tags: [],
      activeTags: []
    });
  },

  onTagSelect(tag, index) {
    var activeTags = this.state.activeTags;
    if(_.contains(this.state.activeTags, index)) {
      // if its already selected, deselect it
      activeTags = _.reject(activeTags, ($index) => $index == index);
    } else {
      // if its not selected, select it
      activeTags.push(index);
    }
    // resort by ascending order
    _.sortBy(activeTags, ($index) => $index);
    // set the state
    this.setState({
      activeTags: activeTags
    });
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
          selected={ _.contains(this.state.activeTags, key) }
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
    //height: constants.height * (2/3),
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 5
  },
  tagList: {

  }
});

module.exports = TagModal;