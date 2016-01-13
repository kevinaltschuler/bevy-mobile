/**
 * DatePickerView.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  DatePickerIOS,
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Calendar = require('react-native-calendar');

var _ = require('underscore');
var constants = require('./../../../constants');

var DatePickerModal = React.createClass({
  propTypes: {
    onSetDate: React.PropTypes.func,
    selected: React.PropTypes.object,
    newPostNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible,
      date: this.props.date,
      time: this.props.time
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isVisible: nextProps.isVisible,
      date: nextProps.date,
      time: nextProps.time
    });
  },

  goBack() {
    //do not send date back, just close
    this.props.newPostNavigator.pop();
  },

  submit() {
    //send the date back to createeventview
    this.props.onSetDate(this.state.date);
    this.props.onSetTime(this.state.time);
    //close
    this.props.newPostNavigator.pop();
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
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
            <Text style={ styles.title }>
            </Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.submit }
            >
              <Icon
                name='done'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={ styles.dateString }>
          <Text style={{fontSize: 18, color: '#555'}}>
            { this.state.date.toLocaleDateString() }
            &nbsp;at&nbsp;
            { this.state.time.toLocaleTimeString(
              navigator.language,
              { hour: '2-digit', minute:'2-digit' }).replace(/(:\d{2}| )$/, "") }
          </Text>
        </View>
        <View style={{
          height: 5,
          width: constants.width,
          backgroundColor: 'rgba(247,247,247,1)'
        }}/>
        <Calendar
          eventDates={[]}
          showControls={true}
          titleFormat={'MMMM YYYY'}
          dayHeadings={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
          prevButtonText={''}
          nextButtonText={''}
          scrollEnabled={true}
          customStyle={calendarStyles}
          onDateSelect={(date) => {
            this.setState({
              date: new Date(date)
            })
          }}
        />
        <View style={styles.pickers}>
          <DatePickerIOS
            mode={'time'}
            date={ this.state.time }
            onDateChange={(time) => {
              this.setState({
                time: new Date(time)
              })
            }}
          />
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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
  dateString: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  pickers: {
    backgroundColor: 'rgba(247,247,247,1)',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

var calendarStyles = {
  calendarContainer: {
    backgroundColor: '#f7f7f7',
    marginBottom: -50
  },
  calendarControls: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  controlButton: {
  },
  controlButtonText: {
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  calendarHeading: {
    flexDirection: 'row',
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#666'
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#666'
  },
  weekRow: {
    flexDirection: 'row',
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#666'
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc'
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  currentDayCircle: {
    backgroundColor: '#2CB673',
  },
  currentDayText: {
    color: '#2CB673',
  },
  selectedDayCircle: {
    backgroundColor: '#2CB673',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#666',
  }
};

module.exports = DatePickerModal;
