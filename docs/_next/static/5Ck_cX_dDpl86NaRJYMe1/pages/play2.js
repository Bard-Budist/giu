(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{4358:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/play2",function(){var e=n("If66");return{page:e.default||e}}])},AwPv:function(e,t,n){var r=n("IFjL");r(r.P+r.R,"Map",{toJSON:n("KIy9")("Map")})},EfDG:function(e,t,n){"use strict";var r=n("zCrM"),o=n("S5Zg");e.exports=n("HKkr")("Map",function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},{get:function(e){var t=r.getEntry(o(this,"Map"),e);return t&&t.v},set:function(e,t){return r.def(o(this,"Map"),0===e?0:e,t)}},r,!0)},"F//K":function(e,t,n){n("dUHx"),n("/r3m"),n("Fk9O"),n("EfDG"),n("AwPv"),n("SZul"),n("Lwwr"),e.exports=n("rFq9").Map},If66:function(e,t,n){"use strict";n.r(t);var r=n("h7sq"),o=n("tS02"),a=n("/XES"),i=n("ztBH"),s=n("Fayl"),u=n("ERkP"),f=n.n(u),l=n("jvFD"),p=n.n(l),c=(n("/cM3"),n("STD2"),"/Users/guillermo/Docs/Docs.Prog/JavaScript/giu/packages/giu-examples/pages/play2.js"),h=function(e){function t(){return Object(r.default)(this,t),Object(a.default)(this,Object(i.default)(t).apply(this,arguments))}return Object(s.default)(t,e),Object(o.default)(t,[{key:"render",value:function(){return f.a.createElement("div",{__source:{fileName:c,lineNumber:12},__self:this},f.a.createElement(p.a,{href:"/play1",__source:{fileName:c,lineNumber:13},__self:this},f.a.createElement("a",{__source:{fileName:c,lineNumber:14},__self:this},"Play1")))}}]),t}(f.a.Component);t.default=h},JeHL:function(e,t,n){e.exports=n("F//K")},KeDb:function(e,t,n){"use strict";var r=n("lpv4"),o=r(n("h7sq")),a=r(n("tS02")),i=r(n("/XES")),s=r(n("ztBH")),u=r(n("Fayl")),f=n("5Tpg"),l=n("lpv4");t.__esModule=!0,t.default=void 0;var p,c=l(n("JeHL")),h=n("EfWO"),d=f(n("ERkP")),v=(l(n("aWzz")),l(n("7xIC"))),_=n("IBMh"),w=n("kMDi");function m(e){return e&&"object"===typeof e?(0,w.formatWithValidation)(e):e}var y=new c.default,g=window.IntersectionObserver;function E(){return p||(g?p=new g(function(e){e.forEach(function(e){if(y.has(e.target)){var t=y.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(p.unobserve(e.target),y.delete(e.target),t())}})},{rootMargin:"200px"}):void 0)}var k=function(e){function t(){var e;return(0,o.default)(this,t),(e=(0,i.default)(this,(0,s.default)(t).apply(this,arguments))).cleanUpListeners=function(){},e.formatUrls=function(e){var t=null,n=null,r=null;return function(o,a){if(r&&o===t&&a===n)return r;var i=e(o,a);return t=o,n=a,r=i,i}}(function(e,t){return{href:m(e),as:t?m(t):t}}),e.linkClicked=function(t){var n=t.currentTarget,r=n.nodeName,o=n.target;if("A"!==r||!(o&&"_self"!==o||t.metaKey||t.ctrlKey||t.shiftKey||t.nativeEvent&&2===t.nativeEvent.which)){var a=e.formatUrls(e.props.href,e.props.as),i=a.href,s=a.as;if(function(e){var t=(0,h.parse)(e,!1,!0),n=(0,h.parse)((0,w.getLocationOrigin)(),!1,!0);return!t.host||t.protocol===n.protocol&&t.host===n.host}(i)){var u=window.location.pathname;i=(0,h.resolve)(u,i),s=s?(0,h.resolve)(u,s):i,t.preventDefault();var f=e.props.scroll;null==f&&(f=s.indexOf("#")<0),v.default[e.props.replace?"replace":"push"](i,s,{shallow:e.props.shallow}).then(function(e){e&&f&&(window.scrollTo(0,0),document.body.focus())})}}},e}return(0,u.default)(t,e),(0,a.default)(t,[{key:"componentWillUnmount",value:function(){this.cleanUpListeners()}},{key:"handleRef",value:function(e){var t=this;this.props.prefetch&&g&&e&&e.tagName&&(this.cleanUpListeners(),this.cleanUpListeners=function(e,t){var n=E();return n?(n.observe(e),y.set(e,t),function(){n.unobserve(e),y.delete(e)}):function(){}}(e,function(){t.prefetch()}))}},{key:"prefetch",value:function(){if(this.props.prefetch){var e=window.location.pathname,t=this.formatUrls(this.props.href,this.props.as).href,n=(0,h.resolve)(e,t);v.default.prefetch(n)}}},{key:"render",value:function(){var e=this,t=this.props.children,n=this.formatUrls(this.props.href,this.props.as),r=n.href,o=n.as;"string"===typeof t&&(t=d.default.createElement("a",null,t));var a=d.Children.only(t),i={ref:function(t){return e.handleRef(t)},onMouseEnter:function(t){a.props&&"function"===typeof a.props.onMouseEnter&&a.props.onMouseEnter(t),e.prefetch()},onClick:function(t){a.props&&"function"===typeof a.props.onClick&&a.props.onClick(t),t.defaultPrevented||e.linkClicked(t)}};return!this.props.passHref&&("a"!==a.type||"href"in a.props)||(i.href=o||r),i.href&&"undefined"!==typeof __NEXT_DATA__&&__NEXT_DATA__.nextExport&&(i.href=(0,_.rewriteUrlForNextExport)(i.href)),d.default.cloneElement(a,i)}}]),t}(d.Component);k.propTypes=void 0,k.defaultProps={prefetch:!0};var b=k;t.default=b},Lwwr:function(e,t,n){n("zjhQ")("Map")},SZul:function(e,t,n){n("iaOj")("Map")},jvFD:function(e,t,n){e.exports=n("KeDb")}},[["4358",1,0]]]);