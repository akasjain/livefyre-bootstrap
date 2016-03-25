var $ = require('jquery');
var Button = require('livefyre-bootstrap/button');
var Command = require('livefyre-bootstrap/command');
require('livefyre-bootstrap');
require('css!../../dist/styles/all.css');

$('.lf-btn').each(function (index, el) {
  var command = new Command(function () {
    console.log('command');
  });
  new Button(command, {
    el: el
  });
});
