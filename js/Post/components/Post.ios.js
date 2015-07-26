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
  TouchableHighlight
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

        <View style={styles.postActionsRow}>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.pointCountText }>
                { this.countVotes() }
              </Text>
              <Icon
                name='fontawesome|thumbs-o-up'
                size={20}
                color='#757d83'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.commentCountText }>
                { post.comments.length }
              </Text>
              <Icon
                name='fontawesome|comment-o'
                size={20}
                color='#757d83'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 1 } ]}
          >
            <Icon
              name='fontawesome|ellipsis-v'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableHighlight>
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
    paddingTop: 8,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  titleRow: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8
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
    marginBottom: 15,
    paddingLeft: 8,
    paddingRight: 8
  },
  bodyText: {
    fontSize: 10,
    color: '#282929'
  },

  postActionsRow: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  pointCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  commentCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  actionTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36
  },
  actionIcon: {
    width: 20,
    height: 36
  },
});

module.exports = Post;