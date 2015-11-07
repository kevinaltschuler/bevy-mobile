'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
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
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              isVisible: false
            });
            this.props.onHide();
          }}
          style={styles.container}
        >
          <BlurView blurType='dark' style={ styles.container}>
            <View style={ styles.panel }>
                <View style={ styles.topBar }>
                  <TouchableOpacity
                    activeOpacity={.5}
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
                      size={ 48 }
                      color='#555'
                    />
                  </TouchableOpacity>
                  <View style={{flex: 2, width: 210, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={ styles.panelHeaderText }>Add a Bevy</Text>
                  </View>
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
                    />
                  </TouchableHighlight>
                </View>
                <View style={ styles.actionRowItem }>
                  <Text style={ styles.actionRowItemText }>Create</Text>
                  <TouchableHighlight
                    underlayColor='#eee'
                    style={[styles.actionRowItemButton, {paddingHorizontal: 30}]}
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
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginLeft: 20,
    marginTop: 20
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
    color: '#666',
    marginLeft: -20
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
    justifyContent: 'center',
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
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = AddBevyModal;