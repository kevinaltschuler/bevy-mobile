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
var { BlurView, VibrancyView } = require('react-native-blur');
var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var constants = require('./../../constants');
var routes = require('./../../routes');

var SortModal = React.createClass({
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

  _renderSortItems() {
    var source = ['top', 'new'];
    var filterItems = [];
    for(var key in source) {
        var sortType = source[key];
        var check = (PostStore.sortType == sortType)
        ? (
          <Icon
            name='ios-checkmark-empty'
            color='#2CB673'
            size={ 35 }
            style={{ width: 35, height: 35 }}
          />
        )
        : <View />;
        filterItems.push(
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={ styles.settingItemContainer }
            onPress={()=>{
              PostActions.sort(sortType)
            }}
          >
            <View style={ styles.settingItem}>
              <Text style={ styles.settingTitle }>
                { sortType }
              </Text>
              { check }
            </View>
          </TouchableHighlight>
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
                    this.props.onHide();
                  }}
                >
                  <Icon
                    name='ios-close-empty'
                    size={ 30 }
                    style={{ width: 30, height: 30 }}
                    color='#333'
                  />
                </TouchableHighlight>

                <Text style={ styles.panelHeaderText }>Sort Posts by...</Text>
              </View>
            <ScrollView 
              style={ styles.actionRow }
              contentContainerStyle={{flexDirection: 'column'}}
            >
                	{ this._renderSortItems() }
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
    width: 300,
    height: 300,
  },
  panelHeaderText: {
    fontSize: 20,
    color: '#666'
  },
  actionRow: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 100
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
  },
  settingItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
    width: 280,
  },
  settingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingTitle: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  settingValue: {
    alignSelf: 'flex-end',
    fontSize: 17,
    color: '#888'
  },
});

module.exports = SortModal;