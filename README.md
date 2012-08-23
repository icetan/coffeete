[![build status](https://secure.travis-ci.org/icetan/coffeete.png)](http://travis-ci.org/icetan/coffeete)
# CoffeeTe

_Templating with CoffeeScript_

## Installation

### With NPM for Node.js

_Note: Because of incompatibility with Ender.js the dependence on CoffeeScript will not be installed automatically._

    # npm install coffeete coffee-script

### Or with Ender.js for the browser

    # ender build coffeete

## How

It is very simple and very lightweight. It uses the CoffeeScript compiler for
string interpolation.

The tool chain: CoffeeTe → CoffeeScript
→ JavaScript.

## Examples

### Our template

```
<script id="about-me" type="text/x-coffeete">
  <h1>#{cap name}</h1>
  <p>
    #{about}
  </p>
  <ul>
    !{for hobby, i in hobbies
      <li class="#{if i % 2 then 'even' else 'odd'}">
        #{hobby}
      </li>
    }!
  </ul>
</script>
```

### The view data

```javascript
var view = {
      name: "christopher"
    , about: "I like grapefriut."
    , hobbies: ["Computers", "Martial Arts", "Coffee"]
    , cap: function (str) {
      return str.slice(0,1).toUpperCase()+str.slice(1);
    }
  };
```

### In the browser

```javascript
var str = document.getElementById('about-me').text
  // Compile a CoffeeTe string to a template function ready to recieve data.
  , template = coffeete(str)
  // Run our compiled template with the view data to get a ready HTML string.
  , html = template(view);

// Fill the page with our newly rendered HTML.
document.getElementsByTagName('body')[0].innerHTML += html;
```

### With Node.js

```javascript
var str = fs.readFileSync('about-me.chtml').toString()
  , template = coffeete(str)
  , html = template(view);

// Write to a static HTML file or serve directly over HTTP.
fs.writeFile('about-me.html', html);
```

Or use the ```.coffeete``` file extension to automatically compile your template.
Now importing your ```about-me.coffeete``` can be done with ```require```.

```javascript
var template = require('./about-me')
  , html = template(view);

fs.writeFile('about-me.html', html);
```

### The result

```html
<h1>Christopher</h1>
<p>
  I like grapefriut.
</p>
<ul>
  
    <li class="odd">
      Computers
    </li>
  
    <li class="even">
      Martial Arts
    </li>
  
    <li class="odd">
      Coffee
    </li>
  
</ul>
```

### Escaping nested interpolations

The only addition to the CoffeeScript interpolation syntax is ```!{``` and
```}!```, which is used to escape nested interpolations.

```
!{for key, value of obj
  <div class="#{key}">#{value}</div>
}!
```

Is the equivalent of pure CoffeeScript's

```coffeescript
"""#{("<div class=\"#{key}\">#{value}</div>" for key, value of obj).join ''}"""
```

The advantage is that you don't need to escape your quotes and you can put your
```for``` declaration at the begining of the block instead of at the end.

Default behavior is to use the text starting at the first line break after
```!{``` and everything to the matching ```}!``` and insert it before the statement
directly after ```!{```. Then joining the result with an empty string. Like the
example above.

If you want to use a block of text in an ```if``` statement or any other way, you
can use the magic ```.```. This will replace the ```.``` with whatever is in your
text block.

```
!{ . if showMoreInfo
  <p>
    Some very interesting details you might want to read about.
  </p>
}!
```

This will output the text inside the braces if ```showMoreInfo``` is truthy.

## Pre-compiling

The downside, specialy when running in the browser, is the dependency on
CoffeeScript at runtime and the need to compile your CoffeeTe templates
runtime. Therfore you can pre compile your templates into pure JavaScript and
save them as CommonJS compliant modules.

    # npm install -g coffeete coffee-script

Now we have installed the CoffeeTe CLI globaly.

    # coffeete about-me.chtml > about-me.js

Or, if you prefere.

    # cat about-me.chtml | coffeete > about-me.js
