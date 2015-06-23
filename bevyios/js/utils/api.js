var urlPath = 'http://joinbevy.com/';
var constants = require('./constants.js');

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
        .then((res) =>  res.json());
    },

    storeUser: function(user) {
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
      return fetch(('api.joinbevy.com/users'),
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

      var url = 'api.joinbevy.com/users/' + user._id + '/bevies';

      fetch((url),
      {
        method: 'get'
      })
      .then((res) => console.log(res))
      .then((data) => console.log(data))
      .catch((error) => console.log('error', error))
      .done();
    }

}
module.exports = api;
