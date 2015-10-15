/**
 * EventBody.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var EventBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool
  },

  getInitialState() {
    return {
      image_url: (this.props.post.images[0] == '/img/default_event_img.png')
        ? constants.siteurl + this.props.post.images[0]
        : this.props.post.images[0],
      date: new Date(this.props.post.event.date)
    };
  },

  goToPostView() {
    // dont navigate if already in comment view
    if(this.props.mainRoute.name == routes.MAIN.COMMENT.name) return;
    // navigate to comments
    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.post = this.props.post;
    this.props.mainNavigator.push(commentRoute);  
  },

  addToCalendar() {

  },

  getMonthText() {
    var monthNum = this.state.date.getMonth();
    var monthMap = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return monthMap[monthNum];
  },

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={ this.goToPostView }
      >
        <View style={ styles.container }>
          <Image 
            style={ styles.image }
            source={{ uri: this.state.image_url }}
          />
          <View style={ styles.details }>
            <View style={ styles.dateContainer }>
              <Text style={ styles.month }>
                { this.getMonthText() }
              </Text>
              <Text style={ styles.day }>
                { this.state.date.getDate() }
              </Text>
            </View>
            <View style={ styles.titleContainer }>
              <Text style={ styles.title }>
                { this.props.post.title }
              </Text>
              <Text style={ styles.location }>
                { this.props.post.event.location }
              </Text>
            </View>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#EEE', false) }
              onPress={ styles.addToCalendar }
            >
              <View style={ styles.eventButton }>
                <Icon
                  name='event'
                  size={ 30 }
                  color='#AAA'
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12
  },
  image: {
    height: 100
  },
  details: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  dateContainer: {
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 10
  },
  month: {
    fontSize: 22,
    color: '#2CB673'
  },
  day: {
    color: '#AAA'
  },
  titleContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    color: '#666'
  },
  location: {
    color: '#AAA'
  },
  eventButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#EEE'
  }
});

module.exports = EventBody;