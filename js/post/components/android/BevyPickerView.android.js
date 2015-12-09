/**
 * BevyPickerView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView,
  TouchableNativeFeedback,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var BevyPickerItem = require('./BevyPickerItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var BevyPickerView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    onSwitchBevy: React.PropTypes.func
  },

  getInitialState() {
    var bevies = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      bevies: bevies.cloneWithRows(this.props.myBevies)
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      bevies: this.state.bevies.cloneWithRows(nextProps.myBevies)
    });
  },

  onBackButton() {
    this.props.newPostNavigator.pop();
    return true;
  },

  onSwitchBevy(bevy) {
    this.props.onSwitchBevy(bevy);
    this.forceUpdate();
    this.props.newPostNavigator.pop();
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>Posting To...</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.postButton }>
              <Text style={ styles.postButtonText }>Done</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <ListView
          dataSource={ this.state.bevies }
          style={ styles.bevyPickerList }
          scrollRenderAheadDistance={ 300 }
          removeClippedSubviews={ true }
          initialListSize={ 10 }
          pageSize={ 10 }
          renderRow={(bevy) => {
            if(bevy._id == -1) return <View />;
            return (
              <BevyPickerItem
                key={ 'bevypickeritem:' + bevy._id }
                bevy={ bevy }
                onSwitchBevy={ this.onSwitchBevy }
                isSelected={ bevy._id == this.props.selectedBevy._id }
              />
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  topBar: {
    backgroundColor: '#2CB673',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10
  },
  topBarTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 18
  },
  postButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  postButtonText: {
    color: '#FFF'
  },
  bevyPickerList: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = BevyPickerView;