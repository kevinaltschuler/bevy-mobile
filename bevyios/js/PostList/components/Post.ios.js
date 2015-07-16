/**
 * Post.ios.js
 * kevin made this
 * yo that party was tight
 */
 'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} = React;

var {
  Icon
} = require('react-native-icons');

var timeAgo = require('./../../shared/helpers/timeAgo');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  countVotes: function() {
    var sum = 0;
    this.props.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  render: function() {
    var post = this.props.post || {};

    return (
      <View style={styles.postCard}>
        <View style={styles.titleRow}>
          <Image 
            style={styles.titleImage}
            source={{ uri: post.author.image_url }}
          />
          <View style={styles.titleTextColumn}>
            <Text style={styles.titleText}>
              { post.author.displayName } • { post.bevy.name }
            </Text>
            <Text style={styles.subTitleText}>
              { timeAgo(Date.parse(post.created)) }
            </Text>
          </View>
        </View>
        
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            { post.title }
          </Text>
          <View style={styles.bodyImages}>
          </View>
        </View>
        
        <View style={styles.postDetailsRow}>
          <Text style={styles.pointText}>
            { this.countVotes() } points    { post.comments.length } comments
          </Text>
        </View>

        <View style={styles.postActionsRow}>
          <TouchableOpacity 
            activeOpacity={.8}
            style={styles.actionTouchable}
          >
            <Icon
              name='ion|ios-arrow-up'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={.8}
            style={styles.actionTouchable}
          >
            <Icon
              name='ion|ios-arrow-down'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={.8}
            style={styles.actionTouchable}
          >
            <Icon
              name='ion|ios-chatbubble-outline'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={.8}
            style={styles.actionTouchable}
          >
            <Icon
              name='ion|ios-more'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  postCard: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      padding: 8,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  titleRow: {
    flexDirection: 'row'
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  titleTextColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    color: '#282929'
  },
  body: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 15
  },
  bodyText: {
    fontSize: 10,
    color: '#282929'
  },
  postDetailsRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  postActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  pointText: {
    fontSize: 10,
    color: '#757d83'
  },
  actionTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  actionIcon: {
      width: 50,
      height: 20,
      backgroundColor: 'rgba(0,0,0,0)'
  },
});

module.exports = Post;