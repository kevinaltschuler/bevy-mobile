/**
 * MyBevies.ios.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyCard = require('./BevyCard.ios.js');
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var BevyStore = require('./../../../bevy/BevyStore');
var BevyActions = require('./../../../bevy/BevyActions');
var BEVY = constants.BEVY;

var MyBevies = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      loading: false,
      loadingInitial: true,
      myBevies: this.props.myBevies
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.LOADING, this.onLoading);
    BevyStore.on(BEVY.LOADED, this.onLoaded);
  },
  componentWillUnmount() {
    BevyStore.off(BEVY.LOADING, this.onLoading);
    BevyStore.off(BEVY.LOADED, this.onLoaded);
  },

  componentWillReceiveProps(nextProps) {
    this.onLoaded();
  },

  onLoading() {
    this.setState({ loading: true });
  },

  onLoaded() {
    this.setState({
      myBevies: BevyStore.getMyBevies(),
      loading: false,
      loadingInitial: false
    });
  },

  onRefresh() {
    BevyActions.fetch();
  },

  goToNewBevy() {
    this.props.mainNavigator.push(routes.MAIN.NEWBEVY);
  },

  _renderBevyList() {
    if(this.state.loadingInitial) return [];
    var bevyList = [];
    for(var key in this.state.myBevies) {
      var bevy = this.state.myBevies[key];
      if(!bevy) continue
      bevyList.push(
        <BevyCard
          bevy={ bevy }
          bevyNavigator={ this.props.bevyNavigator }
          key={ 'bevylist:' + bevy._id }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    return bevyList;
  },

  _renderNewBevyCard() {
    if(this.state.loadingInitial) return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToNewBevy }
        style={ styles.newBevyCard }
      >
        <View
          style={{
            alignItems: 'center'
          }}
        >
          <Icon
            name='add'
            size={ 60 }
            color='#aaa'
          />
          <Text
            style={{
              color: '#999',
              fontSize: 17
            }}
          >
            Create a New Bevy
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  _renderLoading() {
    if(this.state.loadingInitial) {
      return (
        <View style={ styles.spinnerContainer }>
          <Spinner
            isVisible={ true }
            size={ 60 }
            type={ '9CubeGrid' }
            color={ '#2cb673' }
          />
        </View>
      );
    } else return <View />;
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <View style={{
              width: 48,
              height: 48
            }}/>
            <Text style={ styles.title }>
              My Bevies
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goToNewBevy }
            >
              <Icon
                name='add'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={ styles.bevyList }
          automaticallyAdjustContentInsets={ true }
          showsVerticalScrollIndicator={ true }
        >
          { this._renderLoading() }
          { this._renderBevyList() }
          { this._renderNewBevyCard() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bevyList: {
    flexDirection: 'column',
    width: constants.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -10,
  },
  newBevyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: constants.width * .88,
    height: 160,
    borderColor: '#aaa',
    borderWidth: 3,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 70
  },
  spinnerContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height - 300
  },
  noBeviesContainer: {
    flex: 1,
    height: constants.height - 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noBeviesText: {
    color: '#AAA',
    fontSize: 22
  }
});

module.exports = MyBevies;
