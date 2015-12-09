/**
 * Icon.android.js
 * @author albert
 * taken from https://github.com/oblador/react-native-vector-icons/issues/63
 */

'use strict';

var React = require('react-native');

var MaterialIcon = require('react-native-vector-icons/MaterialIcons');

class Icon extends React.Component {
  render() {
    var props = Object.assign({}, this.props);
    props.style = [{
      lineHeight: props.size + Math.floor((props.size / 10) * 9)
    }, props.style];
    return (<MaterialIcon {...props} />);
  }
}

Icon.defaultProps = {
  style: {},
  allowFontScaling: false
};

module.exports = Icon;