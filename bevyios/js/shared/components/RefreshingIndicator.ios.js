var React = require('react-native');
var {
  StyleSheet,
  ActivityIndicatorIOS,
  View,
  Text,
  isValidElement,
  createElement
} = React;

var RefreshingIndicator = React.createClass({

  propTypes: {
    description: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.element ])
  },
  getDefaultProps: function() {
    return {
      activityIndicatorComponent: ActivityIndicatorIOS
    }
  },
  
  renderActivityIndicator: function(style) {
    var activityIndicator = this.props.activityIndicatorComponent;

    if(isValidElement(activityIndicator)) {
      return activityIndicator;
    } else {
      return createElement(activityIndicator, { style })
    }
  },

  render: function() {
    return (
      <View style={[ styles.container, styles.wrapper ]}>
        <View style={[ styles.container, styles.loading, styles.content ]}>
          <Text style={ styles.description }>
            { this.props.description }
          </Text>
          { this.renderActivityIndicator(styles.activityIndicator) }
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  wrapper: {
    height: 40
  },
  content: {
    height: 40
  }
});

module.exports = RefreshingIndicator;