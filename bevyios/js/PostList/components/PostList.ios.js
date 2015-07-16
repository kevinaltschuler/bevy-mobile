/**
 * PostList.ios.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} = React;

var Post = require('./Post.ios.js');
var constants = require('./../../constants.js');
var PostStore = require('./../PostStore');

var PostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.array
  },

  componentWillReceiveProps: function(nextProps) {
  },

  render: function() {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.props.posts
    var dataSource = ds.cloneWithRows(posts);

    return (
      <View style={styles.postContainer}>
        <ListView 
          dataSource={dataSource}
          style={styles.postContainer}
          renderRow={(rowData) =>(
            <Post 
              post={ rowData }
            />
          )}
        />
      </View>
    );
  }
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff'
  },
  button: {
    width: 100,
    height: 100,
  }
})

module.exports = PostList;
