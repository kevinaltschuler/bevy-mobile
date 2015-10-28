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
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      bevies: this.state.bevies.cloneWithRows(nextProps.myBevies)
    });
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
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={() => {
              // go back
              this.props.newPostNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#666'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.topBarTitle }>Posting To...</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
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
    backgroundColor: '#FFF',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  backButtonText: {
    color: '#000'
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#000'
  },
  postButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  postButtonText: {
    color: '#2CB673'
  },
  bevyPickerList: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = BevyPickerView;