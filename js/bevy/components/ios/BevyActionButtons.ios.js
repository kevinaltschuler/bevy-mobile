/**
 * BevyActionButtons.ios.js
 * @author kevin
 * the actions for a bevy
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  ScrollView,
  ActionSheetIOS
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');

var BevyActionButtons = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    bevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    // used so the parent bevy view knows whether to render the search posts
    // or just the posts for the bevy/board
    onSearchStart: React.PropTypes.func,
    onSearchStop: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onSearchStart: _.noop,
      onSearchStop: _.noop
    };
  },

  getInitialState() {
    return {
      joined: _.contains(this.props.user.bevies, this.props.bevy._id),
      isAdmin: _.findWhere(this.props.bevy.admins, { _id: this.props.user._id }) != undefined,
      query: ''
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: _.contains(nextProps.user.bevies, nextProps.bevy._id),
      isAdmin: _.findWhere(nextProps.bevy.admins, { _id: nextProps.user._id }) != undefined
    });
  },

  _handleJoinLeave(index) {
    var bevy = this.props.bevy;
    if(index == 0) {
      if(this.state.joined) {
        BevyActions.leave(bevy._id);
        this.setState({ joined: false });
      } else {
        if(bevy.settings.privacy == 'private') {
          //BoardActions.requestBoard(board._id)
        }
        else {
          BevyActions.join(bevy._id)
          this.setState({ joined: true });
        }
      }
    }
  },

  onSearchBlur() {
    //if(_.isEmpty(this.state.query)) {
    //  this.Swiper.scrollTo(0);
    //}
  },

  onSearchChange(text) {
    this.setState({ query: text });

    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }

    this.searchTimeout = setTimeout(this.search, 250);
  },

  search() {
    var board_id = (_.isEmpty(this.props.activeBoard)) ? null : this.props.activeBoard._id
    PostActions.search(this.state.query, this.props.bevy._id, board_id);
  },

  cancelSearch() {
    // let the post list know that we're not using search posts anymore
    this.props.onSearchStop();
    // clear the seaerch query
    this.setState({ query: '' });
    // blur the text field if its still focused. it probably isnt though
    this.SearchInput.blur();
    // scroll back to the main buttons
    this.Swiper.scrollTo(0, 0);
    // clear the query in PostActions
    PostActions.search('');
  },

  openSearch() {
    // check first if any posts exist
    // dont allow searching if no posts exist
    if(PostStore.getAll().length <= 0) {
      return;
    }
    // let the post list know that we're looking at search posts now
    this.props.onSearchStart();
    // scroll so the search textinput is visible
    this.Swiper.scrollTo(0, constants.width);
    // send out the initial search call to get a generic list of posts
    this.search();
    // once the animation finishes, focus the search textinput
    setTimeout(() => { this.SearchInput.focus() }, 500);
  },

  showActionSheet() {
    var bevy = this.props.bevy;
    if(this.state.joined) {
      var joinOptions = ['Leave Bevy', 'Cancel'];
    } else {
      if(bevy.settings.privacy == 'private') {
       var joinOptions = ['Request To Join', 'Cancel'];
      }
      else {
        var joinOptions = ['Join Bevy', 'Cancel'];
      }
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options: joinOptions,
      cancelButtonIndex: 1,
    },
    buttonIndex => {
      this._handleJoinLeave(buttonIndex);
    });
  },

  inviteUsers() {
    if(this.state.isAdmin) {
      var route = {
        name: routes.MAIN.INVITEUSERS
      };
      this.props.mainNavigator.push(route);
    } else {
      AlertIOS.alert(
       'Only admins may invite users'
      );
    }
  },

  goToInfoView() {
    var route = {
      name: routes.BEVY.INFO
    };
    this.props.bevyNavigator.push(route);
  },

  render() {
    var bevy = this.props.bevy;
    var user = this.props.user;
    if(_.isEmpty(bevy)) {
      return <View/>;
    }

    var joinedText, joinedColor;
    if(this.state.joined) {
      joinedText = 'Joined';
      joinedColor = '#2CB673';
    } else {
      joinedText = 'Join';
      joinedColor = '#AAA';
    }

    return (
      <ScrollView
        ref={ ref => { this.Swiper = ref; }}
        style={ styles.container }
        contentContainerStyle={ styles.containerInner }
        pagingEnabled={ true }
        horizontal={ true }
        showsHorizontalScrollIndicator={ false }
        showsVerticalScrollIndicator={ false }
        canCancelContentTouches={ false }
      >
        <View style={ styles.slide }>
          <TouchableOpacity
            style={ styles.actionWrapper }
            onPress={ this.showActionSheet }
            activeOpacity={ 0.5 }
          >
            <View style={ styles.action }>
              <Icon
                name='done'
                size={ 24 }
                color={ joinedColor }
              />
              <Text style={[ styles.actionText, { color: joinedColor }]}>
                { joinedText }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={0.5}
            onPress={ this.inviteUsers }
          >
            <View style={ styles.action }>
              <Icon
                name='person-add'
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                Invite
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={ 0.5 }
            onPress={ this.openSearch }
          >
            <View style={ styles.action }>
              <Icon
                name='search'
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                Search
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.actionWrapper }
            activeOpacity={ 0.5 }
            onPress={ this.goToInfoView }
          >
            <View style={ styles.action }>
              <Icon
                name={(this.state.isAdmin) ? 'settings' : 'more-horiz' }
                size={ 24 }
                color='#aaa'
              />
              <Text style={ styles.actionText }>
                {(this.state.isAdmin) ? 'Settings' : 'Info' }
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={ styles.slide }>
          <Icon
            name='search'
            size={ 30 }
            color='#AAA'
            style={ styles.searchIcon }
          />
          <TextInput
            ref={ ref => { this.SearchInput = ref; }}
            style={ styles.searchInput }
            value={ this.state.query }
            onChangeText={ this.onSearchChange }
            onSubmitEditing={ this.search }
            onBlur={ this.onSearchBlur }
            autoCorrect={ false }
            autoCapitalize={ 'none' }
            returnKeyType='search'
            placeholder='Search Posts'
            placeholderTextColor='#AAA'
          />
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.searchCancelButton }
            onPress={ this.cancelSearch }
          >
            <Icon
              name='close'
              size={ 20 }
              color='#FFF'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 50,
    maxHeight: 50
  },
  containerInner: {
    height: 50,
    maxHeight: 50
  },
  slide: {
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    height: 50
  },
  searchIcon: {
    marginHorizontal: 10
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 17,
    marginRight: 10
  },
  searchCancelButton: {
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AAA',
    borderRadius: 15,
    marginRight: 10
  },
  actionWrapper: {
    flex: 1,
    height: 50
  },
  action: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionText: {
    color: '#888',
    fontSize: 15
  }
});

module.exports = BevyActionButtons;
