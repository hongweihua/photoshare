(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/compose-classic"],{

/***/ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      config: window.App.config,
      profile: {},
      composeText: '',
      composeTextLength: 0,
      nsfw: false,
      filters: [],
      ids: [],
      media: [],
      carouselCursor: 0,
      visibility: 'public',
      mediaDrawer: false,
      composeState: 'publish',
      uploading: false,
      uploadProgress: 0,
      composeType: false
    };
  },
  beforeMount: function beforeMount() {
    this.fetchProfile();
  },
  mounted: function mounted() {
    this.mediaWatcher();
    this.filters = [['1977', 'filter-1977'], ['Aden', 'filter-aden'], ['Amaro', 'filter-amaro'], ['Ashby', 'filter-ashby'], ['Brannan', 'filter-brannan'], ['Brooklyn', 'filter-brooklyn'], ['Charmes', 'filter-charmes'], ['Clarendon', 'filter-clarendon'], ['Crema', 'filter-crema'], ['Dogpatch', 'filter-dogpatch'], ['Earlybird', 'filter-earlybird'], ['Gingham', 'filter-gingham'], ['Ginza', 'filter-ginza'], ['Hefe', 'filter-hefe'], ['Helena', 'filter-helena'], ['Hudson', 'filter-hudson'], ['Inkwell', 'filter-inkwell'], ['Kelvin', 'filter-kelvin'], ['Kuno', 'filter-juno'], ['Lark', 'filter-lark'], ['Lo-Fi', 'filter-lofi'], ['Ludwig', 'filter-ludwig'], ['Maven', 'filter-maven'], ['Mayfair', 'filter-mayfair'], ['Moon', 'filter-moon'], ['Nashville', 'filter-nashville'], ['Perpetua', 'filter-perpetua'], ['Poprocket', 'filter-poprocket'], ['Reyes', 'filter-reyes'], ['Rise', 'filter-rise'], ['Sierra', 'filter-sierra'], ['Skyline', 'filter-skyline'], ['Slumber', 'filter-slumber'], ['Stinson', 'filter-stinson'], ['Sutro', 'filter-sutro'], ['Toaster', 'filter-toaster'], ['Valencia', 'filter-valencia'], ['Vesper', 'filter-vesper'], ['Walden', 'filter-walden'], ['Willow', 'filter-willow'], ['X-Pro II', 'filter-xpro-ii']];
  },
  methods: {
    fetchProfile: function fetchProfile() {
      var _this = this;

      axios.get('/api/pixelfed/v1/accounts/verify_credentials').then(function (res) {
        _this.profile = res.data;

        if (res.data.locked == true) {
          _this.visibility = 'private';
        }
      })["catch"](function (err) {});
    },
    addMedia: function addMedia(event) {
      var el = $(event.target);
      el.attr('disabled', '');
      var fi = $('.file-input[name="media"]');
      fi.trigger('click');
      el.blur();
      el.removeAttr('disabled');
    },
    mediaWatcher: function mediaWatcher() {
      var self = this;
      $(document).on('change', '.file-input', function (e) {
        var io = document.querySelector('.file-input');
        Array.prototype.forEach.call(io.files, function (io, i) {
          self.uploading = true;

          if (self.media && self.media.length + i >= self.config.uploader.album_limit) {
            swal('Error', 'You can only upload ' + self.config.uploader.album_limit + ' photos per album', 'error');
            return;
          }

          var type = io.type;
          var acceptedMimes = self.config.uploader.media_types.split(',');
          var validated = $.inArray(type, acceptedMimes);

          if (validated == -1) {
            swal('Invalid File Type', 'The file you are trying to add is not a valid mime type. Please upload a ' + self.config.uploader.media_types + ' only.', 'error');
            return;
          }

          var form = new FormData();
          form.append('file', io);
          var xhrConfig = {
            onUploadProgress: function onUploadProgress(e) {
              var progress = Math.round(e.loaded * 100 / e.total);
              self.uploadProgress = progress;
            }
          };
          axios.post('/api/pixelfed/v1/media', form, xhrConfig).then(function (e) {
            self.uploadProgress = 100;
            self.ids.push(e.data.id);
            self.media.push(e.data);
            setTimeout(function () {
              self.uploading = false;
            }, 1000);
          })["catch"](function (e) {
            self.uploading = false;
            io.value = null;
            swal('Oops, something went wrong!', 'An unexpected error occurred.', 'error');
          });
          io.value = null;
          self.uploadProgress = 0;
        });
      });
    },
    toggleFilter: function toggleFilter(e, filter) {
      this.media[this.carouselCursor].filter_class = filter;
    },
    updateMedia: function updateMedia() {
      this.mediaDrawer = false;
    },
    deleteMedia: function deleteMedia() {
      var _this2 = this;

      if (window.confirm('Are you sure you want to delete this media?') == false) {
        return;
      }

      var id = this.media[this.carouselCursor].id;
      axios["delete"]('/api/pixelfed/v1/media', {
        params: {
          id: id
        }
      }).then(function (res) {
        if (_this2.media.length == 1) {
          _this2.mediaDrawer = false;
          _this2.ids = [];
          _this2.media = [];
          _this2.carouselCursor = 0;
        }

        _this2.ids.splice(_this2.carouselCursor, 1);

        _this2.media.splice(_this2.carouselCursor, 1);
      })["catch"](function (err) {
        swal('Whoops!', 'An error occured when attempting to delete this, please try again', 'error');
      });
    },
    mediaAltText: function mediaAltText() {
      var _this3 = this;

      return; // deprecate 

      swal({
        text: 'Add a media description',
        content: "input"
      }).then(function (val) {
        var media = _this3.media[_this3.carouselCursor];
        media.alt = val;
      });
    },
    mediaLicense: function mediaLicense() {
      var _this4 = this;

      return; // deprecate

      swal({
        text: 'Add a media license',
        content: "input",
        button: {
          text: "Update",
          closeModal: true
        }
      }).then(function (val) {
        var media = _this4.media[_this4.carouselCursor];
        media.license = val;
      });
    },
    compose: function compose() {
      var state = this.composeState;

      if (this.uploadProgress != 100 || this.ids.length == 0) {
        return;
      }

      if (this.composeText.length > this.config.uploader.max_caption_length) {
        swal('Error', 'Caption is too long', 'error');
        return;
      }

      switch (state) {
        case 'publish':
          if (this.media.length == 0) {
            swal('Whoops!', 'You need to add media before you can save this!', 'warning');
            return;
          }

          if (this.composeText == 'Add optional caption...') {
            this.composeText = '';
          }

          var data = {
            media: this.media,
            caption: this.composeText,
            visibility: this.visibility,
            cw: this.nsfw
          };
          axios.post('/api/local/status/compose', data).then(function (res) {
            var data = res.data;
            window.location.href = data;
          })["catch"](function (err) {
            var res = err.response.data;

            if (res.message == 'Too Many Attempts.') {
              swal('You\'re posting too much!', 'We only allow 50 posts per hour or 100 per day. If you\'ve reached that limit, please try again later. If you think this is an error, please contact an administrator.', 'error');
              return;
            }

            swal('Oops, something went wrong!', 'An unexpected error occurred.', 'error');
          });
          return;
          break;

        case 'delete':
          this.mediaDrawer = false;
          this.ids = [];
          this.media = [];
          this.carouselCursor = 0;
          this.composeText = '';
          this.composeTextLength = 0;
          $('#composeModal').modal('hide');
          return;
          break;
      }
    },
    about: function about() {
      var text = document.createElement('div');
      text.innerHTML = "\n\t\t\t\t<p class=\"small font-weight-bold\">Please visit the <a href=\"/site/kb/sharing-media\">Sharing Media</a> page for more info.</p>\n\t\t\t";
      swal({
        title: 'Compose UI v3',
        content: text,
        icon: 'info'
      });
    },
    closeModal: function closeModal() {
      this.composeType = '';
      $('#composeModal').modal('hide');
    },
    composeMessage: function composeMessage() {
      var config = this.config;
      var composeType = this.composeType;
      var video = config.uploader.media_types.includes('video/mp4');
      return video ? 'Click here to add photos or videos' : 'Click here to add photos';
    },
    createCollection: function createCollection() {
      window.location.href = '/i/collections/create';
    },
    maxSize: function maxSize() {
      var limit = this.config.uploader.max_photo_size;
      return limit / 1000 + ' MB';
    },
    acceptedFormats: function acceptedFormats() {
      var formats = this.config.uploader.media_types;
      return formats.split(',').map(function (f) {
        return ' ' + f.split('/')[1];
      }).toString();
    }
  }
});

