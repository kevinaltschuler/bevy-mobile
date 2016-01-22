/**
 * BoardPickerItem.ios.js
 *
 * Item for the BoardPickerView
 * Represents a board of the bevy that the
 * user can post to
 *
 * @author albert
 * @flow
 */

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var BoardPickerItem = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      onSelect: _.noop,
      selected: false
    };
  },

  onPress() {
    this.props.onSelect(this.props.board);
  },

  _renderSelected() {
    if(!this.props.selected) return <View />;
    return (
      <Icon
        name='done'
        size={ 36 }
        color='#2CB673'
      />
    );
  },

  render() {
    var boardImageURL = (_.isEmpty(this.props.board.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(this.props.board.image, 80, 80).url;

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress }
      >
        <View style={ styles.container }>
          <Image
            source={{ uri: boardImageURL }}
            style={ styles.boardImage }
          />
          <Text
            style={ styles.boardName }
            numberOfLines={ 2 }
          >
            { this.props.board.name }
          </Text>
          { this._renderSelected() }
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  boardName: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    marginLeft: 15,
    marginRight: 15
  },
  boardImage: {
    borderRadius: 30,
    width: 60,
    height: 60
  },
});

module.exports = BoardPickerItem;
