(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/collectioncompose"],{

/***/ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['collection-id', 'profile-id'],
  data: function data() {
    return {
      loaded: false,
      limit: 8,
      step: 1,
      title: '',
      description: '',
      visibility: 'private',
      collection: {
        title: '',
        description: '',
        visibility: 'public'
      },
      id: '',
      posts: [],
      tab: 'add',
      tabs: ['all', 'add', 'order'],
      recentPosts: [],
      selectedPost: ''
    };
  },
  beforeMount: function beforeMount() {
    var _this = this;

    axios.get('/api/local/collection/' + this.collectionId).then(function (res) {
      _this.collection = res.data;
    });
  },
  mounted: function mounted() {
    this.fetchRecentPosts();
    this.fetchItems();
  },
  methods: {
    addToIds: function addToIds(id) {
      var _this2 = this;

      axios.post('/api/local/collection/item', {
        collection_id: this.collectionId,
        post_id: id
      }).then(function (res) {
        _this2.fetchItems();

        _this2.fetchRecentPosts();

        _this2.tab = 'all';
        _this2.id = '';
      })["catch"](function (err) {
        swal('Invalid URL', 'The post you entered was invalid', 'error');
        _this2.id = '';
      });
    },
    fetchItems: function fetchItems() {
      var _this3 = this;

      axios.get('/api/local/collection/items/' + this.collectionId).then(function (res) {
        _this3.posts = res.data;
        _this3.loaded = true;
      });
    },
    addId: function addId() {
      var max = 18;

      if (this.posts.length >= max) {
        swal('Error', 'You can only add ' + max + ' posts per collection', 'error');
        return;
      }

      var url = this.id;
      var origin = window.location.origin;
      var split = url.split('/');

      if (url.slice(0, origin.length) !== origin) {
        swal('Invalid URL', 'You can only add posts from this instance', 'error');
        this.id = '';
      }

      if (url.slice(0, origin.length + 3) !== origin + '/p/' || split.length !== 6) {
        swal('Invalid URL', 'Invalid URL', 'error');
        this.id = '';
      }

      this.addToIds(split[5]);
      return;
    },
    previewUrl: function previewUrl(status) {
      return status.sensitive ? '/storage/no-preview.png?v=' + new Date().getTime() : status.media_attachments[0].preview_url;
    },
    previewBackground: function previewBackground(status) {
      var preview = this.previewUrl(status);
      return 'background-image: url(' + preview + ');background-size:cover;';
    },
    fetchRecentPosts: function fetchRecentPosts() {
      var _this4 = this;

      axios.get('/api/pixelfed/v1/accounts/' + this.profileId + '/statuses', {
        params: {
          only_media: true,
          min_id: 1
        }
      }).then(function (res) {
        _this4.recentPosts = res.data.filter(function (s) {
          var ids = _this4.posts.map(function (s) {
            return s.id;
          });

          return s.visibility == 'public' && s.sensitive == false && ids.indexOf(s.id) == -1;
        }).slice(0, 3);
      });
    },
    selectPost: function selectPost(status) {
      this.selectedPost = status.id;
      this.id = status.url;
    },
    publish: function publish() {
      if (this.posts.length == 0) {
        swal('Error', 'You cannot publish an empty collection');
        return;
      }

      axios.post('/api/local/collection/' + this.collectionId + '/publish', {
        title: this.collection.title,
        description: this.collection.description,
        visibility: this.collection.visibility
      }).then(function (res) {
        window.location.href = res.data;
      })["catch"](function (err) {
        swal('Something went wrong', 'There was a problem with your request, please try again later.', 'error');
      });
    },
    save: function save() {
      axios.post('/api/local/collection/' + this.collectionId, {
        title: this.collection.title,
        description: this.collection.description,
        visibility: this.collection.visibility
      }).then(function (res) {
        swal('Saved!', 'You have successfully saved this collection.', 'success');
      });
    },
    deleteCollection: function deleteCollection() {
      var confirm = window.confirm('Are you sure you want to delete this collection?');

      if (!confirm) {
        return;
      }

      axios["delete"]('/api/local/collection/' + this.collectionId).then(function (res) {
        window.location.href = '/';
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26&":
/*!*****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "container" }, [
    _vm.loaded
      ? _c("div", { staticClass: "row" }, [
          _vm._m(0),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 col-md-4 pt-3" }, [
            _c(
              "div",
              {
                staticClass: "card rounded-0 shadow-none border ",
                staticStyle: { "min-height": "440px" }
              },
              [
                _c("div", { staticClass: "card-body" }, [
                  _c("div", [
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
                              value: _vm.collection.title,
                              expression: "collection.title"
                            }
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "text",
                            id: "title",
                            placeholder: "Collection Title"
                          },
                          domProps: { value: _vm.collection.title },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.collection,
                                "title",
                                $event.target.value
                              )
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
                              value: _vm.collection.description,
                              expression: "collection.description"
                            }
                          ],
                          staticClass: "form-control",
                          attrs: {
                            id: "description",
                            placeholder: "Example description here",
                            rows: "3"
                          },
                          domProps: { value: _vm.collection.description },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.collection,
                                "description",
                                $event.target.value
                              )
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
                                value: _vm.collection.visibility,
                                expression: "collection.visibility"
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
                                _vm.$set(
                                  _vm.collection,
                                  "visibility",
                                  $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                )
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
                      ])
                    ]),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("p", [
                      _vm.posts.length > 0
                        ? _c(
                            "button",
                            {
                              staticClass:
                                "btn btn-primary font-weight-bold btn-block",
                              attrs: { type: "button" },
                              on: { click: _vm.publish }
                            },
                            [_vm._v("Publish")]
                          )
                        : _c(
                            "button",
                            {
                              staticClass:
                                "btn btn-primary font-weight-bold btn-block disabled",
                              attrs: { type: "button", disabled: "" }
                            },
                            [_vm._v("Publish")]
                          )
                    ]),
                    _vm._v(" "),
                    _c("p", [
                      _c(
                        "button",
                        {
                          staticClass:
                            "btn btn-outline-primary font-weight-bold btn-block",
                          attrs: { type: "button" },
                          on: { click: _vm.save }
                        },
                        [_vm._v("Save")]
                      )
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "mb-0" }, [
                      _c(
                        "button",
                        {
                          staticClass:
                            "btn btn-outline-secondary font-weight-bold btn-block",
                          attrs: { type: "button" },
                          on: { click: _vm.deleteCollection }
                        },
                        [_vm._v("Delete")]
                      )
                    ])
                  ])
                ])
              ]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 col-md-8 pt-3" }, [
            _c("div", [
              _c("ul", { staticClass: "nav nav-tabs" }, [
                _c("li", { staticClass: "nav-item" }, [
                  _c(
                    "a",
                    {
                      class: [
                        _vm.tab == "add"
                          ? "nav-link font-weight-bold bg-white active"
                          : "nav-link font-weight-bold text-muted"
                      ],
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.tab = "add"
                        }
                      }
                    },
                    [_vm._v("Add Posts")]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item" }, [
                  _c(
                    "a",
                    {
                      class: [
                        _vm.tab == "all"
                          ? "nav-link font-weight-bold bg-white active"
                          : "nav-link font-weight-bold text-muted"
                      ],
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.tab = "all"
                        }
                      }
                    },
                    [_vm._v("Preview")]
                  )
                ])
              ])
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "card rounded-0 shadow-none border border-top-0" },
              [
                _c(
                  "div",
                  {
                    staticClass: "card-body",
                    staticStyle: { height: "460px", "overflow-y": "auto" }
                  },
                  [
                    _vm.tab == "all"
                      ? _c(
                          "div",
                          { staticClass: "row" },
                          _vm._l(_vm.posts, function(s, index) {
                            return _c("div", { staticClass: "col-4 p-1" }, [
                              _c(
                                "a",
                                {
                                  staticClass:
                                    "card info-overlay card-md-border-0",
                                  attrs: { href: s.url }
                                },
                                [
                                  _c("div", { staticClass: "square" }, [
                                    s.pf_type == "photo:album"
                                      ? _c(
                                          "span",
                                          {
                                            staticClass:
                                              "float-right mr-3 post-icon"
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fas fa-images fa-2x"
                                            })
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    s.pf_type == "video"
                                      ? _c(
                                          "span",
                                          {
                                            staticClass:
                                              "float-right mr-3 post-icon"
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fas fa-video fa-2x"
                                            })
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    s.pf_type == "video:album"
                                      ? _c(
                                          "span",
                                          {
                                            staticClass:
                                              "float-right mr-3 post-icon"
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fas fa-film fa-2x"
                                            })
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("div", {
                                      staticClass: "square-content",
                                      style: _vm.previewBackground(s)
                                    }),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "info-overlay-text" },
                                      [
                                        _c(
                                          "h5",
                                          {
                                            staticClass:
                                              "text-white m-auto font-weight-bold"
                                          },
                                          [
                                            _c("span", [
                                              _c("span", {
                                                staticClass:
                                                  "far fa-heart fa-lg p-2 d-flex-inline"
                                              }),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  staticClass: "d-flex-inline"
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(s.favourites_count)
                                                  )
                                                ]
                                              )
                                            ]),
                                            _vm._v(" "),
                                            _c("span", [
                                              _c("span", {
                                                staticClass:
                                                  "fas fa-retweet fa-lg p-2 d-flex-inline"
                                              }),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  staticClass: "d-flex-inline"
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(s.reblogs_count)
                                                  )
                                                ]
                                              )
                                            ])
                                          ]
                                        )
                                      ]
                                    )
                                  ])
                                ]
                              )
                            ])
                          }),
                          0
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.tab == "add"
                      ? _c("div", [
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
                                  value: _vm.id,
                                  expression: "id"
                                }
                              ],
                              staticClass: "form-control",
                              attrs: {
                                type: "text",
                                placeholder: "https://pixelfed.dev/p/admin/1"
                              },
                              domProps: { value: _vm.id },
                              on: {
                                input: function($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.id = $event.target.value
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "p",
                              { staticClass: "help-text small text-muted" },
                              [_vm._v("Only local, public posts can be added")]
                            )
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "form-group pt-4" }, [
                            _c(
                              "label",
                              {
                                staticClass: "font-weight-bold text-muted",
                                attrs: { for: "title" }
                              },
                              [_vm._v("Add Recent Post")]
                            ),
                            _vm._v(" "),
                            _c(
                              "div",
                              _vm._l(_vm.recentPosts, function(s, index) {
                                return _c(
                                  "div",
                                  {
                                    class: [
                                      _vm.selectedPost == s.id
                                        ? "box-shadow border border-warning d-inline-block m-1"
                                        : "d-inline-block m-1"
                                    ],
                                    on: {
                                      click: function($event) {
                                        return _vm.selectPost(s)
                                      }
                                    }
                                  },
                                  [
                                    _c("div", {
                                      staticClass: "cursor-pointer",
                                      style:
                                        "width: 175px; height: 175px; " +
                                        _vm.previewBackground(s)
                                    })
                                  ]
                                )
                              }),
                              0
                            )
                          ]),
                          _vm._v(" "),
                          _c("hr"),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass:
                                "btn btn-primary font-weight-bold btn-block",
                              attrs: { type: "button" },
                              on: { click: _vm.addId }
                            },
                            [_vm._v("Add Post")]
                          )
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.tab == "order" ? _c("div") : _vm._e()
                  ]
                )
              ]
            )
          ])
        ])
      : _vm._e()
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-12 col-md-6 offset-md-3 pt-5" }, [
      _c("div", { staticClass: "text-center pb-4" }, [
        _c("h1", [_vm._v("Create Collection")])
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

/***/ "./resources/assets/js/collectioncompose.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/collectioncompose.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Vue.component('collection-compose', __webpack_require__(/*! ./components/CollectionCompose.vue */ "./resources/assets/js/components/CollectionCompose.vue")["default"]);

/***/ }),

/***/ "./resources/assets/js/components/CollectionCompose.vue":
/*!**************************************************************!*\
  !*** ./resources/assets/js/components/CollectionCompose.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollectionCompose.vue?vue&type=template&id=2e26dc26& */ "./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26&");
/* harmony import */ var _CollectionCompose_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollectionCompose.vue?vue&type=script&lang=js& */ "./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_15_7_1_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CollectionCompose_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/assets/js/components/CollectionCompose.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionCompose_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_babel-loader@8.0.6@babel-loader/lib??ref--4-0!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionCompose.vue?vue&type=script&lang=js& */ "./node_modules/_babel-loader@8.0.6@babel-loader/lib/index.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionCompose.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_8_0_6_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionCompose_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26&":
/*!*********************************************************************************************!*\
  !*** ./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./CollectionCompose.vue?vue&type=template&id=2e26dc26& */ "./node_modules/_vue-loader@15.7.1@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.7.1@vue-loader/lib/index.js?!./resources/assets/js/components/CollectionCompose.vue?vue&type=template&id=2e26dc26&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_15_7_1_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_15_7_1_vue_loader_lib_index_js_vue_loader_options_CollectionCompose_vue_vue_type_template_id_2e26dc26___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ 17:
/*!********************************************************!*\
  !*** multi ./resources/assets/js/collectioncompose.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/puxueqian/Code/photoshare/resources/assets/js/collectioncompose.js */"./resources/assets/js/collectioncompose.js");


/***/ })

},[[17,"/js/manifest"]]]);