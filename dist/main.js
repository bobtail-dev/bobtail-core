(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('bobtail-rx', ['exports', 'underscore'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('underscore'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._);
    global.rx = mod.exports;
  }
})(this, function (exports, _underscore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.rx = undefined;

  var _underscore2 = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var rxFactory = function rxFactory(_) {
    var asyncBind = void 0,
        bind = void 0,
        depMgr = void 0,
        lagBind = void 0,
        postLagBind = void 0,
        promiseBind = void 0,
        recorder = void 0;
    var rx = {};
    var nextUid = 0;
    var mkuid = function mkuid() {
      return nextUid += 1;
    };

    var _union = function _union(first, second) {
      return new Set([].concat(_toConsumableArray(Array.from(first)), _toConsumableArray(Array.from(second))));
    };
    var _intersection = function _intersection(first, second) {
      return new Set(Array.from(first).filter(function (item) {
        return second.has(item);
      }));
    };
    var _difference = function _difference(first, second) {
      return new Set(Array.from(first).filter(function (item) {
        return !second.has(item);
      }));
    };

    var popKey = function popKey(x, k) {
      if (!(k in x)) {
        throw new Error('object has no key ' + k);
      }
      var v = x[k];
      delete x[k];
      return v;
    };

    var mapPop = function mapPop(x, k) {
      var v = x.get(k);
      x.delete(k);
      return v;
    };

    var nthWhere = function nthWhere(xs, n, f) {
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (f(x) && (n -= 1) < 0) {
          return [x, i];
        }
      }
      return [null, -1];
    };

    var firstWhere = function firstWhere(xs, f) {
      return nthWhere(xs, 0, f);
    };

    var mkMap = function mkMap(xs) {
      var k = void 0,
          v = void 0;
      if (xs == null) {
        xs = [];
      }
      var map = Object.create != null ? Object.create(null) : {};
      if (_.isArray(xs)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from(xs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            k = _step$value[0];
            v = _step$value[1];
            map[k] = v;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        for (k in xs) {
          v = xs[k];map[k] = v;
        }
      }
      return map;
    };

    var sum = function sum(xs) {
      var n = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(xs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var x = _step2.value;
          n += x;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return n;
    };

    //
    // Events and pub-sub dependency management
    //

    // Just a global mapping from subscription UIDs to source Evs; this essentially
    // enables us to follow subscription UIDs up the dependency graph (from
    // dependents)
    var DepMgr = rx.DepMgr = function () {
      function DepMgr() {
        _classCallCheck(this, DepMgr);

        this.buffering = 0;
        this.buffer = [];
        this.events = new Set();
      }
      // called by Ev.sub to register a new subscription


      _createClass(DepMgr, [{
        key: 'transaction',
        value: function transaction(f) {
          var res = void 0;
          this.buffering += 1;
          try {
            res = f();
          } finally {
            this.buffering -= 1;
            if (this.buffering === 0) {
              var immediateDeps = new Set(_.flatten(Array.from(this.events).map(function (_ref) {
                var downstreamCells = _ref.downstreamCells;
                return Array.from(downstreamCells);
              })));
              var allDeps = rx.allDownstream.apply(rx, _toConsumableArray(Array.from(immediateDeps || [])));
              allDeps.forEach(function (cell) {
                return cell._shield = true;
              });
              try {
                // we need to clear the buffer now, in case rx.transaction is called as a result of one
                // the events that we're publishing, since that would cause transaction to execute again with
                // the full buffer, causing an infinite loop.
                var bufferedPubs = this.buffer;
                this.buffer = [];
                this.events.clear();

                bufferedPubs.map(function () {
                  var _Array$from = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                      _Array$from2 = _slicedToArray(_Array$from, 2),
                      ev = _Array$from2[0],
                      data = _Array$from2[1];

                  return ev.pub(data);
                });
                allDeps.forEach(function (c) {
                  return c.refresh();
                });
              } finally {
                allDeps.forEach(function (cell) {
                  return cell._shield = false;
                });
              }
            }
          }
          return res;
        }
      }]);

      return DepMgr;
    }();

    rx._depMgr = depMgr = new DepMgr();

    var Ev = function () {
      function Ev(init, observable) {
        _classCallCheck(this, Ev);

        this.observable = observable;
        this.init = init;
        this.subs = mkMap();
        this.downstreamCells = new Set();
      }

      _createClass(Ev, [{
        key: 'sub',
        value: function sub(listener) {
          var uid = mkuid();
          if (this.init != null) {
            listener(this.init());
          }
          this.subs[uid] = listener;
          return uid;
        }
      }, {
        key: 'pub',
        value: function pub(data) {
          var _this = this;

          if (depMgr.buffering) {
            depMgr.buffer.push([this, data]);
            return depMgr.events.add(this);
          } else {
            return function () {
              var result = [];
              for (var uid in _this.subs) {
                var listener = _this.subs[uid];
                result.push(listener(data));
              }
              return result;
            }();
          }
        }
      }, {
        key: 'unsub',
        value: function unsub(uid) {
          return popKey(this.subs, uid);
        }
      }, {
        key: 'scoped',
        value: function scoped(listener, context) {
          var uid = this.sub(listener);
          try {
            return context();
          } finally {
            this.unsub(uid);
          }
        }
      }]);

      return Ev;
    }();

    rx.Ev = Ev;

    rx.skipFirst = function (f) {
      var first = true;
      return function () {
        if (first) {
          return first = false;
        } else {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return f.apply(undefined, _toConsumableArray(Array.from(args || [])));
        }
      };
    };

    //
    // Reactivity
    //

    rx.upstream = function (cell) {
      var events = Array.from(cell.upstreamEvents);
      var depCells = events.map(function (ev) {
        return ev.observable;
      });
      return Array.from(new Set(depCells));
    };

    var allDownstreamHelper = rx._allDownstreamHelper = function () {
      for (var _len2 = arguments.length, cells = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        cells[_key2] = arguments[_key2];
      }

      if (cells.length) {
        var downstream = Array.from(new Set(_.flatten(cells.map(function (cell) {
          return Array.from(cell.onSet.downstreamCells);
        }))));
        var r = _.flatten([downstream, allDownstreamHelper.apply(undefined, _toConsumableArray(Array.from(downstream || [])))]);
        return r;
      }
      return [];
    };

    rx.allDownstream = function () {
      for (var _len3 = arguments.length, cells = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        cells[_key3] = arguments[_key3];
      }

      return Array.from(new Set([].concat(_toConsumableArray(Array.from(cells)), _toConsumableArray(Array.from(allDownstreamHelper.apply(undefined, _toConsumableArray(Array.from(cells || [])))))).reverse())).reverse();
    };

    var Recorder = rx.Recorder = function () {
      function Recorder() {
        _classCallCheck(this, Recorder);

        this.stack = [];
        this.isMutating = false;
        this.isIgnoring = false;
        this.hidingMutationWarnings = false;
        this.onMutationWarning = new Ev(); // just fires null for now
      }
      // takes a dep cell and push it onto the stack as the current invalidation
      // listener, so that calls to .sub (e.g. by ObsCell.get) can establish a
      // dependency


      _createClass(Recorder, [{
        key: 'record',
        value: function record(dep, f) {
          if (this.stack.length > 0 && !this.isMutating) {
            _(this.stack).last().addNestedBind(dep);
          }
          this.stack.push(dep);
          // reset isMutating
          var wasMutating = this.isMutating;
          this.isMutating = false;
          // reset isIgnoring
          var wasIgnoring = this.isIgnoring;
          this.isIgnoring = false;
          try {
            return f();
          } finally {
            this.isIgnoring = wasIgnoring;
            this.isMutating = wasMutating;
            this.stack.pop();
          }
        }
      }, {
        key: 'sub',
        value: function sub(event, condFn) {
          if (condFn == null) {
            condFn = function condFn() {
              return true;
            };
          }
          if (this.stack.length > 0 && !this.isIgnoring) {
            var topCell = _(this.stack).last();
            topCell.upstreamEvents.add(event);
            event.downstreamCells.add(topCell);
            return rx.autoSub(event, function () {
              for (var _len4 = arguments.length, evData = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                evData[_key4] = arguments[_key4];
              }

              if (condFn.apply(undefined, _toConsumableArray(Array.from(evData || [])))) {
                return topCell.refresh();
              }
            });
          }
        }
      }, {
        key: 'addCleanup',
        value: function addCleanup(cleanup) {
          if (this.stack.length > 0) {
            return _(this.stack).last().addCleanup(cleanup);
          }
        }
      }, {
        key: 'hideMutationWarnings',
        value: function hideMutationWarnings(f) {
          var wasHiding = this.hidingMutationWarnings;
          this.hidingMutationWarnings = true;
          try {
            return f();
          } finally {
            this.hidingMutationWarnings = wasHiding;
          }
        }
      }, {
        key: 'fireMutationWarning',
        value: function fireMutationWarning() {
          console.warn('Mutation to observable detected during a bind context');
          return this.onMutationWarning.pub(null);
        }
      }, {
        key: 'mutating',
        value: function mutating(f) {
          if (this.stack.length > 0 && !this.hidingMutationWarnings) {
            this.fireMutationWarning();
          }
          var wasMutating = this.isMutating;
          this.isMutating = true;
          try {
            return f();
          } finally {
            this.isMutating = wasMutating;
          }
        }
      }, {
        key: 'ignoring',
        value: function ignoring(f) {
          var wasIgnoring = this.isIgnoring;
          this.isIgnoring = true;
          try {
            return f();
          } finally {
            this.isIgnoring = wasIgnoring;
          }
        }
      }]);

      return Recorder;
    }();

    rx.types = { 'cell': 'cell', 'array': 'array', 'map': 'map', 'set': 'set' };

    rx._recorder = recorder = new Recorder();

    rx.hideMutationWarnings = function (f) {
      return recorder.hideMutationWarnings(f);
    };

    rx.asyncBind = asyncBind = function asyncBind(init, f) {
      var dep = new DepCell(f, init);
      dep.refresh();
      return dep;
    };

    rx.promiseBind = promiseBind = function promiseBind(init, f) {
      return asyncBind(init, function () {
        var _this2 = this;

        return this.record(f).done(function (res) {
          return _this2.done(res);
        });
      });
    };

    rx.bind = bind = function bind(f) {
      return asyncBind(null, function () {
        return this.done(this.record(f));
      });
    };

    rx.lagBind = lagBind = function lagBind(lag, init, f) {
      var timeout = null;
      return asyncBind(init, function () {
        var _this3 = this;

        if (timeout != null) {
          clearTimeout(timeout);
        }
        return timeout = setTimeout(function () {
          return _this3.done(_this3.record(f));
        }, lag);
      });
    };

    rx.postLagBind = postLagBind = function postLagBind(init, f) {
      var timeout = null;
      return asyncBind(init, function () {
        var _this4 = this;

        var _record = this.record(f),
            val = _record.val,
            ms = _record.ms;

        if (timeout != null) {
          clearTimeout(timeout);
        }
        return timeout = setTimeout(function () {
          return _this4.done(val);
        }, ms);
      });
    };

    rx.snap = function (f) {
      return recorder.ignoring(f);
    };

    rx.onDispose = function (cleanup) {
      return recorder.addCleanup(cleanup);
    };

    rx.autoSub = function (ev, listener) {
      var subid = ev.sub(listener);
      rx.onDispose(function () {
        return ev.unsub(subid);
      });
      return subid;
    };

    rx.subOnce = function (event, listener) {
      var uid = rx.autoSub(event, rx.skipFirst(function () {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        _.defer(function () {
          return listener.apply(undefined, _toConsumableArray(Array.from(args || [])));
        });
        return event.unsub(uid);
      }));
      return uid;
    };

    var ObsBase = function () {
      var Cls = rx.ObsBase = function () {
        _createClass(ObsBase, null, [{
          key: 'initClass',
          value: function initClass() {
            var _this5 = this;

            this.prototype.to = {
              cell: function cell() {
                return rx.cell.from(_this5);
              },
              array: function array() {
                return rx.array.from(_this5);
              },
              map: function map() {
                return rx.map.from(_this5);
              },
              set: function set() {
                return rx.set.from(_this5);
              }
            };
          }
        }]);

        function ObsBase() {
          _classCallCheck(this, ObsBase);

          this.events = [];
        }

        _createClass(ObsBase, [{
          key: 'flatten',
          value: function flatten() {
            return rx.flatten(this);
          }
        }, {
          key: 'subAll',
          value: function subAll(condFn) {
            if (condFn == null) {
              condFn = function condFn() {
                return true;
              };
            }return this.events.forEach(function (ev) {
              return recorder.sub(ev, condFn);
            });
          }
        }, {
          key: 'raw',
          value: function raw() {
            return this._base;
          }
        }, {
          key: '_mkEv',
          value: function _mkEv(f) {
            var ev = new Ev(f, this);
            this.events.push(ev);
            return ev;
          }
        }]);

        return ObsBase;
      }();
      Cls.initClass();
      return Cls;
    }();

    var ObsCell = rx.ObsCell = function (_ObsBase) {
      _inherits(ObsCell, _ObsBase);

      function ObsCell(_base) {
        _classCallCheck(this, ObsCell);

        var _this6 = _possibleConstructorReturn(this, (ObsCell.__proto__ || Object.getPrototypeOf(ObsCell)).call(this));

        _this6._base = _base != null ? _base : null;
        _this6.onSet = _this6._mkEv(function () {
          return [null, _this6._base];
        }); // [old, new]
        _this6._shield = false;
        var downstreamCells = function downstreamCells() {
          return _this6.onSet.downstreamCells;
        };
        _this6.refreshAll = function () {
          if (_this6.onSet.downstreamCells.size && !_this6._shield) {
            _this6._shield = true;
            var _cells2 = rx.allDownstream.apply(rx, _toConsumableArray(Array.from(Array.from(downstreamCells()) || [])));
            _cells2.forEach(function (c) {
              return c._shield = true;
            });
            try {
              return _cells2.forEach(function (c) {
                return c.refresh();
              });
            } finally {
              _cells2.forEach(function (c) {
                return c._shield = false;
              });
              _this6._shield = false;
            }
          }
        };
        _this6.refreshSub = rx.autoSub(_this6.onSet, _this6.refreshAll);
        return _this6;
      }

      _createClass(ObsCell, [{
        key: 'all',
        value: function all() {
          var _this7 = this;

          this.subAll(function () {
            return !_this7._shield;
          });
          return this._base;
        }
      }, {
        key: 'get',
        value: function get() {
          return this.all();
        }
      }, {
        key: 'readonly',
        value: function readonly() {
          var _this8 = this;

          return new DepCell(function () {
            return _this8.all();
          });
        }
      }]);

      return ObsCell;
    }(ObsBase);

    var SrcCell = rx.SrcCell = function (_ObsCell) {
      _inherits(SrcCell, _ObsCell);

      function SrcCell() {
        _classCallCheck(this, SrcCell);

        return _possibleConstructorReturn(this, (SrcCell.__proto__ || Object.getPrototypeOf(SrcCell)).apply(this, arguments));
      }

      _createClass(SrcCell, [{
        key: 'set',
        value: function set(x) {
          var _this10 = this;

          return recorder.mutating(function () {
            if (_this10._base !== x) {
              var old = _this10._base;
              _this10._base = x;
              _this10.onSet.pub([old, x]);
              return old;
            }
          });
        }
      }]);

      return SrcCell;
    }(ObsCell);

    var DepCell = rx.DepCell = function (_ObsCell2) {
      _inherits(DepCell, _ObsCell2);

      function DepCell(body, init) {
        _classCallCheck(this, DepCell);

        var _this11 = _possibleConstructorReturn(this, (DepCell.__proto__ || Object.getPrototypeOf(DepCell)).call(this, init != null ? init : null));

        _this11.body = body != null ? body : null;
        _this11.refreshing = false;
        _this11.nestedBinds = [];
        _this11.cleanups = [];
        _this11.upstreamEvents = new Set();
        return _this11;
      }

      _createClass(DepCell, [{
        key: 'refresh',
        value: function refresh() {
          var _this12 = this;

          if (!this.refreshing) {
            var old = this._base;
            // TODO we are immediately disconnecting; something that disconnects upon
            // completion may have better semantics for asynchronous operations:
            //
            // - enabling lagBind to defer evaluation so long as its current
            //   dependencies keep changing
            // - allowing nested binds to continue reacting during asynchronous
            //   operation
            //
            // But the implementation is more complex as it requires being able to
            // create and discard tentative recordings.  It's also unclear whether
            // such a lagBind is more desirable (in the face of changing dependencies)
            // and whether on-completion is what's most generalizable.
            var realDone = function realDone(_base) {
              _this12._base = _base;
              return _this12.onSet.pub([old, _this12._base]);
            };
            var recorded = false;
            var syncResult = null;
            var isSynchronous = false;
            var env = {
              // next two are for tolerating env.done calls from within env.record
              record: function record(f) {
                // TODO document why @refreshing exists
                // guards against recursively evaluating this recorded
                // function (@body or an async body) when calling `.get()`
                if (!_this12.refreshing) {
                  var res = void 0;
                  _this12.disconnect();
                  if (recorded) {
                    throw new Error('this refresh has already recorded its dependencies');
                  }
                  _this12.refreshing = true;
                  recorded = true;
                  try {
                    res = recorder.record(_this12, function () {
                      return f.call(env);
                    });
                  } finally {
                    _this12.refreshing = false;
                  }
                  if (isSynchronous) {
                    realDone(syncResult);
                  }
                  return res;
                }
              },
              done: function done(x) {
                if (old !== x) {
                  if (_this12.refreshing) {
                    isSynchronous = true;
                    return syncResult = x;
                  } else {
                    return realDone(x);
                  }
                }
              }
            };
            return this.body.call(env);
          }
        }
      }, {
        key: 'disconnect',
        value: function disconnect() {
          var _this13 = this;

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            // TODO ordering of cleanup vs unsubscribes may require revisiting
            for (var _iterator3 = Array.from(this.cleanups)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var cleanup = _step3.value;

              cleanup();
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Array.from(this.nestedBinds)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var nestedBind = _step4.value;

              nestedBind.disconnect();
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          this.nestedBinds = [];
          this.cleanups = [];
          this.upstreamEvents.forEach(function (ev) {
            return ev.downstreamCells.delete(_this13);
          });
          return this.upstreamEvents.clear();
        }
      }, {
        key: 'addNestedBind',
        value: function addNestedBind(nestedBind) {
          return this.nestedBinds.push(nestedBind);
        }
      }, {
        key: 'addCleanup',
        value: function addCleanup(cleanup) {
          return this.cleanups.push(cleanup);
        }
      }]);

      return DepCell;
    }(ObsCell);

    var ObsArray = rx.ObsArray = function (_ObsBase2) {
      _inherits(ObsArray, _ObsBase2);

      function ObsArray(_cells, diff) {
        _classCallCheck(this, ObsArray);

        if (_cells == null) {
          _cells = [];
        }
        if (diff == null) {
          diff = rx.basicDiff();
        }

        var _this14 = _possibleConstructorReturn(this, (ObsArray.__proto__ || Object.getPrototypeOf(ObsArray)).call(this));

        _this14._cells = _cells;
        _this14.diff = diff;
        _this14.onChange = _this14._mkEv(function () {
          return [0, [], _this14._cells.map(function (c) {
            return c.raw();
          })];
        }); // [index, removed, added]
        _this14.onChangeCells = _this14._mkEv(function () {
          return [0, [], _this14._cells];
        }); // [index, removed, added]
        _this14._indexed = null;
        return _this14;
      }

      _createClass(ObsArray, [{
        key: 'all',
        value: function all() {
          recorder.sub(this.onChange);
          return this._cells.map(function (c) {
            return c.get();
          });
        }
      }, {
        key: 'raw',
        value: function raw() {
          return this._cells.map(function (c) {
            return c.raw();
          });
        }
      }, {
        key: 'readonly',
        value: function readonly() {
          var _this15 = this;

          return new DepArray(function () {
            return _this15.all();
          });
        }
      }, {
        key: 'rawCells',
        value: function rawCells() {
          return this._cells;
        }
      }, {
        key: 'at',
        value: function at(i) {
          recorder.sub(this.onChange, function () {
            var _Array$from3 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from4 = _slicedToArray(_Array$from3, 3),
                index = _Array$from4[0],
                removed = _Array$from4[1],
                added = _Array$from4[2];

            if (index <= i && removed.length !== added.length) {
              return true;
              // if this element is one of the elements changed
            } else if (removed.length === added.length && i <= index + removed.length) {
              return true;
            } else {
              return false;
            }
          });
          return this._cells[i] != null ? this._cells[i].get() : undefined;
        }
      }, {
        key: 'length',
        value: function length() {
          recorder.sub(this.onChangeCells, function () {
            var _Array$from5 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from6 = _slicedToArray(_Array$from5, 3),
                index = _Array$from6[0],
                removed = _Array$from6[1],
                added = _Array$from6[2];

            return removed.length !== added.length;
          });
          return this._cells.length;
        }
      }, {
        key: 'size',
        value: function size() {
          return this.length();
        }
      }, {
        key: 'map',
        value: function map(f) {
          var ys = new MappedDepArray();
          rx.autoSub(this.onChangeCells, function () {
            var _Array$from7 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from8 = _slicedToArray(_Array$from7, 3),
                index = _Array$from8[0],
                removed = _Array$from8[1],
                added = _Array$from8[2];

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = Array.from(ys._cells.slice(index, index + removed.length))[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var cell = _step5.value;

                cell.disconnect();
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            var newCells = added.map(function (item) {
              return cell = bind(function () {
                return f(item.get());
              });
            });
            return ys.realSpliceCells(index, removed.length, newCells);
          });
          return ys;
        }
      }, {
        key: 'transform',
        value: function transform(f, diff) {
          var _this16 = this;

          return new DepArray(function () {
            return f(_this16.all());
          }, diff);
        }
      }, {
        key: 'filter',
        value: function filter(f) {
          return this.transform(function (arr) {
            return arr.filter(f);
          });
        }
      }, {
        key: 'slice',
        value: function slice(x, y) {
          return this.transform(function (arr) {
            return arr.slice(x, y);
          });
        }
      }, {
        key: 'reduce',
        value: function reduce(f, init) {
          return this.all().reduce(f, init != null ? init : this.at(0));
        }
      }, {
        key: 'reduceRight',
        value: function reduceRight(f, init) {
          return this.all().reduceRight(f, init != null ? init : this.at(0));
        }
      }, {
        key: 'every',
        value: function every(f) {
          return this.all().every(f);
        }
      }, {
        key: 'some',
        value: function some(f) {
          return this.all().some(f);
        }
      }, {
        key: 'indexOf',
        value: function indexOf(val, from) {
          if (from == null) {
            from = 0;
          }return this.all().indexOf(val, from);
        }
      }, {
        key: 'lastIndexOf',
        value: function lastIndexOf(val, from) {
          if (from == null) {
            from = this.length() - 1;
          }
          return this.all().lastIndexOf(val, from);
        }
      }, {
        key: 'join',
        value: function join(separator) {
          if (separator == null) {
            separator = ',';
          }return this.all().join(separator);
        }
      }, {
        key: 'first',
        value: function first() {
          return this.at(0);
        }
      }, {
        key: 'last',
        value: function last() {
          return this.at(this.length() - 1);
        }
      }, {
        key: 'indexed',
        value: function indexed() {
          var _this17 = this;

          if (this._indexed == null) {
            this._indexed = new IndexedDepArray();
            rx.autoSub(this.onChangeCells, function () {
              var _Array$from9 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                  _Array$from10 = _slicedToArray(_Array$from9, 3),
                  index = _Array$from10[0],
                  removed = _Array$from10[1],
                  added = _Array$from10[2];

              return _this17._indexed.realSpliceCells(index, removed.length, added);
            });
          }
          return this._indexed;
        }
      }, {
        key: 'concat',
        value: function concat() {
          for (var _len6 = arguments.length, those = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            those[_key6] = arguments[_key6];
          }

          return rx.concat.apply(rx, [this].concat(_toConsumableArray(Array.from(those))));
        }
      }, {
        key: 'realSpliceCells',
        value: function realSpliceCells(index, count, additions) {
          var _this18 = this;

          var removed = this._cells.splice.apply(this._cells, [index, count].concat(additions));
          var removedElems = rx.snap(function () {
            return Array.from(removed).map(function (x2) {
              return x2.get();
            });
          });
          var addedElems = rx.snap(function () {
            return Array.from(additions).map(function (x3) {
              return x3.get();
            });
          });
          return rx.transaction(function () {
            _this18.onChangeCells.pub([index, removed, additions]);
            return _this18.onChange.pub([index, removedElems, addedElems]);
          });
        }
      }, {
        key: 'realSplice',
        value: function realSplice(index, count, additions) {
          return this.realSpliceCells(index, count, additions.map(rx.cell));
        }
      }, {
        key: '_update',
        value: function _update(val, diff) {
          var _this19 = this;

          var left = void 0;
          if (diff == null) {
            diff = this.diff;
          }
          var old = rx.snap(function () {
            return Array.from(_this19._cells).map(function (x) {
              return x.get();
            });
          });
          var fullSplice = [0, old.length, val];
          var x = null;
          var splices = diff != null ? (left = permToSplices(old.length, val, diff(old, val))) != null ? left : [fullSplice] : [fullSplice];
          //console.log(old, val, splices, fullSplice, diff, @diff)
          return function () {
            var result = [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = Array.from(splices)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var splice = _step6.value;

                var _Array$from11 = Array.from(splice),
                    _Array$from12 = _slicedToArray(_Array$from11, 3),
                    index = _Array$from12[0],
                    count = _Array$from12[1],
                    additions = _Array$from12[2];

                result.push(_this19.realSplice(index, count, additions));
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            return result;
          }();
        }
      }]);

      return ObsArray;
    }(ObsBase);

    var SrcArray = rx.SrcArray = function (_ObsArray) {
      _inherits(SrcArray, _ObsArray);

      function SrcArray() {
        _classCallCheck(this, SrcArray);

        return _possibleConstructorReturn(this, (SrcArray.__proto__ || Object.getPrototypeOf(SrcArray)).apply(this, arguments));
      }

      _createClass(SrcArray, [{
        key: 'spliceArray',
        value: function spliceArray(index, count, additions) {
          var _this21 = this;

          return recorder.mutating(function () {
            return _this21.realSplice(index, count, additions);
          });
        }
      }, {
        key: 'splice',
        value: function splice(index, count) {
          for (var _len7 = arguments.length, additions = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
            additions[_key7 - 2] = arguments[_key7];
          }

          return this.spliceArray(index, count, additions);
        }
      }, {
        key: 'insert',
        value: function insert(x, index) {
          return this.splice(index, 0, x);
        }
      }, {
        key: 'remove',
        value: function remove(x) {
          var i = _(this.raw()).indexOf(x);
          if (i >= 0) {
            return this.removeAt(i);
          }
        }
      }, {
        key: 'removeAll',
        value: function removeAll(x) {
          var _this22 = this;

          return rx.transaction(function () {
            var i = _(rx.snap(function () {
              return _this22.all();
            })).indexOf(x);
            return function () {
              var result = [];
              while (i >= 0) {
                _this22.removeAt(i);
                result.push(i = _(rx.snap(function () {
                  return _this22.all();
                })).indexOf(x));
              }
              return result;
            }();
          });
        }
      }, {
        key: 'removeAt',
        value: function removeAt(index) {
          var _this23 = this;

          var val = rx.snap(function () {
            return _this23.at(index);
          });
          this.splice(index, 1);
          return val;
        }
      }, {
        key: 'push',
        value: function push(x) {
          var _this24 = this;

          return this.splice(rx.snap(function () {
            return _this24.length();
          }), 0, x);
        }
      }, {
        key: 'pop',
        value: function pop() {
          var _this25 = this;

          return this.removeAt(rx.snap(function () {
            return _this25.length() - 1;
          }));
        }
      }, {
        key: 'put',
        value: function put(i, x) {
          return this.splice(i, 1, x);
        }
      }, {
        key: 'replace',
        value: function replace(xs) {
          var _this26 = this;

          return this.spliceArray(0, rx.snap(function () {
            return _this26.length();
          }), xs);
        }
      }, {
        key: 'unshift',
        value: function unshift(x) {
          return this.insert(x, 0);
        }
      }, {
        key: 'shift',
        value: function shift() {
          return this.removeAt(0);
        }
      }, {
        key: 'update',
        value: function update(xs) {
          var _this27 = this;

          return recorder.mutating(function () {
            return _this27._update(xs);
          });
        }
      }, {
        key: 'move',
        value: function move(src, dest) {
          var _this28 = this;

          return rx.transaction(function () {
            // moves element at src to index before dest
            if (src === dest) {
              return;
            }

            var len = rx.snap(function () {
              return _this28.length();
            });

            if (src < 0 || src > len - 1) {
              throw 'Source ' + src + ' is outside of bounds of array of length ' + len;
            }
            if (dest < 0 || dest > len) {
              throw 'Destination ' + dest + ' is outside of bounds of array of length ' + len;
            }

            var val = rx.snap(function () {
              return _this28.all()[src];
            });

            if (src > dest) {
              _this28.removeAt(src);
              _this28.insert(val, dest);
            } else {
              _this28.insert(val, dest);
              _this28.removeAt(src);
            }
          });
        }
      }, {
        key: 'swap',
        value: function swap(i1, i2) {
          var _this29 = this;

          return rx.transaction(function () {
            var len = rx.snap(function () {
              return _this29.length();
            });
            if (i1 < 0 || i1 > len - 1) {
              throw 'i1 ' + i1 + ' is outside of bounds of array of length ' + len;
            }
            if (i2 < 0 || i2 > len - 1) {
              throw 'i2 ' + i2 + ' is outside of bounds of array of length ' + len;
            }

            var first = Math.min(i1, i2);
            var second = Math.max(i1, i2);

            _this29.move(first, second);
            return _this29.move(second, first);
          });
        }
      }, {
        key: 'reverse',
        value: function reverse() {
          var _this30 = this;

          // Javascript's Array.reverse both reverses the Array and returns its new value
          this.update(rx.snap(function () {
            return _this30.all().reverse();
          }));
          return rx.snap(function () {
            return _this30.all();
          });
        }
      }]);

      return SrcArray;
    }(ObsArray);

    var MappedDepArray = rx.MappedDepArray = function (_ObsArray2) {
      _inherits(MappedDepArray, _ObsArray2);

      function MappedDepArray() {
        _classCallCheck(this, MappedDepArray);

        return _possibleConstructorReturn(this, (MappedDepArray.__proto__ || Object.getPrototypeOf(MappedDepArray)).call(this));
      }

      return MappedDepArray;
    }(ObsArray);
    var IndexedDepArray = rx.IndexedDepArray = function (_ObsArray3) {
      _inherits(IndexedDepArray, _ObsArray3);

      function IndexedDepArray(xs, diff) {
        _classCallCheck(this, IndexedDepArray);

        if (xs == null) {
          xs = [];
        }

        var _this32 = _possibleConstructorReturn(this, (IndexedDepArray.__proto__ || Object.getPrototypeOf(IndexedDepArray)).call(this, xs, diff));

        _this32.is = Array.from(_this32._cells).map(function (x, i) {
          return rx.cell(i);
        });
        _this32.onChangeCells = _this32._mkEv(function () {
          return [0, [], _.zip(_this32._cells, _this32.is)];
        }); // [index, removed, added]
        _this32.onChange = _this32._mkEv(function () {
          return [0, [], _.zip(_this32.is, rx.snap(function () {
            return _this32.all();
          }))];
        });
        return _this32;
      }
      // TODO duplicate code with ObsArray


      _createClass(IndexedDepArray, [{
        key: 'map',
        value: function map(f) {
          var ys = new MappedDepArray();
          rx.autoSub(this.onChangeCells, function () {
            var _Array$from13 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from14 = _slicedToArray(_Array$from13, 3),
                index = _Array$from14[0],
                removed = _Array$from14[1],
                added = _Array$from14[2];

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = Array.from(ys._cells.slice(index, index + removed.length))[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var cell = _step7.value;

                cell.disconnect();
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            var newCells = function () {
              var result = [];
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = Array.from(added)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var _step8$value = _slicedToArray(_step8.value, 2),
                      item = _step8$value[0],
                      icell = _step8$value[1];

                  result.push(cell = bind(function () {
                    return f(item.get(), icell);
                  }));
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
              }

              return result;
            }();
            return ys.realSpliceCells(index, removed.length, newCells);
          });
          return ys;
        }
      }, {
        key: 'realSpliceCells',
        value: function realSpliceCells(index, count, additions) {
          var _is,
              _this33 = this;

          var i = void 0;
          var removed = this._cells.splice.apply(this._cells, [index, count].concat(additions));
          var removedElems = rx.snap(function () {
            return Array.from(removed).map(function (x2) {
              return x2.get();
            });
          });

          var iterable = this.is.slice(index + count);
          for (var offset = 0; offset < iterable.length; offset++) {
            i = iterable[offset];
            i.set(index + additions.length + offset);
          }
          var newIs = function () {
            var asc = void 0,
                end = void 0;
            var result = [];
            for (i = 0, end = additions.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
              result.push(rx.cell(index + i));
            }
            return result;
          }();
          (_is = this.is).splice.apply(_is, [index, count].concat(_toConsumableArray(Array.from(newIs))));

          var addedElems = rx.snap(function () {
            return Array.from(additions).map(function (x3) {
              return x3.get();
            });
          });
          return rx.transaction(function () {
            _this33.onChangeCells.pub([index, removed, _.zip(additions, newIs)]);
            return _this33.onChange.pub([index, removedElems, _.zip(addedElems, newIs)]);
          });
        }
      }]);

      return IndexedDepArray;
    }(ObsArray);
    var IndexedMappedDepArray = rx.IndexedMappedDepArray = function (_IndexedDepArray) {
      _inherits(IndexedMappedDepArray, _IndexedDepArray);

      function IndexedMappedDepArray() {
        _classCallCheck(this, IndexedMappedDepArray);

        return _possibleConstructorReturn(this, (IndexedMappedDepArray.__proto__ || Object.getPrototypeOf(IndexedMappedDepArray)).apply(this, arguments));
      }

      return IndexedMappedDepArray;
    }(IndexedDepArray);

    var DepArray = rx.DepArray = function (_ObsArray4) {
      _inherits(DepArray, _ObsArray4);

      function DepArray(f, diff) {
        _classCallCheck(this, DepArray);

        var _this35 = _possibleConstructorReturn(this, (DepArray.__proto__ || Object.getPrototypeOf(DepArray)).call(this, [], diff));

        _this35.f = f;
        rx.autoSub(bind(function () {
          return Array.from(_this35.f());
        }).onSet, function () {
          var _Array$from15 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
              _Array$from16 = _slicedToArray(_Array$from15, 2),
              old = _Array$from16[0],
              val = _Array$from16[1];

          return _this35._update(val);
        });
        return _this35;
      }

      return DepArray;
    }(ObsArray);

    var IndexedArray = rx.IndexedArray = function (_DepArray) {
      _inherits(IndexedArray, _DepArray);

      function IndexedArray(_cells) {
        _classCallCheck(this, IndexedArray);

        var _this36 = _possibleConstructorReturn(this, (IndexedArray.__proto__ || Object.getPrototypeOf(IndexedArray)).call(this));

        _this36._cells = _cells;
        return _this36;
      }

      _createClass(IndexedArray, [{
        key: 'map',
        value: function map(f) {
          var ys = new MappedDepArray();
          rx.autoSub(this._cells.onChange, function () {
            var _Array$from17 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from18 = _slicedToArray(_Array$from17, 3),
                index = _Array$from18[0],
                removed = _Array$from18[1],
                added = _Array$from18[2];

            return ys.realSplice(index, removed.length, added.map(f));
          });
          return ys;
        }
      }]);

      return IndexedArray;
    }(DepArray);

    rx.concat = function () {
      for (var _len8 = arguments.length, xss = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        xss[_key8] = arguments[_key8];
      }

      var xs = void 0;
      var ys = new MappedDepArray();
      var casted = xss.map(function (xs) {
        return rx.cast(xs, 'array');
      });
      var repLens = function () {
        var result = [];
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Array.from(xss)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            xs = _step9.value;
            result.push(0);
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        return result;
      }();
      casted.forEach(function (xs, i) {
        return rx.autoSub(xs.onChange, function () {
          var _Array$from19 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
              _Array$from20 = _slicedToArray(_Array$from19, 3),
              index = _Array$from20[0],
              removed = _Array$from20[1],
              added = _Array$from20[2];

          var xsOffset = sum(repLens.slice(0, i));
          repLens[i] += added.length - removed.length;
          return ys.realSplice(xsOffset + index, removed.length, added);
        });
      });
      return ys;
    };

    var objToJSMap = function objToJSMap(obj) {
      if (obj instanceof Map) {
        return obj;
      } else if (_.isArray(obj)) {
        return new Map(obj);
      } else {
        return new Map(_.pairs(obj));
      }
    };

    var ObsMap = rx.ObsMap = function (_ObsBase3) {
      _inherits(ObsMap, _ObsBase3);

      function ObsMap(_base) {
        _classCallCheck(this, ObsMap);

        if (_base == null) {
          _base = new Map();
        }

        var _this37 = _possibleConstructorReturn(this, (ObsMap.__proto__ || Object.getPrototypeOf(ObsMap)).call(this));

        _this37._base = objToJSMap(_base);
        _this37.onAdd = _this37._mkEv(function () {
          return new Map(_this37._base);
        }); // {key: new...}
        _this37.onRemove = _this37._mkEv(function () {
          return new Map();
        }); // {key: old...}
        _this37.onChange = _this37._mkEv(function () {
          return new Map();
        }); // {key: [old, new]...}
        return _this37;
      }

      _createClass(ObsMap, [{
        key: 'get',
        value: function get(key) {
          this.subAll(function (result) {
            return result.has(key);
          });
          return this._base.get(key);
        }
      }, {
        key: 'has',
        value: function has(key) {
          recorder.sub(this.onAdd, function (additions) {
            return additions.has(key);
          });
          recorder.sub(this.onRemove, function (removals) {
            return removals.has(key);
          });
          return this._base.has(key);
        }
      }, {
        key: 'all',
        value: function all() {
          this.subAll();
          return new Map(this._base);
        }
      }, {
        key: 'readonly',
        value: function readonly() {
          var _this38 = this;

          return new DepMap(function () {
            return _this38.all();
          });
        }
      }, {
        key: 'size',
        value: function size() {
          recorder.sub(this.onRemove);
          recorder.sub(this.onAdd);
          return this._base.size;
        }
      }, {
        key: 'realPut',
        value: function realPut(key, val) {
          if (this._base.has(key)) {
            var old = this._base.get(key);
            if (old !== val) {
              this._base.set(key, val);
              this.onChange.pub(new Map([[key, [old, val]]]));
            }
            return old;
          } else {
            this._base.set(key, val);
            this.onAdd.pub(new Map([[key, val]]));
            return undefined;
          }
        }
      }, {
        key: 'realRemove',
        value: function realRemove(key) {
          var val = mapPop(this._base, key);
          this.onRemove.pub(new Map([[key, val]]));
          return val;
        }
      }, {
        key: '_update',
        value: function _update(other) {
          var _this39 = this;

          var val = void 0;
          var otherMap = objToJSMap(other);
          var ret = new Map(this._base);
          var removals = function () {
            return _.chain(Array.from(_this39._base.keys())).difference(Array.from(otherMap.keys())).map(function (k) {
              return [k, mapPop(_this39._base, k)];
            }).value();
          }();

          var additions = function () {
            return _.chain(Array.from(otherMap.keys())).difference(Array.from(_this39._base.keys())).map(function (k) {
              val = otherMap.get(k);
              _this39._base.set(k, val);
              return [k, val];
            }).value();
          }();

          var changes = function () {
            var k = void 0;
            return _.chain(Array.from(otherMap)).filter(function () {
              var _Array$from21 = Array.from(arguments.length <= 0 ? undefined : arguments[0]);

              var _Array$from22 = _slicedToArray(_Array$from21, 2);

              k = _Array$from22[0];
              val = _Array$from22[1];
              return _this39._base.has(k) && _this39._base.get(k) !== val;
            }).map(function () {
              var _Array$from23 = Array.from(arguments.length <= 0 ? undefined : arguments[0]);

              var _Array$from24 = _slicedToArray(_Array$from23, 2);

              k = _Array$from24[0];
              val = _Array$from24[1];

              var old = _this39._base.get(k);
              _this39._base.set(k, val);
              return [k, [old, val]];
            }).value();
          }();

          rx.transaction(function () {
            if (removals.length) {
              _this39.onRemove.pub(new Map(removals));
            }
            if (additions.length) {
              _this39.onAdd.pub(new Map(additions));
            }
            if (changes.length) {
              return _this39.onChange.pub(new Map(changes));
            }
          });

          return ret;
        }
      }]);

      return ObsMap;
    }(ObsBase);

    var SrcMap = rx.SrcMap = function (_ObsMap) {
      _inherits(SrcMap, _ObsMap);

      function SrcMap() {
        _classCallCheck(this, SrcMap);

        return _possibleConstructorReturn(this, (SrcMap.__proto__ || Object.getPrototypeOf(SrcMap)).apply(this, arguments));
      }

      _createClass(SrcMap, [{
        key: 'put',
        value: function put(key, val) {
          var _this41 = this;

          return recorder.mutating(function () {
            return _this41.realPut(key, val);
          });
        }
      }, {
        key: 'set',
        value: function set(key, val) {
          return this.put(key, val);
        }
      }, {
        key: 'delete',
        value: function _delete(key) {
          var _this42 = this;

          return recorder.mutating(function () {
            var val = undefined;
            if (_this42._base.has(key)) {
              val = _this42.realRemove(key);
              _this42.onRemove.pub(new Map([[key, val]]));
            }
            return val;
          });
        }
      }, {
        key: 'remove',
        value: function remove(key) {
          return this.delete(key);
        }
      }, {
        key: 'clear',
        value: function clear() {
          var _this43 = this;

          return recorder.mutating(function () {
            var removals = new Map(_this43._base);
            _this43._base.clear();
            if (removals.size) {
              _this43.onRemove.pub(removals);
            }
            return removals;
          });
        }
      }, {
        key: 'update',
        value: function update(x) {
          var _this44 = this;

          return recorder.mutating(function () {
            return _this44._update(x);
          });
        }
      }]);

      return SrcMap;
    }(ObsMap);

    var DepMap = rx.DepMap = function (_ObsMap2) {
      _inherits(DepMap, _ObsMap2);

      function DepMap(f) {
        _classCallCheck(this, DepMap);

        var _this45 = _possibleConstructorReturn(this, (DepMap.__proto__ || Object.getPrototypeOf(DepMap)).call(this));

        _this45.f = f;
        var c = bind(_this45.f);
        rx.autoSub(c.onSet, function () {
          var _Array$from25 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
              _Array$from26 = _slicedToArray(_Array$from25, 2),
              old = _Array$from26[0],
              val = _Array$from26[1];

          return _this45._update(val);
        });
        return _this45;
      }

      return DepMap;
    }(ObsMap);

    //
    // Converting POJO attributes to reactive ones.
    //

    var objToJSSet = function objToJSSet(obj) {
      if (obj instanceof Set) {
        return obj;
      } else {
        return new Set(obj);
      }
    };
    var _castOther = function _castOther(other) {
      if (other instanceof Set) {
        other;
      } else if (other instanceof ObsSet) {
        other = other.all();
      }

      if (other instanceof ObsArray) {
        other = other.all();
      }
      if (other instanceof ObsCell) {
        other = other.get();
      }
      return new Set(other);
    };

    var ObsSet = rx.ObsSet = function (_ObsBase4) {
      _inherits(ObsSet, _ObsBase4);

      function ObsSet(_base) {
        _classCallCheck(this, ObsSet);

        if (_base == null) {
          _base = new Set();
        }

        var _this46 = _possibleConstructorReturn(this, (ObsSet.__proto__ || Object.getPrototypeOf(ObsSet)).call(this));

        _this46._base = objToJSSet(_base);
        _this46.onChange = _this46._mkEv(function () {
          return [_this46._base, new Set()];
        }); // additions, removals
        return _this46;
      }

      _createClass(ObsSet, [{
        key: 'has',
        value: function has(key) {
          this.subAll(function () {
            var _Array$from27 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from28 = _slicedToArray(_Array$from27, 2),
                additions = _Array$from28[0],
                removals = _Array$from28[1];

            return additions.has(key) || removals.has(key);
          });
          return this._base.has(key);
        }
      }, {
        key: 'all',
        value: function all() {
          this.subAll();
          return new Set(this._base);
        }
      }, {
        key: 'readonly',
        value: function readonly() {
          var _this47 = this;

          return new DepSet(function () {
            return _this47.all();
          });
        }
      }, {
        key: 'values',
        value: function values() {
          return this.all();
        }
      }, {
        key: 'entries',
        value: function entries() {
          return this.all();
        }
      }, {
        key: 'size',
        value: function size() {
          this.subAll(function () {
            var _Array$from29 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
                _Array$from30 = _slicedToArray(_Array$from29, 2),
                additions = _Array$from30[0],
                removals = _Array$from30[1];

            return additions.size !== removals.size;
          });
          return this._base.size;
        }
      }, {
        key: 'union',
        value: function union(other) {
          var _this48 = this;

          return new DepSet(function () {
            return _union(_this48.all(), _castOther(other));
          });
        }
      }, {
        key: 'intersection',
        value: function intersection(other) {
          var _this49 = this;

          return new DepSet(function () {
            return _intersection(_this49.all(), _castOther(other));
          });
        }
      }, {
        key: 'difference',
        value: function difference(other) {
          var _this50 = this;

          return new DepSet(function () {
            return _difference(_this50.all(), _castOther(other));
          });
        }
      }, {
        key: 'symmetricDifference',
        value: function symmetricDifference(other) {
          var _this51 = this;

          return new DepSet(function () {
            var me = _this51.all();
            other = _castOther(other);
            return new Set(Array.from(_union(me, other)).filter(function (item) {
              return !me.has(item) || !other.has(item);
            }));
          });
        }
      }, {
        key: '_update',
        value: function _update(y) {
          var _this52 = this;

          return rx.transaction(function () {
            var old_ = new Set(_this52._base);
            var new_ = objToJSSet(y);

            var additions = new Set();
            var removals = new Set();

            // JS sets don't come with subtraction :(
            old_.forEach(function (item) {
              if (!new_.has(item)) {
                return removals.add(item);
              }
            });
            new_.forEach(function (item) {
              if (!old_.has(item)) {
                return additions.add(item);
              }
            });

            old_.forEach(function (item) {
              return _this52._base.delete(item);
            });
            new_.forEach(function (item) {
              return _this52._base.add(item);
            });

            _this52.onChange.pub([additions, removals]);
            return old_;
          });
        }
      }]);

      return ObsSet;
    }(ObsBase);

    var SrcSet = rx.SrcSet = function (_ObsSet) {
      _inherits(SrcSet, _ObsSet);

      function SrcSet() {
        _classCallCheck(this, SrcSet);

        return _possibleConstructorReturn(this, (SrcSet.__proto__ || Object.getPrototypeOf(SrcSet)).apply(this, arguments));
      }

      _createClass(SrcSet, [{
        key: 'add',
        value: function add(item) {
          var _this54 = this;

          return recorder.mutating(function () {
            if (!_this54._base.has(item)) {
              _this54._base.add(item);
              _this54.onChange.pub([new Set([item]), new Set()]);
            }
            return item;
          });
        }
      }, {
        key: 'put',
        value: function put(item) {
          return this.add(item);
        }
      }, {
        key: 'delete',
        value: function _delete(item) {
          var _this55 = this;

          return recorder.mutating(function () {
            if (_this55._base.has(item)) {
              _this55._base.delete(item);
              _this55.onChange.pub([new Set(), new Set([item])]);
            }
            return item;
          });
        }
      }, {
        key: 'remove',
        value: function remove(item) {
          return this.delete(item);
        }
      }, {
        key: 'clear',
        value: function clear() {
          var _this56 = this;

          return recorder.mutating(function () {
            var removals = new Set(_this56._base);
            if (_this56._base.size) {
              _this56._base.clear();
              _this56.onChange.pub([new Set(), removals]);
            }
            return removals;
          });
        }
      }, {
        key: 'update',
        value: function update(y) {
          var _this57 = this;

          return recorder.mutating(function () {
            return _this57._update(y);
          });
        }
      }]);

      return SrcSet;
    }(ObsSet);

    var DepSet = rx.DepSet = function (_ObsSet2) {
      _inherits(DepSet, _ObsSet2);

      function DepSet(f) {
        _classCallCheck(this, DepSet);

        var _this58 = _possibleConstructorReturn(this, (DepSet.__proto__ || Object.getPrototypeOf(DepSet)).call(this));

        _this58.f = f;
        var c = bind(_this58.f);
        rx.autoSub(c.onSet, function () {
          var _Array$from31 = Array.from(arguments.length <= 0 ? undefined : arguments[0]),
              _Array$from32 = _slicedToArray(_Array$from31, 2),
              old = _Array$from32[0],
              val = _Array$from32[1];

          return _this58._update(val);
        });
        return _this58;
      }

      return DepSet;
    }(ObsSet);

    rx.cellToSet = function (c) {
      return new rx.DepSet(function () {
        return c.get();
      });
    };

    rx.liftSpec = function (obj) {
      return _.object(function () {
        var result = [];

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = Array.from(Object.getOwnPropertyNames(obj))[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var name = _step10.value;

            var val = obj[name];
            if (val != null && [rx.ObsMap, rx.ObsCell, rx.ObsArray, rx.ObsSet].some(function (cls) {
              return val instanceof cls;
            })) {
              continue;
            }
            var _type = _.isFunction(val) ? null : _.isArray(val) ? 'array' : val instanceof Set ? 'set' : val instanceof Map ? 'map' : 'cell';
            result.push([name, { type: _type, val: val }]);
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }

        return result;
      }());
    };

    rx.lift = function (x, fieldspec) {
      if (fieldspec == null) {
        fieldspec = rx.liftSpec(x);
      }
      return _.mapObject(fieldspec, function (_ref2, name) {
        var type = _ref2.type;

        if (!(x[name] instanceof ObsBase) && type in rx.types) {
          return rx[type](x[name]);
        }
        return x[name];
      });
    };

    rx.unlift = function (x) {
      return _.mapObject(x, function (v) {
        if (v instanceof rx.ObsBase) {
          return v.all();
        } else {
          return v;
        }
      });
    };

    //
    // Implicitly reactive objects
    //

    rx.reactify = function (obj, fieldspec) {
      var spec = void 0;
      if (_.isArray(obj)) {
        var arr = rx.array(_.clone(obj));
        Object.defineProperties(obj, _.object(Object.getOwnPropertyNames(SrcArray.prototype).concat(Object.getOwnPropertyNames(ObsArray.prototype)).concat(Object.getOwnPropertyNames(ObsBase.prototype)).filter(function (methName) {
          return methName !== 'length';
        }).map(function (methName) {
          var meth = obj[methName];
          var newMeth = function newMeth() {
            var _arr$methName;

            var res = void 0;

            for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
              args[_key9] = arguments[_key9];
            }

            if (meth != null) {
              res = meth.call.apply(meth, [obj].concat(args));
            }
            (_arr$methName = arr[methName]).call.apply(_arr$methName, [arr].concat(args));
            return res;
          };
          spec = {
            configurable: true,
            enumerable: false,
            value: newMeth,
            writable: true
          };
          return [methName, spec];
        })));
        return obj;
      } else {
        return Object.defineProperties(obj, _.object(function () {
          var result = [];

          for (var name in fieldspec) {
            spec = fieldspec[name];
            result.push(function (name, spec) {
              var desc = null;
              switch (spec.type) {
                case 'cell':
                  var obs = rx.cell(spec.val != null ? spec.val : null);
                  desc = {
                    configurable: true,
                    enumerable: true,
                    get: function get() {
                      return obs.get();
                    },
                    set: function set(x) {
                      return obs.set(x);
                    }
                  };
                  break;
                case 'array':
                  var view = rx.reactify(spec.val != null ? spec.val : []);
                  desc = {
                    configurable: true,
                    enumerable: true,
                    get: function get() {
                      view.all();
                      return view;
                    },
                    set: function set(x) {
                      view.splice.apply(view, [0, view.length].concat(_toConsumableArray(Array.from(x))));
                      return view;
                    }
                  };
                  break;
                default:
                  throw new Error('Unknown observable type: ' + type);
              }
              return [name, desc];
            }(name, spec));
          }

          return result;
        }()));
      }
    };

    rx.autoReactify = function (obj) {
      return rx.reactify(obj, _.object(function () {
        var result = [];

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = Array.from(Object.getOwnPropertyNames(obj))[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var name = _step11.value;

            var val = obj[name];
            if (val instanceof ObsBase) {
              continue;
            }
            var _type2 = _.isFunction(val) ? null : _.isArray(val) ? 'array' : 'cell';
            result.push([name, { type: _type2, val: val }]);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return result;
      }()));
    };

    rx.cell = function (value) {
      return new SrcCell(value);
    };
    rx.cell.from = function (value) {
      if (value instanceof ObsCell) {
        return value;
      } else if (value instanceof ObsBase) {
        return bind(function () {
          return value.all();
        });
      } else {
        return bind(function () {
          return value;
        });
      }
    };

    rx.array = function (xs, diff) {
      return new SrcArray((xs != null ? xs : []).map(rx.cell), diff);
    };
    rx.array.from = function (value, diff) {
      var f = void 0;
      if (value instanceof rx.ObsArray) {
        return value;
      } else if (_.isArray(value)) {
        f = function f() {
          return value;
        };
      } else if (value instanceof ObsBase) {
        f = function f() {
          return value.all();
        };
      } else {
        throw new Error('Cannot cast ' + value.constructor.name + ' to array!');
      }

      return new DepArray(f, diff);
    };

    rx.map = function (value) {
      return new SrcMap(value);
    };
    rx.map.from = function (value) {
      if (value instanceof rx.ObsMap) {
        return value;
      } else if (value instanceof ObsBase) {
        return new DepMap(function () {
          return value.get();
        });
      } else {
        return new DepMap(function () {
          return value;
        });
      }
    };

    rx.set = function (value) {
      return new SrcSet(value);
    };
    rx.set.from = function (value) {
      if (value instanceof rx.ObsSet) {
        return value;
      } else if (value instanceof rx.ObsBase) {
        return new DepSet(function () {
          return value.all();
        });
      } else {
        return new DepSet(function () {
          return value;
        });
      }
    };

    rx.cast = function (value, type) {
      if (type == null) {
        type = 'cell';
      }
      if ([ObsCell, ObsArray, ObsMap, ObsSet].includes(type)) {
        var realType = null;
        switch (type) {
          case ObsCell:
            realType = 'cell';break;
          case ObsArray:
            realType = 'array';break;
          case ObsMap:
            realType = 'map';break;
          case ObsSet:
            realType = 'set';break;
        }
        type = realType;
      }
      if (_.isString(type)) {
        if (type in rx.types) {
          return rx[type].from(value);
        } else {
          return value;
        }
      } else {
        var opts = value;
        var types = type;
        var x = _.mapObject(opts, function (value, key) {
          if (types[key]) {
            return rx.cast(value, types[key]);
          } else {
            return value;
          }
        });
        return x;
      }
    };

    //
    // Reactive utilities
    //

    rx.flatten = function (xs) {
      return new DepArray(function () {
        return _.chain(flattenHelper([xs])).flatten().filter(function (x) {
          return x != null;
        }).value();
      });
    };

    var prepContents = function prepContents(contents) {
      if (contents instanceof ObsCell || contents instanceof ObsArray || _.isArray(contents)) {
        contents = rx.flatten(contents);
      }
      return contents;
    };

    var flattenHelper = function flattenHelper(x) {
      if (x instanceof ObsArray) {
        return flattenHelper(x.all());
      } else if (x instanceof ObsSet) {
        return flattenHelper(Array.from(x.values()));
      } else if (x instanceof ObsCell) {
        return flattenHelper(x.get());
      } else if (x instanceof Set) {
        return flattenHelper(Array.from(x));
      } else if (_.isArray(x)) {
        return x.map(function (x_k) {
          return flattenHelper(x_k);
        });
      } else {
        return x;
      }
    };

    var flatten = function flatten(xss) {
      var xs = _.flatten(xss);
      return rx.cellToArray(bind(function () {
        return _.flatten(xss);
      }));
    };

    rx.cellToArray = function (cell, diff) {
      return new DepArray(function () {
        return cell.get();
      }, diff);
    };
    rx.cellToMap = function (cell) {
      return new rx.DepMap(function () {
        return cell.get();
      });
    };
    rx.cellToSet = function (c) {
      return new rx.DepSet(function () {
        return c.get();
      });
    };

    // O(n) using hash key
    rx.basicDiff = function (key) {
      if (key == null) {
        key = rx.smartUidify;
      }return function (oldXs, newXs) {
        var x = void 0;
        var oldKeys = mkMap(function () {
          var result = [];
          for (var i = 0; i < oldXs.length; i++) {
            x = oldXs[i];
            result.push([key(x), i]);
          }
          return result;
        }());
        return function () {
          var result1 = [];
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = Array.from(newXs)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              x = _step12.value;
              var left;
              result1.push((left = oldKeys[key(x)]) != null ? left : -1);
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          return result1;
        }();
      };
    };

    // This is invasive; WeakMaps can't come soon enough....
    rx.uidify = function (x) {
      return x.__rxUid != null ? x.__rxUid : Object.defineProperty(x, '__rxUid', {
        enumerable: false,
        value: mkuid()
      }).__rxUid;
    };

    // Need a "hash" that distinguishes different types and distinguishes object
    // UIDs from ints.
    rx.smartUidify = function (x) {
      if (_.isObject(x)) {
        return rx.uidify(x);
      } else {
        return JSON.stringify(x);
      }
    };

    // Note: this gives up and returns null if there are reorderings or
    // duplications; only handles (multiple) simple insertions and removals
    // (batching them together into splices).
    var permToSplices = function permToSplices(oldLength, newXs, perm) {
      var i = void 0;
      if (!newXs.length) {
        return null; // just do a full splice if we're emptying the array
      }
      var refs = function () {
        var result = [];
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = Array.from(perm)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            i = _step13.value;
            if (i >= 0) {
              result.push(i);
            }
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
              _iterator13.return();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }

        return result;
      }();
      if (_.some(function () {
        var asc = void 0,
            end = void 0;
        var result1 = [];
        for (i = 0, end = refs.length - 1, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          result1.push(refs[i + 1] - refs[i] <= 0);
        }
        return result1;
      }())) {
        return null;
      }
      var splices = [];
      var last = -1;
      i = 0;
      while (i < perm.length) {
        // skip over any good consecutive runs
        while (i < perm.length && perm[i] === last + 1) {
          last += 1;
          i += 1;
        }
        // lump any additions into this splice
        var splice = { index: i, count: 0, additions: [] };
        while (i < perm.length && perm[i] === -1) {
          splice.additions.push(newXs[i]);
          i += 1;
        }
        // Find the step difference to find how many from old were removed/skipped;
        // if no step (perm[i] == last + 1) then count should be 0.  If we see no
        // more references to old elements, then we need oldLength to determine how
        // many remaining old elements were logically removed.
        var cur = i === perm.length ? oldLength : perm[i];
        splice.count = cur - (last + 1);
        if (splice.count > 0 || splice.additions.length > 0) {
          splices.push([splice.index, splice.count, splice.additions]);
        }
        last = cur;
        i += 1;
      }
      return splices;
    };

    rx.transaction = function (f) {
      return depMgr.transaction(f);
    };
    return rx;
  };
  // end rxFactory definition

  var rx = exports.rx = rxFactory(_underscore2.default);
});

