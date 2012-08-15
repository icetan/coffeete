#!/usr/bin/env node

var coffeete = require('coffeete'),
    fs = require('fs'),
    file = process.argv[2],
    head = 'module.exports=',
    foot = ';',
    data;

function out (js) {
  process.stdout.write(head + js + foot);
}

if (file !== undefined) {
  var js = coffeete.toJavaScript(fs.readFileSync(file, 'utf-8'));
  out(js);
} else {
  data = '';
  process.stdin.resume();
  process.stdin.on('data', function (chunk) { data += chunk; });
  process.stdin.on('end', function () {
    var js = coffeete.toJavaScript(data);
    out(js);
  });
}
