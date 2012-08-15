var fs = require('fs')
  , coffeete = require('./src/coffeete')
  , view = {
      name: "christopher"
    , about: "I like grapefriut."
    , hobbies: ["Computers", "Martial Arts", "Coffee"]
    , cap: function (str) {
      return str.slice(0,1).toUpperCase()+str.slice(1);
    }
  }
  , str = fs.readFileSync('about-me.chtml').toString()
  , template = coffeete(str)
  , html = template(view);

// Write to a static HTML file or serve directly over HTTP.
fs.writeFile('about-me.html', html);
