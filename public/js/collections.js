(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/collections"],{

/***/ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_masonry_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-masonry-css */ "./node_modules/_vue-masonry-css@1.0.3@vue-masonry-css/dist/vue-masonry.es2015.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

Vue.use(vue_masonry_css__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['collection-id', 'collection-title', 'collection-description', 'collection-visibility', 'profile-id', 'profile-username'],
  data: function data() {
    return {
      loaded: false,
      posts: [],
      currentUser: false,
      owner: false,
      title: this.collectionTitle,
      description: this.collectionDescription,
      visibility: this.collectionVisibility,
      photoId: ''
    };
  },
  beforeMount: function beforeMount() {
    this.fetchCurrentUser();
    this.fetchItems();
  },
  mounted: function mounted() {},
  methods: {
    fetchCurrentUser: function fetchCurrentUser() {
      var _this = this;

      if (document.querySelectorAll('body')[0].classList.contains('loggedIn') == true) {
        axios.get('/api/pixelfed/v1/accounts/verify_credentials').then(function (res) {
          _this.currentUser = res.data;
          _this.owner = _this.currentUser.id == _this.profileId;
        });
      }
    },
    fetchItems: function fetchItems() {
      var _this2 = this;

      axios.get('/api/local/collection/items/' + this.collectionId).then(function (res) {
        _this2.posts = res.data;
        _this2.loaded = true;
      });
    },
    previewUrl: function previewUrl(status) {
      return status.sensitive ? '/storage/no-preview.png?v=' + new Date().getTime() : status.media_attachments[0].preview_url;
    },
    previewBackground: function previewBackground(status) {
      var preview = this.previewUrl(status);
      return 'background-image: url(' + preview + ');';
    },
    addToCollection: function addToCollection() {
      this.$refs.addPhotoModal.show();
    },
    pushId: function pushId() {
      var _this3 = this;

      var max = 18;

      if (this.posts.length >= max) {
        swal('Error', 'You can only add ' + max + ' posts per collection', 'error');
        return;
      }

      var url = this.photoId;
      var origin = window.location.origin;
      var split = url.split('/');

      if (url.slice(0, origin.length) !== origin) {
        swal('Invalid URL', 'You can only add posts from this instance', 'error');
        this.photoId = '';
      }

      if (url.slice(0, origin.length + 3) !== origin + '/p/' || split.length !== 6) {
        swal('Invalid URL', 'Invalid URL', 'error');
        this.photoId = '';
      }

      axios.post('/api/local/collection/item', {
        collection_id: this.collectionId,
        post_id: split[5]
      }).then(function (res) {
        location.reload();
      })["catch"](function (err) {
        swal('Invalid URL', 'The post you entered was invalid', 'error');
        _this3.photoId = '';
      });
    },
    editCollection: function editCollection() {
      this.$refs.editModal.show();
    },
    deleteCollection: function deleteCollection() {
      if (this.owner == false) {
        return;
      }

      var confirmed = window.confirm('Are you sure you want to delete this collection?');

      if (confirmed) {
        axios["delete"]('/api/local/collection/' + this.collectionId).then(function (res) {
          window.location.href = '/';
        });
      } else {
        return;
      }
    },
    updateCollection: function updateCollection() {
      this.$refs.editModal.hide();
      axios.post('/api/local/collection/' + this.collectionId, {
        title: this.title,
        description: this.description,
        visibility: this.visibility
      }).then(function (res) {
        console.log(res.data);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_css-loader@1.0.1@css-loader??ref--9-1!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js */ "./node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.dims[data-v-74b829d0] {\n\tposition: absolute;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tbackground: rgba(0,0,0,.68);\n\tz-index: 300;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js":
/*!*******************************************************************!*\
  !*** ./node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/_style-loader@0.23.1@style-loader/index.js!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_style-loader@0.23.1@style-loader!./node_modules/_css-loader@1.0.1@css-loader??ref--9-1!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/_css-loader@1.0.1@css-loader??ref--9-1!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& */ "./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js */ "./node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_style-loader@0.23.1@style-loader/lib/addStyles.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/_style-loader@0.23.1@style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/_style-loader@0.23.1@style-loader/lib/urls.js":
/*!********************************************************************!*\
  !*** ./node_modules/_style-loader@0.23.1@style-loader/lib/urls.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "w-100 h-100" },
    [
      !_vm.loaded
        ? _c(
            "div",
            {
              staticClass: "d-flex justify-content-center align-items-center",
              staticStyle: { height: "80vh" }
            },
            [_c("img", { attrs: { src: "/img/pixelfed-icon-grey.svg" } })]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.loaded
        ? _c("div", { staticClass: "row mt-3" }, [
            _c("div", { staticClass: "col-12 p-0 mb-3" }, [
              _c(
                "picture",
                {
                  staticClass:
                    "d-flex align-items-center justify-content-center"
                },
                [
                  _c("div", { staticClass: "dims" }),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "text-white",
                      staticStyle: { "z-index": "500", position: "absolute" }
                    },
                    [
                      _c("p", { staticClass: "display-4 text-center pt-3" }, [
                        _vm._v(_vm._s(_vm.title || "Untitled Collection"))
                      ]),
                      _vm._v(" "),
                      _c("p", { staticClass: "lead text-center mb-3" }, [
                        _vm._v(_vm._s(_vm.description))
                      ]),
                      _vm._v(" "),
                      _c("p", { staticClass: "text-center" }, [
                        _vm._v(
                          "\n\t\t\t\t\t\t" +
                            _vm._s(_vm.posts.length) +
                            " photos · by "
                        ),
                        _c(
                          "a",
                          {
                            staticClass: "font-weight-bold text-white",
                            attrs: { href: "/" + _vm.profileUsername }
                          },
                          [_vm._v(_vm._s(_vm.profileUsername))]
                        )
                      ]),
                      _vm._v(" "),
                      _vm.owner == true
                        ? _c("p", { staticClass: "pt-3 text-center" }, [
                            _c("span", [
                              _c(
                                "button",
                                {
                                  staticClass: "btn btn-outline-light btn-sm",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.addToCollection($event)
                                    }
                                  }
                                },
                                [_vm._v("Add Photo")]
                              ),
                              _vm._v("\n\t\t\t\t\t\t\t     \n\t\t\t\t\t\t\t"),
                              _c(
                                "button",
                                {
                                  staticClass: "btn btn-outline-light btn-sm",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.editCollection($event)
                                    }
                                  }
                                },
                                [_vm._v("Edit")]
                              ),
                              _vm._v("\n\t\t\t\t\t\t\t     \n\t\t\t\t\t\t\t"),
                              _c(
                                "button",
                                {
                                  staticClass: "btn btn-outline-light btn-sm",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.deleteCollection($event)
                                    }
                                  }
                                },
                                [_vm._v("Delete")]
                              )
                            ])
                          ])
                        : _vm._e()
                    ]
                  ),
                  _vm._v(" "),
                  _c("img", {
                    staticStyle: {
                      width: "100%",
                      height: "600px",
                      "object-fit": "cover"
                    },
                    attrs: { src: _vm.previewUrl(_vm.posts[0]), alt: "" }
                  })
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "col-12 p-0" },
              [
                _c(
                  "masonry",
                  {
                    attrs: {
                      cols: { default: 2, 700: 2, 400: 1 },
                      gutter: { default: "5px" }
                    }
                  },
                  _vm._l(_vm.posts, function(s, index) {
                    return _c("div", [
                      _c(
                        "a",
                        {
                          staticClass:
                            "card info-overlay card-md-border-0 mb-1",
                          attrs: { href: s.url }
                        },
                        [
                          _c("img", {
                            staticClass: "img-fluid w-100",
                            attrs: { src: _vm.previewUrl(s) }
                          })
                        ]
                      )
                    ])
                  }),
                  0
                )
              ],
              1
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          ref: "editModal",
          attrs: {
            id: "edit-modal",
            "hide-footer": "",
            centered: "",
            title: "Edit Collection",
            "body-class": ""
          }
        },
        [
          _c("form", [
            _c("div", { staticClass: "form-group" }, [
              _c(
                "label",
                {
                  staticClass: "font-weight-bold text-muted",
                  attrs: { for: "title" }
                },
                [_vm._v("Title")]
              ),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.title,
                    expression: "title"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  id: "title",
                  placeholder: "Untitled Collection"
                },
                domProps: { value: _vm.title },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.title = $event.target.value
                  }
                }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c(
                "label",
                {
                  staticClass: "font-weight-bold text-muted",
                  attrs: { for: "description" }
                },
                [_vm._v("Description")]
              ),
              _vm._v(" "),
              _c("textarea", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.description,
                    expression: "description"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  id: "description",
                  placeholder: "Add a description here ...",
                  rows: "3"
                },
                domProps: { value: _vm.description },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.description = $event.target.value
                  }
                }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c(
                "label",
                {
                  staticClass: "font-weight-bold text-muted",
                  attrs: { for: "visibility" }
                },
                [_vm._v("Visibility")]
              ),
              _vm._v(" "),
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.visibility,
                      expression: "visibility"
                    }
                  ],
                  staticClass: "custom-select",
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.visibility = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0]
                    }
                  }
                },
                [
                  _c("option", { attrs: { value: "public" } }, [
                    _vm._v("Public")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "private" } }, [
                    _vm._v("Followers Only")
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass:
                  "btn btn-primary btn-sm py-1 font-weight-bold px-3 float-right",
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.updateCollection($event)
                  }
                }
              },
              [_vm._v("Save")]
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          ref: "addPhotoModal",
          attrs: {
            id: "add-photo-modal",
            "hide-footer": "",
            centered: "",
            title: "Add Photo",
            "body-class": ""
          }
        },
        [
          _c("form", [
            _c("div", { staticClass: "form-group" }, [
              _c(
                "label",
                {
                  staticClass: "font-weight-bold text-muted",
                  attrs: { for: "title" }
                },
                [_vm._v("Add Post by URL")]
              ),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.photoId,
                    expression: "photoId"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  placeholder: "https://pixelfed.dev/p/admin/1"
                },
                domProps: { value: _vm.photoId },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.photoId = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("p", { staticClass: "help-text small text-muted" }, [
                _vm._v("Only local, public posts can be added")
              ])
            ]),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass:
                  "btn btn-primary btn-sm py-1 font-weight-bold px-3 float-right",
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.pushId($event)
                  }
                }
              },
              [_vm._v("Add Photo")]
            )
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/_vue-masonry-css@1.0.3@vue-masonry-css/dist/vue-masonry.es2015.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/_vue-masonry-css@1.0.3@vue-masonry-css/dist/vue-masonry.es2015.js ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*!
 * vue-masonry-css v1.0.3
 * https://github.com/paulcollett/vue-masonry-css
 * Released under the MIT License.
 */

// the component name `<masonry />`
// can be overridden with `Vue.use(Masonry, { name: 'the-masonry' });`
var componentName = 'masonry';

var props = {
  tag: {
    type: [String],
    default: 'div'
  },
  cols: {
    type: [Object, Number, String],
    default: 2
  },
  gutter: {
    type: [Object, Number, String],
    default: 0
  },
  css: {
    type: [Boolean],
    default: true
  },
  columnTag: {
    type: [String],
    default: 'div'
  },
  columnClass: {
    type: [String, Array, Object],
    default: function () { return []; }
  },
  columnAttr: {
    type: [Object],
    default: function () { return ({}); }
  }
};

// Get the resulting value from  `:col=` prop
// based on the window width
var breakpointValue = function (mixed, windowWidth) {
  var valueAsNum = parseInt(mixed);

  if(valueAsNum > -1) {
    return mixed;
  }else if(typeof mixed !== 'object') {
    return 0;
  }

  var matchedBreakpoint = Infinity;
  var matchedValue = mixed.default || 0;

  for(var k in mixed) {
    var breakpoint = parseInt(k);
    var breakpointValRaw = mixed[breakpoint];
    var breakpointVal = parseInt(breakpointValRaw);

    if(isNaN(breakpoint) || isNaN(breakpointVal)) {
      continue;
    }

    var isNewBreakpoint = windowWidth <= breakpoint && breakpoint < matchedBreakpoint;

    if(isNewBreakpoint) {
      matchedBreakpoint = breakpoint;
      matchedValue = breakpointValRaw;
    }
  }

  return matchedValue;
};

var component = {
  props: props,

  data: function data() {
    return {
      displayColumns: 2,
      displayGutter: 0
    }
  },

  mounted: function mounted() {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.reCalculate();
    });

    // Bind resize handler to page
    if(window) {
      window.addEventListener('resize', this.reCalculate);
    }
  },

  updated: function updated() {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.reCalculate();
    });
  },

  beforeDestroy: function beforeDestroy() {
    if(window) {
      window.removeEventListener('resize', this.reCalculate);
    }
  },

  methods: {
    // Recalculate how many columns to display based on window width
    // and the value of the passed `:cols=` prop
    reCalculate: function reCalculate() {
      var previousWindowWidth = this.windowWidth;

      this.windowWidth = (window ? window.innerWidth : null) || Infinity;

      // Window resize events get triggered on page height
      // change which when loading the page can result in multiple
      // needless calculations. We prevent this here.
      if(previousWindowWidth === this.windowWidth) {
        return;
      }

      this._reCalculateColumnCount(this.windowWidth);

      this._reCalculateGutterSize(this.windowWidth);
    },

    _reCalculateGutterSize: function _reCalculateGutterSize(windowWidth) {
      this.displayGutter = breakpointValue(this.gutter, windowWidth);
    },

    _reCalculateColumnCount: function _reCalculateColumnCount(windowWidth) {
      var newColumns = breakpointValue(this.cols, windowWidth);

      // Make sure we can return a valid value
      newColumns = Math.max(1, Number(newColumns) || 0);

      this.displayColumns = newColumns;
    },

    _getChildItemsInColumnsArray: function _getChildItemsInColumnsArray() {
      var this$1 = this;

      var columns = [];
      var childItems = this.$slots.default || [];

      // This component does not work with a child <transition-group /> ..yet,
      // so for now we think it may be helpful to ignore until we can find a way for support
      if(childItems.length === 1 && childItems[0].componentOptions && childItems[0].componentOptions.tag == 'transition-group') {
        childItems = childItems[0].componentOptions.children;
      }

      // Loop through child elements
      for (var i = 0, visibleItemI = 0; i < childItems.length; i++, visibleItemI++) {
        // skip Vue elements without tags, which includes
        // whitespace elements and also plain text
        if(!childItems[i].tag) {
          visibleItemI--;

          continue;
        }

        // Get the column index the child item will end up in
        var columnIndex = visibleItemI % this$1.displayColumns;

        if(!columns[columnIndex]) {
          columns[columnIndex] = [];
        }

        columns[columnIndex].push(childItems[i]);
      }

      return columns;
    }
  },

  render: function render(createElement) {
    var this$1 = this;

    var columnsContainingChildren = this._getChildItemsInColumnsArray();
    var isGutterSizeUnitless = parseInt(this.displayGutter) === this.displayGutter * 1;
    var gutterSizeWithUnit =  isGutterSizeUnitless ? ((this.displayGutter) + "px") : this.displayGutter;

    var columnStyle = {
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
      width: ((100 / this.displayColumns) + "%"),
      border: '0 solid transparent',
      borderLeftWidth: gutterSizeWithUnit
    };

    var columns = columnsContainingChildren.map(function (children, index) {
      /// Create column element and inject the children
      return createElement(this$1.columnTag, {
        key: index + '-' + columnsContainingChildren.length,
        style: this$1.css ? columnStyle : null,
        class: this$1.columnClass,
        attrs: this$1.columnAttr
      }, children); // specify child items here
    });

    var containerStyle = {
      display: ['-webkit-box', '-ms-flexbox', 'flex'],
      marginLeft: ("-" + gutterSizeWithUnit)
    };

    // Return wrapper with columns
    return createElement(
      this.tag, // tag name
      this.css ? { style: containerStyle } : null, // element options
      columns // column vue elements
    );
  }
};

var Plugin = function () {};

Plugin.install = function (Vue, options) {
  if (Plugin.installed) {
    return;
  }

  if(options && options.name) {
    Vue.component(options.name, component);
  } else {
    Vue.component(componentName, component);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin);
}

/* harmony default export */ __webpack_exports__["default"] = (Plugin);


/***/ }),

