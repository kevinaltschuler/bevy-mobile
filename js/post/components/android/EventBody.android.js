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
  TouchableHighlight,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var PostActions = require('./PostActions.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyIntent = require('./../../../shared/apis/BevyIntent.android.js');

var EventBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool
  },

  getInitialState() {
    return {
      source: { uri: this.props.post.images[0].path },
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
    var startTime = new Date(this.props.post.event.date);
    BevyIntent.addEvent({
      startTime: String(startTime.getTime()),
      endTime: String(startTime.getTime() + (1000 * 60 * 60)), // one hour later
      title: this.props.post.title,
      description: this.props.post.event.description,
      location: this.props.post.event.location
    });
  },

  goToMap() {
    BevyIntent.openMap(this.props.post.event.location);
  },

  getMonthText() {
    var monthNum = this.state.date.getMonth();
    var monthMap = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthMap[monthNum];
  },
  getWeekdayText() {
    var weekdayNum = this.state.date.getDay();
    var weekdayMap = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    return weekdayMap[weekdayNum];
  },
  getHoursText() {
    var hours = this.state.date.getHours();
    if(hours == 0) return '12'; // 12 AM
    if(hours > 11) return hours - 12 + 1; // sometime in the PM
    else return hours - 1; // sometime in the AM
  },
  getMinutesText() {
    var minutes = String(this.state.date.getMinutes());
    if(minutes.length < 2) minutes = '0' + minutes;
    return minutes;
  },
  getAMorPM() {
    var hours = this.state.date.getHours();
    if(hours < 11) return 'AM';
    if(hours == 23) return 'AM' // 12 AM
    else return 'PM';
  },

  _renderCompact() {
    return (
      <TouchableWithoutFeedback
        onPress={ this.goToPostView }
      >
        <View style={ compactStyles.container }>
          <Image
            style={ compactStyles.image }
            source={ this.state.source }
          />
          <View style={ compactStyles.details }>
            <View style={ compactStyles.dateContainer }>
              <Text style={ compactStyles.month }>
                { this.getMonthText() }
              </Text>
              <Text style={ compactStyles.day }>
                { this.state.date.getDate() }
              </Text>
            </View>
            <View style={ compactStyles.titleContainer }>
              <Text style={ compactStyles.title }>
                { this.props.post.title }
              </Text>
              <Text style={ compactStyles.location }>
                { this.props.post.event.location }
              </Text>
            </View>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#EEE', false) }
              onPress={ this.addToCalendar }
            >
              <View style={ compactStyles.eventButton }>
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
  },

  _renderExpanded() {
    return (
      <View style={ expandedStyles.container }>
        <View style={ expandedStyles.header }>
          <Image
            style={ expandedStyles.headerImage }
            source={ this.state.source }
          />
          <View style={ expandedStyles.darkener } />
          <TouchableHighlight
            onPress={ this.addToCalendar }
            underlayColor='#EEE'
            style={{
              backgroundColor: '#FFF',
              position: 'absolute',
              top: 10,
              right: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              elevation: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View>
              <Icon
                name='event'
                size={ 26 }
                color='#888'
              />
            </View>
          </TouchableHighlight>
          <Text style={ expandedStyles.title }>
            { this.props.post.title.trim() }
          </Text>
        </View>
        <PostActions
          post={ this.props.post }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
        <View style={ expandedStyles.dateRow }>
          <Icon
            name='schedule'
            size={ 30 }
            color='#888'
          />
          <View style={ expandedStyles.dateDetails }>
            <Text style={ expandedStyles.startDate }>
              { this.getWeekdayText() + ', '  + this.getMonthText() + ' '
                + this.state.date.getDate() + ' at ' + this.getHoursText()+ ':'
                + this.getMinutesText() + ' ' + this.getAMorPM()
              }
            </Text>
            <Text style={ expandedStyles.endDate }>
            </Text>
          </View>
        </View>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ this.goToMap }
        >
          <View style={ expandedStyles.locationRow }>
            <Icon
              name='room'
              size={ 30 }
              color='#888'
            />
            <View style={{
              flex: 1,
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#EEE'
            }}>
              <Text style={ expandedStyles.locationText }>
                { this.props.post.event.location }
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ this.addToCalendar }
        >
          <View style={ expandedStyles.locationRow }>
            <Icon
              name='event'
              size={ 30 }
              color='#888'
            />
            <View style={{
              flex: 1,
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              //borderBottomWidth: 1,
              //borderBottomColor: '#EEE'
            }}>
              <Text style={ expandedStyles.locationText }>
                Add To Calendar
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <View style={ expandedStyles.divider } />
        <View style={ expandedStyles.descriptionRow }>
          <Text style={ expandedStyles.descriptionTitle }>
            About
          </Text>
          <Text style={ expandedStyles.description }>
            { this.props.post.event.description }
          </Text>
        </View>
      </View>
    );
  },

  render() {
    if(this.props.expandText)
      return this._renderExpanded(); // for post list
    else
      return this._renderCompact(); // for comment view
  }
});

var compactStyles = StyleSheet.create({
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
    fontSize: 20,
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
var expandedStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: '#EEE',
    height: 20
  },
  header: {
    height: 200
  },
  headerImage: {
    flex: 1,
    width: constants.width,
    height: 200
  },
  darkener: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200,
    width: constants.width,
    opacity: 0.4,
    backgroundColor: '#000'
  },
  title: {
    position: 'absolute',
    left: 15,
    bottom: 10,
    color: '#FFF',
    textAlign: 'left',
    fontSize: 18
  },
  dateRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  dateDetails: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  startDate: {
    color: '#AAA',
    textAlign: 'left'
  },
  endDate: {
    color: '#AAA',
    textAlign: 'left'
  },
  locationRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  locationText: {
    flex: 1,
    color: '#AAA'
  },
  descriptionRow: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  descriptionTitle: {
    color: '#999',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  description: {
    color: '#999'
  }
});

module.exports = EventBody;
