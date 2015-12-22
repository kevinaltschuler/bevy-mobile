'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');

var PostActionList = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    post: React.PropTypes.object,
    user: React.PropTypes.object
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
            name='ios-redo'
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
    if(this.props.user._id != this.props.post.author._id) {
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
            name='pin'
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
            name='ios-person'
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
    if(this.props.user._id != this.props.post.author._id) {
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
              name='ios-trash'
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