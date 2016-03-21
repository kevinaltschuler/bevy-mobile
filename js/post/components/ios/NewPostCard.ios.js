/**
 * NewPostCard.ios.js
 * @author albert
 * @flow
 */

'use strict';

import React, {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  AlertIOS,
  TouchableOpacity,
  Component,
  PropTypes
} from 'react-native';

let _ = require('underscore');
let constants = require('./../../../constants');
let routes = require('./../../../routes');
let resizeImage = require('./../../../shared/helpers/resizeImage');

let UserStore = require('./../../../user/UserStore');

class NewPostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hintText: constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)]
    }
  }

  goToNewPost() {
    var route = { name: routes.MAIN.NEWPOST };
    this.props.mainNavigator.push(route);
  }

  render() {
    var userImageSource = UserStore.getUserImage(this.props.user.image, 64, 64);

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToNewPost.bind(this) }
        style={ styles.touchContainer }
      >
        <View style={ styles.container }>
          <Image
            source={ userImageSource }
            style={ styles.image }
          />
          <View style={ styles.textContainer }>
            <Text
              style={ styles.text }
              numberOfLines={ 2 }
            >
              { this.state.hintText }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 15
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 6
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    //borderBottomColor: '#CCC'
  },
  text: {
    color: '#888',
    fontSize: 17
  }
});

NewPostCard.propTypes = {
  user: PropTypes.object,
  activeBevy: PropTypes.object,
  mainNavigator: PropTypes.object
},

module.exports = NewPostCard;
