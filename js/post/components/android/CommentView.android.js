/**
 * CommentView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Post = require('./Post.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var CommentView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    post: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            onPress={() => {
              this.props.mainNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            { this.props.activeBevy.name }
          </Text>
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </View>
        </View>
        <Post
          post={ this.props.post }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBar: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  title: {
    textAlign: 'center',
    color: '#666'
  }
});

module.exports = CommentView;