# CoffeeTe

_Templating with CoffeeScript_

## Installation

### With NPM for Node.js

_Note: Because of incompatibility with Ender.js the dependence on CoffeeScript will not be installed automatically._

    npm install coffee-script coffeete

### Or with Ender.js for the browser

    ender build coffeete

## How

It is very simple and very little code. It uses the CoffeeScript compiler for
string interpolation. The tool chain: CoffeeTe -> CoffeeScript
-> JavaScript.

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