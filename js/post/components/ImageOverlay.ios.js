'use strict';

var React = require('react-native');
var {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  PanResponder
} = React;
var {
  Icon
} = require('react-native-icons');
var Modal = require('react-native-modal');

var constants = require('./../../constants');

var toleranceX = 10;
var toleranceY = 10;

var ImageOverlay = React.createClass({

  propTypes: {
    isVisible: React.PropTypes.bool,
    images: React.PropTypes.array
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible,
      imageIndex: 0
    };
  },

  componentDidMount() {
    this._panResponder = PanResponder.create({
      // permission to use the responder
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //var direction = (gestureState.dx > 0) ? 'right' : 'left';
        console.log('testing 1 2 3');
        var x = Math.round(Math.abs(gestureState.dx));
        var y = Math.round(Math.abs(gestureState.dy));
        return this.state.isVisible && x > toleranceX && y < toleranceY;
      },

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
        console.log('image overlay gesture started');
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isVisible: nextProps.isVisible
    });
  },

  render() {
    if(!this.state.isVisible) return null;

    var leftButton = (this.props.images.length == 1) 
    ? <View />
    : <TouchableHighlight
        underlayColor='rgba(0,0,0,0.2)'
        style={ styles.rightArrow }
        onPress={() => {
          this.setState({
            imageIndex: (this.state.imageIndex == 0) ? this.props.images.length - 1 : --this.state.imageIndex
          });
        }}
      >
        <Icon
          name='ion|ios-arrow-left'
          size={ 30 }
          style={{ width: 30, height: 30 }}
          color='#fff'
        />
      </TouchableHighlight>;
    var rightButton = (this.props.images.length == 1)
    ? <View/>
    :  <TouchableHighlight
        underlayColor='rgba(0,0,0,0.2)'
        style={ styles.rightArrow }
        onPress={() => {
          this.setState({
            imageIndex: (this.state.imageIndex == this.props.images.length - 1) ? 0 : ++this.state.imageIndex
          });
        }}
      >
        <Icon
          name='ion|ios-arrow-right'
          size={ 30 }
          style={{ width: 30, height: 30 }}
          color='#fff'
        />
      </TouchableHighlight>;
      var imageCount = (this.props.images.length == 1)
      ? <View/>
      : <Text style={ styles.imageCountText }>
          { this.state.imageIndex + 1 }/{ this.props.images.length }
        </Text>;

    return (
      <Modal
        forceToFront={ true }
        backdropType="blur"
        backdropBlur="dark"
        isVisible={ this.state.isVisible }
        customCloseButton={
          <View style={ styles.topBar }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.2)'
              style={ styles.closeButton }
              onPress={() => {
                this.setState({
                  isVisible: false
                });
              }}
            >
              <Icon
                name='ion|ios-close-empty'
                size={ 30 }
                style={{ width: 30, height: 30 }}
                color='#fff'
              />
            </TouchableHighlight>

            {imageCount}
            {leftButton}
            {rightButton}
          </View>
        }
        onPressBackdrop={() => {
          console.log('backdrop pressed');
          this.setState({
            isVisible: false
          });
        }}
        style={ styles }
      >
        <Image
          style={ styles.image }
          source={{ uri: this.props.images[this.state.imageIndex] }}
          resizeMode='contain'
        >
        </Image>
        {/*<View { ...this._panResponder.panHandlers } style={{
          position: 'absolute',
          top: 68,
          left: 0,
          width: constants.width,
          height: constants.height - 48 - 10 - 10, // top bar plus padding
          backgroundColor: 'rgba(255,0,0,0.2)'
        }}/>*/}
        <Text> </Text>
      </Modal>
    );
    // empty text ^^^ to stop some obscure context bug in native ios.
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: '#000',
    opacity: 0.5
  },
  modal: {
    marginTop: 48,
    flexDirection: 'row',
  },

  topBar: {
    position: 'absolute',
    top: -10,
    left: 0,
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    opacity: 0.75
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageCountText: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    textAlign: 'center'
  },
  leftArrow: {
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightArrow: {
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  image: {
    flex: 1,
    width: constants.width,
    height: constants.height - 48 - 10 - 10 // top bar plus padding
  }
});

module.exports = ImageOverlay;