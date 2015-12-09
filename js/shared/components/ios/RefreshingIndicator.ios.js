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
      <View style={ styles.container }>
        <Text style={ styles.description }>
          { this.props.description }
        </Text>
        { this.renderActivityIndicator(styles.activityIndicator) }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10
  },
  wrapper: {
    height: 40
  },
  description: {
    marginBottom: 5
  }
});

module.exports = RefreshingIndicator;
