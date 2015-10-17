/**
 * SearchView.android.js
 * @author albert
 * @author ben. Mostly bert. I just did some tweaking.
 */

'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  View,
  Text,
  ListView,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../../bevy/BevyStore');
var BevyActions = require('./../../../bevy/BevyActions');
var BEVY = constants.BEVY;

var SearchView = React.createClass({

  // get proptypes
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
  },

  
  getInitialState() {
    var bevies = BevyStore.getPublicBevies();
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies),
      fetching: false,
      searchQuery: BevyStore.getSearchQuery()
    };
  },
  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },
  handleSearching() {
    this.setState({
      fetching: true,
      searchQuery: BevyStore.getSearchQuery(),
      //dataSource: []
    });
  },

  handleSearchComplete() {
    console.log('search done for', this.state.searchQuery);
    //console.log(BevyStore.getSearchList());
    var bevies = BevyStore.getSearchList();
    this.setState({
      fetching: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies)
    });
  },
  render() {
    return (
      <View style={ styles.container }>
        
      	<ListView
          dataSource={ this.state.dataSource }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            var imageUri = bevy.image_url || constants.apiurl + '/img/logo_100.png';
            if(bevy._id == -1) return <View />; // disallow posting to frontpage
            return (
              <View style={ styles.bevyRow }> 
                <TouchableHighlight
                  underlayColor='rgba(0,0,0,.1)'
                  style={styles.bevyButton}
                  onPress={() => {
                    // switch bevy
                    
                    
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
                
              </View>
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
    paddingTop: 48
  },
  bevyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    justifyContent: 'space-between',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
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
    height: 47,
    padding: 10,
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
  },
  bevyButton: {
    flex: 2
  }
});

module.exports = SearchView;