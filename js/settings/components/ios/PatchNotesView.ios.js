/**
 * PatchNotesView.ios.js
 *
 * View patch notes for the app
 * Real simple
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var constants = require('./../../../constants');
var patchNotes = require('./../../../settings/patchNotes').ios;

var PatchNotesView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var notes = patchNotes;
    // expand the latest version
    notes[0].expanded = true;
    return {
      ds: ds.cloneWithRows(notes)
    };
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  renderRow(note) {
    return (
      <PatchNoteItem
        key={ 'patchnote:' + note.version }
        note={ note }
        expanded={ (note.expanded == undefined) ? false : note.expanded }
      />
    );
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
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              Patch Notes
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <ListView
          ref={ ref => { this.ListView = ref; }}
          style={ styles.listView }
          contentContainerStyle={ styles.listViewInner }
          dataSource={ this.state.ds }
          automaticallyAdjustContentInsets={ false }
          renderRow={ this.renderRow }
        />
      </View>
    );
  }
});

var PatchNoteItem = React.createClass({
  propTypes: {
    note: React.PropTypes.object,
    expanded: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      expanded: false
    };
  },

  getInitialState() {
    return {
      expanded: this.props.expanded
    };
  },

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    });
  },

  renderBodyItems(section) {
    var bodyItems = [];
    for(var key in section.bodyItems) {
      var bodyItem = section.bodyItems[key];
      bodyItems.push(
        <Text
          key={ this.props.note.version + ':' + section.header + ':' + key }
          style={ styles.sectionBodyItem }
          numberOfLines={ 3 }
        >
          · { bodyItem }
        </Text>
      );
    }
    return bodyItems;
  },

  renderSections() {
    var sections = [];
    for(var key in this.props.note.sections) {
      var section = this.props.note.sections[key];
      sections.push(
        <View
          key={ this.props.note.version + ':' + section.header }
          style={ styles.section }
        >
          <Text
            style={ styles.sectionHeader }
            numberOfLines={ 1 }
          >
            { section.header }
          </Text>
          { this.renderBodyItems(section) }
        </View>
      );
    }
    return sections;
  },

  render() {
    return (
      <View style={ styles.noteItem }>
        <TouchableOpacity
          onPress={ this.toggleExpanded }
          activeOpacity={ 0.5 }
        >
          <View style={ styles.noteHeader }>
            <Icon
              name='flag'
              size={ 30 }
              color='#AAA'
            />
            <Text style={ styles.noteVersion }>
              Version { this.props.note.version }
            </Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={ !this.state.expanded }>
          { this.renderSections() }
        </Collapsible>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
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
  listView: {
    flex: 1,
  },
  listViewInner: {
    paddingBottom: 15
  },
  noteItem: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'column'
  },
  noteHeader: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  noteVersion: {
    fontSize: 17,
    color: '#282828',
    marginLeft: 10
  },
  section: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginTop: 6
  },
  sectionHeader: {
    color: '#444',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6
  },
  sectionBodyItem: {
    color: '#666',
    fontSize: 14
  }
});

module.exports = PatchNotesView;
