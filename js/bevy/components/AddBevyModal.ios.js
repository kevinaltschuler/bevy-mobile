'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var { BlurView, VibrancyView } = require('react-native-blur');

var constants = require('./../../constants');
var routes = require('./../../routes');

var AddBevyModal = React.createClass({

  propTypes: {
    isVisible: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object,
    menuActions: React.PropTypes.object,
    onHide: React.PropTypes.func
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
        isVisible={ this.state.isVisible }
        animated={ true }
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
                <Text style={ styles.panelHeaderText }>Add a Bevy</Text>
              </View>
            <View style={ styles.actionRow }>
              <View style={ styles.actionRowItem }>
                <Text style={ styles.actionRowItemText }>Search</Text>
                <TouchableHighlight
                  underlayColor='#eee'
                  style={ styles.actionRowItemButton }
                  onPress={() => {
                    var searchNavigator = constants.getSearchNavigator();
                    // go to search
                    searchNavigator.push(routes.SEARCH.IN);
                    // close self
                    this.props.onHide();
                    // close the side menu
                    this.props.menuActions.close();
                  }}
                >
                  <Icon
                    name='ios-search'
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
                    // go to new bevy view
                    this.props.mainNavigator.push(routes.MAIN.NEWBEVY);
                  }}
                >
                  <Icon
                    name='ios-plus-empty'
                    color='#aaa'
                    size={ 80 }
                    style={{ width: 80, height: 80, borderRadius: 15 }}
                  />
                </TouchableHighlight>
              </View>
            </View>
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
  topBar: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  modal: {
    flexDirection: 'row',
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
    borderRadius: 10,
    width: 270,
    height: 270,
    marginTop: 100
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
    borderRadius: 15,
    paddingLeft: 20
  }
});

module.exports = AddBevyModal;