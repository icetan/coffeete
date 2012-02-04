/**
 * CoffeeTe
 * https://github.com/icetan/coffeete
 *
 * Copyright 2012, Christopher Fredén
 * Released under the MIT License
 */

!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('coffeete', function () {
  var coffeescript = (function () {
    })()
    , text = (function () {
      if (typeof window !== 'undefined') {
        var div = document.createElement('div');
        return function (str) {
          div.innerHTML = str;
          return div.innerText || div.textContent;
        };
      } else {
        return function (str) {return str;};
      }
    })()
    , dotRe = /([^\w\\]|^)\.([^\w]|$)/;

  function comp(str) {
    var len = str.indexOf('\n')
      , txt = '"""'+str.slice(len+1)+'""" '
      , cs = text(str.slice(0,len))
      , dot = dotRe.test(cs);
    if (dot) {
      return '"""+('+cs.replace(dotRe, '$1'+txt+'$2')+')+"""';
    } else {
      return '"""+('+txt+cs+').join(\'\')+"""';
    }
  }

  function parse(str) {
    var res = {}
      , c = 0;
    while (true) {
      var start = str.indexOf('!{')
        , end = str.indexOf('}!')
        , open = start !== -1 && start < end
        , len = open ? start : end;
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
    return '"""'+res[0]+'"""';
  }

  function coffeete(str) {
    var cs = parse(str)
      , js = coffeete.coffeeScriptCompile('return '+cs);
    return eval('var f=function(v){with(v){return '+js+'}};f');
  }

  coffeete.coffeeScriptCompile = typeof CoffeeScript !== 'undefined'
    ? CoffeeScript.compile
    : (function (udef) {
        try {
          return require('coffee-script').compile;
        } catch (e) {
          return udef;
        }
      })();
  return coffeete;
});
