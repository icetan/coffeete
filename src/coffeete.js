/**
 * CoffeeTe
 * https://github.com/icetan/coffeete
 *
 * Copyright 2012, Christopher Fredén
 * Released under the MIT License
 */

(function (name, definition) {
  if (typeof module !== 'undefined') {
    var fs, coffeete = module.exports = definition();
    if (typeof require !== 'undefined') {
      // Add Node.js extensions
      if (typeof require.extensions !== 'undefined') {
        fs = require('fs');
        require.extensions['.coffeete'] = function (module, filename) {
          var content = fs.readFileSync(filename, 'utf8');
          module._compile('module.exports='+coffeete.toJavaScript(content), filename);
        };
      } else if (typeof require.registerExtension !== 'undefined') {
        // Remove when registerExtension is depricated
        require.registerExtension('.coffeete', function (content) {
          return 'module.exports='+coffeete.toJavaScript(content);
        });
      }
    }
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
    this[name] = definition();
  }
})('coffeete', function () {
  var text = (function () {
      if (typeof window !== 'undefined') {
        var div = document.createElement('div');
        return function (str) {
          div.innerHTML = str;
          return div.innerText || div.textContent;
        };
      } else {
        return function (str) {return str;};
      }
    })(),
    dotRe = /([^\w\\]|^)\.([^\w]|$)/;

  function comp(str) {
    var len = str.indexOf('\n'),
        txt = '"""'+str.slice(len)+'""" ',
        cs = text(str.slice(0,len)),
        dot = dotRe.test(cs);
    if (dot) {
      return '"""+('+cs.replace(dotRe, '$1'+txt+'$2')+')+"""';
    } else {
      return '"""+(if (_lst=('+txt+cs+')) then (if _lst.join then _lst.join(\'\') else _lst) else \'\')+"""';
    }
  }

  function parse(str) {
    var res = {},
        c = 0;
    while (true) {
      var start = str.indexOf('!{'),
          end = str.indexOf('}!'),
          open = start !== -1 && start < end,
          len = open ? start : end;
      if (start === -1 && (end === -1 || c === 0)) {
        res[c] = (res[c] ? res[c]+str : str); 
        break;
      }
      res[c] = res[c] ? res[c]+str.slice(0,len) : str.slice(0,len);
      if (open) {
        c++;
      } else {
        res[c-1] += comp(res[c]);
        delete res[c];
        c--;
      }
      str = str.slice(len+2);
    }
    return '"""'+res[0].replace(/\n/g, '\\n')+'"""';
  }

  function toJavaScriptFunction(str) {
    var cs = parse(str),
        js = coffeete.coffeeScriptCompile('return '+cs, {bare:true});
    return 'function(v){with(v||{}){'+js+'}}';
  }

  function coffeete(str) {
    var js = toJavaScriptFunction(str);
    return eval('var f='+js+';f');
  }

  coffeete.toJavaScript = toJavaScriptFunction;

  coffeete.coffeeScriptCompile = typeof CoffeeScript !== 'undefined' ?
      CoffeeScript.compile :
      (function (udef) {
        try {
          return require('coffee-script').compile;
        } catch (e) {
          return udef;
        }
      })();
  return coffeete;
});
