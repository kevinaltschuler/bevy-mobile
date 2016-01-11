/**
 * PostActionList.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');

var PostActionList = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    post: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAuthor: this.props.user._id == this.props.post.author._id,
      isAdmin: _.contains(this.props.post.board.admins, this.props.user._id)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAuthor: nextProps.user._id == nextProps.post.author._id,
      isAdmin: _.contains(nextProps.post.board.admins, nextProps.user._id)
    });
  },

  _renderShareButton() {
    return <View />; // not ready for this yet
    return (
      <TouchableHighlight
        underlayColor='rgba(44,182,105,0.8)'
        style={ styles.postOptionsButtonContainer }
        onPress={() => {

        }}
      >
        <View style={ styles.postOptionsButton }>
          <Icon
            name='share'
            color='#fff'
            size={ 30 }
            style={ styles.postOptionsIcon }
          />
          <Text style={ styles.postOptionsText}>
            Share
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _renderEditButton() {
    if(!this.state.isAuthor && !this.state.isAdmin) {
      return <View/>
    }
    return (
      <TouchableHighlight
        underlayColor='rgba(44,182,105,0.8)'
        style={ styles.postOptionsButtonContainer }
        onPress={() => {
          this.props.onEdit();
          this.props.toggleCollapsed();
        }}
      >
        <View style={ styles.postOptionsButton }>
          <Icon
            name='edit'
            color='#fff'
            size={ 30 }
            style={ styles.postOptionsIcon }
          />
          <Text style={ styles.postOptionsText}>
            Edit
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _renderPinButton() {
    return <View />; // not ready for this yet
    return (
      <TouchableHighlight
        underlayColor='rgba(44,182,105,0.8)'
        style={ styles.postOptionsButtonContainer }
        onPress={() => {

        }}
      >
        <View style={ styles.postOptionsButton }>
          <Icon
            name='bookmark'
            color='#fff'
            size={ 30 }
            style={ styles.postOptionsIcon }
          />
          <Text style={ styles.postOptionsText}>
            Pin Post
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _renderAuthorButton() {
    return (
      <TouchableHighlight
        underlayColor='rgba(44,182,105,0.8)'
        style={ styles.postOptionsButtonContainer }
        onPress={() => {
          var route = routes.MAIN.PROFILE;
          route.profileUser = this.props.post.author;
          this.props.mainNavigator.push(route);
        }}
      >
        <View style={ styles.postOptionsButton }>
          <Icon
            name='person'
            color='#fff'
            size={ 30 }
            style={ styles.postOptionsIcon }
          />
          <Text style={ styles.postOptionsText}>
            { this.props.post.author.displayName }'s Profile
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _renderDeleteButton() {
    if(!this.state.isAuthor && !this.state.isAdmin) {
      return <View/>;
    }
    else {
      return (
        <TouchableHighlight
          underlayColor='rgba(44,182,105,0.8)'
          style={ styles.postOptionsButtonContainer }
          onPress={() => {
            PostActions.destroy(this.props.post._id);
          }}
        >
          <View style={ styles.postOptionsButton }>
            <Icon
              name='delete'
              color='#fff'
              size={ 30 }
              style={ styles.postOptionsIcon }
            />
            <Text style={ styles.postOptionsText}>
              Delete Post
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  },

  _renderBoardButton() {

  },

  _renderBevyButton() {

  },

  render() {

    return (
      <View style={ styles.postOptions }>
        { this._renderShareButton() }
        { this._renderPinButton() }
        { this._renderEditButton() }
        { this._renderAuthorButton() }
        { this._renderDeleteButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  postOptions: {
    flexDirection: 'column'
  },
  postOptionsButtonContainer: {
    backgroundColor: '#2CB673',
    flexDirection: 'row'
  },
  postOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  postOptionsIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: 10
  },
  postOptionsText: {
    color: '#fff',
    fontSize: 15
  }
});

module.exports = PostActionList;
