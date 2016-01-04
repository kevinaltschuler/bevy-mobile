'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var constants = require('./../../../constants');

var MessageItem = React.createClass({
  propTypes: {
    message: React.PropTypes.object,
    user: React.PropTypes.object,
    hidePic: React.PropTypes.bool,
    showName: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      message: ''
    }
  },

  getInitialState() {
    return {
      collapsed: true,
      wrap: false
    }
  },

  componentDidMount() {
    this.measureMessageBody();
  },

  measureMessageBody() {
    var message = this.props.message;
    var author = message.author;
    var user = this.props.user;
    var isMe = (user._id == author._id);
    setTimeout(() => {
      this.MessageBody.measure((ox, oy, width, height, px, py) => {

        if(width >= (constants.width - 80)) {
          this.setState({
            wrap: true
          });
        }
      });
    }, 0);
  },

  render: function() {
    var message = this.props.message;
    var author = message.author;
    var user = this.props.user;

    var createDate = new Date(message.created);
    var nowDate = new Date();
    var diff = nowDate - createDate;
    var created = '';
    if(diff <= ( 1000 * 60 * 60 * 24)) {
      // within a day - only display hours and minutes
      created =
        ((createDate.getHours() > 12 )
          ? createDate.getHours() - 12
          : createDate.getHours()) // 12 hr format
        + ':'
        + ((createDate.getMinutes() < 10)
          ? '0' + createDate.getMinutes()
          : createDate.getMinutes())
        + ((createDate.getHours() > 11) ? ' PM' : ' AM');
    } else if (diff <= ( 1000 * 60 * 60 * 24 * 7)) {
      // within a week - only display short weekday
      var weekdayMap = [
        'Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'
      ];
      created = weekdayMap[createDate.getDay()];
    } else {
      // outside of a week - display month and day
      var monthMap = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      created = monthMap[createDate.getMonth() - 1] + ' ' + createDate.getDate();
    }

    var messageBodyStyle = {
      backgroundColor: '#rgba(0,0,0,.2)',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 14,
      flexWrap: 'wrap',
      flex: (this.state.wrap) ? 1 : 0,
    };

    var isMe = (user._id == author._id);

    var image = (this.props.hidePic)
    ? <View style={{height: 5, width: 35}}/>
    : <Image
      source={{ uri: (_.isEmpty(author.image_url))
        ? constants.siteurl + '/img/user-profile-icon.png'
        : author.image_url }}
      style={ styles.authorImage }
    />

    var name = (isMe) ? 'Me' : author.displayName;

    var nameTitle = (this.props.showName)
    ? <Text 
        style={{
          width: constants.width, 
          flexDirection: 'column', 
          textAlign: (isMe) ? 'right' : 'left',
          paddingHorizontal: 45,
          color: 'rgba(0,0,0,.3)'
        }}
      >
        {name}
      </Text>
    : <View/>;

    var space = (this.props.hidePic) ? 5 : 0;

    return (
      <View>
        { (isMe)
          ? (
            <TouchableOpacity
              activeOpacity={.5}
              onPress={() => {
                this.setState({
                  collapsed: !this.state.collapsed
                })
              }}
            >
              <View style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
                { nameTitle }
                <View style={[styles.containerMe, {marginTop: space}]}>
                  <View 
                    style={[messageBodyStyle, { backgroundColor: '#2cb673' } ]}
                    ref={ref => { this.MessageBody = ref; }}
                  >
                    <Text style={{
                      textAlign: 'right',
                      color: '#fff',
                      flex: 1,
                    }}>
                      { message.body}
                    </Text>
                  </View>
                  <View style={{width: 5}}/>
                  { image }
                </View>
                <Collapsible collapsed={this.state.collapsed} >
                  <Text style={[styles.myName, {color: '#888'} ]}>
                    Me · { created }
                  </Text>
                </Collapsible>
              </View>
            </TouchableOpacity>
          )
          : (
            <TouchableOpacity
              activeOpacity={.5}
              onPress={() => {
                this.setState({
                  collapsed: !this.state.collapsed
                })
              }}
            >
              <View style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                backgroundColor: 'rgba(0,0,0,0)'
              }}>
                {nameTitle}
                <View style={[styles.container, {marginTop: space}]}>
                  { image }
                  <View style={{width: 5}}/>
                  <View 
                    style={[messageBodyStyle, {backgroundColor: '#eee'} ]}
                    ref={ref => { this.MessageBody = ref; }}
                  >
                    <Text style={{ textAlign: 'left', color: '#333' }}>
                      { message.body }
                    </Text>
                  </View>
                </View>
                <Collapsible collapsed={this.state.collapsed} >
                  <Text style={[styles.authorName, {color: '#888'} ]}>
                    {author.displayName} · { created }
                  </Text>
                </Collapsible>
              </View>
            </TouchableOpacity>
          )
        }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0)',
    width: constants.width - 80
  },
  containerMe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0)',
    width: constants.width - 80
  },
  authorImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  messageBody: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  messageBodyMe: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  messageTextContainer: {
    //flexDirection: 'row',
    //flex: 1
  },
  messageText: {

  },
  arrow: {
    width: 10,
    height: 10
  },
  myName: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
    marginTop: 0,
    marginRight: 40
  },
  authorName: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
    marginTop: 0,
    marginLeft: 40
  }
});

module.exports = MessageItem;