/***/ "./resources/assets/js/collections.js":
/*!********************************************!*\
  !*** ./resources/assets/js/collections.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Vue.component('collection-component', __webpack_require__(/*! ./components/CollectionComponent.vue */ "./resources/assets/js/components/CollectionComponent.vue")["default"]);

/***/ }),

/***/ "./resources/assets/js/components/CollectionComponent.vue":
/*!****************************************************************!*\
  !*** ./resources/assets/js/components/CollectionComponent.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true& */ "./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true&");
/* harmony import */ var _CollectionComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollectionComponent.vue?vue&type=script&lang=js& */ "./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& */ "./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollectionComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "74b829d0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/assets/js/components/CollectionComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionComponent.vue?vue&type=script&lang=js& */ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&":
/*!*************************************************************************************************************************!*\
  !*** ./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_style-loader@0.23.1@style-loader!../../../../node_modules/_css-loader@1.0.1@css-loader??ref--9-1!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css& */ "./node_modules/_style-loader@0.23.1@style-loader/index.js!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=style&index=0&id=74b829d0&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_style_index_0_id_74b829d0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true&":
/*!***********************************************************************************************************!*\
  !*** ./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true& */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionComponent.vue?vue&type=template&id=74b829d0&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionComponent_vue_vue_type_template_id_74b829d0_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ 18:
/*!**************************************************!*\
  !*** multi ./resources/assets/js/collections.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/puxueqian/Code/photoshare/resources/assets/js/collections.js */"./resources/assets/js/collections.js");


/***/ })

},[[18,"/js/manifest"]]]);