/**
 * AddRelatedView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  ToastAndroid,
  ListView,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var BevyBar = require('./BevyBar.android.js');
var BevySearchItem = require('./BevySearchItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var BEVY = constants.BEVY;

var AddRelatedView = React.createClass({
  propTypes: {
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var results = BevyStore.getSearchList();
    return {
      searching: false,
      query: '',
      searchResults: results,
      ds: ds.cloneWithRows(results)
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.onSearchComplete);
    BevyStore.on(BEVY.SEARCH_ERROR, this.onSearchError);
  },
  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.onSearchComplete);
    BevyStore.off(BEVY.SEARCH_ERROR, this.onSearchError);
  },

  onSearchComplete() {
    var results = BevyStore.getSearchList();
    this.setState({
      ds: this.state.ds.cloneWithRows(results),
      searchResults: results,
      searching: false
    });
  },
  onSearchError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(this.prevScrollY == undefined) {
      this.prevScrollY = scrollY;
      return;
    }
    if(scrollY - this.prevScrollY > 5) {
      // scrolling down
      // hide the keyboard so we can see easier
      this.SearchInput.blur();
    }
    this.prevScrollY = scrollY;
  },

  onSearchChange(text) {
    this.setState({
      query: text
    });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },
  search() {
    BevyActions.search(this.state.query);
    this.setState({
      searching: true
    });
  },

  addBevy(bevy) {
    BevyActions.addRelated(this.props.activeBevy._id, bevy);
    this.props.bevyNavigator.pop();
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <Text style={ styles.title }>
          Add Related Bevy
        </Text>
        <View style={ styles.inputContainer }>
          <TextInput
            ref={ ref => { this.SearchInput = ref; }}
            style={ styles.searchInput }
            value={ this.state.query }
            onChangeText={ this.onSearchChange }
            placeholder='Search for Bevies'
            placeholderTextColor='#AAA'
            underlineColorAndroid='rgba(0,0,0,0)'
          />
        </View>
        <ListView
          dataSource={ this.state.ds }
          style={ styles.searchItemList }
          contentContainerStyle={{ paddingBottom: 10 }}
          scrollRenderAheadDistance={ 300 }
          removeClippedSubviews={ true }
          initialListSize={ 10 }
          pageSize={ 10 }
          onScroll={ this.handleScroll }
          renderRow={ bevy =>
            <BevySearchItem
              key={ 'bevysearchitem:' + bevy._id }
              bevy={ bevy }
              onPress={ this.addBevy }
            />
          }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8
  },
  inputContainer: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#000'
  },
  searchItemList: {
    flex: 1
  }
});

module.exports = AddRelatedView;
