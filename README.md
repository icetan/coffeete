# CoffeeTe

_Templating with CoffeeScript_

## How

It is very simple and very little code. It uses the CoffeeScript compiler for
string interpolation. The tool chain: CoffeeTe -> CoffeeScript
-> JavaScript.

## Examples

### Our template
```html
<script id="about-me" type="text/x-coffeete">
  <h1>#{name}</h1>
  <p>
    #{markdown about}
  </p>
  <ul>
    !{for hobby in hobbies
      <li class="#{if _i%2 then 'even' else 'odd'}">
        #{hobby}
      </li>
    }!
  </ul>
</script>
```

### The view data
```javascript
var view = {
      name: "Christopher"
    , about: ""
    , hobbies: ["Computers", "Martial Arts", "Coffee"]
  };
```

### In the browser
```javascript
var str = document.getElementById('about-me')
  // Compile a CoffeeTe string to a template function ready to recieve data.
  , template = coffeete(str)
  // Run our compiled template with the view data to get a ready HTML string.
  , html = template(view);

// Fill the page with our newly rendered HTML.
document.getElementsByTagName('body')[0].innerHTML += html;
```

### With Node.js
```javascript
var str = fs.readFileSync('about-me.chtml')
  , template = coffeete(str)
  , html = template(view);

// Write to a static HTML file or serve directly over HTTP.
fs.writeFile('about-me.html');
```
