module.exports=__NEXT_REGISTER_PAGE("/play1",function(){var e=webpackJsonp([5],{1118:function(e,t,r){"use strict";var n=r(1119);var o=r(1228);var a="function"===typeof Symbol&&"symbol"===typeof Symbol();var u=Object.prototype.toString;var i=function(e){return"function"===typeof e&&"[object Function]"===u.call(e)};var l=function(){var e={};try{Object.defineProperty(e,"x",{enumerable:false,value:e});for(var t in e)return false;return e.x===e}catch(e){return false}};var c=Object.defineProperty&&l();var f=function(e,t,r,n){if(t in e&&(!i(n)||!n()))return;c?Object.defineProperty(e,t,{configurable:true,enumerable:false,value:r,writable:true}):e[t]=r};var s=function(e,t){var r=arguments.length>2?arguments[2]:{};var u=n(t);a&&(u=u.concat(Object.getOwnPropertySymbols(t)));o(u,function(n){f(e,n,t[n],r[n])})};s.supportsDescriptors=!!c;e.exports=s},1119:function(e,t,r){"use strict";var n=Object.prototype.hasOwnProperty;var o=Object.prototype.toString;var a=Array.prototype.slice;var u=r(1227);var i=Object.prototype.propertyIsEnumerable;var l=!i.call({toString:null},"toString");var c=i.call(function(){},"prototype");var f=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];var s=function(e){var t=e.constructor;return t&&t.prototype===e};var p={$console:true,$external:true,$frame:true,$frameElement:true,$frames:true,$innerHeight:true,$innerWidth:true,$outerHeight:true,$outerWidth:true,$pageXOffset:true,$pageYOffset:true,$parent:true,$scrollLeft:true,$scrollTop:true,$scrollX:true,$scrollY:true,$self:true,$webkitIndexedDB:true,$webkitStorageInfo:true,$window:true};var v=function(){if("undefined"===typeof window)return false;for(var e in window)try{if(!p["$"+e]&&n.call(window,e)&&null!==window[e]&&"object"===typeof window[e])try{s(window[e])}catch(e){return true}}catch(e){return true}return false}();var y=function(e){if("undefined"===typeof window||!v)return s(e);try{return s(e)}catch(e){return false}};var b=function e(t){var r=null!==t&&"object"===typeof t;var a="[object Function]"===o.call(t);var i=u(t);var s=r&&"[object String]"===o.call(t);var p=[];if(!r&&!a&&!i)throw new TypeError("Object.keys called on a non-object");var v=c&&a;if(s&&t.length>0&&!n.call(t,0))for(var b=0;b<t.length;++b)p.push(String(b));if(i&&t.length>0)for(var h=0;h<t.length;++h)p.push(String(h));else for(var d in t)v&&"prototype"===d||!n.call(t,d)||p.push(String(d));if(l){var g=y(t);for(var O=0;O<f.length;++O)g&&"constructor"===f[O]||!n.call(t,f[O])||p.push(f[O])}return p};b.shim=function e(){if(Object.keys){var t=function(){return 2===(Object.keys(arguments)||"").length}(1,2);if(!t){var r=Object.keys;Object.keys=function e(t){return u(t)?r(a.call(t)):r(t)}}}else Object.keys=b;return Object.keys||b};e.exports=b},1120:function(e,t,r){"use strict";var n=r(1119);var o=r(1121);var a=function(e){return"undefined"!==typeof e&&null!==e};var u=r(1230)();var i=Object;var l=o.call(Function.call,Array.prototype.push);var c=o.call(Function.call,Object.prototype.propertyIsEnumerable);var f=u?Object.getOwnPropertySymbols:null;e.exports=function e(t,r){if(!a(t))throw new TypeError("target must be an object");var o=i(t);var s,p,v,y,b,h,d;for(s=1;s<arguments.length;++s){p=i(arguments[s]);y=n(p);var g=u&&(Object.getOwnPropertySymbols||f);if(g){b=g(p);for(v=0;v<b.length;++v){d=b[v];c(p,d)&&l(y,d)}}for(v=0;v<y.length;++v){d=y[v];h=p[d];c(p,d)&&(o[d]=h)}}return o}},1121:function(e,t,r){"use strict";var n=r(1229);e.exports=Function.prototype.bind||n},1122:function(e,t,r){"use strict";var n=r(1120);var o=function(){if(!Object.assign)return false;var e="abcdefghijklmnopqrst";var t=e.split("");var r={};for(var n=0;n<t.length;++n)r[t[n]]=t[n];var o=Object.assign({},r);var a="";for(var u in o)a+=u;return e!==a};var a=function(){if(!Object.assign||!Object.preventExtensions)return false;var e=Object.preventExtensions({1:2});try{Object.assign(e,"xy")}catch(t){return"y"===e[1]}return false};e.exports=function e(){if(!Object.assign)return n;if(o())return n;if(a())return n;return Object.assign}},1221:function(e,t,r){e.exports=r(1222)},1222:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:true});var n=r(56);var o=E(n);var a=r(1223);var u=E(a);var i=r(28);var l=E(i);var c=r(11);var f=E(c);var s=r(12);var p=E(s);var v=r(29);var y=E(v);var b=r(30);var h=E(b);var d=r(1173);var g=r(1);var O=E(g);var j=r(31);var m=E(j);var w=r(1225);var _=E(w);var S=r(55);var x=E(S);var k=r(32);function E(e){return e&&e.__esModule?e:{default:e}}var P=function(e){(0,h.default)(t,e);function t(e){var r;(0,f.default)(this,t);for(var n=arguments.length,o=Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=arguments[a];var u=(0,y.default)(this,(r=t.__proto__||(0,l.default)(t)).call.apply(r,[this,e].concat(o)));u.linkClicked=u.linkClicked.bind(u);u.formatUrls(e);return u}(0,p.default)(t,[{key:"componentWillReceiveProps",value:function e(t){this.formatUrls(t)}},{key:"linkClicked",value:function e(t){var r=this;if("A"===t.currentTarget.nodeName&&(t.metaKey||t.ctrlKey||t.shiftKey||t.nativeEvent&&2===t.nativeEvent.which))return;var n=this.props.shallow;var o=this.href,a=this.as;if(!T(o))return;var u=window.location.pathname;o=(0,d.resolve)(u,o);a=a?(0,d.resolve)(u,a):o;t.preventDefault();var i=this.props.scroll;null==i&&(i=a.indexOf("#")<0);var l=this.props.replace;var c=l?"replace":"push";x.default[c](o,a,{shallow:n}).then(function(e){if(!e)return;if(i){window.scrollTo(0,0);document.body.focus()}}).catch(function(e){r.props.onError&&r.props.onError(e)})}},{key:"prefetch",value:function e(){if(!this.props.prefetch)return;if("undefined"===typeof window)return;var t=window.location.pathname;var r=(0,d.resolve)(t,this.href);x.default.prefetch(r)}},{key:"componentDidMount",value:function e(){this.prefetch()}},{key:"componentDidUpdate",value:function e(t){(0,u.default)(this.props.href)!==(0,u.default)(t.href)&&this.prefetch()}},{key:"formatUrls",value:function e(t){this.href=t.href&&"object"===(0,o.default)(t.href)?(0,d.format)(t.href):t.href;this.as=t.as&&"object"===(0,o.default)(t.as)?(0,d.format)(t.as):t.as}},{key:"render",value:function e(){var t=this.props.children;var r=this.href,n=this.as;"string"===typeof t&&(t=O.default.createElement("a",null,t));var o=g.Children.only(t);var a={onClick:this.linkClicked};!this.props.passHref&&("a"!==o.type||"href"in o.props)||(a.href=n||r);a.href&&"undefined"!==typeof __NEXT_DATA__&&__NEXT_DATA__.nextExport&&(a.href=(0,S._rewriteUrlForNextExport)(a.href));return O.default.cloneElement(o,a)}}]);return t}(g.Component);P.propTypes=(0,_.default)({href:m.default.oneOfType([m.default.string,m.default.object]).isRequired,as:m.default.oneOfType([m.default.string,m.default.object]),prefetch:m.default.bool,replace:m.default.bool,shallow:m.default.bool,passHref:m.default.bool,scroll:m.default.bool,children:m.default.oneOfType([m.default.element,function(e,t){var r=e[t];"string"===typeof r&&$("Warning: You're using a string directly inside <Link>. This usage has been deprecated. Please add an <a> tag as child of <Link>");return null}]).isRequired});t.default=P;function T(e){var t=(0,d.parse)(e,false,true);var r=(0,d.parse)((0,k.getLocationOrigin)(),false,true);return!t.host||t.protocol===r.protocol&&t.host===r.host}var $=(0,k.execOnce)(k.warn)},1223:function(e,t,r){e.exports={default:r(1224),__esModule:true}},1224:function(e,t,r){var n=r(4);var o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function e(t){return o.stringify.apply(o,arguments)}},1225:function(e,t,r){Object.defineProperty(t,"__esModule",{value:true});t["default"]=h;var n=r(1226);var o=c(n);var a=r(1232);var u=c(a);var i=r(1233);var l=c(i);function c(e){return e&&e.__esModule?e:{default:e}}function f(e,t,r){t in e?Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true}):e[t]=r;return e}var s="​";var p="prop-types-exact: "+s;var v={};function y(e){return(0,o["default"])(e,f({},p,v))}function b(e){return e&&e[p]===v}function h(e){if(!(0,l["default"])(e))throw new TypeError("given propTypes must be an object");if((0,u["default"])(e,p)&&!b(e[p]))throw new TypeError("Against all odds, you created a propType for a prop that uses both the zero-width space and our custom string - which, sadly, conflicts with `prop-types-exact`");return(0,o["default"])({},e,f({},p,y(function(){function t(t,r,n){var o=Object.keys(t).filter(function(t){return!(0,u["default"])(e,t)});if(o.length>0)return new TypeError(String(n)+": unknown props found: "+String(o.join(", ")));return null}return t}())))}e.exports=t["default"]},1226:function(e,t,r){"use strict";var n=r(1118);var o=r(1120);var a=r(1122);var u=r(1231);var i=a();n(i,{getPolyfill:a,implementation:o,shim:u});e.exports=i},1227:function(e,t,r){"use strict";var n=Object.prototype.toString;e.exports=function e(t){var r=n.call(t);var o="[object Arguments]"===r;o||(o="[object Array]"!==r&&null!==t&&"object"===typeof t&&"number"===typeof t.length&&t.length>=0&&"[object Function]"===n.call(t.callee));return o}},1228:function(e,t){var r=Object.prototype.hasOwnProperty;var n=Object.prototype.toString;e.exports=function e(t,o,a){if("[object Function]"!==n.call(o))throw new TypeError("iterator must be a function");var u=t.length;if(u===+u)for(var i=0;i<u;i++)o.call(a,t[i],i,t);else for(var l in t)r.call(t,l)&&o.call(a,t[l],l,t)}},1229:function(e,t,r){"use strict";var n="Function.prototype.bind called on incompatible ";var o=Array.prototype.slice;var a=Object.prototype.toString;var u="[object Function]";e.exports=function e(t){var r=this;if("function"!==typeof r||a.call(r)!==u)throw new TypeError(n+r);var i=o.call(arguments,1);var l;var c=function(){if(this instanceof l){var e=r.apply(this,i.concat(o.call(arguments)));if(Object(e)===e)return e;return this}return r.apply(t,i.concat(o.call(arguments)))};var f=Math.max(0,r.length-i.length);var s=[];for(var p=0;p<f;p++)s.push("$"+p);l=Function("binder","return function ("+s.join(",")+"){ return binder.apply(this,arguments); }")(c);if(r.prototype){var v=function e(){};v.prototype=r.prototype;l.prototype=new v;v.prototype=null}return l}},1230:function(e,t,r){"use strict";e.exports=function e(){if("function"!==typeof Symbol||"function"!==typeof Object.getOwnPropertySymbols)return false;if("symbol"===typeof Symbol.iterator)return true;var t={};var r=Symbol("test");var n=Object(r);if("string"===typeof r)return false;if("[object Symbol]"!==Object.prototype.toString.call(r))return false;if("[object Symbol]"!==Object.prototype.toString.call(n))return false;var o=42;t[r]=o;for(r in t)return false;if("function"===typeof Object.keys&&0!==Object.keys(t).length)return false;if("function"===typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(t).length)return false;var a=Object.getOwnPropertySymbols(t);if(1!==a.length||a[0]!==r)return false;if(!Object.prototype.propertyIsEnumerable.call(t,r))return false;if("function"===typeof Object.getOwnPropertyDescriptor){var u=Object.getOwnPropertyDescriptor(t,r);if(u.value!==o||true!==u.enumerable)return false}return true}},1231:function(e,t,r){"use strict";var n=r(1118);var o=r(1122);e.exports=function e(){var t=o();n(Object,{assign:t},{assign:function(){return Object.assign!==t}});return t}},1232:function(e,t,r){var n=r(1121);e.exports=n.call(Function.call,Object.prototype.hasOwnProperty)},1233:function(e,t){Object.defineProperty(t,"__esModule",{value:true});var r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t["default"]=n;function n(e){return e&&"object"===("undefined"===typeof e?"undefined":r(e))&&!Array.isArray(e)}e.exports=t["default"]},1866:function(e,t,r){e.exports=r(1867)},1867:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:true});var n=r(1);var o=r.n(n);var a=r(1221);var u=r.n(a);var i="/Users/guillermo/Docs/Docs.Prog/JavaScript/giu/packages/giu-examples/pages/play1.js";var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;"value"in n&&(n.writable=true);Object.defineProperty(e,n.key,n)}}return function(t,r,n){r&&e(t.prototype,r);n&&e(t,n);return t}}();function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function s(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}});t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var p=function(e){s(t,e);function t(){c(this,t);return f(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}l(t,[{key:"render",value:function e(){return o.a.createElement("div",{__source:{fileName:i,lineNumber:10}},o.a.createElement(u.a,{href:"/play2",__source:{fileName:i,lineNumber:11}},o.a.createElement("a",{__source:{fileName:i,lineNumber:12}},"Play2")))}}]);return t}(o.a.Component);t["default"]=p}},[1866]);return{page:e.default}});