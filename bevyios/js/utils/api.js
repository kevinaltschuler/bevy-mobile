var urlPath = 'http://joinbevy.com/';

var api = {
    
    auth: function(email, pass) { // for logging in
	   //console.log(email, pass);
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
    }

}

module.exports = api;