/***/ }),

/***/ "./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_css-loader@1.0.1@css-loader??ref--9-1!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js */ "./node_modules/_css-loader@1.0.1@css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.media-drawer-filters[data-v-63ff4c97] {\n\t\toverflow-x: scroll;\n\t\tflex-wrap:unset;\n}\n.media-drawer-filters .nav-link[data-v-63ff4c97] {\n\t\tmin-width:100px;\n\t\tpadding-top: 1rem;\n\t\tpadding-bottom: 1rem;\n}\n.media-drawer-filters .active[data-v-63ff4c97] {\n\t\tcolor: #fff;\n\t\tfont-weight: bold;\n}\n@media (hover: none) and (pointer: coarse) {\n.media-drawer-filters[data-v-63ff4c97]::-webkit-scrollbar {\n\t        display: none;\n}\n}\n", ""]);

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

/***/ "./node_modules/_style-loader@0.23.1@style-loader/index.js!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_style-loader@0.23.1@style-loader!./node_modules/_css-loader@1.0.1@css-loader??ref--9-1!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/_css-loader@1.0.1@css-loader??ref--9-1!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& */ "./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&");

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

/***/ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("input", {
      staticClass: "d-none file-input",
      attrs: {
        type: "file",
        name: "media",
        multiple: "",
        accept: _vm.config.uploader.media_types
      }
    }),
    _vm._v(" "),
    _c("div", { staticClass: "timeline" }, [
      _c("div", { staticClass: "card status-card card-md-rounded-0" }, [
        _c(
          "div",
          {
            staticClass: "card-header d-inline-flex align-items-center bg-white"
          },
          [
            _c("img", {
              staticClass: "box-shadow",
              staticStyle: { "border-radius": "32px" },
              attrs: { src: _vm.profile.avatar, width: "32px", height: "32px" }
            }),
            _vm._v(" "),
            _c(
              "a",
              {
                staticClass: "username font-weight-bold pl-2 text-dark",
                attrs: { href: _vm.profile.url }
              },
              [
                _vm._v(
                  "\n\t\t\t\t\t" + _vm._s(_vm.profile.username) + "\n\t\t\t\t"
                )
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "text-right", staticStyle: { "flex-grow": "1" } },
              [
                _c("div", { staticClass: "dropdown" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "dropdown-menu dropdown-menu-right",
                      attrs: { "aria-labelledby": "dropdownMenuButton" }
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "dropdown-item small font-weight-bold",
                          on: { click: _vm.createCollection }
                        },
                        [_vm._v("Create Collection")]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "dropdown-divider" }),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "dropdown-item small font-weight-bold",
                          on: { click: _vm.about }
                        },
                        [_vm._v("About")]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "dropdown-item small font-weight-bold",
                          on: { click: _vm.closeModal }
                        },
                        [_vm._v("Close")]
                      )
                    ]
                  )
                ])
              ]
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "postPresenterContainer" }, [
          _vm.uploading
            ? _c("div", [
                _c(
                  "div",
                  {
                    staticClass: "w-100 h-100 bg-light py-5",
                    staticStyle: { "border-bottom": "1px solid #f1f1f1" }
                  },
                  [
                    _c(
                      "div",
                      { staticClass: "p-5" },
                      [
                        _c("b-progress", {
                          attrs: {
                            value: _vm.uploadProgress,
                            max: 100,
                            striped: "",
                            animated: true
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "p",
                          { staticClass: "text-center mb-0 font-weight-bold" },
                          [
                            _vm._v(
                              "Uploading ... (" +
                                _vm._s(_vm.uploadProgress) +
                                "%)"
                            )
                          ]
                        )
                      ],
                      1
                    )
                  ]
                )
              ])
            : _c("div", [
                _vm.ids.length > 0 &&
                _vm.ids.length != _vm.config.uploader.album_limit
                  ? _c(
                      "div",
                      {
                        staticClass:
                          "card-header py-2 bg-primary m-2 rounded cursor-pointer",
                        on: {
                          click: function($event) {
                            return _vm.addMedia($event)
                          }
                        }
                      },
                      [_vm._m(1)]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.ids.length == 0
                  ? _c(
                      "div",
                      {
                        staticClass: "w-100 h-100 bg-light py-5 cursor-pointer",
                        staticStyle: { "border-bottom": "1px solid #f1f1f1" },
                        on: {
                          click: function($event) {
                            return _vm.addMedia($event)
                          }
                        }
                      },
                      [
                        _c("div", { staticClass: "p-5" }, [
                          _c(
                            "p",
                            { staticClass: "text-center font-weight-bold" },
                            [_vm._v(_vm._s(_vm.composeMessage()))]
                          ),
                          _vm._v(" "),
                          _c(
                            "p",
                            {
                              staticClass: "text-muted mb-0 small text-center"
                            },
                            [
                              _vm._v("Accepted Formats: "),
                              _c("b", [_vm._v(_vm._s(_vm.acceptedFormats()))])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "p",
                            {
                              staticClass: "text-muted mb-0 small text-center"
                            },
                            [
                              _vm._v("Max File Size: "),
                              _c("b", [_vm._v(_vm._s(_vm.maxSize()))])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "p",
                            {
                              staticClass: "text-muted mb-0 small text-center"
                            },
                            [
                              _vm._v("Albums can contain up to "),
                              _c("b", [
                                _vm._v(_vm._s(_vm.config.uploader.album_limit))
                              ]),
                              _vm._v(" photos or videos")
                            ]
                          )
                        ])
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.ids.length > 0
                  ? _c(
                      "div",
                      [
                        _c(
                          "b-carousel",
                          {
                            staticStyle: { "text-shadow": "1px 1px 2px #333" },
                            attrs: {
                              id: "p-carousel",
                              controls: "",
                              indicators: "",
                              background: "#ffffff",
                              interval: 0
                            },
                            model: {
                              value: _vm.carouselCursor,
                              callback: function($$v) {
                                _vm.carouselCursor = $$v
                              },
                              expression: "carouselCursor"
                            }
                          },
                          _vm._l(_vm.media, function(preview, index) {
                            return _vm.ids.length > 0
                              ? _c(
                                  "b-carousel-slide",
                                  { key: "preview_media_" + index },
                                  [
                                    _c(
                                      "div",
                                      {
                                        class: [
                                          _vm.media[index].filter_class
                                            ? _vm.media[index].filter_class
                                            : ""
                                        ],
                                        staticStyle: {
                                          display: "flex",
                                          "min-height": "320px",
                                          "align-items": "center"
                                        },
                                        attrs: { slot: "img" },
                                        slot: "img"
                                      },
                                      [
                                        _c("img", {
                                          staticClass:
                                            "d-block img-fluid w-100",
                                          attrs: {
                                            src: preview.url,
                                            alt: preview.description,
                                            title: preview.description
                                          }
                                        })
                                      ]
                                    )
                                  ]
                                )
                              : _vm._e()
                          }),
                          1
                        )
                      ],
                      1
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.ids.length > 0 &&
                _vm.media[_vm.carouselCursor].type == "Image"
                  ? _c("div", { staticClass: "bg-dark align-items-center" }, [
                      _c(
                        "ul",
                        { staticClass: "nav media-drawer-filters text-center" },
                        [
                          _c("li", { staticClass: "nav-item" }, [
                            _c("div", { staticClass: "p-1 pt-3" }, [
                              _c("img", {
                                staticClass: "cursor-pointer",
                                attrs: {
                                  src: _vm.media[_vm.carouselCursor].url,
                                  width: "100px",
                                  height: "60px"
                                },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    return _vm.toggleFilter($event, null)
                                  }
                                }
                              })
                            ]),
                            _vm._v(" "),
                            _c(
                              "a",
                              {
                                class: [
                                  _vm.media[_vm.carouselCursor].filter_class ==
                                  null
                                    ? "nav-link text-white active"
                                    : "nav-link text-muted"
                                ],
                                attrs: { href: "#" },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    return _vm.toggleFilter($event, null)
                                  }
                                }
                              },
                              [_vm._v("No Filter")]
                            )
                          ]),
                          _vm._v(" "),
                          _vm._l(_vm.filters, function(filter, index) {
                            return _c("li", { staticClass: "nav-item" }, [
                              _c("div", { staticClass: "p-1 pt-3" }, [
                                _c("img", {
                                  class: filter[1],
                                  attrs: {
                                    src: _vm.media[_vm.carouselCursor].url,
                                    width: "100px",
                                    height: "60px"
                                  },
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.toggleFilter($event, filter[1])
                                    }
                                  }
                                })
                              ]),
                              _vm._v(" "),
                              _c(
                                "a",
                                {
                                  class: [
                                    _vm.media[_vm.carouselCursor]
                                      .filter_class == filter[1]
                                      ? "nav-link text-white active"
                                      : "nav-link text-muted"
                                  ],
                                  attrs: { href: "#" },
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.toggleFilter($event, filter[1])
                                    }
                                  }
                                },
                                [_vm._v(_vm._s(filter[0]))]
                              )
                            ])
                          })
                        ],
                        2
                      )
                    ])
                  : _vm._e()
              ]),
          _vm._v(" "),
          _vm.ids.length > 0 &&
          ["Image", "Video"].indexOf(_vm.media[_vm.carouselCursor].type) != -1
            ? _c("div", { staticClass: "bg-lighter p-2 row" }, [
                _vm.media[_vm.carouselCursor].type == "Image"
                  ? _c("div", { staticClass: "col-12" }, [
                      _c("div", { staticClass: "form-group" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.media[_vm.carouselCursor].alt,
                              expression: "media[carouselCursor].alt"
                            }
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "text",
                            placeholder: "Optional image description"
                          },
                          domProps: {
                            value: _vm.media[_vm.carouselCursor].alt
                          },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.media[_vm.carouselCursor],
                                "alt",
                                $event.target.value
                              )
                            }
                          }
                        })
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.media[_vm.carouselCursor].license,
                              expression: "media[carouselCursor].license"
                            }
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "text",
                            placeholder: "Optional media license"
                          },
                          domProps: {
                            value: _vm.media[_vm.carouselCursor].license
                          },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.media[_vm.carouselCursor],
                                "license",
                                $event.target.value
                              )
                            }
                          }
                        })
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("div", { staticClass: "col-12 text-right pt-2" }, [
                  _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-outline-danger btn-sm font-weight-bold mr-1",
                      on: {
                        click: function($event) {
                          return _vm.deleteMedia()
                        }
                      }
                    },
                    [_vm._v("Delete Media")]
                  )
                ])
              ])
            : _vm._e()
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body p-0 border-top" }, [
          _c("div", { staticClass: "caption" }, [
            _c("textarea", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.composeText,
                  expression: "composeText"
                }
              ],
              staticClass: "form-control mb-0 border-0 rounded-0",
              attrs: { rows: "3", placeholder: "Add an optional caption" },
              domProps: { value: _vm.composeText },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.composeText = $event.target.value
                }
              }
            })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-footer" }, [
          _c(
            "div",
            {
              staticClass: "d-flex justify-content-between align-items-center"
            },
            [
              _c("div", [
                _c(
                  "div",
                  { staticClass: "custom-control custom-switch d-inline mr-3" },
                  [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.nsfw,
                          expression: "nsfw"
                        }
                      ],
                      staticClass: "custom-control-input",
                      attrs: { type: "checkbox", id: "nsfwToggle" },
                      domProps: {
                        checked: Array.isArray(_vm.nsfw)
                          ? _vm._i(_vm.nsfw, null) > -1
                          : _vm.nsfw
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.nsfw,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v)
                            if ($$el.checked) {
                              $$i < 0 && (_vm.nsfw = $$a.concat([$$v]))
                            } else {
                              $$i > -1 &&
                                (_vm.nsfw = $$a
                                  .slice(0, $$i)
                                  .concat($$a.slice($$i + 1)))
                            }
                          } else {
                            _vm.nsfw = $$c
                          }
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "label",
                      {
                        staticClass:
                          "custom-control-label small font-weight-bold text-muted pt-1",
                        attrs: { for: "nsfwToggle" }
                      },
                      [_vm._v("NSFW")]
                    )
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "dropdown d-inline" }, [
                  _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-outline-secondary btn-sm py-0 dropdown-toggle",
                      attrs: {
                        type: "button",
                        id: "visibility",
                        "data-toggle": "dropdown",
                        "aria-haspopup": "true",
                        "aria-expanded": "false"
                      }
                    },
                    [
                      _vm._v(
                        "\n\t\t\t\t\t\t\t\t" +
                          _vm._s(
                            _vm.visibility[0].toUpperCase() +
                              _vm.visibility.slice(1)
                          ) +
                          "\n\t\t\t\t\t\t\t"
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "dropdown-menu",
                      staticStyle: { width: "200px" },
                      attrs: { "aria-labelledby": "visibility" }
                    },
                    [
                      _c(
                        "a",
                        {
                          class: [
                            _vm.visibility == "public"
                              ? "dropdown-item active"
                              : "dropdown-item"
                          ],
                          attrs: {
                            href: "#",
                            "data-id": "public",
                            "data-title": "Public"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.visibility = "public"
                            }
                          }
                        },
                        [_vm._m(2)]
                      ),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          class: [
                            _vm.visibility == "private"
                              ? "dropdown-item active"
                              : "dropdown-item"
                          ],
                          attrs: {
                            href: "#",
                            "data-id": "private",
                            "data-title": "Followers Only"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.visibility = "private"
                            }
                          }
                        },
                        [_vm._m(3)]
                      ),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          class: [
                            _vm.visibility == "unlisted"
                              ? "dropdown-item active"
                              : "dropdown-item"
                          ],
                          attrs: {
                            href: "#",
                            "data-id": "private",
                            "data-title": "Unlisted"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.visibility = "unlisted"
                            }
                          }
                        },
                        [_vm._m(4)]
                      )
                    ]
                  )
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "small text-muted font-weight-bold" }, [
                _vm._v(
                  "\n\t\t\t\t\t\t" +
                    _vm._s(_vm.composeText.length) +
                    " / " +
                    _vm._s(_vm.config.uploader.max_caption_length) +
                    "\n\t\t\t\t\t"
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "pl-md-5" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary btn-sm font-weight-bold px-3",
                    on: {
                      click: function($event) {
                        return _vm.compose()
                      }
                    }
                  },
                  [_vm._v("Publish")]
                )
              ])
            ]
          )
        ])
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "button",
      {
        staticClass: "btn btn-link text-dark no-caret dropdown-toggle",
        attrs: {
          type: "button",
          "data-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false",
          title: "Post options"
        }
      },
      [_c("span", { staticClass: "fas fa-ellipsis-v fa-lg text-muted" })]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "p",
      { staticClass: "text-center mb-0 font-weight-bold text-white" },
      [_c("i", { staticClass: "fas fa-plus mr-1" }), _vm._v(" Add Photo")]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "row" }, [
      _c(
        "div",
        { staticClass: "d-none d-block-sm col-sm-2 px-0 text-center" },
        [_c("i", { staticClass: "fas fa-globe" })]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col-12 col-sm-10 pl-2" }, [
        _c("p", { staticClass: "font-weight-bold mb-0" }, [_vm._v("Public")]),
        _vm._v(" "),
        _c("p", { staticClass: "small mb-0" }, [_vm._v("Anyone can see")])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "row" }, [
      _c(
        "div",
        { staticClass: "d-none d-block-sm col-sm-2 px-0 text-center" },
        [_c("i", { staticClass: "fas fa-lock" })]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col-12 col-sm-10 pl-2" }, [
        _c("p", { staticClass: "font-weight-bold mb-0" }, [
          _vm._v("Followers Only")
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "small mb-0" }, [
          _vm._v("Only followers can see")
        ])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "row" }, [
      _c(
        "div",
        { staticClass: "d-none d-block-sm col-sm-2 px-0 text-center" },
        [_c("i", { staticClass: "fas fa-lock" })]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col-12 col-sm-10 pl-2" }, [
        _c("p", { staticClass: "font-weight-bold mb-0" }, [_vm._v("Unlisted")]),
        _vm._v(" "),
        _c("p", { staticClass: "small mb-0" }, [
          _vm._v("Not listed on public timelines")
        ])
      ])
    ])
  }
]
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

