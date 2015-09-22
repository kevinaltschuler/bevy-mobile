'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');
var Modal = require('react-native-modal');

var constants = require('./../../constants');
var routes = require('./../../routes');

var TagModal = React.createClass({
	propTypes: {
		isVisible: React.PropTypes.bool,
		mainNavigator: React.PropTypes.object,
		onHide: React.PropTypes.object,
	},

	getInitialState() {
	    return {
	      isVisible: this.props.isVisible
	    };
	},

	componentWillReceiveProps(nextProps) {
	    this.setState({
	      isVisible: nextProps.isVisible
	    });
	},

  render() {
    if(!this.state.isVisible) return null;
    return (
      <Modal
        forceToFront={ true }
        backdropType="blur"
        backdropBlur="dark"
        isVisible={ this.state.isVisible }
        style={ styles }
        onPressBackdrop={() => { this.props.onHide(); }}
        customCloseButton={
          <TouchableHighlight
            underlayColor='rgba(255,255,255,0.1)'
            style={ styles.closeButton }
            onPress={() => { this.props.onHide(); }}
          >
            <View style={ styles.closeButtonContainer }>
              <Text style={ styles.closeButtonText }>Close</Text>
              <Icon
                name='ion|ios-close-empty'
                size={ 30 }
                color='#fff'
                style={{ width: 30, height: 30 }}
              />
            </View>
          </TouchableHighlight>
        }
      >
        <View style={ styles.panel }>
          <Text style={ styles.panelHeaderText }>Add a Bevy</Text>
          <View style={ styles.actionRow }>
            <View style={ styles.actionRowItem }>
              <Text style={ styles.actionRowItemText }>Search</Text>
              <TouchableHighlight
                underlayColor='#eee'
                style={ styles.actionRowItemButton }
                onPress={() => {
                  // close self
                  this.props.onHide();
                  // close the side menu
                  this.props.menuActions.close();
                }}
              >
                <Icon
                  name='ion|ios-search'
                  color='#aaa'
                  size={ 80 }
                  style={{ width: 80, height: 80, borderRadius: 15 }}
                />
              </TouchableHighlight>
            </View>
            <View style={ styles.actionRowItem }>
              <Text style={ styles.actionRowItemText }>Create</Text>
              <TouchableHighlight
                underlayColor='#eee'
                style={ styles.actionRowItemButton }
                onPress={() => {
                  // close self
                  this.props.onHide();
                  // close the side menu
                  this.props.menuActions.close();
                }}
              >
                <Icon
                  name='ion|ios-plus-empty'
                  color='#aaa'
                  size={ 80 }
                  style={{ width: 80, height: 80, borderRadius: 15 }}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
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
    flexDirection: 'row',
    marginTop: constants.height / 4
  },

  closeButton: {
    position: 'absolute',
    borderColor: '#fff',
    borderRadius: 2,
    borderWidth: 1,
    right: 20 - (constants.width * 1 / 6),
    top: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 17,
    color: '#fff'
  },

  panel: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    width: constants.width * 2 / 3,
    height: constants.height / 3
  },
  panelHeaderText: {
    marginTop: 15,
    fontSize: 22,
    color: '#666'
  },
  actionRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  actionRowItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 6
  },
  actionRowItemText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginBottom: 10
  },
  actionRowItemButton: {
    flex: 1,
    borderRadius: 15
  }
});

module.exports = TagModal;