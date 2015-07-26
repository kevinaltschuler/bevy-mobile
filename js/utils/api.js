var React = require('react-native');
var {
  AsyncStorage
} = React;

var urlPath = 'http://joinbevy.com/';
var constants = require('./../constants.js');

var api = {
    
    auth: function(email, pass) { // for logging in
      return fetch('http://joinbevy.com/login',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: email,
              password: pass
          })
        })
        // on fetch
        .then((res) =>  (res.json()));
    },

    storeUser: function(user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
      constants.setUser(user);
    },

    forgotPass: function(email) {
      return fetch(('http://joinbevy.com/forgot'),
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                  email: email
          })
        })
        .then((res) => res.json());
    },

    register: function(email, pass, picture){
      return fetch(('http://api.joinbevy.com/users'),
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                  email: email,
                  password: pass
                  
          })
        })
        .then((res) => res.json());

    },

    getBevies: function(user) {

      var url = 'http://api.joinbevy.com/users/' + user._id + '/bevies';

      return fetch((url),
      {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/javascript'
        },
      })
      .then((res) => res.json());
    },

    getNotifications: function(user) {

      var url = 'http://api.joinbevy.com/users/' + user._id + '/notifications';

      fetch((url),
      {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/javascript',
          'Accept-Encoding': 'gzip, deflate, sdch',
          'Cache-Control': 'max-age=0',
          'Connection': 'keep-alive',
          'DNT': '1'
        },
      })
      .then((res) => console.log(res))
      .then((data) => console.log(data))
      .catch((error) => console.log('error', error))
      .done();
    }

}
module.exports = api;

