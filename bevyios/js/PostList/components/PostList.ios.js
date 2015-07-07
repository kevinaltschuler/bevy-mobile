/**
 * BevyBar.js
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
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var PostStore = require('./../PostStore');

var PostList = React.createClass({


  propTypes: {
    data: React.PropTypes.object
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('next props', nextProps.data);
  },

  render: function() {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var activeBevyPosts = (this.props.data) ? this.props.data : [];
    var dataSource = ds.cloneWithRows(activeBevyPosts);

    console.log('postlist data', this.props.data);

    return (
      <View style={styles.postContainer}>
        <ListView 
          dataSource={dataSource}
          style={styles.postContainer}
          renderRow={(rowData) =>(
              <Post 
                title={rowData.title}
              />
          )}
        />
      </View>
    );
  },
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1
  },
  button: {
    width: 100,
    height: 100,
  }
})

module.exports = PostList;
