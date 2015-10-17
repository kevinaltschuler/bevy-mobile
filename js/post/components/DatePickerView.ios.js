'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  ListView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  StatusBarIOS,
  Navigator,
  TouchableHighlight,
  DeviceEventEmitter,
  DatePickerIOS,
  Modal
} = React;

var { BlurView, VibrancyView } = require('react-native-blur');

var Icon = require('react-native-vector-icons/Ionicons');
var Calendar = require('react-native-calendar');

var _ = require('underscore');
var routes = require('./../../routes');
var constants = require('./../../constants');
var FILE = constants.FILE;
var FileStore = require('./../../file/FileStore');
var FileActions = require('./../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var window = require('Dimensions').get('window');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var PostActions = require('./../PostActions');

var DatePickerModal = React.createClass({

  propTypes: {
    onSetDate: React.PropTypes.func,
    selected: React.PropTypes.object,
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible,
      date: this.props.date,
      time: this.props.time
    }
  },

  componentWillReceiveProps(nextProps) {
      this.setState({
        isVisible: nextProps.isVisible,
        date: nextProps.date,
        time: nextProps.time
      });
  },

  render() {
    return (
          <View style={ styles.container }>
            <Navbar
              styleParent={{
                backgroundColor: '#2CB673',
                flexDirection: 'column',
                paddingTop: 0
              }}
              styleBottom={{
                backgroundColor: '#2CB673',
                height: 48,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              left={ 
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={() => {
                    //do not send date back, just close
                    this.props.newPostNavigator.pop();
                  }}
                  style={ styles.navButtonLeft }>
                  <Text style={ styles.navButtonTextLeft }>
                    Cancel
                  </Text>
                </TouchableHighlight> 
              }
              center={ 
                <View style={ styles.navTitle }>
                  <Text style={ styles.navTitleText }>
                    Select Date
                  </Text>
                </View>
              }
              right={
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={() => {
                    //send the date back to createeventview
                    this.props.onSetDate(this.state.date); 
                    this.props.onSetTime(this.state.time);
                    //close
                    this.props.newPostNavigator.pop();
                  }}
                  style={ styles.navButtonRight }>
                  <Text style={ styles.navButtonTextRight }>
                    Done
                  </Text>
                </TouchableHighlight>
              }
            />
            <View style={styles.dateString}>
              <Text style={{fontSize: 18, color: '#555'}}>
                {this.state.date.toLocaleDateString()} at {this.state.time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| )$/, "")}
              </Text> 
            </View>
            <View style={{height: 20, width: constants.width, backgroundColor: 'rgba(247,247,247,1)'}}/>
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
  modal: {
    flexDirection: 'row',
    marginTop: constants.height / 4
  },
  topBar: {
    height: 42,
    width: constants.width - 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10
  },
  pickers: {
    backgroundColor: 'rgba(247,247,247,1)', 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    width: constants.width,
    height: 400,
  },
  dateString: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  navButtonLeft: {
    flex: 1,
    padding: 10,
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17,
  },
  navButtonTextRight: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

var calendarStyles = {
  calendarContainer: {
    backgroundColor: '#f7f7f7',
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