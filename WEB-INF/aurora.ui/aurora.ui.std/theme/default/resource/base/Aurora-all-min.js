Ext.Ajax.timeout = 1800000;
$A = Aurora = {
    version: "1.0",
    revision: "$Rev: 8158 $"
};
$A.fireWindowResize = function() {
    if ($A.winWidth != $A.getViewportWidth() || $A.winHeight != $A.getViewportHeight()) {
        $A.winHeight = $A.getViewportHeight();
        $A.winWidth = $A.getViewportWidth();
        $A.Cover.resizeCover()
    }
};
if (Ext.isIE6) {
    Ext.EventManager.on(window, "resize", $A.fireWindowResize, this)
}
$A.cache = {};
$A.cmps = {};
$A.onReady = function(c, b, a) {
    if (window.__host) {
        if (!$A.loadEvent) {
            $A.loadEvent = new Ext.util.Event()
        }
        $A.loadEvent.addListener(c, b, a)
    } else {
        Ext.onReady(c, b, a)
    }
};
$A.get = Ext.get;
$A.defaultDateFormat = "isoDate";
$A.defaultDateTimeFormat = "yyyy-mm-dd HH:MM:ss";
$A.defaultChineseLength = 2;
$A.go = function(a) {
    if (!a) {
        return
    }
    var b = Math.random();
    location.href = a + (a.indexOf("?") == -1 ? "?": "&") + "__r__=" + b
};
$A.center = function(b) {
    var e;
    if (typeof(b) == "string") {
        var c = $A.CmpManager.get(b);
        if (c) {
            if (c.wrap) {
                e = c.wrap
            }
        } else {
            e = Ext.get(b)
        }
    } else {
        e = Ext.get(b)
    }
    var d = $A.getViewportWidth();
    var g = $A.getViewportHeight();
    var a = Math.max(0, (d - e.getWidth()) / 2);
    var f = Math.max(0, (g - e.getHeight()) / 2);
    e.setStyle("position", "absolute");
    e.moveTo(a, f)
};
$A.setTheme = function(a) {
    if (a) {
        var b = new Date();
        b.setTime(b.getTime() + 24 * 3600 * 1000);
        document.cookie = "app_theme=" + escape(a) + ";expires=" + b.toGMTString();
        window.location.reload()
    }
};
$A.getTheme = function() {
    return this.getCookie("app_theme")
};
$A.CmpManager = function() {
    return {
        put: function(b, a) {
            if (!this.cache) {
                this.cache = {}
            }
            if (this.cache[b] != null) {
                alert("错误: ID为' " + b + " '的组件已经存在!");
                return
            }
            if (window.__host) {
                window.__host.cmps[b] = a;
                a.__host = window.__host
            }
            this.cache[b] = a;
            a.on("mouseover", $A.CmpManager.onCmpOver, $A.CmpManager);
            a.on("mouseout", $A.CmpManager.onCmpOut, $A.CmpManager)
        },
        onCmpOver: function(i, g) {
            if ($A.validInfoType != "tip") {
                return
            }
            if (($A.Grid && i instanceof $A.Grid) || ($A.Table && i instanceof $A.Table)) {
                var c = i.dataset;
                if (!c || !g.target) {
                    return
                }
                var h = Ext.fly(g.target).findParent("td");
                if (h) {
                    var d = Ext.fly(h).getAttributeNS("", "atype");
                    if (d == "grid-cell" || d == "table-cell") {
                        var m = Ext.fly(h).getAttributeNS("", "recordid");
                        var f = c.findById(m);
                        if (f) {
                            var a = Ext.fly(h).getAttributeNS("", "dataindex");
                            var l = f.getMeta().getField(a);
                            if (!l) {
                                return
                            }
                            var b = f.valid[a] || l.get("tooltip");
                            if (Ext.isEmpty(b)) {
                                return
                            }
                            $A.ToolTip.show(h, b)
                        }
                    }
                }
            } else {
                if (i.binder) {
                    var c = i.binder.ds;
                    if (!c) {
                        return
                    }
                    var f = i.record;
                    if (!f) {
                        return
                    }
                    var l = f.getMeta().getField(i.binder.name);
                    var b = f.valid[i.binder.name] || l.get("tooltip");
                    if (Ext.isEmpty(b)) {
                        return
                    }
                    $A.ToolTip.show(i.id, b)
                }
            }
        },
        onCmpOut: function(a, b) {
            if ($A.validInfoType != "tip") {
                return
            }
            $A.ToolTip.hide()
        },
        getAll: function() {
            return this.cache
        },
        remove: function(b) {
            var a = this.cache[b];
            if (a.__host && a.__host.cmps) {
                delete a.__host.cmps[b]
            }
            a.un("mouseover", $A.CmpManager.onCmpOver, $A.CmpManager);
            a.un("mouseout", $A.CmpManager.onCmpOut, $A.CmpManager);
            delete this.cache[b]
        },
        get: function(a) {
            if (!this.cache) {
                return null
            }
            return this.cache[a]
        }
    }
} ();
Ext.Ajax.on("requestexception",
function(f, c, e) {
    if ($A.slideBarEnable) {
        $A.SideBar.enable = $A.slideBarEnable
    }
    $A.manager.fireEvent("ajaxerror", $A.manager, c.status, c);
    if ($A.logWindow) {
        var a = $("HTTPWATCH_DATASET").getCurrentRecord();
        var d = $A._startTime;
        var b = new Date();
        a.set("spend", b - d);
        a.set("status", c.status);
        a.set("result", c.statusText);
        a.set("response", c.statusText)
    }
    switch (c.status) {
    case 404:
        $A.showErrorMessage(c.status + _lang["ajax.error"], _lang["ajax.error.404"] + '"' + c.statusText + '"', null, 400, 150);
        break;
    case 500:
        $A.showErrorMessage(c.status + _lang["ajax.error"], c.responseText, null, 500, 300);
        break;
    case 0:
        break;
    default:
        $A.showErrorMessage(_lang["ajax.error"], c.statusText);
        break
    }
},
this);
$ = $A.getCmp = function(b) {
    var a = $A.CmpManager.get(b);
    if (a == null) {
        window.console && console.error("未找到组件:" + b)
    }
    return a
};
$A.setCookie = function(a, b, e) {
    var c = location.pathname;
    c = c.substring(0, c.lastIndexOf("/") + 1);
    var d = null;
    if (e) {
        d = new Date();
        d.setTime(d.getTime() + e * 24 * 60 * 60 * 1000)
    }
    document.cookie = a + "=" + escape(b) + ";path = " + c + ((d) ? (";expires=" + d.toGMTString()) : "")
};
$A.getCookie = function(b) {
    var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
    if (a != null) {
        return unescape(a[2])
    }
    return null
};
$A.getViewportHeight = function() {
    if (Ext.isIE) {
        return Ext.isStrict ? document.documentElement.clientHeight: document.body.clientHeight
    } else {
        return self.innerHeight
    }
};
$A.getViewportWidth = function() {
    if (Ext.isIE || Ext.isIE9 || Ext.isIE10) {
        return Ext.isStrict ? document.documentElement.clientWidth: document.body.clientWidth
    } else {
        return self.innerWidth
    }
};
$A.post = function(e, d, f) {
    var c = Ext.getBody().createChild({
        style: "display:none",
        tag: "form",
        method: "post",
        action: e,
        target: f || "_self"
    });
    for (var b in d) {
        var a = d[b];
        if (a) {
            if (a instanceof Date) {
                a = a.format("isoDate")
            }
            c.createChild({
                tag: "input",
                type: "hidden",
                name: b,
                value: a
            })
        }
    }
    c.dom.submit();
    c.remove()
};
$A.request = function(d) {
    var c = d.url,
    m = d.para,
    f = d.success,
    h = d.error,
    l = d.scope,
    b = d.failure,
    i = d.lockMessage,
    g = Ext.getBody(),
    a = Ext.apply({},
    d.opts);
    if (!Ext.isEmpty(i)) {
        $A.Masker.mask(g, i)
    }
    $A.manager.fireEvent("ajaxstart", c, m);
    if ($A.logWindow) {
        $A._startTime = new Date();
        $("HTTPWATCH_DATASET").create({
            url: c,
            request: Ext.util.JSON.encode({
                parameter: m
            })
        })
    }
    var e = Ext.apply({
        parameter: m
    },
    d.ext);
    return Ext.Ajax.request({
        url: c,
        method: "POST",
        params: {
            _request_data: Ext.util.JSON.encode(e)
        },
        opts: a,
        sync: d.sync,
        success: function(p, r) {
            if (!Ext.isEmpty(i)) {
                $A.Masker.unmask(g)
            }
            if ($A.logWindow) {
                var q = $A._startTime;
                var o = new Date();
                var n = $("HTTPWATCH_DATASET").getCurrentRecord();
                n.set("spend", o - q);
                n.set("result", p.statusText);
                n.set("status", p.status);
                n.set("response", p.responseText)
            }
            $A.manager.fireEvent("ajaxcomplete", c, m, p);
            if (p) {
                var s = null;
                try {
                    s = Ext.decode(p.responseText)
                } catch(u) {
                    $A.showErrorMessage(_lang["ajax.error"], _lang["ajax.error.format"]);
                    return
                }
                if (s && !s.success) {
                    $A.manager.fireEvent("ajaxfailed", $A.manager, c, m, s);
                    if (s.error) {
                        if (s.error.code && (s.error.code == "session_expired" || s.error.code == "login_required")) {
                            if ($A.manager.fireEvent("timeout", $A.manager)) {
                                $A.showErrorMessage(_lang["ajax.error"], _lang["session.expired"])
                            }
                        } else {
                            var q = s.error.stackTrace;
                            q = (q) ? q.replaceAll("\r\n", "</br>") : "";
                            if (s.error.message) {
                                var t = (q == "") ? 150 : 250;
                                $A.showErrorMessage(_lang["ajax.error"], s.error.message + "</br>" + q, null, 400, t)
                            } else {
                                $A.showErrorMessage(_lang["ajax.error"], q, null, 400, 250)
                            }
                        }
                        if (h) {
                            h.call(l, s, r)
                        }
                    }
                } else {
                    if (f) {
                        f.call(l, s, r);
                        d.showSuccessTip = d.showSuccessTip || false
                    }
                    if (d.showSuccessTip) {
                        $A.manager.fireEvent("ajaxsuccess", d.successTip)
                    }
                }
            }
        },
        failure: function(n, o) {
            if (!Ext.isEmpty(i)) {
                $A.Masker.unmask(g)
            }
            if (b) {
                b.call(l, n, o)
            }
        },
        scope: l
    })
};
Aurora.dateFormat = function() {
    var a = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    var b = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    c = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    g = /[^-+\dA-Z]/g,
    d = function(i, h) {
        i = String(i);
        h = h || 2;
        while (i.length < h) {
            i = "0" + i
        }
        return i
    },
    f = function(h, i) {
        return !! String(a[h] || h || a["default"]).match(i)
    },
    e = function(p, n, m) {
        for (var q = 0,
        h = n.match(b), l = p.match(/\d+/g), r, o = 0; q < h.length; q++) {
            if (l.length == h.length) {
                r = l[q]
            } else {
                if (l.length == 1) {
                    r = parseInt(p.slice(o, o += h[q].length), 10)
                } else {
                    r = parseInt(p.slice(o = n.search(h[q]), o + h[q].length))
                }
            }
            switch (h[q]) {
            case "mm":
            case "m":
                r--;
                break
            }
            m(h[q], r)
        }
    };
    return {
        pad: d,
        parseDate: function(n, B, w) {
            if (typeof n != "string" || n == "") {
                return null
            }
            B = String(a[B] || B || a["default"]);
            if (B.slice(0, 4) == "UTC:") {
                B = B.slice(4);
                w = true
            }
            var i = new Date(1970, 1, 2, 0, 0, 0),
            z = w ? "setUTC": "set",
            r = i[z + "Date"],
            l = i[z + "Month"],
            q = i[z + "FullYear"],
            u = i[z + "Year"],
            x = i[z + "Hours"],
            p = i[z + "Minutes"],
            A = i[z + "Seconds"],
            t = i[z + "Milliseconds"],
            h = {
                d: r,
                dd: r,
                m: l,
                mm: l,
                yy: u,
                yyyy: q,
                h: x,
                hh: x,
                H: x,
                HH: x,
                M: p,
                MM: p,
                s: A,
                ss: A,
                l: t,
                L: t
            };
            try {
                e(n, B,
                function(m, s) {
                    h[m].call(i, s)
                })
            } catch(o) {
                throw new SyntaxError("invalid date")
            }
            if (isNaN(i)) {
                throw new SyntaxError("invalid date")
            }
            return i
        },
        format: function(n, B, w) {
            if (arguments.length == 1 && (typeof n == "string" || n instanceof String) && !/\d/.test(n)) {
                B = n;
                n = undefined
            }
            n = n ? new Date(n) : new Date();
            if (isNaN(n)) {
                throw new SyntaxError("invalid date")
            }
            B = String(a[B] || B || a["default"]);
            if (B.slice(0, 4) == "UTC:") {
                B = B.slice(4);
                w = true
            }
            var z = w ? "getUTC": "get",
            r = n[z + "Date"](),
            h = n[z + "Day"](),
            p = n[z + "Month"](),
            u = n[z + "FullYear"](),
            x = n[z + "Hours"](),
            q = n[z + "Minutes"](),
            A = n[z + "Seconds"](),
            t = n[z + "Milliseconds"](),
            i = w ? 0 : n.getTimezoneOffset(),
            l = {
                d: r,
                dd: d(r),
                m: p + 1,
                mm: d(p + 1),
                yy: String(u).slice(2),
                yyyy: u,
                h: x % 12 || 12,
                hh: d(x % 12 || 12),
                H: x,
                HH: d(x),
                M: q,
                MM: d(q),
                s: A,
                ss: d(A),
                l: d(t, 3),
                L: d(t > 99 ? Math.round(t / 10) : t),
                t: x < 12 ? "a": "p",
                tt: x < 12 ? "am": "pm",
                T: x < 12 ? "A": "P",
                TT: x < 12 ? "AM": "PM",
                Z: w ? "UTC": (String(n).match(c) || [""]).pop().replace(g, ""),
                o: (i > 0 ? "-": "+") + d(Math.floor(Math.abs(i) / 60) * 100 + Math.abs(i) % 60, 4),
                S: ["th", "st", "nd", "rd"][r % 10 > 3 ? 0 : (r % 100 - r % 10 != 10) * r % 10]
            };
            return B.replace(b,
            function(m) {
                return m in l ? l[m] : m.slice(1, m.length - 1)
            })
        },
        isDateTime: function(h) {
            return f(h, /([HhMs])\1?/)
        }
    }
} ();
Ext.applyIf(String.prototype, {
    trim: function() {
        return this.replace(/(^\s*)|(\s*$)/g, "")
    }
});
Ext.applyIf(Date.prototype, {
    format: function(a, b) {
        return Aurora.dateFormat.format(this, a, b)
    }
});
Ext.applyIf(Array.prototype, {
    add: function(a) {
        if (this.indexOf(a) == -1) {
            this[this.length] = a
        }
    },
    find: function(e, d) {
        var c = null;
        for (var a = 0; a < this.length; a++) {
            var b = this[a];
            if (b[e] == d) {
                c = b;
                break
            }
        }
        return c
    }
});
Ext.applyIf(String.prototype, {
    replaceAll: function(b, a) {
        return this.replace(new RegExp(b, "gm"), a)
    }
});
Ext.applyIf(String.prototype, {
    parseDate: function(a, b) {
        return Aurora.dateFormat.parseDate(this.toString(), a, b)
    }
});
$A.TextMetrics = function() {
    return {
        measure: function(a, c, d) {
            var b = $A.TextMetrics.Instance(a, d);
            return b.getSize(c)
        }
    }
} ();
$A.TextMetrics.Instance = function(b, e) {
    var c = '<div style="left:-10000px;top:-10000px;position:absolute;visibility:hidden"></div>',
    d = Ext.get(Ext.DomHelper.append(Ext.get(b), c)),
    a = {
        getSize: function(g) {
            d.update(g);
            var f = {
                width: d.getWidth(),
                height: d.getHeight()
            };
            d.remove();
            return f
        },
        bind: function(l) {
            var g = ["padding", "font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"],
            f = g.length,
            m = {};
            for (var h = 0; h < f; h++) {
                m[g[h]] = Ext.fly(l).getStyle(g[h])
            }
            d.setStyle(m)
        },
        setFixedWidth: function(f) {
            d.setWidth(f)
        }
    };
    if (e) {
        d.setWidth(e)
    }
    a.bind(b);
    return a
};
$A.ToolTip = function() {
    var a = {
        init: function() {
            var b = this;
            Ext.onReady(function() {
                var c = Ext.DomHelper.insertFirst(Ext.getBody(), {
                    tag: "div",
                    cls: "tip-wrap",
                    children: [{
                        tag: "div",
                        cls: "tip-body"
                    }]
                });
                var d = Ext.DomHelper.insertFirst(Ext.getBody(), {
                    tag: "div",
                    cls: "item-shadow"
                });
                b.tip = Ext.get(c);
                b.shadow = Ext.get(d);
                b.body = b.tip.first("div.tip-body")
            })
        },
        show: function(b, e) {
            if (this.tip == null) {
                this.init()
            }
            this.tip.show();
            this.shadow.show();
            this.body.update(e);
            var d;
            if (typeof(b) == "string") {
                if (this.sid == b) {
                    return
                }
                this.sid = b;
                var c = $A.CmpManager.get(b);
                if (c) {
                    if (c.wrap) {
                        d = c.wrap
                    }
                }
            } else {
                d = Ext.get(b)
            }
            this.shadow.setWidth(this.tip.getWidth());
            this.shadow.setHeight(this.tip.getHeight());
            this.correctPosition(d)
        },
        correctPosition: function(d) {
            var c = $A.getViewportWidth();
            var b = d.getX() + d.getWidth() + 5;
            var e = d.getX() + d.getWidth() + 7;
            if (b + this.tip.getWidth() > c) {
                b = d.getX() - this.tip.getWidth() - 5;
                e = d.getX() - this.tip.getWidth() - 3
            }
            this.tip.setX(b);
            this.tip.setY(d.getY());
            this.shadow.setX(e);
            this.shadow.setY(this.tip.getY() + 2)
        },
        hide: function() {
            this.sid = null;
            if (this.tip != null) {
                this.tip.hide()
            }
            if (this.shadow != null) {
                this.shadow.hide()
            }
        }
    };
    return a
} ();
$A.SideBar = function() {
    var a = {
        enable: true,
        bar: null,
        show: function(f) {
            var g = f.msg;
            if (!this.enable) {
                return
            }
            var c = this;
            if (parent.showSideBar) {
                parent.showSideBar(g || "")
            } else {
                this.hide();
                var e;
                if (g) {
                    e = '<div class="item-slideBar"><div class="inner">' + g + "</div></div>"
                } else {
                    e = f.html
                }
                this.bar = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), e));
                this.bar.setStyle("z-index", 999999);
                var d = $A.getViewportWidth();
                var i = $A.getViewportHeight();
                var b = Math.max(0, (d - this.bar.getWidth()) / 2);
                var h = Math.max(0, (i - this.bar.getHeight()) / 2);
                this.bar.setY(h);
                this.bar.setX(b);
                this.bar.fadeIn();
                setTimeout(function() {
                    c.hide()
                },
                f.duration || 2000)
            }
        },
        hide: function() {
            if (parent.hideSideBar) {
                parent.hideSideBar()
            } else {
                if (this.bar) {
                    Ext.fly(this.bar).fadeOut();
                    Ext.fly(this.bar).remove();
                    this.bar = null
                }
            }
        }
    };
    return a
} ();
$A.Status = function() {
    var a = {
        bar: null,
        enable: true,
        show: function(c) {
            if (!this.enable) {
                return
            }
            this.hide();
            if (parent.showStatus) {
                parent.showStatus(c)
            } else {
                var b = '<div class="item-statusBar" unselectable="on">' + c + "</div>";
                this.bar = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), b));
                this.bar.setStyle("z-index", 999998)
            }
        },
        hide: function() {
            if (parent.hideStatus) {
                parent.hideStatus()
            } else {
                if (this.bar) {
                    Ext.fly(this.bar).remove();
                    this.bar = null
                }
            }
        }
    };
    return a
} ();
$A.Cover = function() {
    var a = {
        bodyOverflow: null,
        sw: null,
        sh: null,
        container: {},
        cover: function(d) {
            var b = Ext.isStrict ? document.documentElement.scrollWidth: document.body.scrollWidth;
            var c = Ext.isStrict ? document.documentElement.scrollHeight: document.body.scrollHeight;
            var e = Math.max(b, $A.getViewportWidth());
            var h = Math.max(c, $A.getViewportHeight());
            var g = '<DIV tabIndex="-1" class="aurora-cover"' + (Ext.isIE6 ? ' style="position:absolute;width:' + (e - 1) + "px;height:" + (h - 1) + "px;": "") + '" unselectable="on" hideFocus></DIV>';
            var f = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), g));
            f.on("focus",
            function(i) {
                i.stopPropagation();
                Ext.fly(d).focus()
            });
            f.setStyle("z-index", Ext.fly(d).getStyle("z-index") - 1);
            $A.Cover.container[d.id] = f
        },
        uncover: function(b) {
            var d = $A.Cover.container[b.id];
            if (d) {
                Ext.fly(d).remove();
                $A.Cover.container[b.id] = null;
                delete $A.Cover.container[b.id]
            }
            var c = true;
            for (key in $A.Cover.container) {
                if ($A.Cover.container[key]) {
                    c = false;
                    break
                }
            }
        },
        resizeCover: function() {
            for (key in $A.Cover.container) {
                var b = $A.Cover.container[key];
                Ext.fly(b).setStyle("display", "none")
            }
            setTimeout(function() {
                var c = Ext.isStrict ? document.documentElement.scrollWidth: document.body.scrollWidth;
                var d = Ext.isStrict ? document.documentElement.scrollHeight: document.body.scrollHeight;
                var e = Math.max(c, $A.getViewportWidth()) - 1;
                var g = Math.max(d, $A.getViewportHeight()) - 1;
                for (key in $A.Cover.container) {
                    var f = $A.Cover.container[key];
                    Ext.fly(f).setWidth(e);
                    Ext.fly(f).setHeight(g);
                    Ext.fly(f).setStyle("display", "")
                }
            },
            1)
        }
    };
    return a
} ();
$A.Masker = function() {
    var a = {
        container: {},
        mask: function(f, g) {
            if ($A.Masker.container[f.id]) {
                return
            }
            g = g || _lang["mask.loading"];
            var f = Ext.get(f);
            var m = f.getWidth();
            var l = f.getHeight();
            var i = Math.min(l - 2, 30);
            var c = '<div class="aurora-mask"  style="left:-10000px;top:-10000px;width:' + m + "px;height:" + l + 'px;position: absolute;"><div unselectable="on"></div><span style="top:' + (l / 2 - 11) + "px;height:" + i + "px;line-height:" + (i - 2) + 'px">' + g + "</span></div>";
            var d = f.parent("body") ? f.parent() : f.child("body") || f;
            var e = new Ext.Template(c).insertFirst(d.dom, {},
            true);
            var n = f.getStyle("z-index") == "auto" ? 0 : Number(f.getStyle("z-index"));
            e.setStyle("z-index", n + 1);
            e.setXY(f.getXY());
            var b = e.child("span");
            b.setLeft((m - b.getWidth() - 45) / 2);
            $A.Masker.container[f.id] = e
        },
        unmask: function(b) {
            var c = $A.Masker.container[b.id];
            if (c) {
                Ext.fly(c).remove();
                $A.Masker.container[b.id] = null;
                delete $A.Masker.container[b.id]
            }
        }
    };
    return a
} ();
Ext.util.JSON.encodeDate = function(c) {
    var b = function(d) {
        return d < 10 ? "0" + d: d
    };
    var a = '"' + c.getFullYear() + "-" + b(c.getMonth() + 1) + "-" + b(c.getDate());
    if (c.xtype == "timestamp") {
        a = a + " " + b(c.getHours()) + ":" + b(c.getMinutes()) + ":" + b(c.getSeconds())
    }
    a += '"';
    return a
};
$A.evalList = [];
$A.evaling = false;
$A.doEvalScript = function() {
    $A.evaling = true;
    var list = $A.evalList;
    var o = list.shift();
    if (!o) {
        window.__host = null;
        $A.evaling = false;
        if ($A.loadEvent) {
            $A.loadEvent.fire();
            $A.loadEvent = null
        }
        return
    }
    var sf = o.sf,
    html = o.html,
    loadScripts = o.loadScripts,
    callback = o.callback,
    host = o.host,
    id = o.id;
    var dom = sf.dom;
    if (host) {
        window.__host = host
    }
    var links = [];
    var scripts = [];
    var hd = document.getElementsByTagName("head")[0];
    for (var i = 0; i < hd.childNodes.length; i++) {
        var he = hd.childNodes[i];
        if (he.tagName == "LINK") {
            links.push(he.href)
        } else {
            if (he.tagName == "SCRIPT") {
                scripts.push(he.src)
            }
        }
    }
    var jsre = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
    var jsSrcRe = /\ssrc=([\'\"])(.*?)\1/i;
    var cssre = /(?:<link([^>]*)?>)((\n|\r|.)*?)/ig;
    var cssHreRe = /\shref=([\'\"])(.*?)\1/i;
    var cssm;
    while (cssm = cssre.exec(html)) {
        var attrs = cssm[1];
        var srcMatch = attrs ? attrs.match(cssHreRe) : false;
        if (srcMatch && srcMatch[2]) {
            var included = false;
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                if (link.indexOf(srcMatch[2]) != -1) {
                    included = true;
                    break
                }
            }
            if (!included) {
                var s = document.createElement("link");
                s.type = "text/css";
                s.rel = "stylesheet";
                s.href = srcMatch[2];
                hd.appendChild(s)
            }
        }
    }
    var match;
    var jslink = [];
    var jsscript = [];
    while (match = jsre.exec(html)) {
        var attrs = match[1];
        var srcMatch = attrs ? attrs.match(jsSrcRe) : false;
        if (srcMatch && srcMatch[2]) {
            var included = false;
            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                if (script.indexOf(srcMatch[2]) != -1) {
                    included = true;
                    break
                }
            }
            if (!included) {
                jslink[jslink.length] = {
                    src: srcMatch[2],
                    type: "text/javascript"
                }
            }
        } else {
            if (match[2] && match[2].length > 0) {
                jsscript[jsscript.length] = match[2]
            }
        }
    }
    var loaded = 0;
    var finishLoad = function() {
        try {
            for (j = 0, k = jsscript.length; j < k; j++) {
                var jst = jsscript[j];
                if (o.destroying === true) {
                    break
                }
                try {
                    if (window.execScript) {
                        window.execScript(jst)
                    } else {
                        window.eval(jst)
                    }
                } catch(e) {
                    window.console && console.error("执行代码: " + jst + "\n" + e.stack)
                }
            }
        } catch(e) {}
        var el = document.getElementById(id);
        if (el) {
            Ext.removeNode(el)
        }
        Ext.fly(dom).show();
        if (typeof callback == "function") {
            callback()
        }
        $A.doEvalScript()
    };
    var continueLoad = function() {
        var js = jslink[loaded];
        var s = document.createElement("script");
        s.src = js.src;
        s.type = js.type;
        s[Ext.isIE ? "onreadystatechange": "onload"] = onReadOnLoad;
        s.onerror = onErrorLoad;
        hd.appendChild(s)
    };
    var onReadOnLoad = function() {
        var isready = Ext.isIE ? (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") : true;
        if (isready) {
            loaded++;
            if (loaded == jslink.length) {
                finishLoad()
            } else {
                continueLoad()
            }
        }
    };
    var onErrorLoad = function(evt) {
        loaded++;
        alert("无法加载脚本:" + evt.target.src);
        if (loaded == jslink.length) {
            finishLoad()
        } else {
            continueLoad()
        }
    };
    if (jslink.length > 0) {
        continueLoad()
    } else {
        if (jslink.length == 0) {
            for (j = 0, k = jsscript.length; j < k; j++) {
                var jst = jsscript[j];
                if (o.destroying === true) {
                    break
                }
                try {
                    if (window.execScript) {
                        window.execScript(jst)
                    } else {
                        window.eval(jst)
                    }
                } catch(e) {
                    window.console && console.error("执行代码: " + jst + "\n" + e.stack)
                }
            }
            var el = document.getElementById(id);
            if (el) {
                Ext.removeNode(el)
            }
            Ext.fly(dom).show();
            if (typeof callback == "function") {
                callback()
            }
            $A.doEvalScript()
        }
    }
};
Ext.Element.prototype.update = function(b, a, g, d) {
    if (typeof b == "undefined") {
        b = ""
    }
    if (a !== true) {
        this.dom.innerHTML = b;
        if (typeof g == "function") {
            g()
        }
        return this
    }
    var f = Ext.id();
    var c = this;
    var e = this.dom;
    b += '<span id="' + f + '"></span>';
    Ext.lib.Event.onAvailable(f,
    function() {
        $A.evalList.push({
            html: b,
            loadScripts: a,
            callback: g,
            host: d,
            id: f,
            sf: c
        });
        if (!$A.evaling) {
            $A.doEvalScript()
        }
    });
    Ext.fly(e).hide();
    e.innerHTML = b.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "").replace(/(?:<link.*?>)((\n|\r|.)*?)/ig, "");
    return this
};
Ext.EventObjectImpl.prototype.isSpecialKey = function() {
    var a = this.keyCode;
    return (this.type == "keypress" && this.ctrlKey) || a == 9 || a == 13 || a == 40 || a == 27 || (a == 16) || (a == 17) || (a >= 18 && a <= 20) || (a >= 33 && a <= 35) || (a >= 36 && a <= 39) || (a >= 44 && a <= 45)
};
Ext.removeNode = Ext.isIE && !Ext.isIE8 ?
function() {
    var a;
    return function(b) {
        if (b && b.tagName != "BODY") { (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(b, true) : Ext.EventManager.removeAll(b);
            if (!a) {
                a = document.createElement("div");
                a.id = "_removenode";
                a.style.cssText = "position:absolute;display:none;left:-10000px;top:-10000px"
            }
            if (!a.parentNode) {
                document.body.appendChild(a)
            }
            a.appendChild(b);
            a.innerHTML = "";
            delete Ext.elCache[b.id]
        }
    }
} () : function(a) {
    if (a && a.parentNode && a.tagName != "BODY") { (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(a, true) : Ext.EventManager.removeAll(a);
        a.parentNode.removeChild(a);
        delete Ext.elCache[a.id]
    }
};
$A.parseDate = function(b) {
    if (typeof b == "string") {
        var a = b.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
        if (a && a.length > 3) {
            return new Date(parseInt(a[1]), parseInt(a[2], 10) - 1, parseInt(a[3], 10))
        }
        a = b.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
        if (a && a.length > 6) {
            return new Date(parseInt(a[1]), parseInt(a[2], 10) - 1, parseInt(a[3], 10), parseInt(a[4], 10), parseInt(a[5], 10), parseInt(a[6], 10))
        }
    }
    return null
};
$A.getRenderer = function(b) {
    if (!b) {
        return null
    }
    var a;
    if (b.indexOf("Aurora.") != -1) {
        a = $A[b.substr(7, b.length)]
    } else {
        a = window[b]
    }
    return a
};
$A.RowNumberRenderer = function(d, a, b) {
    if (a && a.ds) {
        var c = a.ds;
        return (c.currentPage - 1) * c.pagesize + c.indexOf(a) + 1
    }
};
$A.formatDate = function(a) {
    if (!a) {
        return ""
    }
    if (a.format) {
        return a.format($A.defaultDateFormat)
    }
    return a
};
$A.formatDateTime = function(a) {
    if (!a) {
        return ""
    }
    if (a.format) {
        return a.format($A.defaultDateTimeFormat)
    }
    return a
};
$A.formatNumber = function(d, f) {
    if (Ext.isEmpty(d)) {
        return ""
    }
    d = String(d).replace(/,/g, "");
    if (isNaN(d)) {
        return ""
    }
    if (!isNaN(f)) {
        d = Number(d).toFixed(f)
    }
    var e = $A.parseScientific(d).split(".");
    var a = (e.length == 2) ? "." + e[1] : "";
    var c = e[0];
    var b = /(\d+)(\d{3})/;
    while (b.test(c)) {
        c = c.replace(b, "$1,$2")
    }
    v = c + a;
    return v
};
$A.formatMoney = function(a) {
    return $A.formatNumber(a, 2)
};
$A.parseScientific = function(h) {
    if ((h = String(h)).search(/e/i) == -1) {
        return h
    } else {
        var l = h.split(/e/i),
        g = l[0],
        c = g.match(/-/) || "",
        a = g.indexOf("."),
        f = g.replace(/[-.]/g, ""),
        d = parseInt(l[1]) - (a == -1 ? 0 : f.length - a);
        if (d > 0) {
            for (var e = 0; e < d; e++) {
                f += "0"
            }
        } else {
            d = f.length + d;
            if (d > 0) {
                f = f.substring(0, d) + "." + f.substring(d)
            } else {
                var b = "0.";
                for (var e = 0; e > d; e--) {
                    b += "0"
                }
                f = b + f
            }
        }
        return c + f
    }
};
$A.removeNumberFormat = function(a) {
    a = String(a || "");
    while (a.indexOf(",") != -1) {
        a = a.replace(",", "")
    }
    return isNaN(a) ? parseFloat(a) : a
};
$A.EventManager = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        $A.EventManager.superclass.constructor.call(this);
        this.initEvents()
    },
    initEvents: function() {
        this.addEvents("ajaxerror", "ajaxsuccess", "ajaxfailed", "ajaxstart", "ajaxcomplete", "valid", "timeout", "beforeunload")
    }
});
$A.manager = new $A.EventManager();
$A.manager.on("ajaxstart",
function() {
    $A.Status.show(_lang["eventmanager.start"])
});
$A.manager.on("timeout",
function() {
    $A.Status.hide()
});
$A.manager.on("ajaxerror",
function() {
    $A.Status.hide()
});
$A.manager.on("ajaxcomplete",
function() {
    $A.Status.hide()
});
$A.manager.on("ajaxsuccess",
function(a) {
    $A.SideBar.show({
        msg: a || _lang["eventmanager.success"]
    })
});
$A.regEvent = function(b, a) {
    $A.manager.on(b, a)
};
$A.validInfoType = "area";
$A.validInfoTypeObj = "";
$A.setValidInfoType = function(a, b) {
    $A.validInfoType = a;
    $A.validInfoTypeObj = b
};
$A.invalidRecords = {};
$A.addInValidReocrd = function(f, a) {
    var b = $A.invalidRecords[f];
    if (!b) {
        $A.invalidRecords[f] = b = []
    }
    var c = false;
    for (var d = 0; d < b.length; d++) {
        var e = b[d];
        if (e.id == a.id) {
            c = true;
            break
        }
    }
    if (!c) {
        b.add(a)
    }
};
$A.removeInvalidReocrd = function(e, a) {
    var b = $A.invalidRecords[e];
    if (!b) {
        return
    }
    for (var c = 0; c < b.length; c++) {
        var d = b[c];
        if (d.id == a.id) {
            b.remove(d);
            break
        }
    }
};
$A.getInvalidRecords = function(a) {
    var c = [];
    for (var d in $A.invalidRecords) {
        var e = $A.CmpManager.get(d);
        if (e.pageid == a) {
            var b = $A.invalidRecords[d];
            c = c.concat(b)
        }
    }
    return c
};
$A.isInValidReocrdEmpty = function(a) {
    var e = true;
    for (var c in $A.invalidRecords) {
        var d = $A.CmpManager.get(c);
        if (d.pageid == a) {
            var b = $A.invalidRecords[c];
            if (b.length != 0) {
                e = false;
                break
            }
        }
    }
    return e
};
$A.manager.on("valid",
function(a, c, b) {
    switch ($A.validInfoType) {
    case "area":
        $A.showValidTopMsg(c);
        break;
    case "message":
        $A.showValidWindowMsg(c);
        break
    }
});
$A.showValidWindowMsg = function(g) {
    var f = $A.isInValidReocrdEmpty(g.pageid);
    if (f == true) {
        if ($A.validWindow) {
            $A.validWindow.close()
        }
    }
    if (!$A.validWindow && f == false) {
        $A.validWindow = $A.showWarningMessage(_lang["valid.fail"], "", 400, 200);
        $A.validWindow.on("close",
        function() {
            $A.validWindow = null
        })
    }
    var h = [];
    var b = $A.getInvalidRecords(g.pageid);
    for (var d = 0; d < b.length; d++) {
        var e = b[d];
        var c = e.ds.data.indexOf(e) + 1;
        h[h.length] = _lang["valid.fail.note"] + '<a href="#" onclick="$(\'' + e.ds.id + "').locate(" + c + ')">(' + e.id + ")</a>:";
        for (var a in e.valid) {
            h[h.length] = e.valid[a] + ";"
        }
        h[h.length] = "<br/>"
    }
    if ($A.validWindow) {
        $A.validWindow.body.child("div").update(h.join(""))
    }
};
$A.pageids = [];
$A.showValidTopMsg = function(b) {
    var g = $A.isInValidReocrdEmpty(b.pageid);
    if (g == true) {
        var l = Ext.get(b.pageid + "_msg");
        if (l) {
            l.hide();
            l.setStyle("display", "none");
            l.update("")
        }
        return
    }
    var e = $A.getInvalidRecords(b.pageid);
    var m = [];
    for (var f = 0; f < e.length; f++) {
        var a = e[f];
        var h = a.ds.data.indexOf(a) + 1;
        m[m.length] = _lang["valid.fail.note"] + '<a href="#" onclick="$(\'' + a.ds.id + "').locate(" + h + ')">(' + a.id + ")</a>:";
        for (var c in a.valid) {
            m[m.length] = a.valid[c] + ";"
        }
        m[m.length] = "<br/>"
    }
    var l = Ext.get(b.pageid + "_msg");
    if (l) {
        l.update(m.join(""));
        l.show(true)
    }
};
Ext.fly(document.documentElement).on("keydown",
function(c, b) {
    var a = b.tagName.toUpperCase();
    c.keyCode == 8 && a != "INPUT" && a != "TEXTAREA" && c.stopEvent()
});
$A.startCustomization = function() {
    var a = $A.CmpManager.get("_customization");
    if (a == null) {
        a = new $A.Customization({
            id: "_customization"
        })
    }
    a.start()
};
$A.stopCustomization = function() {
    var a = $A.CmpManager.get("_customization");
    if (a != null) {
        a.stop();
        $A.CmpManager.remove("_customization")
    }
};
$A.convertMoney = function(e) {
    e = Math.abs(e);
    var a = [["元", "万", "亿"], ["仟", "", "拾", "佰"], ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]];
    totalarray = new Array();
    totalarray = e.toString().split(".");
    if (totalarray.length == 1) {
        totalarray[1] = "00"
    } else {
        if (totalarray[1].length == 1) {
            totalarray[1] += "0"
        }
    }
    integerpart = new Array();
    decimalpart = new Array();
    var b = "";
    for (var d = 0; d < totalarray[0].length; d++) {
        integerpart[d] = totalarray[0].charAt(d)
    }
    for (var d = 0; d < totalarray[1].length; d++) {
        decimalpart[d] = totalarray[1].charAt(d)
    }
    for (var d = 0; d < integerpart.length; d++) {
        var c = (integerpart.length - d - 1) % 4 == 0 ? a[0][parseInt((integerpart.length - d) / 4)] : (integerpart[d] == 0) ? "": a[1][((integerpart.length - d) % 4)];
        b = b + a[2][integerpart[d]] + c
    }
    b = b.replace(new RegExp(/零+/g), "零");
    b = b.replace("零万", "万");
    b = b.replace("零亿", "亿");
    b = b.replace("零元", "元");
    b = b.replace("亿万", "亿");
    var f = "";
    if (decimalpart[0] == 0 && decimalpart[1] == 0) {
        f = "整"
    } else {
        if (decimalpart[0] == 0) {
            f = "零"
        } else {
            f = a[2][decimalpart[0]] + "角"
        }
        if (decimalpart[1] != 0) {
            f += a[2][decimalpart[1]] + "分"
        }
    }
    b += f;
    if (e < 0) {
        b = "负" + b
    }
    return b
};
$A.setValidInfoType("tip");
$A.escapeHtml = function(a) {
    if (Ext.isEmpty(a) || !Ext.isString(a)) {
        return a
    }
    return String(a).replace(/&/gm, "&amp;").replace(/\"/gm, "&quot;").replace(/\(/gm, "&#40;").replace(/\)/gm, "&#41;").replace(/\+/gm, "&#43;").replace(/\%/gm, "&#37;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
};
$A.unescapeHtml = function(a) {
    if (Ext.isEmpty(a) || !Ext.isString(a)) {
        return a
    }
    return String(a).replace(/&amp;/gm, "&").replace(/&quot;/gm, '"').replace(/&#40;/gm, "(").replace(/&#41;/gm, ")").replace(/&#43;/gm, "+").replace(/&#37;/gm, "%").replace(/&lt;/gm, "<").replace(/&gt;/gm, ">")
};
$A.doExport = function(n, t, A, f, g, E, I) {
    var z = {
        parameter: {
            _column_config_: {}
        }
    },
    d = [],
    C = {},
    a = function(p, i) {
        if (! (Ext.isDefined(p.forexport) ? p.forexport: true)) {
            return null
        }
        var o = Ext.encode(p);
        var q = C[o];
        if (!q) {
            q = {
                prompt: p.prompt
            }
        }
        C[o] = q; (q.column = q.column || []).add(i);
        if (p._parent) {
            return a(p._parent, q)
        }
        return q
    };
    for (var F = 0; F < t.length; F++) {
        var e = t[F],
        G = Ext.isDefined(e.forexport) ? e.forexport: true;
        if (e.type != "rowcheck" && e.type != "rowradio" && e.type != "rownumber" && G) {
            var H = {
                prompt: e.prompt
            };
            if (e.width) {
                H.width = e.width
            }
            if (e.name) {
                H.name = e.exportfield || e.name
            }
            if (e.exportdatatype) {
                H.datatype = e.exportdatatype
            }
            if (e.exportdataformat) {
                H.dataformat = e.exportdataformat
            }
            H.align = e.align || "left";
            var B = e._parent ? a(e._parent, H) : H;
            if (B) {
                d.add(B)
            }
        }
    }
    z.parameter["_column_config_"]["column"] = d;
    z._generate_state = Ext.isEmpty(I) ? true: I;
    z._format = f || "xlsx";
    if (g) {
        z.separator = g
    }
    if (E) {
        z._file_name_ = E
    }
    if (A) {
        var m = [];
        Ext.each(A,
        function(c) {
            m.push({
                name: c
            })
        });
        z.parameter["_merge_column_"] = m
    }
    var w, x = {};
    if (n.qds) {
        w = n.qds.getCurrentRecord()
    }
    if (w) {
        Ext.apply(x, w.data)
    }
    Ext.apply(x, n.qpara);
    for (var D in x) {
        if (Ext.isEmpty(x[D], false)) {
            delete x[D]
        }
    }
    Ext.apply(z.parameter, x);
    var b = document.createElement("form");
    b.target = "_export_window";
    b.method = "post";
    var h = n.queryurl;
    if (h) {
        b.action = h + (h.indexOf("?") == -1 ? "?": "&") + "r=" + Math.random()
    }
    var l = Ext.get("_export_window") || new Ext.Template('<iframe id ="_export_window" name="_export_window" style="position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;display:none"></iframe>').insertFirst(document.body, {},
    true);
    var u = document.createElement("input");
    u.id = "_request_data";
    u.type = "hidden";
    u.name = "_request_data";
    u.value = Ext.encode(z);
    b.appendChild(u);
    document.body.appendChild(b);
    b.submit();
    Ext.fly(b).remove()
};
$A.isChinese = function(a) {
    return /^[\u4E00-\u9FA5_%]+$/.test(a.trim())
};
$A.isLetter = function(a) {
    return /^[a-zA-Z_%]+$/.test(a.trim())
};
$A.isUpperCase = function(a) {
    return /^[A-Z_%]+$/.test(a.trim())
};
$A.isLowerCase = function(a) {
    return /^[a-z_%]+$/.test(a.trim())
};
$A.isNumber = function(a) {
    return Ext.isNumber(Number(a))
};
$A.isDate = function() {
    var a = ["mm/dd/yyyy", "yyyy-mm-dd"];
    return function(c) {
        if (!Ext.isString(c)) {
            return false
        }
        for (var b = a.length; b--;) {
            try {
                c.parseDate(a[b]);
                return true
            } catch(d) {}
        }
        return false
    }
} ();
$A.isEmpty = Ext.isEmpty;
$A.checkNotification = function(b) {
    var a = null;
    if (Ext.isObject(b)) {
        for (var c in b) {
            var d = b[c];
            if (d.cmps) {
                a = $A.checkNotification(d.cmps)
            } else {
                if (!a && d instanceof Aurora.DataSet) {
                    a = (d.notification && d.isModified()) ? d.notification: null
                }
            }
            if (a) {
                break
            }
        }
    }
    return a
};
window.onbeforeunload = function() {
    var a = [];
    $A.manager.fireEvent("beforeunload", a);
    if (a.length != 0) {
        return a[0]
    }
};
if (Ext.isIE) { (function() {
        var c = Ext.Element.prototype,
        a = c.on,
        b = c.un,
        d = {};
        c.on = c.addListener = function(e, i, h, f) {
            var l = this,
            g = d[l.id] || (d[l.id] = []);
            l.un(e, i, h);
            a.call(l, e, i, h, f);
            Ext.each(g,
            function(p) {
                var m = p.eventName,
                o = p.handler,
                n = p.scope;
                b.call(l, m, o, n);
                a.call(l, m, o, n, p.opt)
            });
            g.unshift({
                eventName: e,
                handler: i,
                scope: h,
                opt: f
            });
            return l
        };
        c.un = c.removeListener = function(e, i, h) {
            var l = this,
            g = d[l.id],
            f = Ext.each(g,
            function(m) {
                if (m.eventName === e && m.handler == i && m.scope == h) {
                    return false
                }
            });
            if (Ext.isDefined(f)) {
                g.splice(f, 1)
            }
            b.call(l, e, i, h);
            return l
        }
    })()
}
$A.FixMath = (function() {
    var a = Math.pow,
    d = function(p, o) {
        var g = 0,
        r = String(p),
        q = String(o),
        i = r.indexOf("."),
        h = q.indexOf("."),
        n = r.indexOf("e"),
        l = q.indexOf("e");
        if (n != -1) {
            g -= Number(r.substr(n + 1));
            r = r.substr(0, n)
        }
        if (l != -1) {
            g -= Number(q.substr(l + 1));
            q = q.substr(0, l)
        }
        if (i != -1) {
            g += r.length - i - 1
        }
        if (h != -1) {
            g += q.length - h - 1
        }
        return Number(r.replace(".", "")) * Number(q.replace(".", "")) / a(10, g)
    },
    f = function(h, g) {
        var m = String(h / g),
        l = m.indexOf(".");
        if (l != -1) {
            m = Number(m).toFixed(16 - l - 1)
        }
        return Number(m)
    },
    e = function(n, m) {
        var s = 0,
        r = 0,
        q, p = String(n),
        o = String(m),
        h = p.indexOf("."),
        g = o.indexOf("."),
        l = p.indexOf("e"),
        i = o.indexOf("e");
        if (l != -1) {
            s -= Number(p.substr(l + 1));
            p = p.substr(0, l)
        }
        if (i != -1) {
            r -= Number(o.substr(i + 1));
            o = o.substr(0, i)
        }
        if (h != -1) {
            s += p.length - h - 1
        }
        if (g != -1) {
            r += o.length - g - 1
        }
        if (r > s) {
            q = r;
            s = r - s;
            r = 0
        } else {
            if (s > r) {
                q = s;
                r = s - r;
                s = 0
            } else {
                q = s;
                s = r = 0
            }
        }
        return (Number(p.replace(".", "")) * a(10, s) + Number(o.replace(".", "")) * a(10, r)) / a(10, q)
    },
    c = function(h, g) {
        return e(h, -g)
    },
    b = function(h, g) {
        var m = String(a(h, g)),
        l = m.indexOf(".");
        if (l != -1) {
            m = Number(m).toFixed(16 - l - 1)
        }
        return Number(m)
    };
    return {
        pow: b,
        minus: c,
        plus: e,
        div: f,
        mul: d
    }
})();
$A.merge = function() {
    function c(d) {
        var e = function() {};
        e.prototype = d;
        return new e()
    }
    function b(e, d, f) {
        if (Ext.isObject(f)) {
            if (Ext.isObject(e[d])) {
                a(e[d], f)
            } else {
                e[d] = c(f)
            }
        } else {
            if (Ext.isArray(f)) {
                e[d] = [].concat(f)
            } else {
                e[d] = f
            }
        }
        return e
    }
    function a(n, f, e) {
        if (Ext.isString(f)) {
            return b(n, f, e)
        }
        for (var m = 1,
        d = arguments.length; m < d; m++) {
            var g = arguments[m];
            for (var h in g) {
                b(n, h, g[h])
            }
        }
        return n
    }
    return function() {
        var e = [{}],
        f = arguments.length,
        d;
        while (f--) {
            if (!Ext.isBoolean(arguments[f])) {
                e[f + 1] = arguments[f]
            }
        }
        d = a.apply(null, e);
        return d
    }
} ();
$A.AUTO_ID = 1000;
$A.DataSet = Ext.extend(Ext.util.Observable, {
    constructor: function(b) {
        var c = this;
        $A.DataSet.superclass.constructor.call(this);
        b = b || {};
        if (b.listeners) {
            this.on(b.listeners)
        }
        this.validateEnable = true;
        this.pageid = b.pageid;
        this.spara = {};
        this.notification = b.notification;
        this.selected = [];
        this.sorttype = b.sorttype || "remote";
        this.maxpagesize = b.maxpagesize || 1000;
        this.pagesize = b.pagesize || 10;
        if (this.pagesize > this.maxpagesize) {
            this.pagesize = this.maxpagesize
        }
        this.submiturl = b.submiturl || "";
        this.queryurl = b.queryurl || "";
        this.fetchall = b.fetchall || false;
        this.totalcountfield = b.totalcountfield || "totalCount";
        this.selectable = b.selectable || false;
        this.selectionmodel = b.selectionmodel || "multiple";
        this.selectfunction = b.selectfunction;
        this.autocount = b.autocount;
        this.autopagesize = b.autopagesize;
        this.bindtarget = b.bindtarget;
        this.bindname = b.bindname;
        this.processfunction = b.processfunction;
        this.modifiedcheck = b.modifiedcheck;
        this.loading = false;
        this.qpara = {};
        this.fields = {};
        this.resetConfig();
        this.id = b.id || Ext.id();
        $A.CmpManager.put(this.id, this);
        if (this.bindtarget && this.bindname) {
            this.bind($(this.bindtarget), this.bindname)
        }
        this.qds = Ext.isEmpty(b.querydataset) ? null: $(b.querydataset);
        if (this.qds != null && this.qds.getCurrentRecord() == null) {
            this.qds.create()
        }
        this.initEvents();
        if (b.fields) {
            this.initFields(b.fields)
        }
        if (b.datas && b.datas.length != 0) {
            var a = b.datahead ? this.convertData(b.datahead, b.datas) : b.datas;
            this.autocount = false;
            this.loadData(a)
        }
        if (b.autoquery === true) {
            $A.onReady(function() {
                c.query()
            })
        }
        if (b.autocreate == true) {
            if (this.data.length == 0) {
                this.create()
            }
        }
    },
    convertData: function(e, a) {
        var f = [];
        for (var c = 0; c < a.length; c++) {
            var h = a[c],
            g = {};
            for (var b = 0; b < e.length; b++) {
                if (!Ext.isEmpty(h[b], true)) {
                    g[e[b]] = h[b]
                }
            }
            f.push(g)
        }
        return f
    },
    destroy: function() {
        var c = this,
        f = c.id,
        e = c.qtId,
        b = c.bindtarget,
        d = c.bindname,
        a = $A.CmpManager;
        c.processListener("un");
        e && Ext.Ajax.abort(e);
        b && d && (e = a.get(b)) && e.clearBind(d);
        Ext.iterate(c.fields,
        function(g, h) {
            h.type == "dataset" && c.clearBind(g)
        });
        a.remove(f);
        delete $A.invalidRecords[f]
    },
    reConfig: function(a) {
        this.resetConfig();
        Ext.apply(this, a)
    },
    clearBind: function(b) {
        var c = this,
        a = c.fields,
        d = a[b].pro.dataset;
        d && d.processBindDataSetListener(c, "un");
        delete a[b]
    },
    processBindDataSetListener: function(c, b) {
        var a = this.onDataSetModify;
        this[b]("add", a, this);
        this[b]("remove", a, this);
        this[b]("select", this.onDataSetSelect, this);
        this[b]("update", a, this);
        this[b]("indexchange", a, this);
        this[b]("clear", a, this);
        this[b]("load", this.onDataSetLoad, this);
        this[b]("reject", a, this);
        c[b]("indexchange", this.onDataSetIndexChange, this);
        c[b]("load", this.onBindDataSetLoad, this);
        c[b]("remove", this.onBindDataSetLoad, this);
        c[b]("clear", this.removeAll, this)
    },
    bind: function(b, a) {
        if (b.fields[a]) {
            alert("重复绑定 " + a);
            return
        }
        this.processBindDataSetListener(b, "un");
        this.processBindDataSetListener(b, "on");
        var c = new $A.Record.Field({
            name: a,
            type: "dataset",
            dataset: this
        });
        b.fields[a] = c
    },
    onBindDataSetLoad: function(b, a) {
        if (b.getAll().length == 0) {
            this.removeAll()
        }
    },
    onDataSetIndexChange: function(b, a) {
        if (!a.get(this.bindname) && a.isNew != true) {
            this.qpara = {};
            Ext.apply(this.qpara, a.data);
            this.query(1, {
                record: a
            })
        }
    },
    onDataSetModify: function() {
        var a = $A.CmpManager.get(this.bindtarget);
        if (a) {
            this.refreshBindDataSet(a.getCurrentRecord(), this.getConfig())
        }
    },
    onDataSetSelect: function(b, f) {
        var h = $A.CmpManager.get(this.bindtarget);
        if (h) {
            var g = h.data;
            var m = false;
            for (var e = 0; e < g.length; e++) {
                var c = g[e];
                var l = c.get(this.bindname);
                if (l) {
                    for (var d = 0; d < l.data.length; d++) {
                        var a = l.data[d];
                        if (a.id == f.id) {
                            l.selected = this.selected;
                            m = true;
                            break
                        }
                    }
                    if (m) {
                        break
                    }
                }
            }
        }
    },
    onDataSetLoad: function(d, c) {
        var a;
        if (c && c.opts && c.opts.record) {
            a = c.opts.record
        } else {
            var b = $A.CmpManager.get(this.bindtarget);
            if (b) {
                a = b.getCurrentRecord()
            }
        }
        if (a) {
            this.refreshBindDataSet(a, d.getConfig())
        }
    },
    refreshBindDataSet: function(a, b) {
        if (!a) {
            return
        }
        a.data[this.bindname] = b
    },
    beforeCreate: function(c, a, b) {
        if (this.data.length == 0) {
            this.create({},
            false)
        }
    },
    resetConfig: function() {
        this.data = [];
        this.selected = [];
        this.gotoPage = 1;
        this.currentPage = 1;
        this.currentIndex = 1;
        this.totalCount = 0;
        this.totalPage = 0;
        this.isValid = true
    },
    getConfig: function() {
        var a = {};
        a.xtype = "dataset";
        a.data = this.data;
        a.selected = this.selected;
        a.isValid = this.isValid;
        a.gotoPage = this.gotoPage;
        a.currentPage = this.currentPage;
        a.currentIndex = this.currentIndex;
        a.totalCount = this.totalCount;
        a.totalPage = this.totalPage;
        a.fields = this.fields;
        return a
    },
    processListener: function(a) {
        if (this.notification) {
            $A.manager[a]("beforeunload", this.onBeforeUnload, this)
        }
    },
    onBeforeUnload: function(a) {
        if (this.isModified()) {
            a.add(this.notification)
        }
    },
    initEvents: function() {
        this.addEvents("ajaxfailed", "beforecreate", "metachange", "fieldchange", "add", "remove", "beforeremove", "afterremove", "update", "clear", "query", "beforeload", "load", "loadfailed", "refresh", "valid", "indexchange", "beforeselect", "select", "unselect", "selectall", "unselectall", "reject", "wait", "afterwait", "beforesubmit", "submit", "submitsuccess", "submitfailed");
        this.processListener("on")
    },
    addField: function(b, o) {
        if (o !== true) {
            var n = b.returnfield,
            f = b.valuefield;
            if (n && f) {
                var a = b.mapping || [],
                h = false;
                for (var e = 0,
                d = a.length; e < d; e++) {
                    var c = a[e];
                    if (c.from == f && c.to == n) {
                        h = true;
                        break
                    }
                }
                if (!h) {
                    a.push({
                        from: f,
                        to: n
                    });
                    b.mapping = a
                }
            }
        }
        var g = new $A.Record.Field(b);
        this.fields[g.name] = g
    },
    removeField: function(a) {
        this.fields[a] = null;
        delete this.fields[a]
    },
    initFields: function(b) {
        for (var c = 0,
        a = b.length; c < a; c++) {
            this.addField(b[c], true)
        }
    },
    getField: function(a) {
        return this.fields[a]
    },
    beforeLoadData: function(a) {
        if (this.processfunction) {
            var b = $A.getRenderer(this.processfunction);
            if (b) {
                return b.call(window, a)
            }
        }
        return a
    },
    clearFilter: function() {
        if (this.backup) {
            this.data = this.backup;
            delete this.backup
        }
    },
    filter: function(e, a) {
        var c = this.backup || this.data,
        b = [];
        this.backup = c;
        Ext.each(c,
        function(d) {
            if (e.call(a || this, d, b) !== false) {
                b.push(d)
            }
        },
        this);
        this.data = b
    },
    loadData: function(e, d, n) {
        this.clearFilter();
        e = this.beforeLoadData(e);
        this.data = [];
        this.selected = [];
        if (d && this.fetchall == false) {
            this.totalCount = d;
            this.totalPage = Math.ceil(this.totalCount / this.pagesize)
        } else {
            this.totalCount = e.length;
            this.totalPage = 1
        }
        for (var b = 0,
        f = e.length; b < f; b++) {
            var a = e[b].data || e[b];
            for (var m in this.fields) {
                var h = this.fields[m];
                if (h) {
                    a[m] = this.processData(a, m, h)
                }
            }
            var c = new $A.Record(a, e[b].field);
            c.setDataSet(this);
            this.data.push(c)
        }
        this.fireEvent("beforeload", this, this.data);
        var l = true;
        if (this.bindtarget && n) {
            var g = $A.CmpManager.get(this.bindtarget).getCurrentRecord();
            if (n.opts.record && g != n.opts.record) {
                this.refreshBindDataSet(n.opts.record, this.getConfig());
                l = false
            }
        }
        if (l) {
            this.fireEvent("load", this, n)
        }
    },
    sort: function(a, b) {
        if (this.getAll().length == 0) {
            return
        }
        if (this.sorttype == "remote") {
            if (b == "") {
                delete this.qpara.ORDER_FIELD;
                delete this.qpara.ORDER_TYPE
            } else {
                this.setQueryParameter("ORDER_FIELD", a);
                this.setQueryParameter("ORDER_TYPE", b)
            }
            this.query()
        } else {
            this.data.sort(function(d, c) {
                var e = d.get(a) > c.get(a);
                return (b == "desc" ? (e ? -1 : 1) : (e ? 1 : -1))
            });
            this.fireEvent("refresh", this)
        }
    },
    create: function(f, d) {
        if (Ext.isNumber(f)) {
            d = f;
            f = null
        }
        f = f || {};
        if (this.fireEvent("beforecreate", this, f)) {
            var a = {};
            for (var c in this.fields) {
                var g = this.fields[c];
                var e = g.getPropertity("defaultvalue");
                if (e && !f[g.name]) {
                    a[g.name] = e
                } else {
                    a[g.name] = this.processValueListField(a, f[g.name], g)
                }
            }
            var f = Ext.apply(f || {},
            a);
            var b = new $A.Record(f);
            this.add(b, d);
            return b
        }
    },
    getNewRecords: function() {
        var d = this.getAll();
        var e = [];
        for (var c = 0,
        b = d.length; c < b; c++) {
            var a = d[c];
            if (a.isNew == true) {
                e.push(a)
            }
        }
        return e
    },
    add: function(a, b) {
        var c = this.data;
        if (c.indexOf(a) != -1) {
            return
        }
        if (Ext.isEmpty(b) || b > c.length) {
            b = c.length
        }
        a.isNew = true;
        a.setDataSet(this);
        c.splice(b, 0, a);
        this.currentIndex = (this.currentPage - 1) * this.pagesize + b + 1;
        this.fireEvent("add", this, a, b);
        this.locate(this.currentIndex, true)
    },
    getCurrentObject: function() {
        return this.getCurrentRecord().getObject()
    },
    getCurrentRecord: function() {
        if (this.data.length == 0) {
            return null
        }
        return this.data[this.currentIndex - (this.currentPage - 1) * this.pagesize - 1]
    },
    remove: function(a) {
        if (!a) {
            a = this.getCurrentRecord()
        }
        if (!a) {
            return
        }
        var b = [].concat(a);
        if (this.fireEvent("beforeremove", this, b)) {
            var e = [];
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (d.isNew) {
                    this.removeLocal(d)
                } else {
                    e[e.length] = d
                }
            }
            this.removeRemote(e)
        }
    },
    removeRemote: function(e) {
        if (this.submiturl == "") {
            return
        }
        var c = [];
        for (var g = 0; g < e.length; g++) {
            var a = e[g];
            for (var m in this.fields) {
                var i = this.fields[m];
                if (i && i.type == "dataset") {
                    delete a.data[m]
                }
            }
            var l = Ext.apply({},
            a.data);
            l._id = a.id;
            l._status = "delete";
            c[g] = l
        }
        if (c.length > 0) {
            var b;
            if (this.bindtarget) {
                var h = $A.CmpManager.get(this.bindtarget);
                b = {
                    record: h.getCurrentRecord(),
                    dataSet: this
                }
            }
            $A.request({
                url: this.submiturl,
                para: c,
                ext: this.spara,
                success: this.onRemoveSuccess,
                error: this.onSubmitError,
                scope: this,
                failure: this.onAjaxFailed,
                opts: b
            })
        }
    },
    onRemoveSuccess: function(e, c) {
        if (e.result.record) {
            var a = [].concat(e.result.record);
            if (this.bindtarget) {
                var h = $A.CmpManager.get(this.bindtarget);
                if (h.getCurrentRecord() == c.opts.record) {
                    for (var d = 0; d < a.length; d++) {
                        var g = a[d];
                        this.removeLocal(this.findById(g._id), true)
                    }
                } else {
                    var b = c.opts.record.get(this.bindname);
                    var f = new $A.DataSet({});
                    f.reConfig(b);
                    for (var d = 0; d < a.length; d++) {
                        var g = a[d];
                        f.removeLocal(f.findById(g._id), true)
                    }
                    this.refreshBindDataSet(c.opts.record, f.getConfig());
                    delete f
                }
            } else {
                for (var d = 0; d < a.length; d++) {
                    var g = a[d];
                    this.removeLocal(this.findById(g._id), true)
                }
            }
            this.fireEvent("afterremove", this)
        }
    },
    removeLocal: function(a, d, c) {
        $A.removeInvalidReocrd(this.id, a);
        var b = this.data.indexOf(a);
        if (b == -1) {
            return
        }
        this.data.remove(a);
        if (d) {
            this.totalCount--
        }
        this.selected.remove(a);
        if (!c) {
            if (this.data.length != 0) {
                var e = this.currentIndex - (this.currentPage - 1) * this.pagesize;
                if (e < 0) {
                    return
                }
                if (e <= this.data.length) {
                    this.locate(this.currentIndex, true)
                } else {
                    this.pre()
                }
            }
        }
        this.fireEvent("remove", this, a, b);
        if (!this.selected.length) {
            this.fireEvent("unselectall", this, this.selected)
        }
    },
    getAll: function() {
        return this.data
    },
    find: function(c, b) {
        var a = null;
        this.each(function(d) {
            var e = d.get(c);
            if (e == b) {
                a = d;
                return false
            }
        },
        this);
        return a
    },
    findById: function(d) {
        var c = null;
        for (var b = 0,
        a = this.data.length; b < a; b++) {
            if (this.data[b].id == d) {
                c = this.data[b];
                break
            }
        }
        return c
    },
    removeAll: function() {
        this.currentIndex = 1;
        this.totalCount = 0;
        this.data = [];
        this.selected = [];
        this.fireEvent("clear", this)
    },
    indexOf: function(a) {
        return this.data.indexOf(a)
    },
    getAt: function(a) {
        return this.data[a]
    },
    each: function(e, d) {
        var b = [].concat(this.data);
        for (var c = 0,
        a = b.length; c < a; c++) {
            if (e.call(d || b[c], b[c], c, a) === false) {
                break
            }
        }
    },
    processCurrentRow: function() {
        var b = this.getCurrentRecord();
        for (var a in this.fields) {
            var d = this.fields[a];
            if (d.type == "dataset") {
                var c = d.pro.dataset;
                if (b && b.data[d.name]) {
                    c.reConfig(b.data[d.name])
                } else {
                    c.resetConfig()
                }
                c.fireEvent("refresh", c);
                c.processCurrentRow()
            }
        }
        if (b) {
            this.fireEvent("indexchange", this, b)
        }
    },
    getSelected: function() {
        return this.selected
    },
    selectAll: function() {
        if (!this.selectable) {
            return
        }
        for (var b = 0,
        a = this.data.length; b < a; b++) {
            if (!this.execSelectFunction(this.data[b])) {
                continue
            }
            this.select(this.data[b], true)
        }
        this.fireEvent("selectall", this, this.selected)
    },
    unSelectAll: function() {
        if (!this.selectable) {
            return
        }
        for (var b = 0,
        a = this.data.length; b < a; b++) {
            if (!this.execSelectFunction(this.data[b])) {
                continue
            }
            this.unSelect(this.data[b], true)
        }
        this.fireEvent("unselectall", this, this.selected)
    },
    select: function(a, c) {
        if (!this.selectable) {
            return
        }
        if (typeof(a) == "string" || typeof(a) == "number") {
            a = this.findById(a)
        }
        if (!a) {
            return
        }
        if (this.selected.indexOf(a) != -1) {
            return
        }
        if (this.fireEvent("beforeselect", this, a)) {
            a.isSelected = true;
            if (this.selectionmodel == "multiple") {
                this.selected.add(a);
                this.fireEvent("select", this, a, c)
            } else {
                var b = this.selected[0];
                this.unSelect(b);
                this.selected = [];
                this.selected.push(a);
                this.fireEvent("select", this, a)
            }
        }
    },
    unSelect: function(a, b) {
        if (!this.selectable) {
            return
        }
        if (typeof(a) == "string" || typeof(a) == "number") {
            a = this.findById(a)
        }
        if (!a) {
            return
        }
        if (this.selected.indexOf(a) == -1) {
            return
        }
        this.selected.remove(a);
        a.isSelected = false;
        this.fireEvent("unselect", this, a, b)
    },
    execSelectFunction: function(d) {
        if (this.selectfunction) {
            var c = $A.getRenderer(this.selectfunction);
            if (c == null) {
                alert("未找到" + this.selectfunction + "方法!")
            } else {
                var a = c.call(window, d);
                if (Ext.isDefined(a)) {
                    return a
                }
            }
        }
        return true
    },
    locate: function(a, d) {
        if (this.currentIndex === a && d !== true) {
            return
        }
        if (this.fetchall == true && a > ((this.currentPage - 1) * this.pagesize + this.data.length)) {
            return
        }
        if (!this.autocount && a > ((this.currentPage - 1) * this.pagesize + this.data.length) && this.data.length < this.pagesize) {
            return
        }
        if (a <= 0) {
            return
        }
        if (a <= 0 || (this.autocount && (a > this.totalCount + this.getNewRecords().length))) {
            return
        }
        var c = a - (this.currentPage - 1) * this.pagesize;
        if (this.data[c - 1]) {
            this.currentIndex = a
        } else {
            if (this.modifiedcheck && this.isModified()) {
                $A.showInfoMessage(_lang["dataset.info"], _lang["dataset.info.locate"])
            } else {
                this.currentIndex = a;
                this.currentPage = Math.ceil(a / this.pagesize);
                this.query(this.currentPage);
                return
            }
        }
        this.processCurrentRow();
        if (this.selectionmodel == "single") {
            var b = this.getAt(a - this.pagesize * (this.currentPage - 1) - 1);
            if (this.execSelectFunction(b)) {
                this.select(b)
            }
        }
    },
    goPage: function(c) {
        if (c > 0) {
            this.gotoPage = c;
            var b = (c - 1) * this.pagesize + 1;
            var a = this.getAll().length - this.pagesize;
            if (this.currentPage < c && a > 0) {
                b += a
            }
            this.locate(b)
        }
    },
    first: function() {
        this.locate(1)
    },
    pre: function() {
        this.locate(this.currentIndex - 1)
    },
    next: function() {
        this.locate(this.currentIndex + 1)
    },
    firstPage: function() {
        this.goPage(1)
    },
    prePage: function() {
        this.goPage(this.currentPage - 1)
    },
    nextPage: function() {
        this.goPage(this.currentPage + 1)
    },
    lastPage: function() {
        this.goPage(this.totalPage)
    },
    validateSelf: function(a) {
        return this.validate(a, true, false)
    },
    setValidateEnable: function(a) {
        this.validateEnable = a
    },
    validate: function(n, x, a) {
        if (!this.validateEnable) {
            return true
        }
        this.isValid = true;
        var o = this.getCurrentRecord();
        if (!o) {
            return true
        }
        var s = n ? this.getSelected() : this.getAll();
        var t = {};
        var b = false;
        var w = null;
        var g = true;
        if (a !== false) {
            for (var q in this.fields) {
                var c = this.fields[q];
                if (c.type == "dataset") {
                    b = true;
                    var u = c.pro.dataset;
                    t[c.name] = u
                }
            }
        }
        for (var q = 0,
        p = s.length; q < p; q++) {
            var e = s[q];
            if (!e.validateRecord()) {
                this.isValid = false;
                w = e;
                $A.addInValidReocrd(this.id, e)
            } else {
                $A.removeInvalidReocrd(this.id, e)
            }
            if (this.isValid == false) {
                if (b) {
                    break
                }
            } else {
                for (var z in t) {
                    var i = t[z];
                    if (e.data[z]) {
                        i.reConfig(e.data[z]);
                        if (!i.validate()) {
                            g = this.isValid = false;
                            w = e
                        } else {
                            i.reConfig(o.data[z])
                        }
                    }
                }
                if (this.isValid == false) {
                    break
                }
            }
        }
        if (w != null) {
            var h = this.indexOf(w);
            if (h != -1) {
                this.locate(h + 1)
            }
        }
        if (x !== false && g !== false) {
            $A.manager.fireEvent("valid", $A.manager, this, this.isValid);
            if (!this.isValid) {
                var m = w.valid,
                f;
                for (var z in m) {
                    f = m[z];
                    break
                }
                $A.showInfoMessage(_lang["dataset.info"], f || _lang["dataset.info.validate"])
            }
        }
        return this.isValid
    },
    setQueryUrl: function(a) {
        this.queryurl = a
    },
    setQueryParameter: function(a, b) {
        this.qpara[a] = b
    },
    setQueryDataSet: function(a) {
        this.qds = a;
        if (this.qds.getCurrentRecord() == null) {
            this.qds.create()
        }
    },
    setSubmitUrl: function(a) {
        this.submiturl = a
    },
    setSubmitParameter: function(a, b) {
        this.spara[a] = b
    },
    isAllReady: function(c) {
        var f = this,
        b = c ? f.getSelected() : f.getAll(),
        g = true;
        for (var d = 0,
        a = b.length; d < a; d++) {
            var e = b[d];
            if (!e.isReady) {
                g = false;
                break
            }
            Ext.iterate(e.data,
            function(h, i) {
                if (i && i.xtype == "dataset") {
                    var m = f.fields[h];
                    var l = m.pro.dataset;
                    l.reConfig(i);
                    if (!l.isAllReady(c)) {
                        g = false;
                        return false
                    }
                }
            })
        }
        return g
    },
    wait: function(a, h, d) {
        var g = this,
        b = a ? g.getAll() : g.getSelected();
        g.fireBindDataSetEvent("wait");
        for (var c = 0,
        f; f = b[c]; c++) {
            Ext.iterate(f.data,
            function(i, l) {
                if (l && l.xtype == "dataset") {
                    b = b.concat(l.data)
                }
            })
        }
        var e = setInterval(function() {
            for (var n = 0,
            m = b.length; n < m; n++) {
                if (!b[n].isReady) {
                    return
                }
            }
            clearInterval(e);
            g.fireBindDataSetEvent("afterwait");
            if (h) {
                h.call(d || window)
            }
        },
        10)
    },
    query: function(b, a) {
        $A.slideBarEnable = $A.SideBar.enable;
        if (!this.queryurl) {
            return
        }
        if (this.qds) {
            if (this.qds.getCurrentRecord() == null) {
                this.qds.create()
            }
            this.qds.wait(true,
            function() {
                if (!this.qds.validate()) {
                    return
                }
                this.doQuery(b, a)
            },
            this)
        } else {
            this.doQuery(b, a)
        }
    },
    doQuery: function(h, f) {
        var e;
        if (this.qds) {
            e = this.qds.getCurrentRecord()
        }
        if (!h) {
            this.currentIndex = 1
        }
        this.currentPage = h || 1;
        var g = {};
        if (e != null) {
            Ext.apply(g, e.data)
        }
        Ext.apply(g, this.qpara);
        for (var c in g) {
            var b = g[c];
            if (Ext.isEmpty(b, false)) {
                delete g[c]
            }
        }
        var a = "pagesize=" + this.pagesize + "&pagenum=" + this.currentPage + "&_fetchall=" + this.fetchall + "&_autocount=" + this.autocount;
        var d = this.queryurl + (this.queryurl.indexOf("?") == -1 ? "?": "&") + a;
        this.loading = true;
        this.fireEvent("query", this, g, f);
        if (this.qtId) {
            Ext.Ajax.abort(this.qtId)
        }
        this.qtId = $A.request({
            url: d,
            para: g,
            success: this.onLoadSuccess,
            error: this.onLoadError,
            scope: this,
            failure: this.onAjaxFailed,
            opts: f,
            ext: f ? f.ext: null
        })
    },
    isModified: function() {
        var e = false;
        var d = this.getAll();
        for (var c = 0,
        b = d.length; c < b; c++) {
            var a = d[c];
            if (a.dirty == true || a.isNew == true) {
                e = true;
                break
            } else {
                for (var f in this.fields) {
                    var h = this.fields[f];
                    if (h.type == "dataset") {
                        var g = h.pro.dataset;
                        g.reConfig(a.data[h.name]);
                        if (g.isModified()) {
                            e = true;
                            break
                        }
                    }
                }
            }
        }
        return e
    },
    getJsonData: function(f, m) {
        var h = [];
        var o = this.data;
        if (f) {
            o = this.getSelected()
        }
        for (var g = 0,
        c = o.length; g < c; g++) {
            var a = o[g];
            var p = a.dirty || a.isNew;
            var n = Ext.apply({},
            a.data);
            n._id = a.id;
            n._status = a.isNew ? "insert": "update";
            for (var e in a.data) {
                if (m && m.indexOf(e) == -1) {
                    delete n[e]
                } else {
                    var q = n[e];
                    if (q && q.xtype == "dataset") {
                        var b = new $A.DataSet({});
                        b.reConfig(q);
                        p = p == false ? b.isModified() : p;
                        n[e] = b.getJsonData()
                    }
                }
            }
            if (p || f) {
                h.push(n)
            }
        }
        return h
    },
    checkEmptyData: function(a) {
        var b = this;
        Ext.each(a,
        function(c) {
            Ext.iterate(c,
            function(e, h, g) {
                if ((g = b.fields[e]) && g.type == "dataset") {
                    b.checkEmptyData(h)
                } else {
                    if (h === "") {
                        c[e] = null
                    }
                }
            })
        })
    },
    doSubmit: function(b, a) {
        var c = this;
        c.fireBindDataSetEvent("submit", b, a);
        if ((c.submiturl = b || c.submiturl) == "") {
            return
        }
        c.checkEmptyData(a);
        $A.request({
            showSuccessTip: true,
            url: c.submiturl,
            para: a,
            ext: c.spara,
            success: c.onSubmitSuccess,
            error: c.onSubmitError,
            scope: c,
            failure: c.onAjaxFailed
        })
    },
    submitSelected: function(b, a) {
        this.submit(b, a, true)
    },
    submit: function(b, a, c) {
        var d = this;
        d.wait(!c,
        function() {
            d.fireEvent("beforesubmit", d) && d.validate(c) && d.doSubmit(b, d.getJsonData(c, a))
        })
    },
    post: function(a) {
        var c = this,
        b = c.getCurrentRecord();
        b && c.wait(true,
        function() {
            c.validate() && $A.post(a, b.data)
        })
    },
    reset: function() {
        var a = this.getCurrentRecord();
        if (!a || !a.fields) {
            return
        }
        for (var d in a.fields) {
            var b = a.fields[d].get("defaultvalue");
            if (b != a.get(d)) {
                a.set(d, b == undefined || b == null ? "": b)
            }
        }
    },
    fireBindDataSetEvent: function() {
        var b = Ext.toArray(arguments);
        var d = b[0];
        b[0] = this;
        this.fireEvent.apply(this, [d].concat(b));
        for (var c in this.fields) {
            var f = this.fields[c];
            if (f.type == "dataset") {
                var e = f.pro.dataset;
                if (e) {
                    e.fireBindDataSetEvent(d)
                }
            }
        }
    },
    afterEdit: function(a, b, c, d) {
        this.fireEvent("update", this, a, b, c, d)
    },
    afterReject: function(a, b, c) {
        this.fireEvent("reject", this, a, b, c)
    },
    onSubmitSuccess: function(b) {
        var a = [];
        if (b.result.record) {
            a = [].concat(b.result.record);
            this.commitRecords(a, true)
        }
        this.fireBindDataSetEvent("submitsuccess", b)
    },
    commitRecords: function(o, b, n) {
        for (var m = 0,
        e = o.length; m < e; m++) {
            var h = o[m];
            var a = this.findById(h._id);
            if (!a) {
                continue
            }
            if (a.isNew) {
                this.totalCount++
            }
            a.commit();
            var t = false;
            for (var g in h) {
                var s = g;
                var p = this.fields[s];
                if (p && p.type == "dataset") {
                    var c = p.pro.dataset;
                    c.reConfig(a.data[p.name]);
                    if (h[g].record) {
                        c.commitRecords([].concat(h[g].record), this.getCurrentRecord() === a && b, a)
                    }
                } else {
                    if (p && p.type == "hidden") {
                        continue
                    } else {
                        var d = a.get(s);
                        var q = h[g];
                        if (s == "_id" || s == "_status" || s == "__parameter_parsed__") {
                            continue
                        }
                        if (p) {
                            q = this.processData(h, g, p)
                        }
                        if (d != q) {
                            t = true;
                            if (b) {
                                a.set(s, q, true)
                            } else {
                                a.data[s] = q;
                                if (n) {
                                    n.data[this.bindname] = this.getConfig()
                                }
                            }
                        }
                    }
                }
            }
            if (!t && b) {
                a.set("__for_update__", true, true);
                delete a.data.__for_update__;
                a.commit()
            }
        }
    },
    processData: function(d, b, e) {
        var a = d[b];
        if (a) {
            var c = e.getPropertity("datatype");
            c = c ? c.toLowerCase() : "";
            switch (c) {
            case "date":
                a = $A.parseDate(a);
                break;
            case "java.util.date":
                a = $A.parseDate(a);
                break;
            case "java.sql.date":
                a = $A.parseDate(a);
                break;
            case "java.sql.timestamp":
                a = $A.parseDate(a);
                a.xtype = "timestamp";
                break;
            case "int":
                a = parseInt(a);
                break;
            case "float":
                a = parseFloat(a);
                break;
            case "boolean":
                a = a == "true";
                break
            }
        }
        return this.processValueListField(d, a, e)
    },
    processValueListField: function(f, n, m) {
        var g = m.getPropertity("options");
        var l = m.getPropertity("displayfield");
        var h = m.getPropertity("valuefield");
        var d = m.getPropertity("mapping");
        if (l && h && g && d && !n) {
            var o;
            for (var e = 0; e < d.length; e++) {
                var b = d[e];
                if (h == b.from) {
                    o = b.to;
                    break
                }
            }
            var c = f[o];
            var p = $(g);
            if (p && !Ext.isEmpty(c)) {
                var a = p.find(h, c);
                if (a) {
                    n = a.get(l)
                }
            }
        }
        return n
    },
    onSubmitError: function(a) {
        this.fireBindDataSetEvent("submitfailed", a)
    },
    onLoadSuccess: function(g, n) {
        try {
            if (g == null) {
                return
            }
            if (!g.result.record) {
                g.result.record = []
            }
            var a = [].concat(g.result.record);
            var h = g.result[this.totalcountfield];
            var d = [];
            if (a.length > 0) {
                for (var c = 0,
                b = a.length; c < b; c++) {
                    var m = {
                        data: a[c]
                    };
                    d.push(m)
                }
            } else {
                if (a.length == 0) {
                    this.currentIndex = 0
                }
            }
            this.loading = false;
            this.loadData(d, h, n);
            if (d.length != 0) {
                this.locate(this.currentIndex, true)
            }
            $A.SideBar.enable = $A.slideBarEnable;
            this.qtId = null
        } catch(f) {
            window.console && console.error(f.stack)
        }
    },
    onAjaxFailed: function(b, a) {
        this.fireBindDataSetEvent("ajaxfailed", b, a);
        this.qtId = null
    },
    onLoadError: function(b, a) {
        this.fireBindDataSetEvent("loadfailed", b, a);
        this.loading = false;
        $A.SideBar.enable = $A.slideBarEnable;
        this.qtId = null
    },
    onFieldChange: function(a, d, b, c) {
        this.fireEvent("fieldchange", this, a, d, b, c)
    },
    onMetaChange: function(a, d, b, c) {
        this.fireEvent("metachange", this, a, d, b, c)
    },
    onRecordValid: function(a, b, c) {
        if (c == false && this.isValid !== false) {
            this.isValid = false
        }
        this.fireEvent("valid", this, a, b, c)
    }
});
$A.Record = function(b, a) {
    this.id = ++$A.AUTO_ID;
    this.data = b;
    this.fields = {};
    this.valid = {};
    this.isValid = true;
    this.isNew = false;
    this.dirty = false;
    this.editing = false;
    this.modified = null;
    this.isReady = true;
    this.isSelected = false;
    this.meta = new $A.Record.Meta(this);
    if (a) {
        this.initFields(a)
    }
};
$A.Record.prototype = {
    commit: function() {
        this.editing = false;
        this.valid = {};
        this.isValid = true;
        this.isNew = false;
        this.dirty = false;
        this.modified = null
    },
    initFields: function(a) {
        for (var c = 0,
        b = a.length; c < b; c++) {
            var d = new $A.Record.Field(a[c]);
            d.record = this;
            this.fields[d.name] = d
        }
    },
    validateRecord: function() {
        this.isValid = true;
        this.valid = {};
        var f = this.ds.fields;
        var d = this.fields;
        var e = [];
        for (var b in f) {
            if (f[b].type != "dataset") {
                e.push(b)
            }
        }
        for (var b in d) {
            if (e.indexOf(b) == -1) {
                if (d[b].type != "dataset") {
                    e.push(b)
                }
            }
        }
        for (var c = 0,
        a = e.length; c < a; c++) {
            if (this.isValid == true) {
                this.isValid = this.validate(e[c])
            } else {
                this.validate(e[c])
            }
        }
        return this.isValid
    },
    validate: function(c) {
        var a = true;
        var e = this.valid[c];
        var i = this.get(c);
        var g = this.getMeta().getField(c);
        var b = g.get("validator");
        var h = i;
        if (i && i.trim) {
            h = i.trim()
        }
        if (Ext.isEmpty(h) && g.get("required") == true) {
            this.valid[c] = g.get("requiredmessage") || _lang["dataset.validate.required"];
            a = false
        }
        if (a == true) {
            var d = true;
            if (b) {
                var f = window[b];
                if (f) {
                    d = f.call(window, this, c, i);
                    if (d !== true) {
                        a = false;
                        this.valid[c] = d
                    }
                } else {
                    alert("未找到函数" + b)
                }
            }
        }
        if (a == true) {
            delete this.valid[c]
        }
        if ((e || this.valid[c]) && e != this.valid[c]) {
            this.ds.onRecordValid(this, c, a)
        }
        return a
    },
    setDataSet: function(a) {
        this.ds = a
    },
    getField: function(a) {
        return this.getMeta().getField(a)
    },
    getMeta: function() {
        return this.meta
    },
    copy: function(a) {
        if (a == this) {
            alert("不能copy自身!");
            return
        }
        if (a.dirty) {
            for (var b in a.modified) {
                this.set(b, a.get(b))
            }
        }
    },
    set: function(b, d, c) {
        var a = this.data[b];
        if (! (a === d || (Ext.isEmpty(a) && Ext.isEmpty(d)) || (Ext.isDate(a) && Ext.isDate(d) && a.getTime() == d.getTime()))) {
            if (!c) {
                this.dirty = true;
                if (!this.modified) {
                    this.modified = {}
                }
                if (typeof this.modified[b] == "undefined") {
                    this.modified[b] = a
                }
            }
            this.data[b] = d;
            if (!this.editing && this.ds) {
                this.ds.afterEdit(this, b, d, a)
            }
        }
        this.validate(b)
    },
    get: function(a) {
        return this.data[a]
    },
    getObject: function() {
        return Ext.apply({},
        this.data)
    },
    setObject: function(b) {
        for (var a in b) {
            this.set(a, b[a])
        }
    },
    reject: function(b) {
        var a = this.modified;
        for (var c in a) {
            if (typeof a[c] != "function") {
                this.data[c] = a[c];
                this.ds.afterReject(this, c, a[c])
            }
        }
        delete this.modified;
        this.editing = false;
        this.dirty = false
    },
    onFieldChange: function(a, b, c) {
        var d = this.getMeta().getField(a);
        this.ds.onFieldChange(this, d, b, c)
    },
    onFieldClear: function(a) {
        var b = this.getMeta().getField(a);
        this.ds.onFieldChange(this, b)
    },
    onMetaChange: function(c, a, b) {
        this.ds.onMetaChange(this, c, a, b)
    },
    onMetaClear: function(a) {
        this.ds.onMetaChange(this, a)
    },
    setDirty: function(a) {
        this.dirty = a
    }
};
$A.Record.Meta = function(a) {
    this.record = a;
    this.pro = {}
};
$A.Record.Meta.prototype = {
    clear: function() {
        this.pro = {};
        this.record.onMetaClear(this)
    },
    getField: function(a) {
        if (!a) {
            return null
        }
        var c = this.record.fields[a];
        var e = this.record.ds.fields[a];
        var b;
        if (!c) {
            if (e) {
                c = new $A.Record.Field({
                    name: e.name,
                    type: e.type || "string"
                })
            } else {
                c = new $A.Record.Field({
                    name: a,
                    type: "string"
                })
            }
            c.record = this.record;
            this.record.fields[c.name] = c
        }
        var d = {};
        if (e) {
            d = Ext.apply(d, e.pro)
        }
        d = $A.merge(d, this.pro);
        d = $A.merge(d, c.pro);
        delete d.name;
        delete d.type;
        c.snap = d;
        return c
    },
    setRequired: function(a) {
        var b = this.pro.required;
        if (b !== a) {
            this.pro.required = a;
            this.record.onMetaChange(this, "required", a)
        }
    },
    setReadOnly: function(a) {
        var b = this.pro.readonly;
        if (b !== a) {
            this.pro.readonly = a;
            this.record.onMetaChange(this, "readonly", a)
        }
    }
};
$A.Record.Field = function(a) {
    this.name = a.name;
    this.type = a.type;
    this.pro = a || {};
    this.record
};
$A.Record.Field.prototype = {
    clear: function() {
        this.pro = {};
        this.record.onFieldClear(this.name)
    },
    setPropertity: function(a, b) {
        var c = this.pro[a];
        if (c !== b) {
            this.pro[a] = b;
            if (this.snap) {
                this.snap[a] = b
            }
            if (this.record) {
                this.record.onFieldChange(this.name, a, b)
            }
        }
    },
    get: function(b) {
        var a = null;
        if (this.snap) {
            a = this.snap[b]
        } else {
            if (this.pro) {
                a = this.pro[b]
            }
        }
        return a
    },
    getPropertity: function(a) {
        return this.pro[a]
    },
    setRequired: function(a) {
        this.setPropertity("required", a);
        if (!a && this.record) {
            this.record.validate(this.name)
        }
    },
    isRequired: function() {
        return this.get("required")
    },
    setReadOnly: function(a) {
        if (a && this.record) {
            delete this.record.valid[this.name]
        }
        this.setPropertity("readonly", a)
    },
    isReadOnly: function() {
        return this.get("readonly")
    },
    setOptions: function(a) {
        this.setPropertity("options", a)
    },
    getOptions: function() {
        return this.get("options")
    },
    setMapping: function(a) {
        this.setPropertity("mapping", a)
    },
    getMapping: function() {
        return this.get("mapping")
    },
    setTitle: function(a) {
        this.setPropertity("title", a)
    },
    setLovWidth: function(a) {
        this.setPropertity("lovwidth", a)
    },
    setLovHeight: function(a) {
        this.setPropertity("lovheight", a)
    },
    setLovGridHeight: function(a) {
        this.setPropertity("lovgridheight", a)
    },
    setLovModel: function(a) {
        this.setPropertity("lovmodel", a)
    },
    setLovService: function(a) {
        this.setPropertity("lovservice", a)
    },
    setLovUrl: function(a) {
        this.setPropertity("lovurl", a)
    },
    setLovPara: function(a, b) {
        var c = this.get("lovpara") || {};
        if (b == null) {
            delete c[a]
        } else {
            c[a] = b
        }
        this.setPropertity("lovpara", c)
    }
};
$A.Component = Ext.extend(Ext.util.Observable, {
    focusCss: "item-focus",
    constructor: function(a) {
        $A.Component.superclass.constructor.call(this);
        this.id = a.id || Ext.id();
        $A.CmpManager.put(this.id, this);
        this.initConfig = a;
        this.isHidden = false;
        this.isFireEvent = false;
        this.hasFocus = false;
        this.initComponent(a);
        this.initEvents();
        this.hidden && this.setVisible(false)
    },
    initComponent: function(a) {
        a = a || {};
        Ext.apply(this, a);
        this.wrap = Ext.get(this.id);
        if (this.listeners) {
            this.on(this.listeners)
        }
    },
    processListener: function(a) {
        this.processMouseOverOut(a);
        if (this.clientresize && (this.marginwidth || this.marginheight)) {
            Ext.EventManager[a](window, "resize", this.windowResizeListener, this)
        }
    },
    processMouseOverOut: function(a) {
        if (this.wrap) {
            this.wrap[a]("mouseover", this.onMouseOver, this);
            this.wrap[a]("mouseout", this.onMouseOut, this)
        }
    },
    initEvents: function() {
        this.addEvents("focus", "blur", "change", "valid", "mouseover", "mouseout");
        this.processListener("on")
    },
    windowResizeListener: function() {
        var c, d;
        var a = "refresh";
        Ext.getBody().addClass(a);
        if (!Ext.isEmpty(this.marginheight)) {
            c = Aurora.getViewportHeight();
            this.setHeight(c - this.marginheight)
        }
        if (!Ext.isEmpty(this.marginwidth)) {
            d = Aurora.getViewportWidth();
            var b = d - this.marginwidth;
            this.setWidth(b)
        }
        Ext.getBody().removeClass(a)
    },
    isEventFromComponent: function(a) {
        return this.wrap.contains(a) || this.wrap.dom === (a.dom ? a.dom: a)
    },
    move: function(a, b) {
        if (!Ext.isEmpty(a)) {
            this.wrap.setX(a)
        }
        if (!Ext.isEmpty(b)) {
            this.wrap.setY(b)
        }
    },
    getBindName: function() {
        return this.binder ? this.binder.name: null
    },
    getBindDataSet: function() {
        return this.binder ? this.binder.ds: null
    },
    bind: function(c, b) {
        this.clearBind();
        if (typeof(c) == "string") {
            c = $(c)
        }
        if (!c) {
            return
        }
        this.binder = {
            ds: c,
            name: b
        };
        this.record = c.getCurrentRecord();
        var d = c.fields[this.binder.name];
        if (d) {
            var a = {};
            Ext.apply(a, this.initConfig);
            Ext.apply(a, d.pro);
            delete a.name;
            delete a.type;
            this.initComponent(a)
        }
        c.on("metachange", this.onRefresh, this);
        c.on("valid", this.onValid, this);
        c.on("remove", this.onRemove, this);
        c.on("clear", this.onClear, this);
        c.on("update", this.onUpdate, this);
        c.on("reject", this.onUpdate, this);
        c.on("fieldchange", this.onFieldChange, this);
        c.on("indexchange", this.onRefresh, this);
        this.onRefresh(c)
    },
    clearBind: function() {
        if (this.binder) {
            var a = this.binder.ds;
            a.un("metachange", this.onRefresh, this);
            a.un("valid", this.onValid, this);
            a.un("remove", this.onRemove, this);
            a.un("clear", this.onClear, this);
            a.un("update", this.onUpdate, this);
            a.un("reject", this.onUpdate, this);
            a.un("fieldchange", this.onFieldChange, this);
            a.un("indexchange", this.onRefresh, this)
        }
        this.binder = null;
        this.record = null;
        this.value = null
    },
    destroy: function() {
        this.processListener("un");
        $A.CmpManager.remove(this.id);
        this.clearBind();
        delete this.wrap
    },
    onMouseOver: function(a) {
        this.fireEvent("mouseover", this, a)
    },
    onMouseOut: function(a) {
        this.fireEvent("mouseout", this, a)
    },
    onRemove: function(b, a) {
        if (this.binder.ds == b && this.record == a) {
            this.clearValue()
        }
    },
    onCreate: function(b, a) {
        this.clearInvalid();
        this.record = b.getCurrentRecord();
        this.setValue("", true)
    },
    onRefresh: function(a) {
        if (this.isFireEvent == true || this.isHidden == true) {
            return
        }
        this.clearInvalid();
        this.render(a.getCurrentRecord())
    },
    render: function(a) {
        this.record = a;
        if (this.record) {
            var c = this.record.get(this.binder.name);
            var d = this.record.getMeta().getField(this.binder.name);
            var b = {};
            Ext.apply(b, this.initConfig);
            Ext.apply(b, d.snap);
            this.initComponent(b);
            if (this.record.valid[this.binder.name]) {
                this.markInvalid()
            }
            if (!Ext.isEmpty(c, true)) {
                this.setValue(c, true)
            } else {
                this.clearValue()
            }
        } else {
            this.setValue("", true)
        }
    },
    onValid: function(d, a, b, c) {
        if (this.binder.ds == d && this.binder.name == b && this.record == a) {
            if (c) {
                this.fireEvent("valid", this, this.record, this.binder.name, true);
                this.clearInvalid()
            } else {
                this.fireEvent("valid", this, this.record, this.binder.name, false);
                this.markInvalid()
            }
        }
    },
    onUpdate: function(d, a, b, c) {
        if (this.binder.ds == d && this.record == a && this.binder.name == b && this.getValue() !== c) {
            this.setValue(c, true)
        }
    },
    onFieldChange: function(b, a, c) {
        if (this.binder.ds == b && this.record == a && this.binder.name == c.name) {
            this.onRefresh(b)
        }
    },
    onClear: function(a) {
        this.clearValue()
    },
    setValue: function(b, a) {
        var c = this.value;
        this.value = b;
        if (a === true) {
            return
        }
        if (this.binder) {
            this.record = this.binder.ds.getCurrentRecord();
            if (this.record == null) {
                this.record = this.binder.ds.create({},
                false)
            }
            this.record.set(this.binder.name, b);
            if (Ext.isEmpty(b, true)) {
                delete this.record.data[this.binder.name]
            }
        }
        if (! (c === b || (Ext.isEmpty(c) && Ext.isEmpty(b)))) {
            this.fireEvent("change", this, b, c)
        }
    },
    getValue: function() {
        var a = this.value;
        a = (a === null || a === undefined ? "": a);
        return a
    },
    setWidth: function(a) {
        if (this.width == a) {
            return
        }
        this.width = a;
        this.wrap.setWidth(a)
    },
    setHeight: function(a) {
        if (this.height == a) {
            return
        }
        this.height = a;
        this.wrap.setHeight(a)
    },
    show: function() {
        this.wrap.show()
    },
    hide: function() {
        this.wrap.hide()
    },
    setVisible: function(a) {
        this[a ? "show": "hide"]()
    },
    clearInvalid: function() {},
    markInvalid: function() {},
    clearValue: function() {},
    initMeta: function() {},
    setDefault: function() {},
    setRequired: function() {},
    onDataChange: function() {}
});
$A.Field = Ext.extend($A.Component, {
    autoselect: true,
    transformcharacter: true,
    validators: [],
    requiredCss: "item-notBlank",
    readOnlyCss: "item-readOnly",
    emptyTextCss: "item-emptyText",
    invalidCss: "item-invalid",
    constructor: function(a) {
        a.required = a.required || false;
        a.readonly = a.readonly || false;
        a.autocomplete = a.autocomplete || false;
        a.autocompletefield = a.autocompletefield || null;
        a.autocompletesize = a.autocompletesize || 2;
        a.autocompletepagesize = a.autocompletepagesize || 10;
        this.context = a.context || "";
        $A.Field.superclass.constructor.call(this, a)
    },
    initElements: function() {
        this.el = this.wrap.child("input[atype=field.input]")
    },
    initComponent: function(a) {
        var b = this;
        $A.Field.superclass.initComponent.call(b, a);
        b.service = b.autocompleteservice || b.lovservice || b.lovmodel;
        b.para = {};
        b.initElements();
        b.originalValue = b.getValue();
        b.applyEmptyText();
        b.initStatus();
        b.initService();
        b.initAutoComplete()
    },
    processListener: function(a) {
        var b = this;
        $A.Field.superclass.processListener.call(b, a);
        b.el[a]("focus", b.onFocus, b)[a]("blur", b.onBlur, b)[a]("change", b.onChange, b)[a]("keyup", b.onKeyUp, b)[a]("keydown", b.onKeyDown, b)[a]("keypress", b.onKeyPress, b)
    },
    processMouseOverOut: function(a) {
        var b = this;
        b.el[a]("mouseover", b.onMouseOver, b)[a]("mouseout", b.onMouseOut, b)
    },
    initEvents: function() {
        $A.Field.superclass.initEvents.call(this);
        this.addEvents("keydown", "keyup", "keypress", "enterdown")
    },
    destroy: function() {
        var b = this,
        a = b.autocompleteview;
        $A.Field.superclass.destroy.call(b);
        if (a) {
            a.destroy();
            a.un("select", b.onViewSelect, b);
            delete b.autocompleteview
        }
        delete this.el
    },
    setWidth: function(a) {
        this.wrap.setStyle("width", (a + 3) + "px")
    },
    setHeight: function(a) {
        this.wrap.setStyle("height", a + "px");
        this.el.setStyle("height", (a - 2) + "px")
    },
    initStatus: function() {
        var a = this;
        a.clearInvalid();
        a.initRequired(a.required);
        a.initReadOnly(a.readonly);
        a.initEditable(a.editable);
        a.initMaxLength(a.maxlength)
    },
    onChange: function(a) {},
    onKeyUp: function(a) {
        this.fireEvent("keyup", this, a)
    },
    onKeyDown: function(c) {
        var a = this,
        b = c.keyCode;
        a.fireEvent("keydown", a, c);
        if ((a.isEditor == true && b == 9) || ((a.readonly || !a.editable) && b == 8)) {
            c.stopEvent()
        }
        if (b == 13 || b == 27) {
            a.blur();
            if (b == 13) { (function() {
                    a.fireEvent("enterdown", a, c)
                }).defer(5)
            }
        }
    },
    onKeyPress: function(a) {
        this.fireEvent("keypress", this, a)
    },
    onFocus: function(b) {
        var a = this;
        a.autoselect && a.select.defer(1, a);
        if (!a.hasFocus) {
            a.hasFocus = true;
            a.startValue = a.getValue();
            if (a.emptytext && !a.readonly) {
                a.el.dom.value == a.emptytext && a.setRawValue("");
                a.wrap.removeClass(a.emptyTextCss)
            }
            a.wrap.addClass(a.focusCss);
            a.fireEvent("focus", a)
        }
    },
    processValue: function(a) {
        return a
    },
    onBlur: function(b) {
        var a = this;
        if (a.hasFocus) {
            a.hasFocus = false; ! a.readonly && a.setValue(a.processValue(a.processMaxLength(a.getRawValue())));
            a.wrap.removeClass(a.focusCss);
            a.fireEvent("blur", a)
        }
    },
    processMaxLength: function(g) {
        var f = [],
        e = $A.defaultChineseLength;
        if (this.isOverMaxLength(g)) {
            for (var c = 0,
            b = 0; c < g.length; c++) {
                var d = g.charAt(c),
                a = d.match(/[^\x00-\xff]/g);
                b += a != null && a.length > 0 ? e: 1;
                if (b <= this.maxlength) {
                    f.push(d)
                } else {
                    break
                }
            }
            return f.join("")
        }
        return g
    },
    setValue: function(b, a) {
        var c = this;
        if (c.emptytext && c.el && !Ext.isEmpty(b)) {
            c.wrap.removeClass(c.emptyTextCss)
        }
        c.setRawValue(c.formatValue(Ext.isEmpty(b) ? "": b));
        c.applyEmptyText();
        $A.Field.superclass.setValue.call(c, b, a)
    },
    formatValue: function(b) {
        var d = this,
        c = d.renderer ? $A.getRenderer(d.renderer) : null,
        a = d.binder;
        return c != null ? c(b, d.record, a && a.name) : b
    },
    getRawValue: function() {
        var c = this,
        a = c.el.getValue(),
        b = c.typecase;
        a = a === c.emptytext || a === undefined ? "": a;
        if (c.isDbc(a)) {
            a = c.dbc2sbc(a)
        }
        if (b) {
            if (b == "upper") {
                a = a.toUpperCase()
            } else {
                if (b == "lower") {
                    a = a.toLowerCase()
                }
            }
        }
        return a
    },
    initRequired: function(b) {
        var a = this;
        if (a.currentRequired == b) {
            return
        }
        a.clearInvalid();
        a.currentRequired = a.required = b;
        a.wrap[b ? "addClass": "removeClass"](a.requiredCss)
    },
    initEditable: function(a) {
        var b = this;
        if (b.currentEditable == a) {
            return
        }
        b.currentEditable = b.editable = a;
        b.el.dom.readOnly = b.readonly ? true: (a === false)
    },
    initReadOnly: function(a) {
        var b = this;
        if (b.currentReadonly == a) {
            return
        }
        b.currentReadonly = b.readonly = a;
        b.el.dom.readOnly = a;
        b.wrap[a ? "addClass": "removeClass"](b.readOnlyCss)
    },
    isOverMaxLength: function(e) {
        if (!this.maxlength) {
            return false
        }
        var f = 0,
        b = 0,
        d = $A.defaultChineseLength;
        for (; b < e.length; b++) {
            var a = e.charAt(b).match(/[^\x00-\xff]/g);
            f += a != null && a.length > 0 ? d: 1
        }
        return f > this.maxlength
    },
    initMaxLength: function(a) {
        if (a) {
            this.el.dom.maxLength = a
        }
    },
    initService: function() {
        var b = this,
        a = b.service;
        if (a) {
            b.service = b.processParmater(a)
        }
    },
    initAutoComplete: function() {
        var d = this,
        c = d.service,
        a = d.autocompleteview,
        e = d.autocompletefield,
        b = d.binder && d.binder.name;
        if (d.autocomplete && c) {
            if (!a) {
                a = d.autocompleteview = new $A.AutoCompleteView({
                    id: d.id,
                    el: d.el,
                    fuzzyfetch: d.fuzzyfetch,
                    cmp: d
                });
                a.on("select", d.onViewSelect, d)
            } else {
                if (!a.active) {
                    a.processListener("on")
                }
            }
            a.active = true;
            if (!e) {
                Ext.each(d.getMapping(),
                function(f) {
                    if (f.to == b) {
                        e = d.autocompletefield = f.from
                    }
                });
                if (!e) {
                    e = b
                }
            }
            a.bind({
                url: d.context + "autocrud/" + c + "/query",
                name: e,
                size: d.autocompletesize,
                pagesize: d.autocompletepagesize,
                renderer: d.autocompleterenderer,
                binder: d.binder,
                fetchremote: d.fetchremote === false ? false: true
            })
        } else {
            if (a) {
                a.processListener("un");
                a.active = false
            }
        }
    },
    onViewSelect: function(c) {
        var b = this,
        a = b.record;
        Ext.each(c && b.getMapping(),
        function(d) {
            var e = c.get(d.from);
            a.set(d.to, Ext.isEmpty(e) ? "": e)
        })
    },
    getMapping: function() {
        var b, c = this.record,
        a = this.binder.name;
        if (c) {
            var d = c.getMeta().getField(a);
            if (d) {
                b = d.get("mapping")
            }
        }
        return b ? b: [{
            from: a,
            to: a
        }]
    },
    applyEmptyText: function() {
        var b = this,
        a = b.emptytext;
        if (a && b.getRawValue().length < 1) {
            b.setRawValue(a);
            b.wrap.addClass(b.emptyTextCss)
        }
    },
    processParmater: function(b) {
        var a = b.indexOf("?");
        if (a != -1) {
            this.para = Ext.urlDecode(b.substring(a + 1, b.length));
            return b.substring(0, a)
        }
        return b
    },
    getPara: function() {
        return Ext.apply({},
        this.getFieldPara(), this.para)
    },
    getFieldPara: function(a) {
        return (a = this.record) && (a = a.getMeta().getField(this.binder.name)) && Ext.apply({},
        a.get("lovpara"))
    },
    clearInvalid: function() {
        this.invalidMsg = null;
        this.wrap.removeClass(this.invalidCss)
    },
    markInvalid: function(a) {
        this.invalidMsg = a;
        this.wrap.addClass(this.invalidCss)
    },
    select: function(f, a) {
        if (!this.hasFocus) {
            return
        }
        var c = this.getRawValue();
        if (c.length > 0) {
            f = f === undefined ? 0 : f;
            a = a === undefined ? c.length: a;
            var e = this.el.dom;
            if (f === 0 && a === c.length && e.select) {
                e.select()
            } else {
                if (e.setSelectionRange) {
                    e.setSelectionRange(f, a)
                } else {
                    if (e.createTextRange) {
                        var b = e.createTextRange();
                        b.moveStart("character", f);
                        b.moveEnd("character", a - c.length);
                        b.select()
                    }
                }
            }
        }
    },
    setRawValue: function(a) {
        var b = this.el.dom;
        if (b.value === (a = Ext.isEmpty(a) ? "": a)) {
            return
        }
        return b.value = a
    },
    reset: function() {
        var a = this;
        a.setValue(a.originalValue);
        a.clearInvalid();
        a.applyEmptyText()
    },
    focus: function() {
        this.el.dom.focus();
        this.fireEvent("focus", this)
    },
    blur: function() {
        this.el.blur();
        this.fireEvent("blur", this)
    },
    clearValue: function() {
        this.setValue("", true);
        this.clearInvalid();
        this.applyEmptyText()
    },
    setPrompt: function(b) {
        var a = Ext.fly(this.id + "_prompt");
        if (a) {
            a.update(b)
        }
    },
    show: function() {
        $A.Field.superclass.show.call(this);
        var a = Ext.fly(this.id + "_prompt");
        if (a) {
            a.show()
        }
    },
    hide: function() {
        $A.Field.superclass.hide.call(this);
        var a = Ext.fly(this.id + "_prompt");
        if (a) {
            a.hide()
        }
    },
    isDbc: function(d) {
        if (!this.transformcharacter) {
            return false
        }
        var b = false;
        for (var a = 0; a < d.length; a++) {
            var e = d.charCodeAt(a);
            if ((e > 65248) || (e == 12288)) {
                b = true;
                break
            }
        }
        return b
    },
    dbc2sbc: function(d) {
        var a = [];
        for (var b = 0; b < d.length; b++) {
            var c = d.charCodeAt(b);
            if (c >= 65281 && c <= 65373) {
                a.push(String.fromCharCode(c - 65248))
            } else {
                if (c == 12288) {
                    a.push(" ")
                } else {
                    a.push(d.charAt(b))
                }
            }
        }
        return a.join("")
    }
});
$A.Box = Ext.extend($A.Component, {
    constructor: function(a) {
        this.errors = [];
        $A.Box.superclass.constructor.call(this, a)
    },
    initEvents: function() {},
    onValid: function(e, a, d, b) {
        if (b) {
            this.clearError(e.id)
        } else {
            var c = a.errors[d];
            if (c) {
                this.showError(e.id, c.message)
            }
        }
    },
    showError: function(b, a) {
        Ext.fly(b + "_vmsg").update(a)
    },
    clearError: function(a) {
        Ext.fly(a + "_vmsg").update("")
    },
    clearAllError: function() {
        for (var a = 0; a < this.errors.length; a++) {
            this.clearError(this.errors[a])
        }
    }
});
$A.ImageCode = Ext.extend($A.Component, {
    processListener: function(a) {
        $A.ImageCode.superclass.processListener.call(this, a);
        this.wrap[a]("click", this.onClick, this)
    },
    onClick: function() {
        if (this.enable == true) {
            this.refresh()
        }
    },
    setEnable: function(a) {
        if (a == true) {
            this.enable = true;
            this.refresh()
        } else {
            this.enable = false;
            this.wrap.dom.src = ""
        }
    },
    refresh: function() {
        this.wrap.dom.src = "imagecode?r=" + Math.random()
    }
});
$A.Label = Ext.extend($A.Component, {
    onUpdate: function(d, a, b, c) {
        if (this.binder.ds == d && this.binder.name == b) {
            this.updateLabel(a, b, c)
        }
    },
    render: function(a) {
        this.record = a;
        if (this.record) {
            var b = this.record.get(this.binder.name);
            this.updateLabel(this.record, this.binder.name, b)
        }
    },
    updateLabel: function(a, b, d) {
        var c = $A.getRenderer(this.renderer);
        if (c != null) {
            d = c.call(window, d, a, b)
        }
        this.wrap.update(d)
    },
    setPrompt: function(b) {
        var a = Ext.fly(this.id + "_prompt");
        if (a) {
            a.update(b)
        }
    }
});
$A.Link = Ext.extend($A.Component, {
    params: {},
    constructor: function(a) {
        this.url = a.url || "";
        $A.Link.superclass.constructor.call(this, a)
    },
    processListener: function(a) {},
    reset: function() {
        this.params = {}
    },
    set: function(a, b) {
        this.params[a] = b
    },
    get: function(a) {
        return this.params[a]
    },
    getUrl: function() {
        var a;
        var b = Ext.urlEncode(this.params);
        if (Ext.isEmpty(b)) {
            a = this.url
        } else {
            a = this.url + (this.url.indexOf("?") == -1 ? "?": "&") + Ext.urlEncode(this.params)
        }
        return a
    }
});
$A.HotKey = function() {
    var h = "CTRL",
    a = "ALT",
    g = "SHIFT",
    e = {},
    c = true,
    f = function(o, u) {
        var q = o.keyCode,
        p = [],
        s,
        n = this;
        if (q != 16 && q != 17 && q != 18) {
            o.ctrlKey && p.push(h);
            o.altKey && p.push(a);
            o.shiftKey && p.push(g);
            p.push(String.fromCharCode(q));
            s = e[n.id][p.join("+").toUpperCase()];
            if (s) {
                o.stopEvent();
                if (c) {
                    c = false;
                    var l = Ext.get(u),
                    m = u.tagName.toLowerCase(),
                    r = function(t) {
                        Ext.each(s,
                        function(w) {
                            return w()
                        });
                        l.un("focus", r)
                    };
                    if (m == "input" || m == "textarea") {
                        l.on("focus", r).blur().focus()
                    } else {
                        r()
                    }
                }
            }
        }
    },
    i = function() {
        c = true
    },
    d = function(l) {
        l.on("keydown", f, l, {
            stopPropagation: true
        }).on("keyup", i)
    },
    b = {
        addHandler: function(r, n) {
            var m = r.toUpperCase().split("+"),
            l = [],
            p = window.__host || Ext.getBody(),
            q = p.id,
            o = e[q];
            if (!o) {
                e[q] = o = {};
                d(p)
            }
            m.indexOf(h) != -1 && l.push(h);
            m.indexOf(a) != -1 && l.push(a);
            m.indexOf(g) != -1 && l.push(g);
            if (l.length < m.length) {
                l.push(m.pop());
                l = l.join("+"); (o[l] || (o[l] = [])).add(n)
            }
        }
    };
    return b
} (); (function(b) {
    var c = "TR",
    a = "autocomplete-selected",
    f = "click",
    h = "mousemove",
    e = "mousedown",
    i = ['<div id="{id}" tabIndex="-2" class="item-popup" style="visibility:hidden;background-color:#fff;">', "</div>"],
    g = ['<div id="{id}" class="item-shadow" style="visibility:hidden;">', "</div>"],
    d = '<table class="autocomplete" cellspacing="0" cellpadding="2">';
    b.AutoCompleteView = Ext.extend($A.Component, {
        constructor: function(l) {
            var m = this;
            l.id = l.id + "_autocomplete";
            m.isLoaded = false;
            m.maxHeight = 250;
            m.delay = 500;
            $A.AutoCompleteView.superclass.constructor.call(m, l)
        },
        initComponent: function(l) {
            var m = this;
            $A.AutoCompleteView.superclass.initComponent.call(this, l);
            m.wrap = new Ext.Template(i).insertFirst(document.body, {
                width: m.width,
                height: m.height,
                id: m.id
            },
            true);
            m.shadow = new Ext.Template(g).insertFirst(document.body, {
                width: m.width,
                height: m.height,
                id: m.id + "_shadow"
            },
            true);
            m.ds = new b.DataSet({
                id: m.id + "_ds",
                autocount: false
            })
        },
        processListener: function(l) {
            $A.AutoCompleteView.superclass.processListener.call(this, l);
            var m = this,
            n = m.ds;
            m.el[l]("keyup", m.onKeyUp, m)[l]("keydown", m.onKeyDown, m)[l]("blur", m.onBlur, m);
            n[l]("load", m.onLoad, m);
            n[l]("query", m.onQuery, m);
            m.wrap[l](f, m.onClick, m)[l]("mousedown", m.onMouseDown, m, {
                preventDefault: true
            })
        },
        initEvents: function() {
            $A.AutoCompleteView.superclass.initEvents.call(this);
            this.addEvents("select", f)
        },
        bind: function(l) {
            Ext.apply(this, l)
        },
        destroy: function() {
            var m = this,
            l = m.wrap;
            m.ds.destroy();
            m.shadow.remove();
            $A.AutoCompleteView.superclass.destroy.call(m);
            l.remove();
            delete m.ds;
            delete m.shadow
        },
        onQuery: function() {
            var l = this;
            l.wrap.update('<table cellspacing="0" cellpadding="2"><tr tabIndex="-2"><td>' + _lang["lov.query"] + "</td></tr></table>").un(h, l.onMove, l);
            l.correctViewSize()
        },
        onLoad: function() {
            var p = this,
            m = p.ds.getAll(),
            o = m.length,
            n = p.wrap,
            q;
            p.selectedIndex = null;
            if (o == 0) {
                q = [d, '<tr tabIndex="-2"><td>', _lang["lov.notfound"], "</td></tr></table>"]
            } else {
                q = p.createListView(m, p.binder);
                n.on(h, p.onMove, p)
            }
            p.isLoaded = true;
            n.update(q.join(""));
            p.correctViewSize()
        },
        onKeyDown: function(o) {
            if (this.isShow) {
                var m = this,
                n = o.keyCode,
                l = m.selectedIndex;
                if (n == 13) {
                    if (l != null) {
                        m.el.blur(); (function() {
                            m.onSelect(l);
                            m.hide()
                        }).defer(10, m)
                    } else {
                        m.hide()
                    }
                } else {
                    if (n == 27 || n == 9) {
                        m.hide()
                    } else {
                        if (m.ds.getAll().length > 0) {
                            if (n == 38) {
                                m.selectItem(l == null ? -1 : l - 1, true)
                            } else {
                                if (n == 40) {
                                    m.selectItem(l == null ? 0 : l + 1, true)
                                }
                            }
                        }
                    }
                }
            }
        },
        onKeyUp: function(q) {
            var p = this,
            o = p.url,
            n = p.cmp,
            l = (n ? n.getRawValue() : p.el.getValue()).trim(),
            m = q.keyCode;
            p.fireEvent("keyup", p, q);
            if (m > 40 || (m < 37 && m != 13 && m != 27 && m != 9 && m != 17)) {
                if (l.length >= p.size) {
                    if (p.showCompleteId) {
                        clearTimeout(p.showCompleteId)
                    }
                    p.showCompleteId = function() {
                        var r = p.ds;
                        r.setQueryUrl(Ext.urlAppend(o, Ext.urlEncode(n ? n.getPara() : p.para)));
                        r.setQueryParameter(p.name, p.fuzzyfetch ? l + "%": l);
                        r.pagesize = p.pagesize;
                        p.show();
                        r.query();
                        delete p.showCompleteId
                    }.defer(p.delay)
                } else {
                    if (p.showCompleteId) {
                        clearTimeout(p.showCompleteId);
                        delete p.showCompleteId
                    }
                    p.hide()
                }
            }
        },
        onBlur: function(m) {
            var l = this;
            if (l.showCompleteId) {
                clearTimeout(l.showCompleteId);
                delete l.showCompleteId
            }
        },
        onMove: function(m, l) {
            this.selectItem((Ext.fly(l).findParent(c) || l).tabIndex)
        },
        onClick: function(m, l) {
            l = Ext.fly(l).findParent(c) || l;
            if (l.tagName != c) {
                return
            }
            this.onSelect(l);
            this.hide()
        },
        onMouseDown: function() {
            var l = this; (function() {
                l.el.focus()
            }).defer(Ext.isIE ? 1 : 0, l)
        },
        onSelect: function(o) {
            var n = this,
            m, l = Ext.isNumber(o) ? o: o.tabIndex;
            if (l > -1) {
                m = n.ds.getAt(l)
            }
            n.fireEvent("select", m);
            n.el.focus()
        },
        selectItem: function(n, m) {
            if (Ext.isEmpty(n) || n < -1) {
                return
            }
            var p = this,
            o = p.getNode(n),
            l = p.selectedIndex;
            if (o && (n = o.tabIndex) != l) {
                if (!Ext.isEmpty(l)) {
                    Ext.fly(p.getNode(l)).removeClass(a)
                }
                p.selectedIndex = n;
                if (m) {
                    p.focusRow(n)
                }
                Ext.fly(o).addClass(a)
            }
        },
        focusRow: function(u) {
            var t = this.binder,
            p = t ? t.ds.getField(t.name).getPropertity("displayFields") : null,
            q = p && p.length ? 23 : 0,
            l = 22,
            m = this.wrap,
            s = m.getScroll().top,
            o = m.getHeight(),
            n = m.dom.scrollWidth > m.dom.clientWidth ? 16 : 0;
            if (u * l < s) {
                m.scrollTo("top", u * l - 1)
            } else {
                if ((u + 1) * l + q > (s + o - n)) {
                    m.scrollTo("top", (u + 1) * l - o + n + q)
                }
            }
        },
        getNode: function(o) {
            var n = this.wrap.query("tr[tabindex!=-2]"),
            m = n.length;
            if (o >= m) {
                o = o % m
            } else {
                if (o < 0) {
                    o = m + o % m
                }
            }
            return n[o]
        },
        show: function() {
            var m = this,
            l;
            if (!m.isShow) {
                m.isShow = true;
                l = m.wrap;
                m.position();
                l.dom.className = "item-popup item-comboBox-view";
                l.update("");
                m.wrap.show();
                m.shadow.show();
                Ext.get(document).on(e, m.trigger, m)
            }
        },
        trigger: function(m) {
            var l = this;
            if (!l.wrap.contains(m.target) && (!l.owner || !l.owner.wrap.contains(m.target))) {
                l.hide()
            }
        },
        hide: function(m) {
            var l = this;
            if (l.isShow) {
                l.isShow = false;
                l.isLoaded = false;
                Ext.get(document).un(e, l.trigger, l);
                l.wrap.hide();
                l.shadow.hide()
            }
        },
        position: function() {
            var p = this,
            m = p.cmp ? p.cmp.wrap: p.el,
            t = m.getXY(),
            n = p.getWidth(),
            r = p.getHeight(),
            l = m.getHeight(),
            s = b.getViewportHeight() - 3,
            o = b.getViewportWidth() - 3,
            q = (t[0] + n) > o ? ((o - n) < 0 ? t[0] : (o - n)) : t[0];
            y = (t[1] + l + r) > s ? ((t[1] - r) < 0 ? (t[1] + l) : (t[1] - r)) : (t[1] + l);
            p.moveTo(q, y)
        },
        createListView: function(m, o) {
            var s = [d],
            q;
            if (o) {
                q = o.ds.getField(o.name).getPropertity("displayFields");
                if (q && q.length) {
                    s.push('<tr tabIndex="-2" class="autocomplete-head">');
                    Ext.each(q,
                    function(l) {
                        s.push("<td>", l.prompt, "</td>")
                    });
                    s.push("</tr>")
                }
            }
            for (var p = 0,
            n = m.length; p < n; p++) {
                var r = m[p];
                s.push('<tr tabIndex="', p, '"', p % 2 == 1 ? ' class="autocomplete-row-alt"': "", ">", this.getRenderText(r, q), "</tr>")
            }
            s.push("</table>");
            return s
        },
        getRenderText: function(l, m) {
            var p = this,
            o = b.getRenderer(p.renderer),
            q = [],
            n = function(s) {
                var r = l.get(s);
                q.push("<td>", Ext.isEmpty(r) ? "&#160;": r, "</td>")
            };
            if (o) {
                q.push(o.call(window, p, l))
            } else {
                if (m && m.length) {
                    Ext.each(m,
                    function(r) {
                        n(r.name)
                    })
                } else {
                    n(p.name)
                }
            }
            return q.join("")
        },
        correctViewSize: function() {
            var m = this,
            l = m.wrap.child("table");
            if (l.getWidth() < 150) {
                l.setWidth(150)
            }
            m.setHeight(Math.max(Math.min(l.getHeight() + 2, m.maxHeight), 20));
            m.setWidth(m.wrap.getWidth());
            m.position()
        },
        moveTo: function(l, m) {
            this.wrap.moveTo(l, m);
            this.shadow.moveTo(l + 3, m + 3)
        },
        setHeight: function(l) {
            this.wrap.setHeight(l);
            this.shadow.setHeight(l)
        },
        setWidth: function(l) {
            this.shadow.setWidth(l)
        },
        getHeight: function() {
            return this.wrap.getHeight()
        },
        getWidth: function() {
            return this.wrap.getWidth()
        }
    })
})($A);
$A.Button = Ext.extend($A.Component, {
    disableCss: "item-btn-disabled",
    overCss: "item-btn-over",
    pressCss: "item-btn-pressed",
    disabled: false,
    constructor: function(a) {
        $A.Button.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.Button.superclass.initComponent.call(this, a);
        this.el = this.wrap.child("button[atype=btn]");
        this.textEl = this.el.child("div");
        if (this.hidden == true) {
            this.setVisible(false)
        }
        if (this.disabled == true) {
            this.disable()
        }
    },
    processListener: function(a) {
        $A.Button.superclass.processListener.call(this, a);
        this.wrap[a]("click", this.onClick, this);
        this.wrap[a]("mousedown", this.onMouseDown, this);
        this.el[a]("focus", this.onFocus, this);
        this.el[a]("blur", this.onBlur, this);
        this.el[a]("keydown", this.onKeyDown, this)
    },
    initEvents: function() {
        $A.Button.superclass.initEvents.call(this);
        this.addEvents("click")
    },
    click: function() {
        this.el.dom.click()
    },
    destroy: function() {
        $A.Button.superclass.destroy.call(this);
        delete this.el
    },
    focus: function() {
        if (this.disabled) {
            return
        }
        this.el.dom.focus()
    },
    blur: function() {
        if (this.disabled) {
            return
        }
        this.el.dom.blur()
    },
    disable: function() {
        this.disabled = true;
        this.wrap.addClass(this.disableCss);
        this.el.dom.disabled = true
    },
    enable: function() {
        this.disabled = false;
        this.wrap.removeClass(this.disableCss);
        this.el.dom.disabled = false
    },
    onMouseDown: function(a) {
        if (!this.disabled) {
            this.wrap.addClass(this.pressCss);
            Ext.get(document.documentElement).on("mouseup", this.onMouseUp, this)
        }
    },
    onMouseUp: function(a) {
        if (!this.disabled) {
            Ext.get(document.documentElement).un("mouseup", this.onMouseUp, this);
            this.wrap.removeClass(this.pressCss)
        }
    },
    onKeyDown: function(a) {
        if (!this.disabled && a.keyCode == 13) {
            this.wrap.addClass(this.pressCss);
            Ext.get(document.documentElement).on("keyup", this.onKeyUp, this)
        }
    },
    onKeyUp: function(a) {
        if (!this.disabled && a.keyCode == 13) {
            Ext.get(document.documentElement).un("keyup", this.onKeyUp, this);
            if (this.wrap) {
                this.wrap.removeClass(this.pressCss)
            }
        }
    },
    onClick: function(a) {
        if (!this.disabled) {
            a.stopEvent();
            this.fireEvent("click", this, a)
        }
    },
    onFocus: function(a) {
        this.hasFocus = true;
        this.onMouseOver(a)
    },
    onBlur: function(a) {
        this.hasFocus = false;
        this.onMouseOut(a)
    },
    onMouseOver: function(a) {
        if (!this.disabled) {
            this.wrap.addClass(this.overCss)
        }
        $A.Button.superclass.onMouseOver.call(this, a)
    },
    onMouseOut: function(a) {
        if (!this.disabled) {
            this.wrap.removeClass(this.overCss)
        }
        $A.Button.superclass.onMouseOut.call(this, a)
    },
    setText: function(a) {
        this.textEl.update(a)
    }
});
$A.Button.getTemplate = function(c, b, a) {
    return '<div class="item-btn " id="' + c + '" style="WIDTH: ' + (a || 60) + 'px" cellSpacing="0"><TBODY><TR><TD class="item-btn-tl"><I></I></TD><TD class="item-btn-tc"></TD><TD class="item-btn-tr"><I></I></TD></TR><TR><TD class="item-btn-ml"><I></I></TD><TD class="item-btn-mc"><BUTTON hideFocus style="HEIGHT: 17px" atype="btn"><div>' + b + '</div></BUTTON></TD><TD class="item-btn-mr"><I></I></TD></TR><TR><TD class="item-btn-bl"><I></I></TD><TD class="item-btn-bc"></TD><TD class="item-btn-br"><I></I></TD></TR></TBODY></div><script>new Aurora.Button({"id":"' + c + '"});<\/script>'
};
$A.CheckBox = Ext.extend($A.Component, {
    checkedCss: "item-ckb-c",
    uncheckedCss: "item-ckb-u",
    readonyCheckedCss: "item-ckb-readonly-c",
    readonlyUncheckedCss: "item-ckb-readonly-u",
    constructor: function(a) {
        a.checked = a.checked || false;
        a.readonly = a.readonly || false;
        $A.CheckBox.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        this.checkedvalue = "Y";
        this.uncheckedvalue = "N";
        $A.CheckBox.superclass.initComponent.call(this, a);
        this.wrap = Ext.get(this.id);
        this.el = this.wrap.child("div[atype=checkbox]")
    },
    processListener: function(a) {
        this.wrap[a]("mousedown", this.onMouseDown, this)[a]("click", this.onClick, this);
        this.el[a]("keydown", this.onKeyDown, this);
        this.el[a]("focus", this.onFocus, this);
        this.el[a]("blur", this.onBlur, this)
    },
    initEvents: function() {
        $A.CheckBox.superclass.initEvents.call(this);
        this.addEvents("click")
    },
    destroy: function() {
        $A.CheckBox.superclass.destroy.call(this);
        delete this.el
    },
    onKeyDown: function(b) {
        var a = b.keyCode;
        if (a == 32) {
            this.onClick.call(this, b);
            b.stopEvent()
        }
    },
    onMouseDown: function(b) {
        var a = this;
        a.hasFocus && b.stopEvent();
        a.focus.defer(Ext.isIE ? 1 : 0, a)
    },
    onClick: function(a) {
        if (!this.readonly) {
            this.checked = this.checked ? false: true;
            this.setValue(this.checked);
            this.fireEvent("click", this, this.checked);
            this.focus()
        }
    },
    focus: function() {
        this.el.focus()
    },
    blur: function() {
        this.el.blur()
    },
    onFocus: function() {
        var a = this;
        if (!a.hasFocus) {
            a.hasFocus = true;
            a.el.addClass(a.focusCss);
            a.fireEvent("focus", a)
        }
    },
    onBlur: function() {
        var a = this;
        if (a.hasFocus) {
            a.hasFocus = false;
            a.el.removeClass(a.focusCss);
            a.fireEvent("blur", a)
        }
    },
    setValue: function(b, a) {
        if (typeof(b) === "boolean") {
            this.checked = b ? true: false
        } else {
            this.checked = ("" + b == "" + this.checkedvalue)
        }
        this.initStatus();
        var c = this.checked == true ? this.checkedvalue: this.uncheckedvalue;
        $A.CheckBox.superclass.setValue.call(this, c, a)
    },
    getValue: function() {
        var a = this.value;
        a = (a === null || a === undefined ? "": a);
        return a
    },
    initStatus: function() {
        this.el.removeClass(this.checkedCss);
        this.el.removeClass(this.uncheckedCss);
        this.el.removeClass(this.readonyCheckedCss);
        this.el.removeClass(this.readonlyUncheckedCss);
        if (this.readonly) {
            this.el.addClass(this.checked ? this.readonyCheckedCss: this.readonlyUncheckedCss)
        } else {
            this.el.addClass(this.checked ? this.checkedCss: this.uncheckedCss)
        }
    }
});
$A.Radio = Ext.extend($A.Component, {
    ccs: "item-radio-img-c",
    ucs: "item-radio-img-u",
    rcc: "item-radio-img-readonly-c",
    ruc: "item-radio-img-readonly-u",
    imgCss: "item-radio-img",
    valueField: "value",
    constructor: function(a) {
        a.checked = a.checked || false;
        a.readonly = a.readonly || false;
        $A.Radio.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.Radio.superclass.initComponent.call(this, a);
        this.wrap = Ext.get(this.id);
        this.nodes = Ext.DomQuery.select(".item-radio-option", this.wrap.dom);
        this.initStatus()
    },
    processListener: function(a) {
        $A.Radio.superclass.processListener.call(this, a);
        this.wrap[a]("click", this.onClick, this);
        this.wrap[a]("keydown", this.onKeyDown, this);
        this.wrap[a]("focus", this.onFocus, this);
        this.wrap[a]("blur", this.onBlur, this)
    },
    focus: function() {
        this.wrap.focus()
    },
    blur: function() {
        this.wrap.blur()
    },
    onFocus: function() {
        this.fireEvent("focus", this)
    },
    onBlur: function() {
        this.fireEvent("blur", this)
    },
    onKeyDown: function(g) {
        var d = this,
        f = g.keyCode,
        b = d.options,
        a = d.valueField;
        d.fireEvent("keydown", d, g);
        if (f == 13) { (function() {
                d.fireEvent("enterdown", d, g)
            }).defer(5)
        } else {
            var c = b.indexOf(d.getValueItem());
            if (f == 40 || f == 39) {++c < b.length && d.setValue(b[c][a]);
                g.stopEvent()
            } else {
                if (f == 38 || f == 37) {--c >= 0 && d.setValue(b[c][a]);
                    g.stopEvent()
                }
            }
        }
    },
    initEvents: function() {
        $A.Radio.superclass.initEvents.call(this);
        this.addEvents("click", "keydown", "enterdown")
    },
    setValue: function(b, a) {
        if (b == "") {
            return
        }
        $A.Radio.superclass.setValue.call(this, b, a);
        this.initStatus();
        this.focus()
    },
    getItem: function() {
        var a = this.getValueItem();
        if (a != null) {
            a = new $A.Record(a)
        }
        return a
    },
    getValueItem: function() {
        var b = this.getValue();
        var a = this.options.length;
        var d = null;
        for (var c = 0; c < a; c++) {
            var e = this.options[c];
            if (e[this.valueField] == b) {
                d = e;
                break
            }
        }
        return d
    },
    select: function(b) {
        var a = this.getItemValue(b);
        if (a) {
            this.setValue(a)
        }
    },
    getValue: function() {
        var a = this.value;
        a = (a === null || a === undefined ? "": a);
        return a
    },
    initStatus: function() {
        var a = this.nodes.length;
        for (var b = 0; b < a; b++) {
            var c = Ext.fly(this.nodes[b]).child("." + this.imgCss);
            c.removeClass(this.ccs);
            c.removeClass(this.ucs);
            c.removeClass(this.rcc);
            c.removeClass(this.ruc);
            var d = Ext.fly(this.nodes[b]).getAttributeNS("", "itemvalue");
            if (d == this.value) {
                this.readonly ? c.addClass(this.rcc) : c.addClass(this.ccs)
            } else {
                this.readonly ? c.addClass(this.ruc) : c.addClass(this.ucs)
            }
        }
    },
    getItemValue: function(b) {
        var c = Ext.fly(this.nodes[b]);
        if (!c) {
            return null
        }
        var a = c.getAttributeNS("", "itemvalue");
        return a
    },
    onClick: function(f) {
        if (!this.readonly) {
            var a = this.nodes.length;
            for (var c = 0; c < a; c++) {
                var d = Ext.fly(this.nodes[c]);
                if (d.contains(f.target)) {
                    var b = d.getAttributeNS("", "itemvalue");
                    this.setValue(b);
                    this.fireEvent("click", this, b);
                    break
                }
            }
        }
    }
});
$A.TextField = Ext.extend($A.Field, {
    initComponent: function(b) {
        $A.TextField.superclass.initComponent.call(this, b);
        var d = this,
        a = d.restrict,
        c = d.typecase;
        if (a) {
            d.restrict = a.replace(/^\[|\]$/mg, "")
        }
        c && d.el.setStyle("text-transform", c + "case")
    },
    isCapsLock: function(c) {
        var b = c.getKey(),
        a = c.shiftKey;
        if (((b >= 65 && b <= 90) && !a) || ((b >= 97 && b <= 122) && a)) {
            if (this.dcl != true) {
                $A.showWarningMessage(_lang["textfield.warn"], _lang["textfield.warn.capslock"])
            }
            this.dcl = true
        } else {
            this.dcl = false
        }
    },
    onKeyPress: function(d) {
        var c = this,
        b = d.getCharCode(),
        a = c.restrict,
        f = c.restrictinfo;
        if ((Ext.isGecko || Ext.isOpera) && (d.isSpecialKey() || b == 8 || b == 46)) {
            return
        }
        if (a && !new RegExp("[" + a + "]").test(String.fromCharCode(b))) {
            if (f) {
                $A.ToolTip.show(c.id, f)
            }
            d.stopEvent();
            return
        }
        $A.TextField.superclass.onKeyPress.call(c, d);
        if (c.detectCapsLock) {
            c.isCapsLock(d)
        }
    },
    processValue: function(b) {
        var c = this,
        a = c.restrict,
        e = c.restrictinfo,
        d = b;
        if (a) {
            b = String(b).replace(new RegExp("[^" + a + "]", "mg"), "");
            if (e && b != d) {
                $A.ToolTip.show(c.id, e)
            }
        }
        return b
    }
});
$A.NumberField = Ext.extend($A.TextField, {
    allowdecimals: true,
    allownegative: true,
    allowformat: true,
    baseChars: "0123456789",
    decimalSeparator: ".",
    decimalprecision: 2,
    constructor: function(a) {
        $A.NumberField.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        var b = this;
        $A.NumberField.superclass.initComponent.call(b, a);
        b.max = Ext.isEmpty(a.max) ? Number.MAX_VALUE: Number(a.max);
        b.min = Ext.isEmpty(a.min) ? -Number.MAX_VALUE: Number(a.min);
        b.restrict = b.baseChars + "";
        b.restrictinfo = _lang["numberfield.only"];
        if (b.allowdecimals) {
            b.restrict += b.decimalSeparator
        }
        if (b.allownegative) {
            b.restrict += "-"
        }
    },
    onBlur: function(a) {
        $A.ToolTip.hide();
        $A.NumberField.superclass.onBlur.call(this, a)
    },
    formatValue: function(a) {
        var b = this,
        c = $A.parseScientific(b.fixPrecision(b.parseValue(a)));
        if (b.allowformat) {
            c = $A.formatNumber(c)
        }
        return $A.NumberField.superclass.formatValue.call(b, c)
    },
    processMaxLength: function(c) {
        var b = $A.parseScientific(c).split("."),
        a = false;
        if (b[0].search(/-/) != -1) {
            a = true
        }
        return (a ? "-": "") + $A.NumberField.superclass.processMaxLength.call(this, b[0].replace(/[-,]/g, "")) + (b[1] ? "." + b[1] : "")
    },
    initMaxLength: function(a) {
        if (a && !this.allowdecimals) {
            this.el.dom.maxLength = a
        }
    },
    processValue: function(a) {
        var b = this,
        c;
        a = b.parseValue(a);
        if (a > b.max) {
            a = b.max;
            c = _lang["numberfield.max"] + a
        } else {
            if (a < b.min) {
                a = b.min;
                c = _lang["numberfield.min"] + a
            }
        }
        if (c) {
            $A.ToolTip.show(b.id, c)
        }
        return a
    },
    onFocus: function(b) {
        var a = this;
        if (!a.readonly && a.allowformat) {
            a.setRawValue($A.removeNumberFormat(a.getRawValue()))
        }
        $A.NumberField.superclass.onFocus.call(a, b)
    },
    parseValue: function(b) {
        var a = this;
        b = String(b);
        if (b.indexOf(",") != -1) {
            b = b.replace(/,/g, "")
        }
        if (!a.allownegative) {
            b = b.replace("-", "")
        }
        if (!a.allowdecimals) {
            b = b.indexOf(".") == -1 ? b: b.substring(0, b.indexOf("."))
        }
        b = parseFloat(a.fixPrecision(b.replace(a.decimalSeparator, ".")));
        return isNaN(b) ? "": b
    },
    fixPrecision: function(b) {
        var a = isNaN(b);
        if (!this.allowdecimals || this.decimalprecision == -1 || a || !b) {
            return a ? "": b
        }
        var c = parseFloat(b).toFixed(this.decimalprecision);
        if (this.allowpad == false) {
            c = String(parseFloat(c))
        }
        return c
    }
});
$A.Spinner = Ext.extend($A.NumberField, {
    initComponent: function(b) {
        var c = this;
        $A.Spinner.superclass.initComponent.call(c, b);
        var a = String(c.step = Number(b.step || 1)).split(".")[1];
        c.decimalprecision = a ? a.length: 0;
        c.btn = c.wrap.child("div.item-spinner-btn")
    },
    processListener: function(a) {
        var b = this;
        $A.Spinner.superclass.processListener.call(b, a);
        b.btn[a]("mouseover", b.onBtnMouseOver, b)[a]("mouseout", b.onBtnMouseOut, b)[a]("mousedown", b.onBtnMouseDown, b)[a]("mouseup", b.onBtnMouseUp, b)
    },
    onBtnMouseOver: function(b, a) {
        if (this.readonly) {
            return
        }
        Ext.fly(a).addClass("spinner-over")
    },
    onBtnMouseOut: function(b, a) {
        if (this.readonly) {
            return
        }
        Ext.fly(a).removeClass("spinner-over");
        this.onBtnMouseUp(b, a)
    },
    onBtnMouseDown: function(f, b) {
        if (this.readonly) {
            return
        }
        var d = Ext.fly(b),
        a = !!d.addClass("spinner-select").parent(".item-spinner-plus"),
        c = this;
        c.goStep(a,
        function() {
            c.intervalId = setInterval(function() {
                clearInterval(c.intervalId);
                c.intervalId = setInterval(function() {
                    c.goStep(a, null,
                    function() {
                        clearInterval(c.intervalId)
                    })
                },
                40)
            },
            500)
        })
    },
    onBtnMouseUp: function(c, a) {
        var b = this;
        if (b.readonly) {
            return
        }
        Ext.fly(a).removeClass("spinner-select");
        if (b.intervalId) {
            clearInterval(b.intervalId);
            b.setValue(b.getRawValue());
            delete b.intervalId
        }
    },
    plus: function() {
        this.goStep(true,
        function(a) {
            this.setValue(a)
        })
    },
    minus: function() {
        this.goStep(false,
        function(a) {
            this.setValue(a)
        })
    },
    goStep: function(a, l, e) {
        if (this.readonly) {
            return
        }
        var f = this,
        c = f.step,
        d = f.min,
        h = f.max,
        i = f.getRawValue(),
        b = i ? Number(i) + (a ? c: -c) : (0 < d ? d: (0 > h ? h: 0)),
        g = f.toFixed(f.toFixed(b - d) % c);
        b = f.toFixed(b - (g == c ? 0 : g));
        if (b <= h && b >= d) {
            f.setRawValue(f.formatValue(b));
            if (l) {
                l.call(f, b)
            }
        } else {
            if (e) {
                e.call(f, b)
            }
        }
    },
    toFixed: function(a) {
        return Number(a.toFixed(this.decimalprecision))
    }
});
$A.TriggerField = Ext.extend($A.TextField, {
    constructor: function(a) {
        $A.TriggerField.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.TriggerField.superclass.initComponent.call(this, a);
        this.trigger = this.wrap.child("div[atype=triggerfield.trigger]");
        this.initPopup()
    },
    initPopup: function() {
        if (this.initpopuped == true) {
            return
        }
        this.popup = this.wrap.child("div[atype=triggerfield.popup]");
        this.shadow = this.wrap.child("div[atype=triggerfield.shadow]");
        Ext.getBody().insertFirst(this.popup);
        Ext.getBody().insertFirst(this.shadow);
        this.initpopuped = true
    },
    initEvents: function() {
        $A.TriggerField.superclass.initEvents.call(this);
        this.addEvents("expand", "collapse")
    },
    processListener: function(a) {
        $A.TriggerField.superclass.processListener.call(this, a);
        this.trigger[a]("click", this.onTriggerClick, this, {
            preventDefault: true
        });
        this.popup[a]("click", this.onPopupClick, this, {
            stopPropagation: true
        })
    },
    isExpanded: function() {
        var a = this.popup.getXY();
        return ! (a[0] < -500 || a[1] < -500)
    },
    setWidth: function(a) {
        this.wrap.setStyle("width", (a + 3) + "px")
    },
    onPopupClick: function() {
        this.hasExpanded = true;
        this.el.focus()
    },
    onFocus: function() {
        $A.TriggerField.superclass.onFocus.call(this);
        if (!this.readonly && !this.isExpanded() && !this.hasExpanded) {
            this.expand()
        }
        this.hasExpanded = false
    },
    onBlur: function(a) {
        this.hasFocus = false;
        this.wrap.removeClass(this.focusCss);
        this.fireEvent("blur", this)
    },
    onKeyDown: function(a) {
        switch (a.keyCode) {
        case 9:
        case 13:
        case 27:
            if (this.isExpanded()) {
                this.collapse()
            }
            break;
        case 40:
            if (!this.isExpanded() && !this.readonly) {
                this.expand()
            }
        }
        $A.TriggerField.superclass.onKeyDown.call(this, a)
    },
    isEventFromComponent: function(a) {
        return $A.TriggerField.superclass.isEventFromComponent.call(this, a) || this.popup.dom == a || this.popup.contains(a)
    },
    destroy: function() {
        if (this.isExpanded()) {
            this.collapse()
        }
        this.shadow.remove();
        this.popup.remove();
        $A.TriggerField.superclass.destroy.call(this);
        delete this.popup;
        delete this.shadow
    },
    triggerBlur: function(b, a) {
        if (!this.isEventFromComponent(a)) {
            if (this.isExpanded()) {
                this.collapse()
            }
        }
    },
    setVisible: function(a) {
        $A.TriggerField.superclass.setVisible.call(this, a);
        if (a == false && this.isExpanded()) {
            this.collapse()
        }
    },
    collapse: function() {
        Ext.get(document.documentElement).un("mousedown", this.triggerBlur, this);
        this.popup.moveTo( - 1000, -1000);
        this.shadow.moveTo( - 1000, -1000);
        this.fireEvent("collapse", this)
    },
    expand: function() {
        Ext.get(document.documentElement).un("mousedown", this.triggerBlur, this);
        Ext.get(document.documentElement).on("mousedown", this.triggerBlur, this);
        this.syncPopup();
        this.fireEvent("expand", this)
    },
    syncPopup: function() {
        var d = document[Ext.isStrict ? "documentElement": "body"].scrollLeft,
        m = document[Ext.isStrict ? "documentElement": "body"].scrollTop,
        n = this.wrap.getXY(),
        g = n[0] - d,
        f = n[1] - m,
        b = this.popup.getWidth(),
        i = this.popup.getHeight(),
        a = this.wrap.getHeight(),
        e = this.wrap.getWidth(),
        l = $A.getViewportHeight() - 3,
        c = $A.getViewportWidth() - 3,
        h = ((g + b) > c ? ((c - b) < 0 ? g: (c - b)) : g) + d;
        y = ((f + a + i) > l ? ((f - i) < 0 ? (f + a) : (f - i)) : (f + a)) + m;
        this.popup.moveTo(h, y);
        this.shadow.moveTo(h + 3, y + 3)
    },
    onTriggerClick: function() {
        if (this.readonly) {
            return
        }
        if (this.isExpanded()) {
            this.collapse()
        } else {
            this.expand();
            this.el.focus()
        }
    }
});
$A.ComboBox = Ext.extend($A.TriggerField, {
    maxHeight: 200,
    blankOption: true,
    rendered: false,
    selectedClass: "item-comboBox-selected",
    initComponent: function(a) {
        $A.ComboBox.superclass.initComponent.call(this, a);
        var b = a.options;
        if (b) {
            this.setOptions(b)
        } else {
            this.clearOptions()
        }
    },
    initEvents: function() {
        $A.ComboBox.superclass.initEvents.call(this);
        this.addEvents("select")
    },
    onBlur: function(c) {
        if (this.hasFocus) {
            $A.ComboBox.superclass.onBlur.call(this, c);
            if (!this.readonly
            /*this.isExpanded()*/
            ) {
                var b = this.getRawValue();
                if (b != this.value) {
                    if (this.fetchrecord === false) {
                        this.setValue(b)
                    } else {
                        var a = this.getRecordByDisplay(b);
                        this.setValue(a && this.getRenderText(a) || "")
                    }
                }
            }
        }
    },
    getRecordByDisplay: function(b) {
        if (!this.optionDataSet) {
            return null
        }
        var a = null;
        Ext.each(this.optionDataSet.getAll(),
        function(c) {
            if (this.getRenderText(c) == b) {
                a = c;
                return false
            }
        },
        this);
        return a
    },
    expand: function() {
        if (!this.optionDataSet) {
            return
        }
        if (this.rendered === false) {
            this.doQuery()
        } ! this.isExpanded() && $A.ComboBox.superclass.expand.call(this);
        var a = this.getValue();
        this.currentIndex = this.getIndex(a);
        if (!Ext.isEmpty(a)) {
            this.selectItem(this.currentIndex, true)
        }
    },
    onKeyDown: function(d) {
        if (this.readonly) {
            return
        }
        var c = Ext.isEmpty(this.selectedIndex) ? -1 : this.selectedIndex,
        b = d.keyCode;
        if (b == 40 || b == 38) {
            this.inKeyMode = true;
            if (b == 38) {
                c--;
                if (c >= 0) {
                    this.selectItem(c, true)
                }
            } else {
                if (b == 40) {
                    c++;
                    if (c < this.view.dom.childNodes.length) {
                        this.selectItem(c, true)
                    }
                }
            }
        } else {
            if (this.inKeyMode && b == 13) {
                this.inKeyMode = false;
                var a = this.selectedClass;
                Ext.each(this.view.dom.childNodes,
                function(e) {
                    if (Ext.fly(e).hasClass(a)) {
                        this.onSelect(e);
                        return false
                    }
                },
                this);
                this.collapse();
                return
            }
        }
        $A.ComboBox.superclass.onKeyDown.call(this, d)
    },
    onKeyUp: function(a) {
        if (this.readonly) {
            return
        }
        var b = a.keyCode;
        if (!a.isSpecialKey() || b == 8 || b == 46) {
            this.doQuery(this.getRawValue());
            if (!this.isExpanded()) {
                $A.ComboBox.superclass.expand.call(this)
            } else {
                this.syncPopup()
            }
            this.rendered = false
        }
        $A.ComboBox.superclass.onKeyUp.call(this, a)
    },
    collapse: function() {
        $A.ComboBox.superclass.collapse.call(this);
        if (!Ext.isEmpty(this.currentIndex)) {
            Ext.fly(this.getNode(this.currentIndex)).removeClass(this.selectedClass)
        }
    },
    clearOptions: function() {
        this.processDataSet("un");
        this.optionDataSet = null
    },
    setOptions: function(a) {
        var b = typeof(a) === "string" ? $(a) : a;
        if (this.optionDataSet != b) {
            this.processDataSet("un");
            this.optionDataSet = b;
            this.processDataSet("on");
            this.rendered = false;
            if (!Ext.isEmpty(this.value)) {
                this.setValue(this.value, true)
            }
        }
    },
    processDataSet: function(a) {
        var b = this.optionDataSet,
        c = this.onDataSetLoad;
        if (b) {
            b[a]("load", c, this);
            b[a]("query", c, this);
            b[a]("add", c, this);
            b[a]("update", c, this);
            b[a]("remove", c, this);
            b[a]("clear", c, this);
            b[a]("reject", c, this)
        }
    },
    onDataSetLoad: function() {
        this.rendered = false;
        if (this.isExpanded()) {
            this.expand()
        }
    },
    onRender: function() {
        if (!this.view) {
            this.view = this.popup.update("<ul></ul>").child("ul").on("click", this.onViewClick, this).on("mousemove", this.onViewMove, this)
        }
        if (this.optionDataSet) {
            this.initList();
            this.rendered = true
        }
        this.correctViewSize()
    },
    correctViewSize: function() {
        var c = [],
        b = this.wrap.getWidth();
        Ext.each(this.view.dom.childNodes,
        function(d) {
            b = Math.max(b, $A.TextMetrics.measure(d, d.innerHTML).width) || b
        });
        var a = Math.max(20, Math.min(this.popup.child("ul").getHeight() + 4, this.maxHeight));
        this.popup.setWidth(b).setHeight(a);
        this.shadow.setWidth(b).setHeight(a)
    },
    onViewClick: function(b, a) {
        if (a.tagName != "LI") {
            return
        }
        this.onSelect(a);
        this.collapse()
    },
    onViewMove: function(b, a) {
        this.selectItem(a.tabIndex)
    },
    onSelect: function(f) {
        var b = f.tabIndex;
        if (b == -1) {
            return
        }
        var c = this,
        d = null,
        e = "",
        a = null;
        if (c.blankoption) {
            b--
        }
        if (b != -1) {
            a = c.optionDataSet.getAt(b);
            d = a.get(c.valuefield);
            e = c.getRenderText(a)
        }
        c.setValue(e, null, a);
        c.fireEvent("select", c, d, e, a)
    },
    doQuery: function(c) {
        var b = this.optionDataSet;
        if (b) {
            if (Ext.isEmpty(c)) {
                b.clearFilter()
            } else {
                var a = new RegExp(c.replace(/[+?*.^$\[\](){}\\|]/g,
                function(e) {
                    return "\\" + e
                }), "i"),
                d = this.displayfield;
                b.filter(function(e) {
                    return a.test(e.get(d))
                },
                this)
            }
        }
        this.onRender()
    },
    initList: function() {
        this.currentIndex = this.selectedIndex = null;
        var b = this.optionDataSet,
        a = this.view;
        if (b.loading == true) {
            a.update('<li tabIndex="-1">' + _lang["combobox.loading"] + "</li>")
        } else {
            var d = [],
            c = 0;
            if (this.blankoption) {
                d.push('<li tabIndex="0"></li>');
                c = 1
            }
            Ext.each(b.getAll(),
            function(f, e) {
                d.push('<li tabIndex="', e + c, '">', this.getRenderText(f), "</li>")
            },
            this);
            a.update(d.join(""))
        }
    },
    getRenderText: function(a) {
        var b = $A.getRenderer(this.displayrenderer);
        if (b) {
            return b(this, a)
        } else {
            return a.get(this.displayfield)
        }
    },
    selectItem: function(d, c) {
        if (Ext.isEmpty(d)) {
            return
        }
        var e = this.getNode(d),
        a = this.selectedIndex,
        b = this.selectedClass;
        if (e && e.tabIndex != a) {
            if (!Ext.isEmpty(a)) {
                Ext.fly(this.getNode(a)).removeClass(b)
            }
            this.selectedIndex = e.tabIndex;
            if (c) {
                this.focusRow(this.selectedIndex)
            }
            Ext.fly(e).addClass(b)
        }
    },
    focusRow: function(f) {
        var e = 20,
        a = this.popup,
        c = a.getScroll().top,
        d = a.getHeight(),
        b = a.dom.scrollWidth > a.dom.clientWidth ? 16 : 0;
        if (f * e < c) {
            a.scrollTo("top", f * e - 1)
        } else {
            if ((f + 1) * e > (c + d - b)) {
                a.scrollTo("top", (f + 1) * e - d + b)
            }
        }
    },
    getNode: function(a) {
        return this.view.dom.childNodes[a]
    },
    destroy: function() {
        if (this.view) {
            this.view.un("click", this.onViewClick, this).un("mousemove", this.onViewMove, this)
        }
        this.processDataSet("un");
        $A.ComboBox.superclass.destroy.call(this);
        delete this.view
    },
    setValue: function(d, c, a) {
        $A.ComboBox.superclass.setValue.call(this, d, c);
        var f = this.record;
        if (f && !c) {
            var g = f.getMeta().getField(this.binder.name);
            if (g) {
                var e = this.getRawValue(),
                b = a || this.getRecordByDisplay(e);
                Ext.each(g.get("mapping"),
                function(i) {
                    var h = b ? b.get(i.from) : (this.fetchrecord === false ? e: "");
                    if (!Ext.isEmpty(h, true)) {
                        f.set(i.to, h)
                    } else {
                        delete f.data[i.to]
                    }
                },
                this)
            }
        }
    },
    getIndex: function(a) {
        var b = this.displayfield;
        return Ext.each(this.optionDataSet.getAll(),
        function(c) {
            if (c.data[b] == a) {
                return false
            }
        })
    }
});
$A.DateField = Ext.extend($A.Component, {
    bodyTpl: ['<TABLE cellspacing="0">', '<CAPTION class="item-dateField-caption">', "{preYearBtn}", "{nextYearBtn}", "{preMonthBtn}", "{nextMonthBtn}", "<SPAN>", '<SPAN atype="item-year-span" style="margin-right:5px;cursor:pointer"></SPAN>', '<SPAN atype="item-month-span" style="cursor:pointer"></SPAN>', "</SPAN>", "</CAPTION>", '<THEAD class="item-dateField-head">', "<TR>", "<TD>{sun}</TD>", "<TD>{mon}</TD>", "<TD>{tues}</TD>", "<TD>{wed}</TD>", "<TD>{thur}</TD>", "<TD>{fri}</TD>", "<TD>{sat}</TD>", "</TR>", "</THEAD>", "<TBODY>", "</TBODY>", "</TABLE>"],
    preMonthTpl: '<DIV class="item-dateField-pre" title="{preMonth}" onclick="$(\'{id}\').preMonth()"></DIV>',
    nextMonthTpl: '<DIV class="item-dateField-next" title="{nextMonth}" onclick="$(\'{id}\').nextMonth()"></DIV>',
    preYearTpl: '<DIV class="item-dateField-preYear" title="{preYear}" onclick="$(\'{id}\').preYear()"></DIV>',
    nextYearTpl: '<DIV class="item-dateField-nextYear" title="{nextYear}" onclick="$(\'{id}\').nextYear()"></DIV>',
    popupTpl: '<DIV class="item-popup" atype="date-popup" style="vertical-align: middle;background-color:#fff;visibility:hidden"></DIV>',
    initComponent: function(a) {
        $A.DateField.superclass.initComponent.call(this, a);
        if (this.height) {
            this.rowHeight = (this.height - 18 * (Ext.isIE ? 3 : 2)) / 6
        }
        var b = {
            sun: _lang["datefield.sun"],
            mon: _lang["datefield.mon"],
            tues: _lang["datefield.tues"],
            wed: _lang["datefield.wed"],
            thur: _lang["datefield.thur"],
            fri: _lang["datefield.fri"],
            sat: _lang["datefield.sat"]
        };
        if (this.enableyearbtn == "both" || this.enableyearbtn == "pre") {
            b.preYearBtn = new Ext.Template(this.preYearTpl).apply({
                preYear: _lang["datefield.preYear"],
                id: this.id
            })
        }
        if (this.enableyearbtn == "both" || this.enableyearbtn == "next") {
            b.nextYearBtn = new Ext.Template(this.nextYearTpl).apply({
                nextYear: _lang["datefield.nextYear"],
                id: this.id
            })
        }
        if (this.enablemonthbtn == "both" || this.enablemonthbtn == "pre") {
            b.preMonthBtn = new Ext.Template(this.preMonthTpl).apply({
                preMonth: _lang["datefield.preMonth"],
                id: this.id
            })
        }
        if (this.enablemonthbtn == "both" || this.enablemonthbtn == "next") {
            b.nextMonthBtn = new Ext.Template(this.nextMonthTpl).apply({
                nextMonth: _lang["datefield.nextMonth"],
                id: this.id
            })
        }
        this.body = new Ext.Template(this.bodyTpl).append(this.wrap.dom, b, true);
        this.yearSpan = this.body.child("span[atype=item-year-span]");
        this.monthSpan = this.body.child("span[atype=item-month-span]");
        this.popup = new Ext.Template(this.popupTpl).append(this.body.child("caption").dom, {},
        true)
    },
    processListener: function(a) {
        $A.DateField.superclass.processListener.call(this, a);
        this.body[a]("mousewheel", this.onMouseWheel, this);
        this.body[a]("mouseover", this.onMouseOver, this);
        this.body[a]("mouseout", this.onMouseOut, this);
        this.body[a]("click", this.onSelect, this);
        this.yearSpan[a]("click", this.onViewShow, this);
        this.monthSpan[a]("click", this.onViewShow, this)
    },
    initEvents: function() {
        $A.DateField.superclass.initEvents.call(this);
        this.addEvents("select", "draw")
    },
    destroy: function() {
        $A.DateField.superclass.destroy.call(this);
        delete this.preMonthBtn;
        delete this.nextMonthBtn;
        delete this.body
    },
    onMouseWheel: function(a) {
        this[(a.getWheelDelta() > 0 ? "pre": "next") + (a.ctrlKey ? "Year": "Month")]();
        a.stopEvent()
    },
    onMouseOver: function(b, a) {
        this.out();
        if (((a = Ext.fly(a)).hasClass("item-day") || (a = a.parent(".item-day"))) && a.getAttributeNS("", "_date") != "0") {
            $A.DateField.superclass.onMouseOver.call(this, b);
            this.over(a)
        }
    },
    onMouseOut: function(a) {
        $A.DateField.superclass.onMouseOut.call(this, a);
        this.out()
    },
    over: function(a) {
        a = a || this.body.last().child("td.item-day");
        this.overTd = a;
        a.addClass("dateover")
    },
    out: function() {
        if (this.overTd) {
            this.overTd.removeClass("dateover");
            this.overTd = null
        }
    },
    onSelect: function(d, b) {
        var c = this,
        f = Ext.get(b),
        a;
        if (f.parent('div[atype="date-popup"]')) {
            c.onViewClick(d, f)
        } else {
            a = f.getAttributeNS("", "_date");
            if (a && a != "0") {
                c.fireEvent("select", d, b, c, new Date(Number(a)))
            }
        }
    },
    onSelectDay: function(a) {
        if (!a.hasClass("onSelect")) {
            a.addClass("onSelect")
        }
    },
    onViewShow: function(f, b) {
        var c = Ext.get(b);
        this.focusSpan = c;
        var a = this.body.child("thead"),
        d = a.getXY();
        this.popup.moveTo(d[0], d[1]);
        this.popup.setWidth(a.getWidth());
        this.popup.setHeight(a.getHeight() + a.next().getHeight());
        if (c.getAttributeNS("", "atype") == "item-year-span") {
            this.initView(this.year, 100, true)
        } else {
            this.initView(7, 60)
        }
        Ext.get(document.documentElement).on("mousedown", this.viewBlur, this);
        this.popup.show()
    },
    onViewHide: function() {
        Ext.get(document.documentElement).un("mousedown", this.viewBlur, this);
        this.popup.hide()
    },
    viewBlur: function(b, a) {
        if (!this.popup.contains(a) && !(this.focusSpan.contains(a) || this.focusSpan.dom == a)) {
            this.onViewHide()
        }
    },
    onViewClick: function(b, a) {
        if (a.hasClass("item-day")) {
            if (this.focusSpan.getAttributeNS("", "atype") == "item-year-span") {
                this.year = a.getAttributeNS("", "_data")
            } else {
                this.month = a.getAttributeNS("", "_data")
            }
            this.year--;
            this.nextYear();
            this.onViewHide()
        }
    },
    nowMonth: function() {
        this.predraw(new Date())
    },
    preMonth: function() {
        this.predraw(new Date(this.year, this.month - 2, 1, this.hours, this.minutes, this.seconds))
    },
    nextMonth: function() {
        this.predraw(new Date(this.year, this.month, 1, this.hours, this.minutes, this.seconds))
    },
    preYear: function() {
        this.predraw(new Date(this.year - 1, this.month - 1, 1, this.hours, this.minutes, this.seconds))
    },
    nextYear: function() {
        this.predraw(new Date(this.year + 1, this.month - 1, 1, this.hours, this.minutes, this.seconds))
    },
    predraw: function(a, b) {
        if (!a || !a instanceof Date) {
            a = new Date()
        }
        this.date = a;
        this.hours = a.getHours();
        this.minutes = a.getMinutes();
        this.seconds = a.getSeconds();
        this.year = a.getFullYear();
        this.month = a.getMonth() + 1;
        this.draw(new Date(this.year, this.month - 1, 1, this.hours, this.minutes, this.seconds));
        if (!b) {
            this.fireEvent("draw", this)
        }
    },
    draw: function(c) {
        var l = [],
        q = c.getFullYear(),
        o = c.getMonth() + 1,
        g = c.getHours(),
        e = c.getMinutes(),
        b = c.getSeconds();
        this.yearSpan.update(q + _lang["datefield.year"]);
        this.monthSpan.update(o + _lang["datefield.month"]);
        for (var h = 1,
        a = new Date(q, o - 1, 1).getDay(), r = new Date(q, o - 1, 0).getDate(); h <= a; h++) {
            l.push((this.enablebesidedays == "both" || this.enablebesidedays == "pre") ? new Date(q, o - 2, r - a + h, g, e, b) : null)
        }
        for (var h = 1,
        t = new Date(q, o, 0).getDate(); h <= t; h++) {
            l.push(new Date(q, o - 1, h, g, e, b))
        }
        for (var h = 1,
        t = new Date(q, o, 0).getDay(), n = 43 - l.length; h < n; h++) {
            l.push((this.enablebesidedays == "both" || this.enablebesidedays == "next") ? new Date(q, o, h, g, e, b) : null)
        }
        var m = this.body.dom.tBodies[0];
        while (m.firstChild) {
            Ext.fly(m.firstChild).remove()
        }
        var f = 0;
        while (l.length) {
            var u = Ext.get(m.insertRow( - 1));
            u.set({
                r_index: f
            });
            if (f % 2 == 0) {
                u.addClass("week-alt")
            }
            if (this.rowHeight) {
                u.setHeight(this.rowHeight)
            }
            f++;
            for (var h = 1; h <= 7; h++) {
                var p = l.shift();
                if (Ext.isDefined(p)) {
                    var s = Ext.get(u.dom.insertCell( - 1));
                    if (p) {
                        s.set({
                            c_index: h - 1
                        });
                        s.addClass(c.getMonth() == p.getMonth() ? "item-day": "item-day item-day-besides");
                        s.update(this.renderCell(s, p, p.getDate(), o) || p.getDate());
                        if (s.disabled) {
                            s.set({
                                _date: "0"
                            });
                            s.addClass("item-day-disabled")
                        } else {
                            s.set({
                                _date: ("" + p.getTime())
                            });
                            if (this.format) {
                                s.set({
                                    title: p.format(this.format)
                                })
                            }
                        }
                        if (this.isSame(p, new Date())) {
                            s.addClass("onToday")
                        }
                        if (this.selectDay && this.isSame(p, this.selectDay)) {
                            this.onSelectDay(s)
                        }
                    } else {
                        s.update("&#160;")
                    }
                }
            }
        }
    },
    renderCell: function(a, c, b, d) {
        if (this.dayrenderer) {
            return $A.getRenderer(this.dayrenderer).call(this, a, c, b, d)
        }
    },
    isSame: function(b, a) {
        if (!a.getFullYear || !b.getFullYear) {
            return false
        }
        return (b.getFullYear() == a.getFullYear() && b.getMonth() == a.getMonth() && b.getDate() == a.getDate())
    },
    initView: function(b, f, g) {
        var d = ["<table cellspacing='0' cellpadding='0' width='100%'><tr><td width='45%'></td><td width='10%'></td><td width='45%'></td></tr>"];
        for (var c = 0,
        h = (g ? 5 : 6), e = b - h, a = b; c < h; c++) {
            d.push("<tr><td class='item-day' _data='" + e + "'>" + e + "</td><td></td><td class='item-day' _data='" + a + "'>" + a + "</td></tr>");
            e += 1;
            a += 1
        }
        d.push("");
        if (g) {
            d.push("<tr><td><div class='item-dateField-pre' onclick='$(\"" + this.id + '").initView(' + (b - 10) + "," + f + ",true)'></div></td>");
            d.push("<td><div class='item-dateField-close' onclick='$(\"" + this.id + "\").onViewHide()'></div></td>");
            d.push("<td><div class='item-dateField-next' onclick='$(\"" + this.id + '").initView(' + (b + 10) + "," + f + ",true)'></div></td></tr>")
        } else {
            d.push("<td colspan='3' align='center'><div class='item-dateField-close' onclick='$(\"" + this.id + "\").onViewHide()'></div></td>")
        }
        d.push("</table>");
        this.popup.update(d.join(""))
    }
});
$A.DatePicker = Ext.extend($A.TriggerField, {
    nowTpl: ['<DIV class="item-day" style="cursor:pointer" title="{title}">{now}</DIV>'],
    constructor: function(a) {
        this.dateFields = [];
        this.cmps = {};
        $A.DatePicker.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.DatePicker.superclass.initComponent.call(this, a);
        this.initFormat();
        this.initDatePicker()
    },
    initFormat: function() {
        this.format = this.format || $A.defaultDateFormat
    },
    initDatePicker: function() {
        if (!this.inited) {
            this.initDateField();
            this.initFooter();
            this.inited = true
        }
    },
    initDateField: function() {
        this.popup.setStyle({
            width: 150 * this.viewsize + "px"
        });
        if (this.dateFields.length == 0) {
            for (var b = 0; b < this.viewsize; b++) {
                var a = {
                    id: this.id + "_df" + b,
                    height: 130,
                    enablemonthbtn: "none",
                    enablebesidedays: "none",
                    dayrenderer: this.dayrenderer,
                    listeners: {
                        draw: this.onDraw.createDelegate(this),
                        mouseover: this.mouseOver.createDelegate(this),
                        mouseout: this.mouseOut.createDelegate(this)
                    }
                };
                if (b == 0) {
                    if (this.enablebesidedays == "both" || this.enablebesidedays == "pre") {
                        a.enablebesidedays = "pre"
                    }
                    if (this.enablemonthbtn == "both" || this.enablemonthbtn == "pre") {
                        a.enablemonthbtn = "pre"
                    }
                    if (this.enableyearbtn == "both" || this.enableyearbtn == "pre") {
                        a.enableyearbtn = "pre"
                    }
                }
                if (b == this.viewsize - 1) {
                    if (this.enablebesidedays == "both" || this.enablebesidedays == "next") {
                        a.enablebesidedays = a.enablebesidedays == "pre" ? "both": "next"
                    }
                    if (this.enablemonthbtn == "both" || this.enablemonthbtn == "next") {
                        a.enablemonthbtn = a.enablemonthbtn == "pre" ? "both": "next"
                    }
                    if (this.enableyearbtn == "both" || this.enableyearbtn == "next") {
                        a.enableyearbtn = a.enableyearbtn == "pre" ? "both": "next"
                    }
                } else {
                    Ext.fly(this.id + "_df" + b).dom.style.cssText = "border-right:1px solid #BABABA"
                }
                this.dateFields.add(new $A.DateField(a))
            }
        }
    },
    initFooter: function() {
        if (!this.now) {
            this.now = new Ext.Template(this.nowTpl).append(this.popup.child("div.item-dateField-foot").dom, {
                now: _lang["datepicker.today"],
                title: new Date().format(this.format)
            },
            true)
        }
        var b = new Date(),
        a = this.now,
        c = this.dayrenderer;
        c && $A.getRenderer(c).call(this, a, b, b.getDate());
        if (a.disabled) {
            a.set({
                _date: "0"
            });
            a.addClass("item-day-disabled")
        } else {
            a.set({
                _date: new Date(b.getFullYear(), b.getMonth(), b.getDate(), 0, 0, 0).getTime()
            })
        }
    },
    initEvents: function() {
        $A.DatePicker.superclass.initEvents.call(this);
        this.addEvents("select")
    },
    processListener: function(a) {
        $A.DatePicker.superclass.processListener.call(this, a);
        this.el[a]("click", this.mouseOut, this);
        this.popup[a]("click", this.onSelect, this)
    },
    mouseOver: function(a, b) {
        if (this.focusField) {
            this.focusField.out()
        }
        this.focusField = a
    },
    mouseOut: function() {
        if (this.focusField) {
            this.focusField.out()
        }
        this.focusField = null
    },
    onKeyUp: function(a) {
        if (this.readonly) {
            return
        }
        $A.DatePicker.superclass.onKeyUp.call(this, a);
        var b = a.keyCode;
        if (!a.isSpecialKey() || b == 8 || b == 46) {
            try {
                this.selectDay = this.getRawValue().parseDate(this.format);
                this.wrapDate(this.selectDay);
                $A.Component.prototype.setValue.call(this, this.selectDay || "");
                this.predraw(this.selectDay)
            } catch(a) {}
        }
    },
    onKeyDown: function(a) {
        if (this.readonly) {
            return
        }
        if (this.focusField) {
            switch (a.keyCode) {
            case 37:
                this.goLeft(a);
                break;
            case 38:
                this.goUp(a);
                break;
            case 39:
                this.goRight(a);
                break;
            case 40:
                this.goDown(a);
                break;
            case 13:
                this.onSelect(a, this.focusField.overTd);
            default:
                if (this.focusField) {
                    this.focusField.out()
                }
                this.focusField = null
            }
        } else {
            $A.DatePicker.superclass.onKeyDown.call(this, a);
            if (a.keyCode == 40) {
                this.focusField = this.dateFields[0];
                this.focusField.over()
            }
        }
    },
    goLeft: function(h) {
        var g = this.focusField;
        var i = g.overTd,
        c = i.prev(".item-day");
        g.out();
        if (c) {
            g.over(c)
        } else {
            var d = this.dateFields[this.dateFields.indexOf(g) - 1],
            b = i.parent().getAttributeNS("", "r_index");
            if (d) {
                this.focusField = d
            } else {
                g.preMonth();
                this.focusField = this.dateFields[this.dateFields.length - 1]
            }
            var a = this.focusField.body.child("tr[r_index=" + b + "]").select("td.item-day");
            this.focusField.over(a.item(a.getCount() - 1))
        }
        h.stopEvent()
    },
    goUp: function(i) {
        var h = this.focusField;
        var m = h.overTd,
        d = m.parent().prev(),
        b = m.getAttributeNS("", "c_index"),
        c;
        h.out();
        if (d) {
            c = d.child("td[c_index=" + b + "]")
        }
        if (c) {
            h.over(c)
        } else {
            var g = this.dateFields[this.dateFields.indexOf(h) - 1];
            if (g) {
                this.focusField = g
            } else {
                h.preMonth();
                this.focusField = this.dateFields[0]
            }
            var a = this.focusField.body.select("td[c_index=" + b + "]");
            this.focusField.over(a.item(a.getCount() - 1))
        }
    },
    goRight: function(g) {
        var d = this.focusField;
        var h = d.overTd,
        b = h.next(".item-day"),
        a = h.parent();
        d.out();
        if (b) {
            d.over(b)
        } else {
            var c = this.dateFields[this.dateFields.indexOf(d) + 1];
            if (c) {
                this.focusField = c
            } else {
                d.nextMonth();
                this.focusField = this.dateFields[0]
            }
            this.focusField.over(this.focusField.body.child("tr[r_index=" + a.getAttributeNS("", "r_index") + "]").child("td.item-day"))
        }
        g.stopEvent()
    },
    goDown: function(h) {
        var g = this.focusField;
        var i = g.overTd,
        c = i.parent().next(),
        b,
        a = i.getAttributeNS("", "c_index");
        g.out();
        if (c) {
            b = c.child("td[c_index=" + a + "]")
        }
        if (b) {
            g.over(b)
        } else {
            var d = this.dateFields[this.dateFields.indexOf(g) + 1];
            if (d) {
                this.focusField = d
            } else {
                g.nextMonth();
                this.focusField = this.dateFields[this.dateFields.length - 1]
            }
            this.focusField.over(this.focusField.body.child("td[c_index=" + a + "]"))
        }
    },
    onDraw: function(a) {
        if (this.dateFields.length > 1) {
            this.sysnDateField(a)
        }
        this.shadow.setWidth(this.popup.getWidth());
        this.shadow.setHeight(this.popup.getHeight())
    },
    onSelect: function(f, c) {
        var a = Ext.fly(c).getAttributeNS("", "_date");
        if (a && a != "0") {
            var d = this,
            b = new Date(Number(a));
            d.collapse();
            d.processDate(b);
            d.setValue(b);
            d.fireEvent("select", d, b)
        }
    },
    wrapDate: function(a) {},
    processDate: function(a) {},
    onBlur: function(a) {
        if (this.hasFocus) {
            $A.DatePicker.superclass.onBlur.call(this, a);
            if (!this.readonly && !this.isExpanded()) {
                try {
                    var b = this.getRawValue().parseDate(this.format);
                    this.wrapDate(b);
                    this.setValue(b || "")
                } catch(a) {
                    this.setValue("")
                }
            }
        }
    },
    formatValue: function(a) {
        if (a instanceof Date) {
            return a.format(this.format)
        }
        return a
    },
    expand: function() {
        this.selectDay = this.getValue();
        this.predraw(this.selectDay);
        $A.DatePicker.superclass.expand.call(this)
    },
    collapse: function() {
        $A.DatePicker.superclass.collapse.call(this);
        this.focusField = null
    },
    destroy: function() {
        $A.DatePicker.superclass.destroy.call(this);
        var a = this;
        Ext.each(this.dateFields,
        function(b) {
            try {
                b.destroy()
            } catch(c) {
                alert("销毁datePicker出错: " + c)
            }
        });
        delete this.format;
        delete this.viewsize
    },
    predraw: function(a) {
        if (a && a instanceof Date) {
            this.selectDay = new Date(a)
        } else {
            a = new Date();
            a.setHours(this.hour || 0);
            a.setMinutes(this.minute || 0);
            a.setSeconds(this.second || 0);
            a.setMilliseconds(0)
        }
        this.draw(a)
    },
    draw: function(a) {
        this.dateFields[0].selectDay = this.selectDay;
        this.dateFields[0].format = this.format;
        this.dateFields[0].predraw(a)
    },
    sysnDateField: function(c) {
        var a = new Date(c.date);
        for (var b = 0; b < this.viewsize; b++) {
            if (c == this.dateFields[b]) {
                a.setMonth(a.getMonth() - b)
            }
        }
        for (var b = 0; b < this.viewsize; b++) {
            this.dateFields[b].selectDay = this.selectDay;
            if (b != 0) {
                a.setMonth(a.getMonth() + 1)
            }
            this.dateFields[b].format = this.format;
            if (c != this.dateFields[b]) {
                this.dateFields[b].predraw(a, true)
            }
        }
    }
});
$A.DateTimePicker = Ext.extend($A.DatePicker, {
    initFormat: function() {
        this.format = this.format || $A.defaultDateTimeFormat
    },
    initFooter: function() {
        this.hourSpan = this.popup.child("input[atype=field.hour]");
        this.minuteSpan = this.popup.child("input[atype=field.minute]");
        this.secondSpan = this.popup.child("input[atype=field.second]");
        this.hourSpanParent = this.hourSpan.parent()
    },
    processListener: function(a) {
        $A.DateTimePicker.superclass.processListener.call(this, a);
        if (this.hourSpan) {
            this.hourSpan[a]("click", this.onDateClick, this, {
                stopPropagation: true
            });
            this.hourSpan[a]("focus", this.onDateFocus, this);
            this.hourSpan[a]("blur", this.onDateBlur, this);
            this.minuteSpan[a]("focus", this.onDateFocus, this);
            this.minuteSpan[a]("blur", this.onDateBlur, this);
            this.minuteSpan[a]("click", this.onDateClick, this, {
                stopPropagation: true
            });
            this.secondSpan[a]("focus", this.onDateFocus, this);
            this.secondSpan[a]("blur", this.onDateBlur, this);
            this.secondSpan[a]("click", this.onDateClick, this, {
                stopPropagation: true
            });
            this.hourSpanParent[a]("keydown", this.onDateKeyDown, this);
            this.hourSpanParent[a]("keyup", this.onDateKeyUp, this)
        }
    },
    onDateKeyDown: function(b) {
        var d = b.keyCode,
        a = b.target;
        if (d == 13) {
            a.blur()
        } else {
            if (d == 27) {
                a.value = a.oldValue || "";
                a.blur()
            } else {
                if (d != 8 && d != 9 && d != 37 && d != 39 && d != 46 && (d < 48 || d > 57 || b.shiftKey)) {
                    b.stopEvent();
                    return
                }
            }
        }
    },
    onDateKeyUp: function(d) {
        var f = d.keyCode,
        b = d.target;
        if (f != 8 && f != 9 && f != 37 && f != 39 && f != 46 && (f < 48 || f > 57 || d.shiftKey)) {
            d.stopEvent();
            return
        } else {
            if (this.value && this.value instanceof Date) {
                var a = new Date(this.value.getTime());
                this.processDate(a);
                this.setValue(a)
            }
            this.draw(new Date(this.dateFields[0].year, this.dateFields[0].month - 1, 1, this.hourSpan.dom.value, this.minuteSpan.dom.value, this.secondSpan.dom.value))
        }
    },
    onDateClick: function() {},
    onDateFocus: function(a) {
        Ext.fly(a.target.parentNode).addClass("item-dateField-input-focus");
        a.target.select()
    },
    onDateBlur: function(b) {
        var a = b.target;
        Ext.fly(a.parentNode).removeClass("item-dateField-input-focus");
        if (!a.value.match(/^[0-9]*$/)) {
            a.value = a.oldValue || ""
        }
    },
    predraw: function(a, b) {
        $A.DateTimePicker.superclass.predraw.call(this, a, b);
        this.hourSpan.dom.oldValue = this.hourSpan.dom.value = $A.dateFormat.pad(this.dateFields[0].hours);
        this.minuteSpan.dom.oldValue = this.minuteSpan.dom.value = $A.dateFormat.pad(this.dateFields[0].minutes);
        this.secondSpan.dom.oldValue = this.secondSpan.dom.value = $A.dateFormat.pad(this.dateFields[0].seconds)
    },
    processDate: function(a) {
        if (a) {
            a.setHours((el = this.hourSpan.dom).value.match(/^[0-9]*$/) ? el.value: el.oldValue);
            a.setMinutes((el = this.minuteSpan.dom).value.match(/^[0-9]*$/) ? el.value: el.oldValue);
            a.setSeconds((el = this.secondSpan.dom).value.match(/^[0-9]*$/) ? el.value: el.oldValue);
            this.wrapDate(a)
        }
    },
    wrapDate: function(a) {
        if (a) {
            a.xtype = "timestamp"
        }
    }
});
$A.ToolBar = Ext.extend($A.Component, {
    constructor: function(a) {
        $A.ToolBar.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.ToolBar.superclass.initComponent.call(this, a)
    },
    initEvents: function() {
        $A.ToolBar.superclass.initEvents.call(this)
    }
});
$A.NavBar = Ext.extend($A.ToolBar, {
    constructor: function(a) {
        $A.NavBar.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.NavBar.superclass.initComponent.call(this, a);
        this.dataSet = $(this.dataSet);
        this.navInfo = this.wrap.child("div[atype=displayInfo]");
        if (this.type != "simple" && this.type != "tiny") {
            this.pageInput = $(this.inputId);
            this.currentPage = this.wrap.child("div[atype=currentPage]");
            this.pageInfo = this.wrap.child("div[atype=pageInfo]");
            if (this.comboBoxId) {
                this.pageSizeInput = $(this.comboBoxId);
                this.pageSizeInfo = this.wrap.child("div[atype=pageSizeInfo]");
                this.pageSizeInfo2 = this.wrap.child("div[atype=pageSizeInfo2]");
                this.pageSizeInfo.update(_lang["toolbar.pageSize"]);
                this.pageSizeInfo2.update(_lang["toolbar.pageSize2"])
            }
            this.pageInfo.update(_lang["toolbar.total"] + "&#160;&#160;" + _lang["toolbar.page"]);
            this.currentPage.update(_lang["toolbar.ctPage"])
        }
    },
    processListener: function(a) {
        $A.NavBar.superclass.processListener.call(this, a);
        this.dataSet[a]("load", this.onLoad, this);
        if (this.type != "simple" && this.type != "tiny") {
            this.pageInput[a]("change", this.onPageChange, this);
            if (this.pageSizeInput) {
                this.pageSizeInput[a]("change", this.onPageSizeChange, this)
            }
        }
    },
    initEvents: function() {
        $A.NavBar.superclass.initEvents.call(this)
    },
    onLoad: function() {
        var e = this,
        f = e.dataSet,
        d = f.pagesize,
        c = e.pageSizeInput;
        e.navInfo.update(e.creatNavInfo());
        if (e.type != "simple" && e.type != "tiny") {
            e.pageInput.setValue(f.currentPage, true);
            e.pageInfo.update(_lang["toolbar.total"] + f.totalPage + _lang["toolbar.page"]);
            if (c && !c.optionDataSet) {
                if (f.fetchall) {
                    d = f.totalCount;
                    c.initReadOnly(true)
                }
                var b = [10, 20, 50, 100];
                if (b.indexOf(d) == -1) {
                    b.unshift(d);
                    b.sort(function(l, i) {
                        return l - i
                    })
                }
                var a = [];
                while (Ext.isDefined(b[0])) {
                    var h = b.shift();
                    a.push({
                        code: h,
                        name: h
                    })
                }
                var g = new $A.DataSet({
                    datas: a
                });
                c.valuefield = "code";
                c.displayfield = "name";
                c.setOptions(g);
                c.setValue(d, true)
            }
        }
    },
    creatNavInfo: function() {
        var h = this,
        a = h.dataSet,
        g = a.currentPage,
        e = a.totalPage,
        n = a.totalCount,
        b = a.pagesize;
        if (a.fetchall) {
            b = n
        }
        if (h.type == "simple") {
            var f = [];
            if (e) {
                f.push("<span>共" + e + "页</span>");
                f.push(g == 1 ? "<span>" + _lang["toolbar.firstPage"] + "</span>": h.createAnchor(_lang["toolbar.firstPage"], 1));
                f.push(g == 1 ? "<span>" + _lang["toolbar.prePage"] + "</span>": h.createAnchor(_lang["toolbar.prePage"], g - 1));
                for (var d = 1; d < 4 && d <= e; d++) {
                    f.push(d == g ? "<b>" + g + "</b>": h.createAnchor(d, d))
                }
                if (e > h.maxPageCount) {
                    if (g > 5) {
                        h.createSplit(f)
                    }
                    for (var d = g - 1; d < g + 2; d++) {
                        if (d > 3 && d < e - 2) {
                            f.push(d == g ? "<b>" + g + "</b>": this.createAnchor(d, d))
                        }
                    }
                    if (g < e - 4) {
                        this.createSplit(f)
                    }
                } else {
                    if (e > 6) {
                        for (var d = 4; d < e - 2; d++) {
                            f.push(d == g ? "<b>" + g + "</b>": this.createAnchor(d, d))
                        }
                    }
                }
                for (var d = e - 2; d < e + 1; d++) {
                    if (d > 3) {
                        f.push(d == g ? "<b>" + g + "</b>": this.createAnchor(d, d))
                    }
                }
                f.push(g == e ? "<span>" + _lang["toolbar.nextPage"] + "</span>": this.createAnchor(_lang["toolbar.nextPage"], g + 1));
                f.push(g == e ? "<span>" + _lang["toolbar.lastPage"] + "</span>": this.createAnchor(_lang["toolbar.lastPage"], e))
            }
            return f.join("")
        } else {
            if (h.type == "tiny") {
                var f = [];
                f.push(g == 1 ? "<span>" + _lang["toolbar.firstPage"] + "</span>": this.createAnchor(_lang["toolbar.firstPage"], 1));
                f.push(g == 1 ? "<span>" + _lang["toolbar.prePage"] + "</span>": this.createAnchor(_lang["toolbar.prePage"], g - 1));
                f.push(g == e ? "<span>" + _lang["toolbar.nextPage"] + "</span>": h.createAnchor(_lang["toolbar.nextPage"], g + 1));
                f.push("<span>第" + g + "页</span>");
                return f.join("")
            } else {
                var m = ((g - 1) * b + 1),
                l = g * b,
                c = $A.getTheme();
                if (l > n && n > m) {
                    l = n
                }
                if (l == 0) {
                    m = 0
                }
                if (c == "mac") {
                    return _lang["toolbar.visible"] + " " + m + " - " + l
                } else {
                    return _lang["toolbar.visible"] + " " + m + " - " + l + " " + _lang["toolbar.total"] + n + _lang["toolbar.item"]
                }
            }
        }
    },
    createAnchor: function(b, a) {
        return "<a href=\"javascript:$('" + this.dataSet.id + "').goPage(" + a + ')">' + b + "</a>"
    },
    createSplit: function(a) {
        a.push("<span>···</span>")
    },
    onPageChange: function(a, c, d) {
        var b = this.dataSet;
        if (isNaN(c) || c <= 0 || c > b.totalPage) {
            a.setValue(d, true)
        } else {
            b.goPage(c)
        }
    },
    onPageSizeChange: function(b, c, d) {
        var a = this.dataSet.maxpagesize;
        if (isNaN(c) || c < 0) {
            b.setValue(d, true)
        } else {
            if (c > a) {
                $A.showMessage(_lang["toolbar.errormsg"], _lang["toolbar.maxPageSize"] + a + _lang["toolbar.item"], null, 240);
                b.setValue(d, true)
            } else {
                this.dataSet.pagesize = Math.round(c);
                this.dataSet.query()
            }
        }
    }
});
$A.WindowManager = function() {
    return {
        put: function(a) {
            if (!this.cache) {
                this.cache = []
            }
            this.cache.add(a)
        },
        getAll: function() {
            return this.cache
        },
        remove: function(a) {
            this.cache.remove(a)
        },
        get: function(c) {
            if (!this.cache) {
                return null
            }
            var b = null;
            for (var a = 0; a < this.cache.length; a++) {
                if (this.cache[a].id == c) {
                    b = this.cache[a];
                    break
                }
            }
            return b
        },
        getZindex: function() {
            var c = 40;
            var d = this.getAll();
            for (var b = 0; b < d.length; b++) {
                var e = d[b];
                var a = e.wrap.getStyle("z-index");
                if (a == "auto") {
                    a = 0
                }
                if (a > c) {
                    c = a
                }
            }
            return Number(c)
        }
    }
} ();
$A.Window = Ext.extend($A.Component, {
    constructor: function(a) {
        if ($A.WindowManager.get(a.id)) {
            return
        }
        this.draggable = true;
        this.closeable = true;
        this.fullScreen = false;
        this.modal = a.modal || true;
        this.cmps = {};
        $A.Window.superclass.constructor.call(this, a)
    },
    initComponent: function(c) {
        $A.Window.superclass.initComponent.call(this, c);
        var f = this;
        $A.WindowManager.put(f);
        var b = new Ext.Template(f.getTemplate());
        var d = new Ext.Template(f.getShadowTemplate());
        f.width = 1 * (f.width || 350);
        f.height = 1 * (f.height || 400);
        if (f.fullScreen) {
            var e = document.documentElement.style;
            f.overFlow = e.overflow;
            e.overflow = "hidden";
            f.width = $A.getViewportWidth();
            f.height = $A.getViewportHeight() - 26;
            f.draggable = false;
            f.marginheight = 1;
            f.marginwidth = 1
        }
        var a = "";
        if (f.url) {
            a = 'url="' + f.url + '"'
        }
        f.wrap = b.insertFirst(document.body, {
            id: f.id,
            title: f.title,
            width: f.width,
            bodywidth: f.width - 2,
            height: f.height,
            url: a,
            clz: (f.fullScreen ? "full-window ": "") + f.className || ""
        },
        true);
        f.wrap.cmps = f.cmps;
        f.shadow = d.insertFirst(document.body, {},
        true);
        f.shadow.setWidth(f.wrap.getWidth());
        f.shadow.setHeight(f.wrap.getHeight());
        f.title = f.wrap.child("div[atype=window.title]");
        f.head = f.wrap.child("td[atype=window.head]");
        f.body = f.wrap.child("div[atype=window.body]");
        f.closeBtn = f.wrap.child("div[atype=window.close]");
        if (f.draggable) {
            f.initDraggable()
        }
        if (!f.closeable) {
            f.closeBtn.hide()
        }
        if (Ext.isEmpty(c.x) || Ext.isEmpty(c.y) || f.fullScreen) {
            f.center()
        } else {
            f.move(c.x, c.y);
            this.toFront();
            this.focus.defer(10, this)
        }
        if (f.url) {
            f.load(f.url, c.params)
        }
    },
    processListener: function(a) {
        $A.Window.superclass.processListener.call(this, a);
        if (this.closeable) {
            this.closeBtn[a]("click", this.onCloseClick, this);
            this.closeBtn[a]("mouseover", this.onCloseOver, this);
            this.closeBtn[a]("mouseout", this.onCloseOut, this);
            this.closeBtn[a]("mousedown", this.onCloseDown, this)
        }
        this.wrap[a]("click", this.onClick, this, {
            stopPropagation: true
        });
        this.wrap[a]("keydown", this.onKeyDown, this);
        if (this.draggable) {
            this.head[a]("mousedown", this.onMouseDown, this)
        }
    },
    initEvents: function() {
        $A.Window.superclass.initEvents.call(this);
        this.addEvents("beforeclose", "close", "load")
    },
    onClick: function(a) {
        if (!this.modal) {
            this.toFront()
        }
    },
    onKeyDown: function(h) {
        var d = h.getKey();
        if (d == 9) {
            var g, i, c, f;
            for (var b in this.cmps) {
                f = this.cmps[b];
                if (f.focus) {
                    if (!g) {
                        g = b
                    }
                    i = b
                }
                if (f.hasFocus) {
                    c = b
                }
            }
            if (h.shiftKey) {
                var a = i;
                i = g;
                g = a
            }
            if (c == i) {
                h.stopEvent();
                if (f && f.blur) {
                    f.blur()
                }
                g && this.cmps[g].focus()
            }
        } else {
            if (d == 27) {
                h.stopEvent();
                this.close()
            }
        }
    },
    initDraggable: function() {
        this.head.addClass("item-draggable")
    },
    focus: function() {
        this.wrap.focus()
    },
    center: function() {
        var d = $A.getViewportWidth();
        var f = $A.getViewportHeight();
        var b = document[Ext.isStrict ? "documentElement": "body"].scrollLeft;
        var c = document[Ext.isStrict ? "documentElement": "body"].scrollTop;
        var a = b + Math.max((d - this.width) / 2, 0);
        var e = c + Math.max((f - this.height - (Ext.isIE ? 26 : 23)) / 2, 0);
        if (this.fullScreen) {
            a = b;
            e = c;
            this.move(a, e, true);
            this.shadow.moveTo(a, e)
        } else {
            this.move(a, e)
        }
        this.toFront();
        this.focus.defer(10, this)
    },
    move: function(b, c, a) {
        this.wrap.moveTo(b, c);
        if (!a) {
            this.shadow.moveTo(b + 3, c + 3)
        }
    },
    hasVScrollBar: function() {
        var a = document[Ext.isStrict ? "documentElement": "body"];
        return a.scrollTop > 0 || a.scrollHeight > a.clientHeight
    },
    hasHScrollBar: function() {
        var a = document[Ext.isStrict ? "documentElement": "body"];
        return a.scrollLeft > 0 || a.scrollWidth > a.clientWidth
    },
    getShadowTemplate: function() {
        return ['<DIV class="win-shadow item-shadow"></DIV>']
    },
    getTemplate: function() {
        return ['<TABLE id="{id}" class="win-wrap {clz}" style="left:-10000px;top:-10000px;width:{width}px;outline:none" cellSpacing="0" cellPadding="0" hideFocus tabIndex="-1" border="0" {url}>', "<TBODY>", '<TR style="height:23px;" >', '<TD class="win-caption">', '<TABLE cellSpacing="0" class="win-cap" unselectable="on"  onselectstart="return false;" style="height:23px;-moz-user-select:none;"  cellPadding="0" width="100%" border="0" unselectable="on">', "<TBODY>", "<TR>", '<TD unselectable="on" class="win-caption-label" atype="window.head" width="99%">', '<DIV unselectable="on" atype="window.title" unselectable="on">{title}</DIV>', "</TD>", '<TD unselectable="on" class="win-caption-button" noWrap>', '<DIV class="win-close" atype="window.close" unselectable="on"></DIV>', "</TD>", '<TD><DIV style="width:5px;"/></TD>', "</TR>", "</TBODY>", "</TABLE>", "</TD>", "</TR>", '<TR style="height:{height}px">', '<TD class="win-body" vAlign="top" unselectable="on">', '<DIV class="win-content" atype="window.body" style="position:relatvie;width:{bodywidth}px;height:{height}px;" unselectable="on"></DIV>', "</TD>", "</TR>", "</TBODY>", "</TABLE>"]
    },
    toFront: function() {
        var f = this.wrap.getStyle("z-index");
        var c = $A.WindowManager.getZindex();
        if (f == "auto") {
            f = 0
        }
        if (f < c) {
            this.wrap.setStyle("z-index", c + 5);
            this.shadow.setStyle("z-index", c + 4);
            if (this.modal) {
                $A.Cover.cover(this.wrap)
            }
        }
        var b = $A.WindowManager.getAll();
        for (var a = 0; a < b.length; a++) {
            var d = b[a];
            if (d != this) {
                var e = $A.Cover.container[d.wrap.id];
                if (e) {
                    e.setStyle({
                        filter: "alpha(opacity=0)",
                        opacity: "0",
                        mozopacity: "0"
                    })
                }
            }
        }
    },
    onMouseDown: function(c) {
        var a = this;
        a.toFront();
        var b = a.wrap.getXY();
        a.relativeX = b[0] - c.getPageX();
        a.relativeY = b[1] - c.getPageY();
        a.screenWidth = $A.getViewportWidth();
        a.screenHeight = $A.getViewportHeight();
        if (!this.proxy) {
            this.initProxy()
        }
        this.proxy.show();
        Ext.get(document.documentElement).on("mousemove", a.onMouseMove, a);
        Ext.get(document.documentElement).on("mouseup", a.onMouseUp, a)
    },
    onMouseUp: function(b) {
        var a = this;
        Ext.get(document.documentElement).un("mousemove", a.onMouseMove, a);
        Ext.get(document.documentElement).un("mouseup", a.onMouseUp, a);
        if (a.proxy) {
            a.wrap.moveTo(a.proxy.getX(), a.proxy.getY());
            a.shadow.moveTo(a.proxy.getX() + 3, a.proxy.getY() + 3);
            a.proxy.hide()
        }
    },
    onMouseMove: function(h) {
        h.stopEvent();
        var c = document[Ext.isStrict && !Ext.isWebKit ? "documentElement": "body"].scrollLeft;
        var f = document[Ext.isStrict && !Ext.isWebKit ? "documentElement": "body"].scrollTop;
        var b = c + this.screenWidth;
        var g = f + this.screenHeight;
        var d = h.getPageX() + this.relativeX;
        var a = h.getPageY() + this.relativeY;
        this.proxy.moveTo(d, a)
    },
    checkDataSetNotification: function() {
        var b = Aurora.checkNotification(this.cmps);
        if (b) {
            var a = this;
            $A.showConfirm(_lang["dataset.info"], b,
            function() {
                a.close(true)
            });
            return false
        }
        return true
    },
    showLoading: function() {
        this.body.update(_lang["window.loading"]);
        this.body.setStyle("text-align", "center");
        this.body.setStyle("line-height", 5)
    },
    clearLoading: function() {
        this.body.update("");
        this.body.setStyle("text-align", "");
        this.body.setStyle("line-height", "")
    },
    initProxy: function() {
        var a = this;
        var c = '<DIV style="border:1px dashed black;Z-INDEX: 10000; LEFT: 0px; WIDTH: 100%; CURSOR: move; POSITION: absolute; TOP: 0px; HEIGHT: 621px;-moz-user-select:none;" unselectable="on"  onselectstart="return false;"></DIV>';
        a.proxy = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), c));
        var b = a.wrap.getXY();
        a.proxy.setWidth(a.wrap.getWidth());
        a.proxy.setHeight(a.wrap.getHeight());
        a.proxy.setLocation(b[0], b[1])
    },
    onCloseClick: function(a) {
        a.stopEvent();
        this.close()
    },
    onCloseOver: function(a) {
        this.closeBtn.addClass("win-btn-over")
    },
    onCloseOut: function(a) {
        this.closeBtn.removeClass("win-btn-over")
    },
    onCloseDown: function(a) {
        this.closeBtn.removeClass("win-btn-over");
        this.closeBtn.addClass("win-btn-down");
        Ext.get(document.documentElement).on("mouseup", this.onCloseUp, this)
    },
    onCloseUp: function(a) {
        this.closeBtn.removeClass("win-btn-down");
        Ext.get(document.documentElement).un("mouseup", this.onCloseUp, this)
    },
    close: function(d) {
        if (!d && !this.checkDataSetNotification()) {
            return
        }
        if (this.fireEvent("beforeclose", this)) {
            if (this.wrap) {
                this.wrap.destroying = true
            }
            $A.WindowManager.remove(this);
            if (this.fullScreen) {
                Ext.fly(document.documentElement).setStyle({
                    overflow: this.overFlow
                })
            }
            this.destroy();
            this.fireEvent("close", this)
        }
        var c = $A.WindowManager.getAll();
        for (var b = 0; b < c.length - 1; b++) {
            var e = c[b];
            if (e != this) {
                var f = $A.Cover.container[e.wrap.id];
                if (f) {
                    f.setStyle({
                        filter: "alpha(opacity=0)",
                        opacity: "0",
                        mozopacity: "0"
                    })
                }
            }
        }
        var a = c[c.length - 1];
        if (a) {
            var f = $A.Cover.container[a.wrap.id];
            if (f) {
                f.setStyle({
                    opacity: "",
                    mozopacity: ""
                });
                f.dom.style.cssText = f.dom.style.cssText.replace(/filter[^;]*/i, "")
            }
        }
    },
    clearBody: function() {
        for (var a in this.cmps) {
            var b = this.cmps[a];
            if (b.destroy) {
                try {
                    b.destroy()
                } catch(c) {
                    alert("销毁window出错: " + c)
                }
            }
        }
    },
    destroy: function() {
        var a = this.wrap;
        if (!a) {
            return
        }
        if (this.proxy) {
            this.proxy.remove()
        }
        if (this.modal) {
            $A.Cover.uncover(this.wrap)
        }
        $A.Window.superclass.destroy.call(this);
        this.clearBody();
        delete this.title;
        delete this.head;
        delete this.body;
        delete this.closeBtn;
        delete this.proxy;
        a.remove();
        this.shadow.remove()
    },
    load: function(a, b) {
        this.clearBody();
        this.showLoading();
        Ext.Ajax.request({
            url: a,
            params: b || {},
            success: this.onLoad.createDelegate(this)
        })
    },
    setChildzindex: function(b) {
        for (var a in this.cmps) {
            var d = this.cmps[a];
            d.setZindex(b)
        }
    },
    setWidth: function(a) {
        a = $A.getViewportWidth();
        $A.Window.superclass.setWidth.call(this, a);
        this.body.setWidth(a - 2);
        this.shadow.setWidth(this.wrap.getWidth())
    },
    setHeight: function(c) {
        c = $A.getViewportHeight() - 26;
        Ext.fly(this.body.dom.parentNode.parentNode).setHeight(c);
        this.body.setHeight(c);
        this.shadow.setHeight(this.wrap.getHeight());
        var a = document[Ext.isStrict ? "documentElement": "body"].scrollLeft;
        var b = document[Ext.isStrict ? "documentElement": "body"].scrollTop;
        this.shadow.moveTo(a, b);
        this.wrap.moveTo(a, b)
    },
    onLoad: function(a, c) {
        if (!this.body) {
            return
        }
        this.clearLoading();
        var f = a.responseText;
        var d;
        try {
            d = Ext.decode(a.responseText)
        } catch(l) {}
        if (d && d.success == false) {
            if (d.error) {
                if (d.error.code && d.error.code == "session_expired" || d.error.code == "login_required") {
                    if ($A.manager.fireEvent("timeout", $A.manager)) {
                        $A.showErrorMessage(_lang["ajax.error"], _lang["session.expired"])
                    }
                } else {
                    $A.manager.fireEvent("ajaxfailed", $A.manager, c.url, c.para, d);
                    var b = d.error.stackTrace;
                    b = (b) ? b.replaceAll("\r\n", "</br>") : "";
                    if (d.error.message) {
                        var g = (b == "") ? 150 : 250;
                        $A.showErrorMessage(_lang["window.error"], d.error.message + "</br>" + b, null, 400, g)
                    } else {
                        $A.showErrorMessage(_lang["window.error"], b, null, 400, 250)
                    }
                }
            }
            return
        }
        var i = this;
        this.body.update(f, true,
        function() {
            i.fireEvent("load", i)
        },
        this.wrap)
    }
});
$A.showMessage = function(d, c, e, b, a) {
    return $A.showTypeMessage(d, c, b || 300, a || 100, "win-info", e)
};
$A.showWarningMessage = function(d, c, e, b, a) {
    return $A.showTypeMessage(d, c, b || 300, a || 100, "win-warning", e)
};
$A.showInfoMessage = function(d, c, e, b, a) {
    return $A.showTypeMessage(d, c, b || 300, a || 100, "win-info", e)
};
$A.showErrorMessage = function(d, c, e, b, a) {
    return $A.showTypeMessage(d, c, b || 300, a || 100, "win-error", e)
};
$A.showTypeMessage = function(e, d, c, a, b, f) {
    var d = '<div class="win-icon ' + b + '"><div class="win-type" style="width:' + (c - 70) + "px;height:" + (a - 62) + 'px;">' + d + "</div></div>";
    return $A.showOkWindow(e, d, c, a, f)
};
$A.showConfirm = function(f, e, c, d, b, a) {
    b = b || 300;
    a = a || 100;
    var e = '<div class="win-icon win-question"><div class="win-type" style="width:' + (b - 70) + "px;height:" + (a - 62) + 'px;">' + e + "</div></div>";
    return $A.showOkCancelWindow(f, e, c, d, b, a)
};
$A.showOkCancelWindow = function(m, e, c, f, d, n) {
    var b = Ext.id(),
    h = "aurora-msg-ok" + b,
    a = "aurora-msg-cancel" + b,
    i = $A.Button.getTemplate(h, _lang["window.button.ok"]),
    g = $A.Button.getTemplate(a, _lang["window.button.cancel"]),
    l = new $A.Window({
        id: "aurora-msg-ok-cancel" + b,
        closeable: true,
        title: m,
        height: n || 100,
        width: d || 300
    });
    if (!Ext.isEmpty(e, true)) {
        l.body.update(e + '<center><table cellspacing="5"><tr><td>' + i + "</td><td>" + g + "</td><tr></table></center>", true,
        function() {
            var p = $(h);
            var o = $(a);
            l.cmps[h] = p;
            l.cmps[a] = o;
            p.on("click",
            function() {
                if (c && c.call(this, l) === false) {
                    return
                }
                l.close()
            });
            o.on("click",
            function() {
                if (f && f.call(this, l) === false) {
                    return
                }
                l.close()
            })
        })
    }
    return l
};
$A.showYesNoCancelWindow = function(n, e, p, d, c, o) {
    var b = Ext.id(),
    f = "aurora-msg-yes" + b,
    l = "aurora-msg-no" + b,
    a = "aurora-msg-cancel" + b,
    i = $A.Button.getTemplate(f, _lang["window.button.yes"]),
    g = $A.Button.getTemplate(l, _lang["window.button.no"]),
    h = $A.Button.getTemplate(a, _lang["window.button.cancel"]),
    m = new $A.Window({
        id: "aurora-msg-yes-no-cancel" + b,
        closeable: true,
        title: n,
        height: o || 100,
        width: c || 300
    });
    if (!Ext.isEmpty(e, true)) {
        m.body.update(e + '<center><table cellspacing="5"><tr><td>' + i + "</td><td>" + g + "</td><td>" + h + "</td><tr></table></center>", true,
        function() {
            var s = $(f),
            r = $(l),
            q = $(a);
            m.cmps[f] = s;
            m.cmps[l] = r;
            m.cmps[a] = q;
            s.on("click",
            function() {
                if (p && p.call(this, m) === false) {
                    return
                }
                m.close()
            });
            r.on("click",
            function() {
                if (d && d.call(this, m) === false) {
                    return
                }
                m.close()
            });
            q.on("click",
            function() {
                m.close()
            })
        })
    }
    return m
};
$A.showOkWindow = function(f, c, b, i, h) {
    var a = Ext.id(),
    d = "aurora-msg-yes" + a,
    g = $A.Button.getTemplate(d, _lang["window.button.ok"]),
    e = new $A.Window({
        id: "aurora-msg-ok" + a,
        closeable: true,
        title: f,
        height: i,
        width: b
    });
    if (!Ext.isEmpty(c, true)) {
        e.body.update(c + "<center>" + g + "</center>", true,
        function() {
            var l = $(d);
            e.cmps[d] = l;
            l.on("click",
            function() {
                if (h && h.call(this, e) === false) {
                    return
                }
                e.close()
            });
            l.focus.defer(10, l)
        })
    }
    return e
};
$A.showUploadWindow = function(d, f, b, e, c, a, g) {
    new Aurora.Window({
        id: "upload_window",
        url: d + "/upload.screen?callback=" + g + "&pkvalue=" + e + "&source_type=" + b + "&max_size=" + (c || 0) + "&file_type=" + (a || "*.*"),
        title: f || _lang["window.upload.title"],
        height: 330,
        width: 595
    })
}; (function(c) {
    var h = "",
    m = "tr[tabindex]",
    l = "width",
    e = "px",
    a = "autocomplete-selected",
    i = "click",
    o = "mousemove",
    b = "beforecommit",
    d = "commit",
    f = "beforetriggerclick",
    n = "fetching",
    g = "fetched";
    c.Lov = Ext.extend(c.TextField, {
        constructor: function(p) {
            var q = this;
            q.isWinOpen = false;
            q.fetching = false;
            q.fetchremote = true;
            q.maxHeight = 240;
            c.Lov.superclass.constructor.call(q, p)
        },
        initComponent: function(p) {
            var q = this;
            c.Lov.superclass.initComponent.call(this, p);
            q.trigger = q.wrap.child("div[atype=triggerfield.trigger]")
        },
        processParmater: function(q) {
            var p = q.indexOf("?");
            if (p != -1) {
                this.para = Ext.urlDecode(q.substring(p + 1, q.length));
                return q.substring(0, p)
            }
            return q
        },
        processListener: function(q) {
            var r = this,
            p = r.autocompleteview;
            c.Lov.superclass.processListener.call(r, q);
            r.trigger[q]("mousedown", r.onWrapFocus, r, {
                preventDefault: true
            })[q](i, r.onTriggerClick, r, {
                preventDefault: true
            })
        },
        initEvents: function() {
            c.Lov.superclass.initEvents.call(this);
            this.addEvents(b, d, f, n, g)
        },
        onWrapFocus: function(r, p) {
            var q = this;
            r.stopEvent();
            q.focus.defer(Ext.isIE ? 1 : 0, q)
        },
        onTriggerClick: function(r) {
            r.stopEvent();
            var q = this,
            p = q.autocompleteview;
            if (q.fireEvent(f, q)) {
                q.showLovWindow()
            }
        },
        destroy: function() {
            var p = this;
            if (p.qtId) {
                Ext.Ajax.abort(p.qtId)
            }
            c.Lov.superclass.destroy.call(p)
        },
        clearBind: function() {
            var p = this;
            c.Lov.superclass.clearBind.call(p);
            p.lovurl = null;
            p.service = null;
            p.autocompleteservice = null;
            p.lovservice = null;
            p.lovmodel = null
        },
        setWidth: function(p) {
            this.wrap.setStyle(l, (p + 3) + e)
        },
        onBlur: function() {
            var q = this,
            p = q.autocompleteview;
            if (!p || !p.isShow) {
                $A.Lov.superclass.onBlur.call(q)
            }
        },
        onChange: function(r) {
            var q = this,
            p = q.autocompleteview;
            c.Lov.superclass.onChange.call(q);
            if (!p || !p.isShow) {
                q.fetchRecord()
            }
        },
        onKeyDown: function(s) {
            if (this.isWinOpen) {
                return
            }
            var q = this,
            r = s.keyCode,
            p = q.autocompleteview;
            if (!p || !p.isShow) {
                if (!s.ctrlKey && r == 40) {
                    s.stopEvent();
                    q.showLovWindow()
                }
                c.Lov.superclass.onKeyDown.call(q, s)
            }
        },
        onViewSelect: function(q) {
            var p = this;
            if (!q) {
                if (p.autocompleteview.isLoaded) {
                    p.fetchRecord()
                }
            } else {
                p.setValue("");
                p.commit(q)
            }
            p.focus()
        },
        createListView: function(p, r, w) {
            var x = ['<table class="autocomplete" cellspacing="0" cellpadding="2">'],
            t = r.ds.getField(r.name).getPropertity("displayFields");
            if (t && t.length) {
                x.push('<tr tabIndex="-2" class="autocomplete-head">');
                Ext.each(t,
                function(z) {
                    x.push("<td>", z.prompt, "</td>")
                });
                x.push("</tr>")
            }
            for (var s = 0,
            q = p.length; s < q; s++) {
                var u = p[s];
                x.push('<tr tabIndex="', s, '"', s % 2 == 1 ? ' class="autocomplete-row-alt"': h, ">", this.getRenderText(w ? u: new $A.Record(u), t), "</tr>")
            }
            x.push("</table>");
            return x
        },
        getRenderText: function(p, q) {
            var t = this,
            s = c.getRenderer(t.autocompleterenderer),
            u = [],
            r = function(x) {
                var w = p.get(x);
                u.push("<td>", Ext.isEmpty(w) ? "&#160;": w, "</td>")
            };
            if (s) {
                u.push(s(t, p))
            } else {
                if (q) {
                    Ext.each(q,
                    function(w) {
                        r(w.name)
                    })
                } else {
                    r(t.autocompletefield)
                }
            }
            return u.join(h)
        },
        canHide: function() {
            return this.isWinOpen == false
        },
        commit: function(u, q, s) {
            var t = this,
            p = q || t.record;
            if (t.fireEvent(b, t, p, u) !== false) {
                if (t.win) {
                    t.win.close()
                }
                if (p && u) {
                    Ext.each(s || t.getMapping(),
                    function(r) {
                        var w = u.get(r.from);
                        p.set(r.to, Ext.isEmpty(w) ? h: w)
                    })
                }
                t.fireEvent(d, t, p, u)
            }
        },
        onWinClose: function() {
            var p = this;
            p.isWinOpen = false;
            p.win = null;
            if (!Ext.isIE6 && !Ext.isIE7) {
                p.focus()
            } else { (function() {
                    p.focus()
                }).defer(10)
            }
        },
        getLovPara: function() {
            return this.getPara()
        },
        fetchRecord: function() {
            var w = this;
            if (w.readonly == true || !w.fetchremote) {
                return
            }
            w.fetching = true;
            var z = w.getRawValue(),
            s,
            x = w.service,
            r = w.getMapping(),
            u = w.record,
            t = {},
            A = w.binder,
            q = c.SideBar,
            B = w.autocompletefield;
            if (!Ext.isEmpty(z) && w.fuzzyfetch) {
                z += "%"
            }
            if (!Ext.isEmpty(x)) {
                s = Ext.urlAppend(w.context + "autocrud/" + x + "/query?pagenum=1&_fetchall=false&_autocount=false", Ext.urlEncode(w.getLovPara()))
            }
            if (u == null && A) {
                u = A.ds.create({},
                false)
            }
            u.isReady = false;
            if (B) {
                t[B] = z;
                Ext.each(r,
                function(p) {
                    u.set(p.to, h)
                })
            } else {
                Ext.each(r,
                function(p) {
                    if (A.name == p.to) {
                        t[p.from] = z
                    }
                    u.set(p.to, h)
                })
            }
            c.slideBarEnable = q.enable;
            q.enable = false;
            if (Ext.isEmpty(z) || Ext.isEmpty(x)) {
                w.fetching = false;
                u.isReady = true;
                q.enable = c.slideBarEnable;
                return
            }
            $A.Masker.mask(w.wrap, _lang["lov.query"]);
            w.fireEvent(n, w);
            w.qtId = c.request({
                url: s,
                para: t,
                success: function(D) {
                    var F = new c.Record({});
                    if (D.result.record) {
                        var p = [].concat(D.result.record),
                        C = p.length;
                        if (C > 0) {
                            if (w.fetchsingle && C > 1) {
                                var I = w.createListView(p, A).join(h),
                                H = new Ext.Template('<div style="position:absolute;left:0;top:0">{sb}</div>').append(document.body, {
                                    sb: I
                                },
                                true),
                                G = w.wrap.getXY(),
                                E = w.fetchSingleWindow = new c.Window({
                                    id: w.id + "_fetchmulti",
                                    closeable: true,
                                    title: "请选择",
                                    height: Math.min(H.getHeight(), w.maxHeight),
                                    width: Math.max(H.getWidth(), 200),
                                    x: G[0],
                                    y: G[1] + w.wrap.getHeight()
                                });
                                H.remove();
                                E.on("close",
                                function() {
                                    w.focus()
                                });
                                E.body.update(I).on(o, w.onViewMove, w).on("dblclick",
                                function(M, L) {
                                    L = Ext.fly(L).parent(m);
                                    var K = L.dom.tabIndex;
                                    if (K < -1) {
                                        return
                                    }
                                    var J = new c.Record(p[K]);
                                    w.commit(J, u, r);
                                    E.close()
                                }).child("table").setWidth("100%")
                            } else {
                                F = new c.Record(p[0])
                            }
                        }
                    }
                    w.fetching = false;
                    $A.Masker.unmask(w.wrap);
                    w.commit(F, u, r);
                    u.isReady = true;
                    q.enable = c.slideBarEnable;
                    w.fireEvent(g, w)
                },
                error: w.onFetchFailed,
                scope: w
            })
        },
        onViewMove: function(q, p) {
            this.selectItem((Ext.fly(p).findParent(m) || p).tabIndex)
        },
        selectItem: function(q) {
            if (Ext.isEmpty(q) || q < -1) {
                return
            }
            var s = this,
            r = s.getNode(q),
            p = s.selectedIndex;
            if (r && r.tabIndex != p) {
                if (!Ext.isEmpty(p)) {
                    Ext.fly(s.getNode(p)).removeClass(a)
                }
                s.selectedIndex = r.tabIndex;
                Ext.fly(r).addClass(a)
            }
        },
        getNode: function(r) {
            var q = this.fetchSingleWindow.body.query("tr[tabindex!=-2]"),
            p = q.length;
            if (r >= p) {
                r = r % p
            } else {
                if (r < 0) {
                    r = p + r % p
                }
            }
            return q[r]
        },
        onFetchFailed: function(p) {
            var q = this;
            q.fetching = false;
            c.SideBar.enable = c.slideBarEnable;
            q.fireEvent(g, q)
        },
        showLovWindow: function() {
            var x = this;
            if (x.fetching || x.isWinOpen || x.readonly) {
                return
            }
            var s = x.getRawValue(),
            p = x.lovurl,
            u = x.service,
            r = x.context,
            q = x.lovwidth || 400,
            t;
            x.blur();
            if (!Ext.isEmpty(p)) {
                t = Ext.urlAppend(p, Ext.urlEncode(x.getFieldPara()))
            } else {
                if (!Ext.isEmpty(u)) {
                    t = r + "sys_lov.screen?url=" + encodeURIComponent(Ext.urlAppend(r + "autocrud/" + u + "/query", Ext.urlEncode(x.getLovPara()))) + "&service=" + u
                }
            }
            if (t) {
                x.isWinOpen = true;
                x.win = new c.Window({
                    title: x.title || "Lov",
                    url: Ext.urlAppend(t, "lovid=" + x.id + "&key=" + encodeURIComponent(s) + "&gridheight=" + (x.lovgridheight || 350) + "&innerwidth=" + (q - 30) + "&lovautoquery=" + (Ext.isEmpty(x.lovautoquery) ? "true": x.lovautoquery) + "&lovlabelwidth=" + (x.lovlabelwidth || 75) + "&lovpagesize=" + (x.lovpagesize || "")),
                    height: x.lovheight || 400,
                    width: q
                });
                x.win.on("close", x.onWinClose, x)
            }
        },
        isEventFromComponent: function(q) {
            var p = this.autocompleteview;
            return $A.Lov.superclass.isEventFromComponent.call(this, q) || (p && p.wrap.contains(q))
        }
    })
})($A);
$A.MultiLov = Ext.extend($A.Lov, {
    constructor: function(a) {
        this.quote = "'";
        this.localvalues = [];
        $A.MultiLov.superclass.constructor.call(this, a)
    },
    processListener: function(a) {
        $A.MultiLov.superclass.processListener.call(this, a);
        this.el[a]("click", this.onClick, this)
    },
    initEvents: function() {
        $A.MultiLov.superclass.initEvents.call(this)
    },
    onChange: function(a) {},
    onClick: function(f) {
        var h = this.getCursortPosition();
        var d = this.getRawValue();
        var c = d.split(";");
        var g = 0;
        for (var b = 0; b < c.length; b++) {
            var a = g + c[b].length + 1;
            if (h > g && h < a) {
                if (this.start != g || this.end != a) {
                    this.select(g, a);
                    if (Ext.isGecko || Ext.isOpera) {
                        this.start = g;
                        this.end = a
                    }
                } else {
                    this.start = this.end = 0
                }
                break
            } else {
                g += c[b].length + 1
            }
        }
    },
    commit: function(f, d) {
        if (this.win) {
            this.win.close()
        }
        var a = d ? d: this.record,
        c = f.getAll(),
        g = "";
        if (a) {
            this.optionDataSet = f;
            for (var e = 0; e < c.length; e++) {
                if (c[e].get(this.valuefield)) {
                    var b = c[e].get(this.valuefield);
                    g += this.quote + b + this.quote;
                    if (e != c.length - 1) {
                        g += ","
                    }
                }
            }
            a.set(this.binder.name, g)
        }
        this.fireEvent("commit", this, a, c)
    },
    getCursortPosition: function() {
        var b = 0;
        if (document.selection) {
            this.el.focus();
            var a = document.selection.createRange();
            a.moveStart("character", -this.el.dom.value.length);
            b = a.text.length
        } else {
            if (this.el.dom.selectionStart || this.el.dom.selectionStart == "0") {
                b = this.el.dom.selectionStart
            }
        }
        return b
    },
    processValue: function(d) {
        this.localvalues = [];
        if (!d) {
            return ""
        }
        var c = d.split(";"),
        g = "",
        b = [];
        for (var e = 0; e < c.length; e++) {
            var f = c[e].trim();
            if (f || f == "0") {
                var a = this.getRecordByDisplay(f);
                if (a) {
                    f = a.get(this.valuefield);
                    b.add(a)
                } else {
                    this.localvalues.add(f)
                }
                g += this.quote + f + this.quote + ","
            }
        }
        if (this.optionDataSet) {
            this.optionDataSet.removeAll()
        }
        for (var e = 0; e < b.length; e++) {
            this.optionDataSet.add(b[e])
        }
        return g.match(/,$/) ? g.slice(0, g.length - 1) : g
    },
    getRecordByDisplay: function(b) {
        if (!this.optionDataSet) {
            return null
        }
        var a = this.optionDataSet.getAll();
        for (var c = 0; c < a.length; c++) {
            var e = a[c].get(this.displayfield);
            if (e == b) {
                return a[c]
            }
        }
        return null
    },
    formatValue: function(b) {
        var d = "";
        if (this.optionDataSet) {
            var a = this.optionDataSet.getAll();
            for (var c = 0; c < a.length; c++) {
                d += a[c].get(this.displayfield) + ";"
            }
        }
        for (var c = 0; c < this.localvalues.length; c++) {
            d += this.localvalues[c] + ";"
        }
        return d
    },
    showLovWindow: function() {
        if (this.fetching || this.isWinOpen || this.readonly) {
            return
        }
        var a = this.getRawValue();
        this.blur();
        var b;
        if (!Ext.isEmpty(this.lovurl)) {
            b = this.lovurl + "?" + Ext.urlEncode(this.getLovPara()) + "&"
        } else {
            if (!Ext.isEmpty(this.lovservice)) {
                b = this.context + "sys_multiLov.screen?url=" + encodeURIComponent(this.context + "sys_lov.svc?svc=" + this.lovservice + "&" + Ext.urlEncode(this.getLovPara())) + "&service=" + this.lovservice + "&"
            } else {
                if (!Ext.isEmpty(this.lovmodel)) {
                    b = this.context + "sys_multiLov.screen?url=" + encodeURIComponent(this.context + "autocrud/" + this.lovmodel + "/query?" + Ext.urlEncode(this.getLovPara())) + "&service=" + this.lovmodel + "&"
                }
            }
        }
        if (b) {
            this.isWinOpen = true;
            this.win = new $A.Window({
                title: this.title || "Lov",
                url: b + "lovid=" + this.id + "&key=" + encodeURIComponent(a) + "&gridheight=" + (this.lovgridheight || 350) + "&innerwidth=" + ((this.lovwidth || 400) - 30) + "&innergridwidth=" + Math.round(((this.lovwidth || 400) - 90) / 2) + "&lovautoquery=" + this.lovautoquery + "&lovlabelwidth=" + this.lovlabelwidth,
                height: this.lovheight || 400,
                width: this.lovwidth || 400
            });
            this.win.on("close", this.onWinClose, this)
        }
    },
    destroy: function() {
        $A.Lov.superclass.destroy.call(this)
    }
});
$A.TextArea = Ext.extend($A.Field, {
    constructor: function(a) {
        $A.TextArea.superclass.constructor.call(this, a)
    },
    initComponent: function(a) {
        $A.TextArea.superclass.initComponent.call(this, a)
    },
    initEvents: function() {
        $A.TextArea.superclass.initEvents.call(this)
    },
    initElements: function() {
        this.el = this.wrap
    },
    onKeyDown: function(a) {}
});
$A.Customization = Ext.extend(Ext.util.Observable, {
    constructor: function(a) {
        $A.Customization.superclass.constructor.call(this);
        this.id = a.id || Ext.id();
        $A.CmpManager.put(this.id, this);
        this.initConfig = a
    },
    start: function(a) {
        var b = this;
        this.scanInterval = setInterval(function() {
            var c = $A.CmpManager.getAll();
            for (var d in c) {
                var e = c[d];
                if (e.iscust == true) {
                    e.on("mouseover", b.onCmpOver, b)
                }
            }
        },
        500)
    },
    mask: function(c) {
        var a = c.getWidth();
        var b = c.getHeight();
        var e = '<div title="点击设置个性化" style="border:2px solid #000;cursor:pointer;left:-10000px;top:-10000px;width:' + (a) + "px;height:" + (b) + 'px;position: absolute;"><div style="width:100%;height:100%;filter: alpha(opacity=0);opacity: 0;mozopacity: 0;background-color:#ffffff;"> </div></div>';
        this.masker = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), e));
        this.masker.setStyle("z-index", 10001);
        var d = c.getXY();
        this.masker.setX(d[0] - 2);
        this.masker.setY(d[1] - 2);
        this.masker.on("click", this.onClick, this);
        this.cover.on("mouseover", this.onCmpOut, this)
    },
    onClick: function() {
        var g = window.location.pathname;
        var h = g.indexOf("modules");
        var d = g.substring(h, g.length);
        var c = d.substring(d.lastIndexOf("/") + 1, d.length);
        var b = g.substring(0, h);
        var f = this.el.parent("[url]");
        if (f) {
            var e = f.getAttributeNS("", "url");
            if (e) {
                e = e.split("?")[0];
                if (e.indexOf(b) == -1) {
                    var a = e.lastIndexOf("/");
                    if (a != -1) {
                        e = e.substring(a + 1, e.length)
                    }
                    d = d.replaceAll(c, e)
                } else {
                    d = e.substring(e.indexOf(b) + new String(b).length, e.length)
                }
            }
        }
        new Aurora.Window({
            id: "sys_customization_window",
            url: b + "modules/sys/sys_customization_window.screen?screen_path=" + d + "&id=" + this.cmp.id,
            title: "个性化设置",
            height: 170,
            width: 400
        });
        this.onCmpOut()
    },
    hideMask: function() {
        if (this.masker) {
            Ext.fly(this.masker).remove();
            this.masker = null
        }
    },
    showCover: function() {
        var b = Ext.isStrict ? document.documentElement.scrollWidth: document.body.scrollWidth;
        var c = Ext.isStrict ? document.documentElement.scrollHeight: document.body.scrollHeight;
        var d = Math.max(b, Aurora.getViewportWidth());
        var f = Math.max(c, Aurora.getViewportHeight());
        var a = (Ext.isIE6 ? "position:absolute;width:" + (d - 1) + "px;height:" + (f - 1) + "px;": "");
        var e = '<DIV class="aurora-cover" style="' + a + 'filter: alpha(opacity=0);background-color: #fff;opacity: 0;mozopacity: 0;" unselectable="on"></DIV>';
        this.cover = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(), e));
        this.cover.setStyle("z-index", 9999)
    },
    hideCover: function() {
        if (this.cover) {
            this.cover.un("mouseover", this.onCmpOut, this);
            Ext.fly(this.cover).remove();
            this.cover = null
        }
    },
    getEl: function(b) {
        var a;
        if (Aurora.Grid && b instanceof Aurora.Grid) {
            a = b.wb
        } else {
            a = b.wrap
        }
        return a
    },
    onCmpOver: function(a, b) {
        if (this.isInSpotlight) {
            return
        }
        this.isInSpotlight = true;
        this.showCover();
        this.cmp = a;
        this.el = this.getEl(a);
        if (this.el) {
            this.currentZIndex = this.el.getStyle("z-index");
            this.el.setStyle("z-index", 10000)
        }
        this.mask(this.el)
    },
    onCmpOut: function(a) {
        this.isInSpotlight = false;
        if (this.el) {
            this.el.setStyle("z-index", this.currentZIndex);
            this.el = null
        }
        this.hideMask();
        this.hideCover();
        this.cmp = null
    },
    stop: function() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval)
        }
        this.onCmpOut();
        var a = $A.CmpManager.getAll();
        for (var b in a) {
            var c = a[b];
            if (c.iscust == true) {
                c.un("mouseover", this.onCmpOver, this)
            }
        }
    }
});
$A.QueryForm = Ext.extend($A.Component, {
    initComponent: function(a) {
        $A.QueryForm.superclass.initComponent.call(this, a);
        var c = this,
        b = c.bodyWrap = c.wrap.child(".form_body_wrap");
        if (b) {
            c.body = b.first();
            c.hasbody = true;
            if (!c.isopen) {
                c.body.hide()
            }
        }
        c.searchInput = $A.CmpManager.get(c.id + "_query");
        c.rds = $A.CmpManager.get(c.resulttarget)
    },
    processListener: function(a) {
        $A.QueryForm.superclass.processListener.call(this, a);
        Ext.fly(document)[a]("click", this.formBlur, this)
    },
    formBlur: function(b, a) {
        if (!this.isEventFromComponent(a)) {
            this.close()
        }
    },
    bind: function(a) {
        if (Ext.isString(a)) {
            a = $(a)
        }
        this.qds = a
    },
    doSearch: function() {
        var d = this,
        a = d.searchInput,
        b = d.queryhook,
        f = d.queryfield;
        if (d.rds) {
            if (!d.isopen && a) {
                var e = a.getValue(),
                c = d.qds;
                if (b) {
                    b(e, c)
                } else {
                    if (f) {
                        if (c.getCurrentRecord()) {
                            c.getCurrentRecord().set(f, e)
                        }
                    }
                }
            }
            d.rds.query();
            d.close()
        }
    },
    open: function() {
        var b = this,
        a = b.body;
        if (b.isopen && b.hasbody) {
            return
        }
        b.isopen = true;
        b.bodyWrap.parent("TBODY").setStyle("display", "block");
        if (b.isopen) {
            a.show()
        }
        b.bodyWrap.setHeight(a.getHeight() + 10);
        b.bodyWrap.fadeIn()
    },
    close: function() {
        var a = this;
        if (a.isopen && a.hasbody) {
            a.isopen = false;
            a.body.hide();
            a.bodyWrap.parent("TBODY").setStyle("display", "none");
            a.bodyWrap.setHeight(0, true)
        }
    },
    trigger: function() {
        this[this.isopen ? "close": "open"]()
    },
    reset: function() {
        if (this.searchInput) {
            this.searchInput.setValue("")
        }
        this.qds.reset()
    }
}); (function(d) {
    var b = /[^\x00-\xff]/g,
    g = "",
    h = "tr[tabindex]",
    c = "div.item-receiver-info",
    f = ";",
    a = "autocomplete-selected",
    i = "mousemove",
    e = "commit";
    d.MultiTextField = Ext.extend(d.TextField, {
        infoTpl: ['<div class="item-receiver-info" _data="{data}"><span class="item-receiver-info-name">{text}</span>', '<a class="item-receiver-info-close" href="#" onclick="return false;" hideFocus tabIndex="-1"></a>', "</div>"],
        processListener: function(l) {
            var m = this;
            d.MultiTextField.superclass.processListener.call(m, l);
            m.wrap[l]("mousedown", m.onWrapFocus, m, {
                preventDefault: true
            })[l]("mouseup", m.onWrapClick, m)
        },
        initEvents: function() {
            d.Lov.superclass.initEvents.call(this);
            this.addEvents(e)
        },
        onWrapClick: function(m, l) {
            l = Ext.fly(l);
            if (l.hasClass("item-receiver-info-close")) {
                this.removeItem(l.parent(c))
            }
        },
        onWrapFocus: function(n, l) {
            var m = this;
            n.stopEvent();
            if (Ext.isIE && l !== m.el.dom) {
                m.hasFocus = false
            }
            m.focus.defer(Ext.isIE ? 1 : 0, m)
        },
        onBlur: function() {
            var m = this,
            l = m.autocompleteview;
            if (m.hasFocus) {
                if (Ext.isIE && m.hasChange) {
                    m.fetchRecord();
                    m.hasChange = false
                } else {
                    if (!m.fetching && (!l || !l.isShow)) {
                        d.MultiTextField.superclass.onBlur.call(m)
                    }
                }
                m.hasFocus = false;
                m.wrap.removeClass(m.focusCss)
            }
        },
        onChange: function() {
            var m = this,
            n = m.getRawValue(),
            l = m.autocompleteview;
            d.MultiTextField.superclass.onChange.call(m);
            if (!l || !l.isShow) {
                if (m.hasFocus) {
                    m.fetchRecord()
                } else {
                    if (Ext.isIE) {
                        m.hasChange = true
                    }
                }
            }
        },
        processValue: function(m) {
            var n = this.binder.name,
            l = [];
            Ext.each(this.items,
            function(o) {
                l.push(o[n])
            });
            return l.join(f)
        },
        formatValue: function(m) {
            var p = this,
            m, o = p.record,
            l = p.binder,
            n, q = [];
            p.clearAllItems();
            if (o && !Ext.isEmpty(m = o.get(n = p.binder.name))) {
                Ext.each(p.getMapping(),
                function(s) {
                    var t = s.to,
                    r = String(o.get(t));
                    if (n != t) {
                        q.push({
                            name: t,
                            values: Ext.isEmpty(r) ? [] : r.split(f)
                        })
                    }
                });
                Ext.each(m.split(f),
                function(s, r) {
                    var t = {};
                    Ext.each(q,
                    function(u) {
                        t[u.name] = u.values[r]
                    });
                    t[n] = s;
                    p.items.push(t);
                    p.addItem(d.MultiTextField.superclass.formatValue.call(p, s)).item = t
                })
            }
            return g
        },
        onKeyDown: function(o) {
            var m = this,
            n = m.getRawValue(),
            l = m.getValueLength(n);
            if (o.keyCode === 8) {
                if (n === g) {
                    m.removeItem(m.el.prev())
                } else {
                    m.setSize(l - 1)
                }
            } else {
                if (o.keyCode === 186) {
                    m.fetchRecord();
                    o.stopEvent()
                } else {
                    m.setSize(l + 1)
                }
            }
            d.MultiTextField.superclass.onKeyDown.call(m, o)
        },
        getValueLength: function(o) {
            var p = 0,
            m = 0,
            n = d.defaultChineseLength;
            for (; m < o.length; m++) {
                var l = o.charAt(m).match(b);
                p += l != null && l.length > 0 ? n: 1
            }
            return p
        },
        onKeyUp: function() {
            this.setSize(this.getValueLength(this.getRawValue()))
        },
        onViewSelect: function(m) {
            var l = this;
            if (!m) {
                if (l.autocompleteview.isLoaded) {
                    l.fetchRecord()
                }
            } else {
                l.commit(m)
            }
            l.focus()
        },
        commit: function(q, m, o) {
            var p = this,
            l = m || p.record,
            n = p.binder.name,
            s = {};
            if (l && q) {
                Ext.each(o || p.getMapping(),
                function(t) {
                    var u = q.get(t.from),
                    r = l.get(t.to);
                    if (!Ext.isEmpty(u)) {
                        s[t.to] = u;
                        if (!Ext.isEmpty(r)) {
                            u = r + f + u
                        }
                    } else {
                        u = r
                    }
                    l.set(t.to, u)
                })
            }
            p.fireEvent(e, p, l, q)
        },
        setSize: function(l) {
            this.el.set({
                size: l || 1
            })
        },
        addItem: function(o, l) {
            if (o) {
                var n = this,
                m = n.infoTpl;
                n.setSize(1);
                return new Ext.Template(l ? m[0] + m[2] : m).insertBefore(n.el, {
                    text: o,
                    data: o
                },
                true)
            }
        },
        removeItem: function(l) {
            if (l) {
                var n = this,
                m = n.record;
                Ext.each(n.getMapping(),
                function(p) {
                    var o = [];
                    Ext.each(n.items.remove(l.item),
                    function(q) {
                        o.push(q[p.to])
                    });
                    m.set(p.to, o.join(f))
                })
            }
        },
        clearAllItems: function() {
            this.items = [];
            this.wrap.select(c).remove()
        },
        fetchRecord: function() {
            if (this.readonly) {
                return
            }
            var t = this,
            x = t.getRawValue(),
            s = t.record,
            z = t.binder,
            n = z.name;
            t.fetching = true;
            if (t.fetchremote) {
                var o, u = t.service,
                m = t.getMapping(),
                q = {},
                l = d.SideBar,
                A = t.autocompletefield;
                if (!Ext.isEmpty(u)) {
                    o = Ext.urlAppend(t.context + "autocrud/" + u + "/query?pagenum=1&_fetchall=false&_autocount=false", Ext.urlEncode(t.getPara()))
                }
                if (s == null && z) {
                    s = z.ds.create({},
                    false)
                }
                s.isReady = false;
                if (A) {
                    q[A] = x
                } else {
                    Ext.each(m,
                    function(p) {
                        if (n == p.to) {
                            q[p.from] = x
                        }
                    })
                }
                d.slideBarEnable = l.enable;
                l.enable = false;
                if (Ext.isEmpty(x) || Ext.isEmpty(u)) {
                    t.fetching = false;
                    s.isReady = true;
                    l.enable = d.slideBarEnable;
                    return
                }
                t.setRawValue(g);
                var r = t.addItem(_lang["lov.query"], true);
                t.qtId = d.request({
                    url: o,
                    para: q,
                    success: function(C) {
                        var E = new d.Record({});
                        if (C.result.record) {
                            var p = [].concat(C.result.record),
                            B = p.length;
                            if (B > 0) {
                                if (t.fetchsingle && B > 1) {
                                    var G = t.createListView(p, z).join(g),
                                    F = new Ext.Template('<div style="position:absolute;left:0;top:0">{sb}</div>').append(document.body, {
                                        sb: G
                                    },
                                    true),
                                    D = t.fetchSingleWindow = new d.Window({
                                        id: t.id + "_fetchmulti",
                                        closeable: true,
                                        title: "请选择",
                                        height: Math.min(F.getHeight(), t.maxHeight),
                                        width: Math.max(F.getWidth(), 200)
                                    });
                                    F.remove();
                                    D.body.update(G).on(i, t.onViewMove, t).on("dblclick",
                                    function(K, J) {
                                        J = Ext.fly(J).parent(h);
                                        var I = J.dom.tabIndex;
                                        if (I < -1) {
                                            return
                                        }
                                        var H = new d.Record(p[I]);
                                        t.commit(H, s, m);
                                        D.close()
                                    }).child("table").setWidth("100%")
                                } else {
                                    E = new d.Record(p[0])
                                }
                            }
                        }
                        t.fetching = false;
                        r.remove();
                        t.commit(E, s, m);
                        s.isReady = true;
                        l.enable = d.slideBarEnable
                    },
                    error: t.onFetchFailed,
                    scope: t
                })
            } else {
                var w = s.get(n);
                s.set(n, Ext.isEmpty(w) ? x: w + f + x)
            }
        },
        createListView: function(m, o, s) {
            var t = ['<table class="autocomplete" cellspacing="0" cellpadding="2">'],
            q = o.ds.getField(o.name).getPropertity("displayFields");
            if (q && q.length) {
                t.push('<tr tabIndex="-2" class="autocomplete-head">');
                Ext.each(q,
                function(l) {
                    t.push("<td>", l.prompt, "</td>")
                });
                t.push("</tr>")
            }
            for (var p = 0,
            n = m.length; p < n; p++) {
                var r = m[p];
                t.push('<tr tabIndex="', p, '"', p % 2 == 1 ? ' class="autocomplete-row-alt"': g, ">", this.getRenderText(s ? r: new d.Record(r), q), "</tr>")
            }
            t.push("</table>");
            return t
        },
        getRenderText: function(l, m) {
            var p = this,
            o = d.getRenderer(p.autocompleterenderer),
            q = [],
            n = function(s) {
                var r = l.get(s);
                q.push("<td>", Ext.isEmpty(r) ? "&#160;": r, "</td>")
            };
            if (o) {
                q.push(o(p, l))
            } else {
                if (m) {
                    Ext.each(m,
                    function(r) {
                        n(r.name)
                    })
                } else {
                    n(p.autocompletefield)
                }
            }
            return q.join(g)
        },
        onViewMove: function(m, l) {
            this.selectItem((Ext.fly(l).findParent(h) || l).tabIndex)
        },
        selectItem: function(m) {
            if (Ext.isEmpty(m) || m < -1) {
                return
            }
            var o = this,
            n = o.getNode(m),
            l = o.selectedIndex;
            if (n && n.tabIndex != l) {
                if (!Ext.isEmpty(l)) {
                    Ext.fly(o.getNode(l)).removeClass(a)
                }
                o.selectedIndex = n.tabIndex;
                Ext.fly(n).addClass(a)
            }
        },
        getNode: function(o) {
            var n = this.fetchSingleWindow.body.query("tr[tabindex!=-2]"),
            m = n.length;
            if (o >= m) {
                o = o % m
            } else {
                if (o < 0) {
                    o = m + o % m
                }
            }
            return n[o]
        },
        select: function() {}
    })
})($A);
$A.PercentField = Ext.extend($A.NumberField, {
    formatValue: function(a) {
        if (Ext.isEmpty(a)) {
            return ""
        }
        return $A.PercentField.superclass.formatValue.call(this, $A.FixMath.mul(a, 100))
    },
    processValue: function(a) {
        if (Ext.isEmpty(a)) {
            return ""
        }
        return $A.FixMath.div($A.PercentField.superclass.processValue.call(this, a), 100)
    }
});