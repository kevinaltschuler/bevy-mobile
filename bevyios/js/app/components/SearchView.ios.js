'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight
} = React;

var constants = require('./../../constants');
var routes = require('./../../routes');
var BevyActions = require('./../../BevyView/BevyActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var SearchView = React.createClass({

  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
    publicBevies: React.PropTypes.array
  },

  getInitialState() {
    var bevies = this.props.publicBevies;
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies),
      fetching: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevies = nextProps.publicBevies;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(bevies)
    });
  },

  componentWillUpdate() {
    /*if(this.props.searchRoute.name == routes.SEARCH.IN.name && !this.state.fetching) {
      // ok, now we're in search.
      // fetch public bevies
      console.log('fetching public');
      BevyActions.fetchPublic();
      this.setState({
        fetching: true
      });
    }*/
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />
        <Text style={ styles.publicBevyTitle }>Public Bevies</Text>
        <ListView
          dataSource={ this.state.dataSource }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            var imageUri = bevy.image_url || constants.apiurl + '/img/logo_100.png';
            if(bevy._id == -1) return <View />; // disallow posting to frontpage
            return (
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={() => {
                  // switch bevy
                  BevyActions.switchBevy(bevy._id);
                  this.props.searchNavigator.jumpTo(routes.SEARCH.OUT);
                }}
              >
                <View style={ styles.bevyPickerItem }>
                  <Image
                    style={ styles.bevyPickerImage }
                    source={{ uri: imageUri }}
                  />
                  <Text style={ styles.bevyPickerName }>
                    { bevy.name }
                  </Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: 60
  },
  publicBevyTitle: {
    fontSize: 17,
    textAlign: 'center'
  },
  bevyPickerList: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  bevyPickerImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  bevyPickerName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 15
  }
});

module.exports = SearchView;