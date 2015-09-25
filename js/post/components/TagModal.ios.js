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
var FilterItem = require('./FilterItem.ios.js');

var constants = require('./../../constants');
var routes = require('./../../routes');

var TagModal = React.createClass({
	propTypes: {
		isVisible: React.PropTypes.bool,
		mainNavigator: React.PropTypes.object,
		onHide: React.PropTypes.func,
		frontpageFilters: React.PropTypes.array,
    activeTags: React.PropTypes.array,
    activeBevy: React.PropTypes.object
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

  _renderFilterItems() {
    var source = (this.props.activeBevy._id == -1) ? this.props.frontpageFilters : this.props.activeTags;
    var filterItems = [];
    for(var key in source) {
      var filter = source[key];
      filterItems.push(
        <FilterItem
          key={'filterItem:' + filter.name}
          filter={filter}
          isFrontpage={this.props.activeBevy._id == -1}
          value={true}
        />
      )
    }
    return filterItems;
    var filterItems = [];
    for(var key in activeTags) {
      var filter = activeTags[key]
      filterItems.push(
        <FilterItem
          filter={filter}
        />
      )
    }
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
          <Text style={ styles.panelHeaderText }>Filter Posts by bevy</Text>
          <View style={ styles.actionRow }>
            <View style={ styles.actionRowItem }>
              	{ this._renderFilterItems() }
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