/***/ "./resources/assets/js/components/ComposeClassic.vue":
/*!***********************************************************!*\
  !*** ./resources/assets/js/components/ComposeClassic.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true& */ "./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true&");
/* harmony import */ var _ComposeClassic_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ComposeClassic.vue?vue&type=script&lang=js& */ "./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& */ "./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ComposeClassic_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "63ff4c97",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/assets/js/components/ComposeClassic.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./ComposeClassic.vue?vue&type=script&lang=js& */ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&":
/*!********************************************************************************************************************!*\
  !*** ./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_style-loader@0.23.1@style-loader!../../../../node_modules/_css-loader@1.0.1@css-loader??ref--9-1!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--9-2!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css& */ "./node_modules/_style-loader@0.23.1@style-loader/index.js!./node_modules/_css-loader@1.0.1@css-loader/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=style&index=0&id=63ff4c97&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_0_23_1_style_loader_index_js_node_modules_css_loader_1_0_1_css_loader_index_js_ref_9_1_node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_9_2_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_style_index_0_id_63ff4c97_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true&":
/*!******************************************************************************************************!*\
  !*** ./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true& ***!
  \******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true& */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/ComposeClassic.vue?vue&type=template&id=63ff4c97&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_ComposeClassic_vue_vue_type_template_id_63ff4c97_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/assets/js/compose-classic.js":
/*!************************************************!*\
  !*** ./resources/assets/js/compose-classic.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Vue.component('compose-classic', __webpack_require__(/*! ./components/ComposeClassic.vue */ "./resources/assets/js/components/ComposeClassic.vue")["default"]);

/***/ }),

/***/ 8:
/*!******************************************************!*\
  !*** multi ./resources/assets/js/compose-classic.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/puxueqian/Code/photoshare/resources/assets/js/compose-classic.js */"./resources/assets/js/compose-classic.js");


/***/ })

},[[8,"/js/manifest"]]]);