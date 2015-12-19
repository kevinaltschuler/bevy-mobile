/* MapView.ios.js
* made by @kevin
* the girl to our left has iphone in hand, ipad in lap and imac on desk.
*/
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight
} = React;
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var SearchBar = require('./../../../shared/components/ios/SearchBar.ios.js');
var NewPostView = require('./../../../post/components/ios/NewPostView.ios.js');
var CreateBevyView = require('./../../../bevy/components/ios/CreateBevyView.ios.js');
var CommentView = require('./../../../post/components/ios/CommentView.ios.js');
var ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');

var LocationView = React.createClass({

	getInitialState: function() {
		return {
			mapRegion: this.props.location
		};
	},

	render: function() {
		return (
			<View style={styles.container}>
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
		            alignItems: 'center',
		          }}
		          left={
		            <TouchableHighlight
		              underlayColor={'rgba(0,0,0,0)'}
		              onPress={() => {
		                // blur all text inputs
		                // go back
		                this.props.mainNavigator.pop();
		              }}
		              style={ styles.navButtonLeft }>
		              <Text style={ styles.navButtonTextLeft }>
		                back
		              </Text>
		            </TouchableHighlight>
		          }
		          center={
		            <View style={ styles.navTitle }>
		              <Text style={ styles.navTitleText }>
		                {this.props.location}
		              </Text>
		            </View>
		          }
		          right={
		          	<View style={ styles.navButtonRight } />
		          }
		        />
		        <WebView
		        	style={styles.map}
		        	url={'https://www.google.com/maps/search/' + this.props.location.replace(/ /g, '+')}
		        	scrollEnabled={false}
		        	scalePageToFit={true}
		        	contentInset={{top: -20,left: 0,bottom: 0,right: 0}}
		        />
			</View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    height: 500
  },
  navButtonLeft: {
    flex: 1,
    marginLeft: 8
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#ddd',
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
  scrollView: {
    flex: 1,
    flexDirection: 'column'
  },
  map: {
  	flex: 1,
  	height: 500
  }
});

module.exports = LocationView;
