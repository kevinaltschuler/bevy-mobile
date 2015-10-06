'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var FilterItem = require('./FilterItem.ios.js');
const { BlurView, VibrancyView } = require('react-native-blur');

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
    var source = (this.props.activeBevy._id == -1) ? this.props.myBevies : this.props.activeBevy.tags;
    var filterItems = [];
    for(var key in source) {
      var filter = source[key];
      var value = _.contains(source, filter);
      filterItems.push(
        <FilterItem
          key={'filterItem:' + filter.name}
          filter={filter}
          isFrontpage={this.props.activeBevy._id == -1}
          value={value}
          source={ source }
        />
      )
    }
    return filterItems;
  },

  render() {
    if(!this.state.isVisible) return null;
    return (
      <Modal
        isVisible={ this.state.isVisible }
        animated={ false }
        transparent={ true }
      >
        <BlurView blurType='dark' style={ styles.container}>
          <View style={ styles.panel }>
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
                    name='ios-close-empty'
                    size={ 30 }
                    style={{ width: 30, height: 30 }}
                    color='#333'
                  />
                </TouchableHighlight>

                <Text style={ styles.panelHeaderText }>filter posts by bevy</Text>
              </View>
            <ScrollView 
              style={ styles.actionRow }
              contentContainerStyle={{flexDirection: 'column'}}
            >
                	{ this._renderFilterItems() }
            </ScrollView>
          </View>
        </BlurView>
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
    alignItems: 'center'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: 'transparent',
    opacity: 0.5
  },
  modal: {
    flexDirection: 'row',
    marginTop: constants.height / 4
  },

  topBar: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 20,
    width: constants.width * 2 / 3,
    height: constants.height * .8,
  },
  panelHeaderText: {
    fontSize: 20,
    color: '#666'
  },
  actionRow: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
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