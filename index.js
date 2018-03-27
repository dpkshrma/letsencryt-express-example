const http = require('http');
const https = require('https');
const redirectHttps = require('redirect-https')
const greenlock = require('greenlock');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send("Hello World")
})

const le = greenlock.create({ server: 'staging' });

const opts = {
  domains: ['local.test.com'], email: 'dpkshrma01@gmail.com', agreeTos: true
};

le.register(opts).then(function (certs) {
  console.log(certs);
  // privkey, cert, chain, expiresAt, issuedAt, subject, altnames
}, function (err) {
  console.error(err);
});

http.createServer(le.middleware(redirectHttps())).listen(80, function() {
  console.log("Server Running On http" + 80);
});

https.createServer(le.httpsOptions, le.middleware(app)).listen(443, function() {
  console.log("Server Running On https" + 443);
});
