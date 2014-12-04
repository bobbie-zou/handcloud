(function(aC) {
	var aE = document,
	a5 = aE.documentElement,
	ai = Ext.each,
	ak = Ext.isEmpty,
	L = false,
	ag = true,
	az = null,
	a1 = aC.CheckBox,
	ah = "_",
	k = "__",
	w = ".",
	r = " ",
	x = "",
	E = "]",
	aA = "-c",
	ap = "-u",
	aM = "$l-",
	aG = "$u-",
	aN = "on",
	ao = "px",
	a2 = "tr",
	a = "td",
	a7 = "th",
	b = "_tb",
	ar = "div",
	n = "top",
	c = "left",
	am = "none",
	T = "width",
	O = "center",
	av = "hidden",
	aQ = "cursor",
	aq = "",
	aB = "default",
	aa = "w-resize",
	g = "outline",
	aR = "1px dotted blue",
	aS = "atype",
	e = "append",
	aL = "insertBefore",
	aX = "insertAfter",
	f = "before",
	l = "_navbar",
	aZ = "text-overflow",
	D = "recordid",
	R = "dataindex",
	ad = "r-selected",
	Q = "required",
	aI = "item-notBlank",
	au = "item-invalid",
	d = "row-alt",
	F = "grid-rowbox",
	aV = w + F,
	u = "grid.rowcheck",
	B = "grid.rowradio",
	G = "grid.head",
	a3 = "grid-ckb ",
	af = "grid-select-all",
	al = "multiple",
	ax = "checkedvalue",
	y = "-readonly",
	I = "item-ckb",
	X = I + "-self",
	a4 = w + X,
	aF = I + ap,
	aO = I + aA,
	N = I + y + ap,
	W = I + y + aA,
	Y = "item-radio-img",
	aW = Y + aA,
	aK = Y + ap,
	S = Y + y + aA,
	H = Y + y + ap,
	a0 = a4 + r + w + aO,
	q = "grid-cell",
	h = "cell-editor",
	M = "cellcheck",
	Z = "rowcheck",
	ab = "rowradio",
	at = "rownumber",
	j = "grid-",
	a9 = j + at,
	aP = "desc",
	o = "asc",
	i = j + aP,
	aH = j + o,
	p = "click",
	a6 = "dblclick",
	K = "cellclick",
	v = "render",
	aY = "rowclick",
	aw = "editorshow",
	V = "nexteditorshow",
	aT = "keydown",
	an = "select",
	z = "mousedown",
	ay = "mousemove",
	aj = "mouseup",
	t = "createrow",
	J = "addrow",
	ac = "未找到",
	aJ = "方法!",
	P = "tr[class!=grid-hl]",
	s = "div[atype=grid.headcheck]",
	aU = "[" + R + "=",
	a8 = a7 + aU,
	ae = a + aU,
	m = {
		autoadjust: ag,
		forexport: ag,
		hidden: L,
		lock: L,
		resizable: ag,
		rowspan: 1,
		sortable: ag,
		width: 100
	},
	aD = function(C, A) {
		return C
	};
	aC.Grid = Ext.extend(aC.Component, {
		constructor: function(A) {
			var C = this;
			C.selectedId = az;
			C.lockWidth = 0;
			C.editorborder = ag;
			C.autofocus = ag;
			aC.Grid.superclass.constructor.call(C, A);
			aC.onReady(function() {
				C.autofocus && C.focus()
			})
		},
		initComponent: function(A) {
			aC.Grid.superclass.initComponent.call(this, A);
			var U = this,
			C = U.wrap,
			ba = U.wb = Ext.get(U.id + "_wrap");
			U.fb = ba.child("div[atype=grid.fb]");
			if (U.fb) {
				U.uf = U.fb.child("div[atype=grid.uf]")
			}
			U.uc = C.child("div[atype=grid.uc]");
			U.uh = C.child("div[atype=grid.uh]");
			U.ub = C.child("div[atype=grid.ub]");
			U.uht = C.child("table[atype=grid.uht]");
			U.lc = C.child("div[atype=grid.lc]");
			U.lh = C.child("div[atype=grid.lh]");
			U.lb = C.child("div[atype=grid.lb]");
			U.lht = C.child("table[atype=grid.lht]");
			U.sp = C.child("div[atype=grid.spliter]");
			Ext.getBody().insertFirst(U.sp);
			U.classfiyColumns();
			U.initTemplate()
		},
		processListener: function(A) {
			var C = this;
			aC.Grid.superclass.processListener.call(C, A);
			C.wrap[A](z, C.onMouseDown, C);
			if (C.canwheel !== L) {
				C.wb[A]("mousewheel", C.onMouseWheel, C)
			}
			C.wb[A](Ext.isOpera ? "keypress": aT, C.handleKeyDown, C)[A]("keyup", C.handleKeyUp, C)[A]("focus", C.onFocus, C)[A]("blur", C.onBlur, C);
			C.ub[A]("scroll", C.syncScroll, C)[A](p, C.onClick, C)[A](a6, C.onDblclick, C);
			C.uht[A](ay, C.onUnLockHeadMove, C);
			C.uh[A](z, C.onHeadMouseDown, C)[A](p, C.onHeadClick, C);
			if (C.lb) {
				C.lb[A]("scroll", C.syncScroll, C)[A](p, C.onClick, C)[A](a6, C.onDblclick, C)
			}
			if (C.lht) {
				C.lht[A](ay, C.onLockHeadMove, C)
			}
			if (C.lh) {
				C.lh[A](z, C.onHeadMouseDown, C)[A](p, C.onHeadClick, C)
			}
			C[A](K, C.onCellClick, C)
		},
		initEvents: function() {
			aC.Grid.superclass.initEvents.call(this);
			this.addEvents(v, aT, a6, K, aY, aw, V),
			t
		},
		syncScroll: function(U, A) {
			var C = this;
			C.hideEditor();
			C.uh.dom.scrollLeft = C.ub.dom.scrollLeft;
			if (C.lb) {
				if (C.lb.dom === A) {
					C.ub.dom.scrollTop = C.lb.dom.scrollTop
				} else {
					C.lb.dom.scrollTop = C.ub.dom.scrollTop
				}
			}
			if (C.uf) {
				C.uf.dom.scrollLeft = C.ub.dom.scrollLeft
			}
		},
		handleKeyUp: function(A) {
			if (A.getKey() == 9) {
				this.showEditorByRecord()
			}
		},
		handleKeyDown: function(ba) {
			var C = this,
			A = ba.getKey(),
			U = C.dataset;
			if (ba.ctrlKey && ba.keyCode == 86 && C.canpaste) {
				var bb = window.clipboardData.getData("text");
				if (bb) {
					ai(bb.split("\n"),
					function(bf) {
						var bd = bf.split("\t");
						if (bd == x) {
							return
						}
						var be = {},
						bc = 0;
						ai(C.columns,
						function(bg) {
							if (C.isFunctionCol(bg.type)) {
								return
							}
							if (bg.hidden !== ag) {
								be[bg.name] = bd[bc];
								bc++
							}
						});
						U.create(be)
					})
				}
			} else {
				if (A == 9) {
					C.showEditorByRecord()
				} else {
					if (A == 38 || A == 40 || A == 33 || A == 34) {
						if (U.loading == ag) {
							return
						}
						switch (ba.getKey()) {
						case 33:
							U.prePage();
							break;
						case 34:
							U.nextPage();
							break;
						case 38:
							if (!ba.ctrlKey) {
								U.pre()
							}
							break;
						case 40:
							if (!ba.ctrlKey) {
								U.next()
							}
							break
						}
						ba.stopEvent()
					}
				}
			}
			C.fireEvent(aT, C, ba)
		},
		processDataSetLiestener: function(A) {
			var C = this,
			U = C.dataset;
			if (U) {
				U[A]("ajaxfailed", C.onAjaxFailed, C);
				U[A]("metachange", C.onRefresh, C);
				U[A]("update", C.onUpdate, C);
				U[A]("reject", C.onUpdate, C);
				U[A]("add", C.onAdd, C);
				U[A]("submit", C.onBeforSubmit, C);
				U[A]("submitfailed", C.onAfterSuccess, C);
				U[A]("submitsuccess", C.onAfterSuccess, C);
				U[A]("query", C.onBeforeLoad, C);
				U[A]("load", C.onLoad, C);
				U[A]("loadfailed", C.onAjaxFailed, C);
				U[A]("valid", C.onValid, C);
				U[A]("beforeremove", C.onBeforeRemove, C);
				U[A]("remove", C.onRemove, C);
				U[A]("clear", C.onLoad, C);
				U[A]("refresh", C.onRefresh, C);
				U[A]("fieldchange", C.onFieldChange, C);
				U[A]("indexchange", C.onIndexChange, C);
				U[A]("select", C.onSelect, C);
				U[A]("unselect", C.onUnSelect, C);
				U[A]("selectall", C.onSelectAll, C);
				U[A]("unselectall", C.onUnSelectAll, C);
				U[A]("wait", C.onWait, C);
				U[A]("afterwait", C.onAfterSuccess, C)
			}
		},
		bind: function(C) {
			if (Ext.isString(C)) {
				C = $(C);
				if (!C) {
					return
				}
			}
			var A = this;
			A.dataset = C;
			A.processDataSetLiestener(aN);
			if (C.autopagesize === ag && C.fetchall !== ag) {
				C.pagesize = Math.floor((A.ub.getHeight() || parseFloat(A.ub.dom.style.height)) / 25);
				if (isNaN(C.pagesize) || C.pagesize == 0) {
					C.pagesize = 1
				}
				if (C.getAll().length || C.qtId) {
					C.query();
					return
				}
			}
			$A.onReady(function() {
				A.onLoad()
			})
		},
		initTemplate: function() {
			var A = this;
			A.rowTdTpl = new Ext.Template(["<td {rowSpan} ", aS, '="{', aS, '}" class="', F, '" ', D, '="{', D, '}">']);
			A.rowNumTdTpl = new Ext.Template(['<td {rowSpan} style="text-align:{align}" class="', a9, '" ', aS, '="', a9, '" ', D, '="{', D, '}">']);
			A.rowNumCellTpl = new Ext.Template(['<div class="', q, '">{text}</div>']);
			A.tdTpl = new Ext.Template(['<td class="{celltdcls}" {rowSpan} style="visibility:{visibility};text-align:{align}" ', R, '="{name}" ', aS, '="', q, '" ', D, '="{', D, '}">']);
			A.cellTpl = new Ext.Template(['<div class="', q, ' {cellcls}" style="', T, ":{", T, '}px" id="', A.id, '_{name}_{recordid}" title="{title}">{celleditordiv}<span>{text}</span></div>']);
			A.cbTpl = new Ext.Template(['<center><div class="{cellcls}" id="', A.id, "_{name}_{", D, '}"></div></center>'])
		},
		getCheckBoxStatus: function(A, ba, U) {
			var bc = A.getField(ba),
			C = bc.get(ax),
			bb = A.data[ba];
			return I + (U ? y: x) + ((bb && bb == C) ? aA: ap)
		},
		createTemplateData: function(C, A) {
			return {
				recordid: A.id,
				visibility: C.hidden === ag ? av: aq,
				name: C.name
			}
		},
		createCell: function(be, ba, bf, bb) {
			var bo = this,
			bp = bo.createTemplateData(be, ba),
			bh,
			bn = bo.tdTpl,
			U = x,
			bm = x,
			bd = be.type,
			bj,
			bc = bo.getEditor(be, ba),
			A = [];
			if (bc != x) {
				var bl = aC.CmpManager.get(bc);
				if (bl && (bl instanceof a1)) {
					bd = M
				} else {
					if (bo.editorborder) {
						U = h
					} else {
						bp.celleditordiv = '<div class="cell-editor-div"></div>'
					}
				}
			} else {
				if (be.name && !ak(ba.getField(be.name).get(ax))) {
					bd = M;
					bj = ag
				}
			}
			if (bd == Z || bd == ab) {
				var bk = bo.dataset,
				bg = bk.getSelected().indexOf(ba) == -1 ? ap: aA;
				bj = bk.execSelectFunction(ba) ? x: y;
				bn = bo.rowTdTpl;
				Ext.apply(bp, {
					align: O,
					atype: bd == Z ? u: B,
					cellcls: bd == Z ? a3 + I + bj + bg: "grid-radio " + Y + bj + bg
				});
				bh = bo.cbTpl
			} else {
				if (bd == M) {
					Ext.apply(bp, {
						align: O,
						cellcls: a3 + bo.getCheckBoxStatus(ba, be.name, bj)
					});
					bh = bo.cbTpl
				} else {
					var C = ba.getMeta().getField(be.name);
					if (C && ak(ba.data[be.name]) && ba.isNew == ag && C.get(Q) == ag) {
						U = U + r + aI
					}
					var bi = bo.renderText(ba, be, ba.data[be.name]);
					Ext.apply(bp, {
						align: be.align || c,
						cellcls: U,
						celltdcls: bm,
						text: bi,
						title: be.showtitle ? $A.unescapeHtml(String(bi).replace(/<[^<>]+>/mg, x)) : ""
					});
					if (bd == at) {
						bn = bo.rowNumTdTpl;
						bh = bo.rowNumCellTpl
					} else {
						bh = bo.cellTpl
					}
				}
			}
			if (bb) {
				bp.rowSpan = "rowSpan=" + bb
			}
			if (!bf) {
				A.push(bn.applyTemplate(bp))
			} else {
				if (bf != ag && bm) {
					Ext.fly(bf).addClass(bm)
				}
			}
			A.push(bh.applyTemplate(bp));
			if (!bf) {
				A.push("</td>")
			}
			return A.join(x)
		},
		createRow: function(bc, bh, bf, bg) {
			var bb = this,
			U = {},
			bd = az,
			bi = L,
			ba = bb.parseCss(bb.renderRow(bg, bh));
			bb.fireEvent(t, bb, bh, bg, U, bf);
			if (U.height) {
				ba.style = ba.style = ";height:" + U.height + "px;"
			}
			var be = ['<tr id="', bb.id, bc, bg.id, '"  _row="' + bg.id + '" class="', (bh % 2 == 0 ? x: d), ba.cls, '"', 'style="', ba.style, '">'];
			for (var C = 0,
			A = bf.length; C < A; C++) {
				if (bf[C].hidden && bf[C].visiable == false) {
					continue
				}
				if (U.name && !U.height && !bi) {
					bd = az;
					if (bf[C].name == U.name) {
						bi = ag
					} else {
						bd = 2
					}
				}
				be.push(bb.createCell(bf[C], bg, az, bd))
			}
			be.push("</tr>");
			be.push(U.html || "");
			return be.join(x)
		},
		parseCss: function(U) {
			var bb = x,
			A = x;
			if (Ext.isArray(U)) {
				for (var C = 0; C < U.length; C++) {
					var ba = this.parseCss(U[C]);
					bb += ";" + ba.style;
					A += r + ba.cls
				}
			} else {
				if (Ext.isString(U)) {
					var bc = !!U.match(/^([^,:;]+:[^:;]+;)*[^,:;]+:[^:;]+;*$/);
					A = bc ? x: U;
					bb = bc ? U: x
				}
			}
			return {
				style: bb,
				cls: A
			}
		},
		renderText: function(A, C, bb) {
			var ba = C.renderer,
			bb = $A.escapeHtml(bb);
			if (ba) {
				var U = aC.getRenderer(ba);
				if (U == az) {
					alert(ac + ba + aJ);
					return bb
				}
				bb = U(bb, A, C.name);
				return bb == az ? x: bb
			}
			return bb == az ? x: bb
		},
		renderRow: function(A, bb) {
			var ba = this.rowrenderer,
			C = az;
			if (ba) {
				var U = aC.getRenderer(ba);
				if (U == az) {
					alert(ac + ba + aJ);
					return C
				}
				C = U(A, bb);
				return ! C ? x: C
			}
			return C
		},
		createTH: function(U) {
			var bb = ['<tr class="grid-hl">'];
			for (var C = 0,
			A = U.length; C < A; C++) {
				var ba = U[C];
				if (ba.hidden && ba.visiable == false) {
					continue
				}
				bb.push("<th ", R, '="', ba.name, '" style="height:0px;width:', ba.width, ao, '"></th>')
			}
			bb.push("</tr>");
			return bb.join(x)
		},
		onBeforeRemove: function() {
			aC.Masker.mask(this.wb, _lang["grid.mask.remove"])
		},
		onWait: function() {
			aC.Masker.mask(this.wb, _lang["grid.mask.waiting"])
		},
		onBeforeLoad: function() {
			this.ub.scrollTo(c, 0);
			this.uh.scrollTo(c, 0);
			aC.Masker.mask(this.wb, _lang["grid.mask.loading"])
		},
		onBeforSubmit: function(A) {
			if (this.submask == true) {
				aC.Masker.mask(this.wb, _lang["grid.mask.submit"])
			}
		},
		onFetching: function(A) {
			var C = this;
			C.isFetching = true;
			aC.Masker.mask(C.wb, _lang["grid.mask.fetching"]);
			A.on("fetched", C.onFetched, C)
		},
		onFetched: function(A) {
			var C = this;
			C.isFetching = false;
			aC.Masker.unmask(C.wb);
			A.un("fetched", C.onFetched, C);
			A.un("fetching", C.onFetching, C)
		},
		onAfterSuccess: function() {
			aC.Masker.unmask(this.wb)
		},
		preLoad: function() {},
		onLoad: function() {
			var C = this,
			U = C.dataset,
			A = U.getCurrentRecord();
			C.isSelectAll = L;
			C.clearDomRef();
			C.preLoad();
			C.wrap.removeClass(af);
			C.initHeadCheckStatus(L);
			if (C.lb) {
				C.renderLockArea()
			}
			C.renderUnLockAread();
			C.drawFootBar();
			A && C.onIndexChange(U, A);
			aC.Masker.unmask(C.wb);
			C.fireEvent(v, C)
		},
		initHeadCheckStatus: function(C) {
			var U = this,
			A = U.wrap.child(s);
			if (A && U.selectable && U.selectionmodel == al) {
				U.setCheckBoxStatus(A, C)
			}
		},
		clearDomRef: function() {
			this.selectlockTr = az;
			this.selectUnlockTr = az
		},
		customize: function(be) {
			var bf = location.pathname,
			U = bf.indexOf("modules");
			if (U == -1) {
				U = bf.indexOf(be) + be.length + 1
			}
			var bc = bf.substring(U, bf.length),
			bd = bc.substring(bc.lastIndexOf("/") + 1, bc.length),
			C = bf.substring(0, U),
			ba = this.wrap.parent("[url]");
			if (ba) {
				var A = ba.getAttributeNS("", "url");
				if (A) {
					A = A.split("?")[0];
					if (A.indexOf(C) == -1) {
						var bb = A.lastIndexOf("/");
						if (bb != -1) {
							A = A.substring(bb + 1, A.length)
						}
						bc = bc.replaceAll(bd, A)
					} else {
						bc = A.substring(A.indexOf(C) + new String(C).length, A.length)
					}
				}
			}
			new Aurora.Window({
				id: "sys_customization_grid",
				url: C + "modules/sys/sys_customization_grid.screen?source_file=" + bc + "&id=" + this.id + "&did=" + this.dataset.id,
				title: "个性化设置",
				height: 530,
				width: 560
			})
		},
		onAjaxFailed: function(C, A) {
			aC.Masker.unmask(this.wb)
		},
		onMouseWheel: function(C) {
			C.stopEvent();
			if (this.editing == ag) {
				return
			}
			var U = C.getWheelDelta(),
			A = this.dataset;
			if (U > 0) {
				A.pre()
			} else {
				if (U < 0) {
					A.next()
				}
			}
		},
		onMouseDown: function(bb, U) {
			U = (U = Ext.fly(U)).is(a) ? U: U.parent(a);
			var ba = this,
			C = U.getAttribute(aS),
			A;
			if ((A = ba.currentEditor) && A.editor instanceof a1 && C == q && U.getAttribute(R) == A.name) {
				if (bb.shiftKey) {
					ba._begin = A.record;
					bb.stopEvent()
				} else {
					if ((U = U.child(".grid-ckb")) && U.dom.className.search(/readonly/) == -1) {
						bb.stopEvent();
						A.editor.focus.defer(Ext.isIE ? 1 : 0, A.editor)
					}
				}
			}
		},
		focus: function() {
			this.wb.focus()
		},
		onFocus: function() {
			this.hasFocus = ag
		},
		blur: function() {
			this.wb.blur()
		},
		onBlur: function() {
			this.hasFocus = L
		},
		renderLockArea: function() {
			var A = this,
			C = A.lockColumns,
			U = ['<TABLE cellSpacing="0" atype="grid.lbt" cellPadding="0" border="0"  ', T, '="', A.lockWidth, '"><TBODY>', A.createTH(C)];
			ai(A.dataset.data,
			function(bb, ba) {
				U.push(A.createRow(aM, ba, C, bb))
			},
			A);
			U.push('</TBODY></TABLE><DIV style="height:17px"></DIV>');
			A.lbt = A.lb.update(U.join(x)).child("table[atype=grid.lbt]")
		},
		renderUnLockAread: function() {
			var A = this,
			C = A.unlockColumns,
			U = ['<TABLE cellSpacing="0" atype="grid.ubt" cellPadding="0" border="0" ', T, '="', A.unlockWidth, '"><TBODY>', A.createTH(C)];
			ai(A.dataset.data,
			function(bb, ba) {
				U.push(A.createRow(aG, ba, C, bb))
			},
			A);
			U.push("</TBODY></TABLE>");
			A.ubt = A.ub.update(U.join(x)).child("table[atype=grid.ubt]")
		},
		isOverSplitLine: function(A) {
			var U = this,
			C = 0,
			ba = L;
			U.overColIndex = -1;
			ai(U.columns,
			function(bc, bb) {
				if (bc.hidden !== ag) {
					C += bc.width
				}
				if (A < C + 3 && A > C - 3 && bc.resizable != L) {
					ba = ag;
					U.overColIndex = bb;
					return L
				}
			});
			return ba
		},
		onRefresh: function() {
			var A = this;
			A.onLoad();
			if (A.selectable) {
				var C = A.dataset;
				ai(C.selected,
				function(U) {
					A.onSelect(C, U)
				})
			}
		},
		onIndexChange: function(U, C) {
			var A = this.getDataIndex(C.id);
			if (A == -1) {
				return
			}
			this.selectRow(A, L)
		},
		isFunctionCol: function(A) {
			return A == Z || A == ab || A == at
		},
		onAdd: function(U, bd, bm) {
			var bg = this,
			bb = bg.columns,
			bk = bm === U.data.length - 1,
			be = bg.parseCss(bg.renderRow(bd, bm)),
			bl = (bm % 2 == 0 ? x: d + r) + be.cls;
			if (bg.lbt) {
				var C = aE.createElement(a2),
				bj = bg.lbt.dom.tBodies[0];
				C.id = bg.id + aM + bd.id;
				C.className = bl;
				Ext.fly(C).set({
					style: be.style,
					_row: bd.id
				});
				ai(bb,
				function(bn) {
					if (bn.lock === ag) {
						if (bn.hidden && bn.visiable == false) {
							return ag
						}
						var bp = aE.createElement(a);
						if (bn.type == Z) {
							Ext.fly(bp).set({
								recordid: bd.id,
								atype: u
							});
							bp.className = F;
							if (bg.isSelectAll) {
								bp.className += r + X
							}
						} else {
							if (bn.type == ab) {
								Ext.fly(bp).set({
									recordid: bd.id,
									atype: B
								});
								bp.className = F
							} else {
								if (bn.hidden) {
									bp.style.visibility = av
								}
								bp.style.textAlign = bn.align || c;
								if (!bg.isFunctionCol(bn.type)) {
									bp.dataindex = bn.name
								}
								var bo = {
									recordid: bd.id,
									atype: q
								};
								if (bn.type == at) {
									bp.className = a9;
									bo.atype = a9
								}
								Ext.fly(bp).set(bo)
							}
						}
						bp.innerHTML = bg.createCell(bn, bd, bp);
						C.appendChild(bp)
					}
				});
				if (bk) {
					bj.appendChild(C)
				} else {
					var bf = Ext.fly(bj).query(P);
					for (var bc = bm,
					ba = bf.length; bc < ba; bc++) {
						var bh = Ext.fly(bf[bc]).toggleClass(d);
						bh.select(".grid-rownumber div").each(function(bn) {
							bn.update(Number(bn.dom.innerHTML) + 1)
						});
						bh.select(aV).each(function(bn) {
							bg.setSelectStatus(U.findById(bn.getAttributeNS(x, D)))
						})
					}
					bj.insertBefore(C, bf[bm])
				}
			}
			var A = aE.createElement(a2),
			bi = bg.ubt.dom.tBodies[0];
			A.id = bg.id + aG + bd.id;
			A.className = bl;
			Ext.fly(A).set({
				style: be.style,
				_row: bd.id
			});
			ai(bb,
			function(bn) {
				if (bn.lock !== ag) {
					if (bn.hidden && bn.visiable == false) {
						return ag
					}
					var bo = aE.createElement(a);
					bo.style.visibility = bn.hidden === ag ? av: aq;
					bo.style.textAlign = bn.align || c;
					Ext.fly(bo).set({
						dataindex: bn.name,
						recordid: bd.id,
						atype: q
					});
					bo.innerHTML = bg.createCell(bn, bd, bo);
					A.appendChild(bo)
				}
			});
			if (bk) {
				bi.appendChild(A)
			} else {
				var bf = Ext.fly(bi).query(P);
				for (var bc = bm,
				ba = bf.length; bc < ba; bc++) {
					Ext.fly(bf[bc]).toggleClass(d)
				}
				bi.insertBefore(A, bf[bm])
			}
			bg.setSelectStatus(bd);
			bg.drawFootBar();
			bg.fireEvent(J, bg, bd)
		},
		renderEditor: function(bb, A, ba, C) {
			var U = bb.parent(a);
			U.update(this.createCell(ba, A, U.dom))
		},
		onUpdate: function(U, ba, C, bf) {
			var bc = this,
			A, be, bg;
			bc.setSelectStatus(ba);
			if (A = Ext.get([bc.id, C, ba.id].join(ah))) {
				var bd = bc.findColByName(C),
				bb = bc.getEditor(bd, ba);
				if (bb != x ? ($(bb) instanceof a1) : (C && !ak(ba.getField(C).get(ax)))) {
					bc.renderEditor(A, ba, bd, bb)
				} else { (A.child("span") || A).update(bg = bc.renderText(ba, bd, bf));
					bd.showtitle && A.set({
						title: $A.unescapeHtml(String(bg).replace(/<[^<>]+>/mg, x))
					})
				}
			}
			ai(bc.columns,
			function(bh) {
				if (bh.name != C && (be = Ext.get([bc.id, bh.name, ba.id].join(ah)))) {
					if (bh.editorfunction) {
						bc.renderEditor(be, ba, bh, bc.getEditor(bh, ba))
					}
					if (bh.renderer) { (be.child("span") || be).update(bg = bc.renderText(ba, bh, ba.get(bh.name)));
						bh.showtitle && be.set({
							title: $A.unescapeHtml(String(bg).replace(/<[^<>]+>/mg, x))
						})
					}
				}
			});
			bc.drawFootBar(C)
		},
		onValid: function(ba, A, C, U) {
			var bc = this.findColByName(C);
			if (bc) {
				var bb = aD.call(this, Ext.get([this.id, C, A.id].join(ah)));
				if (bb) {
					if (U == L) {
						bb.addClass(au)
					} else {
						bb.removeClass([aI, au])
					}
				}
			}
		},
		onRemove: function(bb, A, C) {
			var ba = this,
			U = Ext.get(ba.id + aM + A.id),
			bc = Ext.get(ba.id + aG + A.id);
			if (U) {
				U.remove()
			}
			if (bc) {
				bc.remove()
			}
			ai(ba.columns,
			function(bd) {
				if (bd.name) {
					ba.removeCompositeEditor(bd.name, A)
				}
			});
			if (Ext.isIE || Ext.isIE9) {
				ba.syncScroll()
			}
			ba.clearDomRef();
			aC.Masker.unmask(ba.wb);
			ba.drawFootBar()
		},
		onClear: function() {},
		onFieldChange: function(ba, A, bb, C, U) {
			if (C == Q) {
				var bc = aD.call(this, Ext.get([this.id, bb.name, A.id].join(ah)));
				if (bc) {
					bc[U == ag ? "addClass": "removeClass"](aI)
				}
			}
		},
		getDataIndex: function(U) {
			for (var C = 0,
			ba = this.dataset.data,
			A = ba.length; C < A; C++) {
				if (ba[C].id == U) {
					return C
				}
			}
			return - 1
		},
		onSelect: function(ba, C, bb) {
			if (!C || bb) {
				return
			}
			var U = this,
			A = Ext.get(U.id + k + C.id);
			if (A) {
				A.parent(aV).addClass(X);
				if (U.selectionmodel == al) {
					U.setCheckBoxStatus(A, ag);
					if (ba.selected.length == ba.data.length) {
						U.initHeadCheckStatus(ag)
					}
				} else {
					U.setRadioStatus(A, ag);
					ba.locate((ba.currentPage - 1) * ba.pagesize + ba.indexOf(C) + 1)
				}
				U.setSelectStatus(C)
			}
		},
		onUnSelect: function(ba, C, bb) {
			if (!C || bb) {
				return
			}
			var U = this,
			A = Ext.get(U.id + k + C.id);
			if (A) {
				A.parent(aV).addClass(X);
				if (U.selectionmodel == al) {
					U.setCheckBoxStatus(A, L);
					U.initHeadCheckStatus(L)
				} else {
					U.setRadioStatus(A, L)
				}
				U.setSelectStatus(C)
			}
		},
		onSelectAll: function() {
			var A = this;
			A.clearChecked();
			A.isSelectAll = ag;
			A.isUnSelectAll = L;
			A.wrap.addClass(af);
			A.initHeadCheckStatus(ag)
		},
		onUnSelectAll: function() {
			var A = this;
			A.clearChecked();
			A.isSelectAll = L;
			A.isUnSelectAll = ag;
			A.wrap.removeClass(af);
			A.initHeadCheckStatus(L)
		},
		clearChecked: function() {
			var A = this.wrap;
			A.select(a0).replaceClass(aO, aF);
			A.select(a4).removeClass(X)
		},
		onDblclick: function(bb, C) {
			if (C = Ext.fly(C).parent("td[atype=grid-cell]")) {
				var U = this,
				ba = U.dataset,
				A = ba.findById(C.getAttributeNS(x, D));
				U.fireEvent(a6, U, A, ba.indexOf(A), C.getAttributeNS(x, R))
			}
		},
		onClick: function(bd, bg) {
			var be = (bg = Ext.fly(bg)).is(a) ? bg: bg.parent(a);
			if (be) {
				var bc = this,
				U = be.getAttributeNS(x, aS),
				bf = be.getAttributeNS(x, D),
				C = bc.dataset;
				if (U == q) {
					var bb = C.findById(bf),
					bh = C.indexOf(bb),
					A = be.getAttributeNS(x, R);
					bc.fireEvent(K, bc, bh, A, bb, !bg.hasClass("grid-ckb"));
					bc.fireEvent(aY, bc, bh, bb)
				} else {
					if (U == a9) {
						var bb = C.findById(bf),
						bh = C.indexOf(bb);
						if (bb.id != bc.selectedId) {
							bc.selectRow(bh)
						}
					} else {
						if (U == u) {
							var ba = Ext.get(bc.id + k + bf);
							if (ba.hasClass(N) || ba.hasClass(W)) {
								return
							}
							if (bc.isSelectAll && !ba.parent(a4)) {
								ba.replaceClass(aF, aO)
							} else {
								if (bc.isUnselectAll && !ba.parent(a4)) {
									ba.replaceClass(aO, aF)
								}
							}
							ba.hasClass(aO) ? C.unSelect(bf) : C.select(bf)
						} else {
							if (U == B) {
								var ba = Ext.get(bc.id + k + bf);
								if (ba.hasClass(H) || ba.hasClass(S)) {
									return
								}
								C.select(bf)
							}
						}
					}
				}
			}
		},
		onCellClick: function(U, ba, C, A, bb) {
			this.adjustColumn(C);
			this.showEditor(ba, C, bb)
		},
		adjustColumn: function(ba) {
			var bd = this,
			U = bd.findColByName(ba);
			if (!U || !U.autoadjust || U.hidden) {
				return
			}
			var bc = bd.wrap.select("tr.grid-hl " + a8 + ba + E),
			C = parseInt(bc.elements[0].style.width),
			A = C,
			be = 12,
			bb = Math.min(bd.width - (bd.selectable ? 23 : 0) - 20, U.maxadjustwidth || Number.MAX_VALUE);
			bd.wrap.select(ae + ba + "] span").each(function(bf) {
				if (Ext.isIE || Ext.isIE9) {
					bf.parent().setStyle(aZ, "clip")
				}
				A = Math.max(bf.getWidth() + be, A);
				if (Ext.isIE || Ext.isIE9) {
					bf.parent().setStyle(aZ, x)
				}
				if (A > bb) {
					A = bb;
					return L
				}
			});
			A > C && bd.setColumnSize(ba, A)
		},
		setColumnPrompt: function(C, A) {
			this.wrap.select("td.grid-hc" + aU + C + "] div").update(A)
		},
		setEditor: function(C, U) {
			var A = this.findColByName(C),
			ba = Ext.get([this.id, C, this.selectedId].join(ah));
			A.editor = U;
			if (ba) {
				if (U == x) {
					ba.removeClass(h)
				} else {
					if (!$(U) instanceof a1) {
						ba.addClass(h)
					}
				}
			}
		},
		getEditor: function(ba, C) {
			var U = ba.editor || x;
			if (ba.editorfunction) {
				var A = window[ba.editorfunction];
				if (A == az) {
					alert(ac + ba.editorfunction + aJ);
					return az
				}
				U = A(C, ba.name) || x
			}
			return U
		},
		positionEditor: function() {
			var ba = this,
			U = ba.currentEditor,
			C = U.editor,
			A = C instanceof a1,
			bc = aD.call(ba, Ext.get([ba.id, U.name, U.record.id].join(ah)), A),
			bb = bc.getXY();
			if (A) {
				C.move(bb[0], bb[1] - 4)
			} else {
				C.move(bb[0], bb[1])
			}
		},
		showEditor: function(bf, A, be) {
			if (bf == -1) {
				return
			}
			var bc = this,
			U = bc.findColByName(A);
			if (!U) {
				return
			}
			var C = bc.dataset,
			ba = C.getAt(bf);
			if (!ba) {
				return
			}
			if (ba.id != bc.selectedId) {
				bc.selectRow(bf)
			} else {
				bc.focusRow(bf)
			}
			bc.focusColumn(A);
			var bd = bc.getEditor(U, ba);
			bc.setEditor(A, bd);
			if (bd != x) {
				var bb = $(bd); (function() {
					var bi = ba.get(A),
					bm = aD.call(bc, Ext.get([bc.id, A, ba.id].join(ah))),
					bh;
					bb.bind(C, A);
					bb.render(ba);
					bb.el.on(aT, bc.onEditorKeyDown, bc);
					Ext.fly(a5).on(z, bc.onEditorBlur, bc);
					bh = bc.currentEditor = {
						record: ba,
						ov: bi,
						name: A,
						editor: bb
					};
					bc.positionEditor();
					if (bb instanceof a1) {
						var bg = bc._begin;
						if (bc._begin) {
							var bl = C.indexOf(bg),
							bk = C.indexOf(ba);
							if (bl > bk) {
								var bj = bk;
								bk = bl;
								bl = bj
							}
							bk++;
							for (; bl < bk; bl++) {
								C.getAt(bl).set(A, bg.get(A))
							}
							delete bc._begin
						} else {
							if (be) {
								bb.focus()
							} else {
								bb.onClick()
							}
						}
					} else {
						if (bb instanceof aC.Field && !bb instanceof aC.TextArea) {
							bb.el.setStyle("text-align", U.align || c)
						} else {
							if (bb instanceof aC.Lov) {
								bb.on("fetching", bc.onFetching, bc)
							}
						}
						if (! (bb instanceof aC.TextArea)) {
							bb.setHeight(bm.getHeight() - 2)
						}
						bb.setWidth(bm.getWidth() - 5);
						bb.isEditor = ag;
						bb.isFireEvent = ag;
						bb.isHidden = L;
						bb.focus();
						bb.on(an, bc.onEditorSelect, bc);
						if (Ext.isFunction(be)) {
							be(bb)
						}
						bc.fireEvent(aw, bc, bb, bf, A, ba)
					}
					bc.editing = ag
				}).defer(10)
			}
		},
		showEditorByRecord: function(A) {
			var C = this,
			U = C.dataset,
			ba = A ? U.indexOf(A) : 0;
			A = A || U.getAt(0);
			if (!A && C.autoappend) {
				A = U.create()
			}
			if (A) {
				ai(C.columns,
				function(bb) {
					if (bb.hidden != ag && C.getEditor(bb, A) != x) {
						C.fireEvent(K, C, ba, bb.name, A,
						function() {});
						C.fireEvent(aY, C, ba, A);
						return L
					}
				})
			}
		},
		onEditorSelect: function() { (function() {
				this.hideEditor()
			}).defer(1, this)
		},
		onEditorKeyDown: function(bb) {
			var U = this,
			ba = bb.keyCode,
			C = U.currentEditor;
			if (ba == 27) {
				if (C) {
					var A = C.editor;
					if (A) {
						A.clearInvalid();
						A.render(A.binder.ds.getCurrentRecord())
					}
				}
				U.hideEditor()
			} else {
				if (ba == 13) {
					if (! (C && C.editor && C.editor instanceof aC.TextArea)) {
						U.showEditorBy(39)
					}
				} else {
					if (ba == 9) {
						bb.stopEvent();
						U.showEditorBy(bb.shiftKey ? 37 : 39)
					} else {
						if (bb.ctrlKey && (ba == 37 || ba == 38 || ba == 39 || ba == 40)) {
							U.showEditorBy(ba);
							bb.stopEvent()
						}
					}
				}
			}
		},
		findEditorBy: function(bd) {
			var bg = this,
			C, bf;
			if ((C = bg.currentEditor) && (bf = C.editor)) {
				var bj = bg.columns,
				bh = L,
				bc = bg.dataset,
				bb = bf.binder.name,
				A = bf.record,
				bl = bc.data.indexOf(A),
				U = az,
				bi = L,
				be = ag,
				bk = L,
				ba;
				if (bl != -1) {
					if (bd == 37 || bd == 38) {
						bj = [].concat(bj).reverse();
						be = L
					}
					if (bd == 38 || bd == 40) {
						bk = ag;
						ba = bg.findColByName(bb)
					}
					while (A) {
						if (!bk) {
							ai(bj,
							function(bm) {
								if (bh) {
									if (bm.hidden != ag && bg.getEditor(bm, A) != x) {
										U = bm.name;
										return L
									}
								} else {
									if (bm.name == bb) {
										bh = ag
									}
								}
							})
						}
						if (U) {
							return {
								row: bl,
								name: U,
								record: A
							}
						}
						A = bc.getAt(be ? ++bl: --bl);
						if (be && !A && !bi && bg.autoappend !== L) {
							bg.hideEditor();
							bc.create();
							A = bc.getAt(bl);
							bi = ag
						}
						if (bk && A && bg.getEditor(ba, A) != x) {
							U = bb
						}
					}
				}
			}
			return az
		},
		showEditorBy: function(U) {
			var ba = this,
			bb = true,
			C = ba.findEditorBy(U),
			A = ba.currentEditor;
			if (A) {
				A = A.editor
			}
			if (C) { (function(bd) {
					function be() {
						bd();
						A.un("fetched", be)
					}
					function bc() {
						if (ba.isFetching) {
							A.on("fetched", be)
						} else {
							bd()
						}
						A.un("blur", bc)
					}
					if (A && A instanceof aC.Lov) {
						A.on("blur", bc);
						ba.hideEditor()
					} else {
						ba.hideEditor();
						bd()
					}
				})(function() {
					var bd = C.row,
					bc = C.record;
					ba.fireEvent(K, ba, bd, C.name, bc, bb);
					ba.fireEvent(aY, ba, bd, bc)
				})
			}
		},
		focusRow: function(bc) {
			var bb = 25,
			A = this.ub,
			U = A.getScroll().top,
			ba = A.getHeight(),
			C = A.dom.scrollWidth > A.dom.clientWidth ? 16 : 0;
			if (bc * bb < U) {
				A.scrollTo(n, bc * bb - 1)
			} else {
				if ((bc + 1) * bb > (U + ba - C)) {
					A.scrollTo(n, (bc + 1) * bb - ba + C)
				}
			}
		},
		focusColumn: function(U) {
			var be = this,
			A = 25,
			C = be.ub,
			bb = C.getScroll().left,
			bf = 0,
			bd = 0,
			ba = 0,
			bc;
			ai(be.columns,
			function(bg) {
				if (bg.name == U) {
					bd = bg.width
				}
				if (bg.hidden !== ag) {
					if (bg.lock === ag) {
						ba += bg.width
					} else {
						if (bd == 0) {
							bf += bg.width
						}
					}
				}
			});
			bc = bf + bd;
			if (bf < bb) {
				C.scrollTo(c, bf)
			} else {
				if ((bc - bb) > (be.width - ba)) {
					C.scrollTo(c, bc - be.width + ba + (C.dom.scrollHeight > C.dom.clientHeight ? 16 : 0))
				}
			}
		},
		hideEditor: function() {
			var ba = this,
			U = ba.currentEditor;
			if (U) {
				var C = U.editor;
				if (C) {
					if (!C.canHide || C.canHide()) {
						C.el.un(aT, ba.onEditorKeyDown, ba);
						C.un(an, ba.onEditorSelect, ba);
						Ext.fly(a5).un(z, ba.onEditorBlur, ba);
						C.move( - 20000);
						var A = C.autocompleteview;
						if (A) {
							A.hide()
						}
						ba.editing = L;
						C.blur();
						C.onBlur();
						C.isFireEvent = L;
						C.isHidden = ag;
						if (C.collapse) {
							C.collapse()
						}
						delete ba.currentEditor
					}
				}
			}
		},
		onEditorBlur: function(ba, C) {
			var U = this,
			A = U.currentEditor;
			if (A && !A.editor.isEventFromComponent(C)) {
				U.hideEditor.defer(Ext.isIE || Ext.isIE9 ? 10 : 0, U)
			}
		},
		onLockHeadMove: function(C) {
			var A = this;
			A.hmx = C.xy[0] - A.lht.getXY()[0];
			A.lh.setStyle(aQ, A.isOverSplitLine(A.hmx) ? aa: aB)
		},
		onUnLockHeadMove: function(U) {
			var A = this;
			var C = A.uht;
			A.hmx = U.xy[0] - (C ? C.getXY()[0] + C.getScroll().left: 0) + A.lockWidth;
			A.uh.setStyle(aQ, A.isOverSplitLine(A.hmx) ? aa: aB)
		},
		onHeadMouseDown: function(C) {
			var A = this;
			A.dragWidth = -1;
			if (A.overColIndex == undefined || A.overColIndex == -1) {
				return
			}
			A.dragIndex = A.overColIndex;
			A.dragStart = C.getXY()[0];
			A.sp.setHeight(A.wrap.getHeight()).show().setStyle({
				top: A.wrap.getXY()[1] + ao,
				left: C.xy[0] + ao
			});
			Ext.get(a5).on(ay, A.onHeadMouseMove, A).on(aj, A.onHeadMouseUp, A);
			C.stopEvent()
		},
		onHeadClick: function(be, bi) {
			var bc = this,
			bf = Ext.fly(bi).parent(a),
			A = bc.dataset,
			U;
			if (bf) {
				U = bf.getAttributeNS(x, aS)
			}
			if (U == G) {
				var bd = bf.getAttributeNS(x, R),
				C = bc.findColByName(bd);
				if (C && C.sortable === ag) {
					if (A.isModified()) {
						aC.showInfoMessage("提示", "有未保存数据!");
						return
					}
					var bg = bf.child(ar),
					bb = x;
					if (bc.currentSortTarget) {
						bc.currentSortTarget.removeClass([aH, i])
					}
					bc.currentSortTarget = bg;
					if (ak(C.sorttype)) {
						C.sorttype = aP;
						bg.removeClass(aH).addClass(i);
						bb = aP
					} else {
						if (C.sorttype == aP) {
							C.sorttype = o;
							bg.removeClass(i).addClass(aH);
							bb = o
						} else {
							C.sorttype = x;
							bg.removeClass([i, aH])
						}
					}
					A.sort(bd, bb)
				}
			} else {
				if (U == u) {
					var ba = bf.child(s);
					if (ba) {
						var bh = ba.hasClass(aO);
						if (!bh) {
							A.selectAll()
						} else {
							A.unSelectAll()
						}
					}
				}
			}
		},
		setRadioStatus: function(A, C) {
			if (!C) {
				A.removeClass(aW).addClass(aK)
			} else {
				A.addClass(aW).removeClass(aK)
			}
		},
		setCheckBoxStatus: function(A, C) {
			if (!C) {
				A.removeClass(aO).addClass(aF)
			} else {
				A.addClass(aO).removeClass(aF)
			}
		},
		setSelectDisable: function(U, C) {
			var A = this.dataset.selected.indexOf(C) == -1;
			if (this.selectionmodel == al) {
				U.removeClass([aO, aF]).addClass(A ? N: W)
			} else {
				U.removeClass([aW, aK, S, H]).addClass(A ? H: S)
			}
		},
		setSelectEnable: function(U, C) {
			var A = this.dataset.selected.indexOf(C) == -1;
			if (this.selectionmodel == al) {
				U.removeClass([N, W]).addClass(A ? aF: aO)
			} else {
				U.removeClass([aK, aW, H, S]).addClass(A ? aK: aW)
			}
		},
		setSelectStatus: function(C) {
			var U = this,
			ba = U.dataset;
			if (ba.selectfunction) {
				var A = Ext.get(U.id + k + C.id);
				if (!ba.execSelectFunction(C)) {
					U.setSelectDisable(A, C)
				} else {
					U.setSelectEnable(A, C)
				}
			}
		},
		onHeadMouseMove: function(ba) {
			var U = this;
			ba.stopEvent();
			U.dragEnd = ba.getXY()[0];
			var C = U.dragEnd - U.dragStart,
			bb = U.columns[U.dragIndex],
			A = bb.width + C;
			if (A > 30 && A < U.width) {
				U.dragWidth = A;
				U.sp.setStyle(c, ba.xy[0] + ao)
			}
		},
		onHeadMouseUp: function(C) {
			var A = this;
			Ext.get(a5).un(ay, A.onHeadMouseMove, A).un(aj, A.onHeadMouseUp, A);
			A.sp.hide();
			if (A.dragWidth != -1) {
				A.setColumnSize(A.columns[A.dragIndex].name, A.dragWidth)
			}
			A.syncScroll()
		},
		findColByName: function(A) {
			var C;
			if (A) {
				ai(this.columns,
				function(U) {
					if (U.name && U.name.toLowerCase() === A.toLowerCase()) {
						C = U;
						return L
					}
				})
			}
			return C
		},
		selectRow: function(bc, C) {
			var ba = this,
			bb = ba.dataset,
			A = bb.getAt(bc),
			U = (bb.currentPage - 1) * bb.pagesize + bc + 1;
			ba.selectedId = A.id;
			if (ba.selectlockTr) {
				ba.selectlockTr.removeClass(ad)
			}
			if (ba.selectUnlockTr) {
				ba.selectUnlockTr.removeClass(ad)
			}
			ba.selectUnlockTr = Ext.get(ba.id + aG + A.id);
			if (ba.selectUnlockTr) {
				ba.selectUnlockTr.addClass(ad)
			}
			ba.selectlockTr = Ext.get(ba.id + aM + A.id);
			if (ba.selectlockTr) {
				ba.selectlockTr.addClass(ad)
			}
			ba.focusRow(bc);
			if (C !== L && U != az) {
				bb.locate.defer(5, bb, [U, L])
			}
		},
		setColumnSize: function(A, bg) {
			var bb = this,
			bc, ba, U = 0,
			C = 0;
			ai(bb.columns,
			function(bh) {
				if (bh.name && bh.name === A) {
					if (bh.hidden === ag) {
						return
					}
					bh.width = bg;
					if (bh.lock !== ag) {
						bc = bb.uh.child(a8 + A + E);
						ba = bb.ub.child(a8 + A + E)
					} else {
						if (bb.lh) {
							bc = bb.lh.child(a8 + A + E)
						}
						if (bb.lb) {
							ba = bb.lb.child(a8 + A + E)
						}
					}
				}
				if (bh.hidden !== ag) {
					bh.lock !== ag ? (C += bh.width) : (U += bh.width)
				}
			});
			bb.unlockWidth = C;
			bb.lockWidth = U;
			if (bc) {
				bc.setStyle(T, bg + ao)
			}
			if (ba) {
				ba.setStyle(T, bg + ao)
			}
			var bf = Math.max(bb.width - U, 0);
			if (bb.fb) {
				bb.fb.child(a8 + A + E).setStyle(T, bg + ao);
				bb.uf.setStyle(T, bf + ao);
				bb.fb.child("table[atype=fb.ubt]").setStyle(T, C + ao);
				var be = bb.fb.child("table[atype=fb.lbt]");
				if (be) {
					bb.fb.child("div[atype=grid.lf]").setStyle(T, (U - 1) + ao);
					be.setStyle(T, U + ao)
				}
			}
			if (bb.lc) {
				var bd = Math.max(U - 1, 0);
				bb.lc.setStyle({
					width: bd + ao,
					display: bd == 0 ? am: x
				})
			}
			if (bb.lht) {
				bb.lht.setStyle(T, U + ao)
			}
			if (bb.lbt) {
				bb.lbt.setStyle(T, U + ao)
			}
			bb.uc.setStyle(T, bf + ao);
			bb.uh.setStyle(T, bf + ao);
			bb.ub.setStyle(T, bf + ao);
			bb.uht.setStyle(T, C + ao);
			if (bb.ubt) {
				bb.ubt.setStyle(T, C + ao)
			}
			bb.syncSize()
		},
		drawFootBar: function(C) {
			var A = this;
			if (!A.fb) {
				return
			}
			ai([].concat(C ? C: A.columns),
			function(bd) {
				var bb = Ext.isString(bd) ? A.findColByName(bd) : bd;
				if (bb && bb.footerrenderer) {
					var bc = aC.getRenderer(bb.footerrenderer);
					if (bc == az) {
						alert(ac + bb.footerrenderer + aJ);
						return
					}
					var ba = bb.name,
					U = bc(A.dataset.data, ba);
					if (!ak(U)) {
						A.fb.child(ae + ba + E).update(U)
					}
				}
			})
		},
		syncSize: function() {
			var A = this,
			U = 0;
			ai(A.columns,
			function(ba) {
				if (ba.hidden !== ag) {
					if (ba.lock === ag) {
						U += ba.width
					}
				}
			});
			if (U != 0) {
				var C = A.width - U;
				A.uc.setWidth(C);
				A.uh.setWidth(C);
				A.ub.setWidth(C)
			}
		},
		classfiyColumns: function() {
			var A = this;
			A.lockColumns = [],
			A.unlockColumns = [];
			A.lockWidth = 0,
			A.unlockWidth = 0;
			ai(A.columns,
			function(C) {
				if (C.lock === ag) {
					A.lockColumns.add(C);
					if (C.hidden !== ag) {
						A.lockWidth += C.width
					}
				} else {
					A.unlockColumns.add(C);
					if (C.hidden !== ag) {
						A.unlockWidth += C.width
					}
				}
			});
			A.columns = A.lockColumns.concat(A.unlockColumns)
		},
		showColumn: function(C) {
			var A = this.findColByName(C);
			if (A && A.visiable != false) {
				if (A.hidden === ag) {
					delete A.hidden;
					A.forexport = ag;
					this.setColumnSize(C, A.hiddenwidth || A.width);
					delete A.hiddenwidth;
					this.wrap.select(ae + C + E).show()
				}
			}
		},
		hideColumn: function(C) {
			var A = this.findColByName(C);
			if (A && A.visiable != false) {
				if (A.hidden !== ag) {
					A.hiddenwidth = A.width;
					this.setColumnSize(C, 0, L);
					this.wrap.select(ae + C + E).hide();
					A.hidden = ag;
					A.forexport = L
				}
			}
		},
		removeColumn: function(A) {
			var be = this,
			bg = be.columns,
			bh = [],
			bd = [];
			ai(A,
			function(bj) {
				col = be.findColByName(bj);
				if (!col) {
					return
				}
				if (col.lock) {
					bh.push(bj)
				} else {
					bd.push(bj)
				}
				bg.splice(bg.indexOf(col), 1)
			});
			var bc = bh.length,
			bb = bd.length,
			U = [];
			if (bc || bb) {
				be.classfiyColumns();
				if (bc) {
					var C = be.lockWidth,
					bi = be.wrap.getWidth() - C;
					for (var ba = 0; ba < bc; ba++) {
						U.push(aU + bh[ba] + E)
					}
					if (C) {
						be.lht.setWidth(C);
						be.lc.setWidth(C);
						be.lbt.dom.width = C
					} else {
						be.lc.remove()
					}
					be.uc.setWidth(bi);
					be.uh.setWidth(bi);
					be.ub.setWidth(bi)
				}
				for (var ba = 0; ba < bb; ba++) {
					U.push(aU + bd[ba] + E)
				}
				be.wrap.select(U.join(",")).remove();
				var bf = be.unlockWidth;
				be.uht.setWidth(bf);
				be.ubt.setWidth(bf)
			}
		},
		createHead: Ext.isIE || Ext.isIE9 ?
		function(bd, be, U, bc, C) {
			var A = bc.query(a2),
			ba = Ext.fly(A[0]).child("th:last()"),
			bb;
			if (U) {
				bb = bc.query(aU + U + E)[0]
			}
			if (be == aX) {
				bb = bb.nextSibling || az;
				C++
			} else {
				if (be == e) {
					if (ba) {
						bb = ba.dom
					}
					C = -1
				}
			}
			ai(bd,
			function(bj) {
				var bg = Ext.get(aE.createElement(a7)),
				bi = Ext.get(A[1].insertCell(C)),
				bf = bj.width,
				bh = bj.name;
				if (C > -1) {
					C++
				}
				bi.addClass("grid-hc").set({
					dataindex: bh,
					atype: G
				}).update("<div>" + bj.prompt + "</div>");
				if (bb) {
					A[0].insertBefore(bg.dom, bb)
				} else {
					A[0].appendChild(bg.dom)
				}
				bg.setStyle(T, bf + ao).set({
					dataindex: bh
				})
			})
		}: function(bd, be, A, bb) {
			var C = [],
			ba = [],
			U = bb.query(be != e ? aU + A + E: a2),
			bc = Ext.fly(U[0]).child("th:last()");
			ai(bd,
			function(bf) {
				C.push('<th style="width:', bf.width, ao, ';" ', R, '="', bf.name, '"></th>');
				ba.push('<td class="grid-hc" atype="grid.head" ', R, '="', bf.name, '"><div>', bf.prompt, "</div></td>")
			});
			new Ext.Template(C.join(x))[be](U[0], {});
			new Ext.Template(ba.join(x))[be](U[1], {});
			if (bc) {
				bc.appendTo(Ext.fly(U[0]))
			}
		},
		addColumn: function(bm, C, bc) {
			var bd = this;
			if (bd.dataset.isModified()) {
				aC.showInfoMessage(_lang["grid.info"], _lang["grid.info.continue"])
			} else {
				var bi = bd.columns,
				be = bi.length,
				bl, bj;
				if (C && bc) {
					var ba = bd.findColByName(C);
					if (ba) {
						bl = ba.lock;
						bj = bd[bl ? "lockColumns": "unlockColumns"].indexOf(ba);
						be = (bc == f ? 0 : 1) + bi.indexOf(ba)
					} else {
						alert("未找到列" + C);
						return
					}
				}
				var bk = [],
				bb = [];
				ai(bm,
				function(bp) {
					var bo = Ext.apply(Ext.apply({},
					m), bp),
					bn = bd.findColByName(bo.name);
					if (bn) {
						return
					}
					if (bo.lock) {
						bk.push(bo)
					} else {
						bb.push(bo)
					}
				});
				var U = bk.concat(bb);
				if (U.length) {
					var A = bc ? (bc == f ? aL: aX) : e,
					bh = umethod = A,
					bf = uname = C,
					bg = bd.wrap;
					if (bl) {
						umethod = aL;
						uname = bd.unlockColumns[0].name
					} else {
						bh = e;
						bf = az
					}
					bd.columns = bi.slice(0, be).concat(U).concat(bi.slice(be));
					bd.classfiyColumns();
					if (bk.length) {
						if (!bd.lht) {
							bd.lc = new Ext.Template("<DIV class='grid-la' atype='grid.lc' style='width:24px;'><DIV class='grid-lh' atype='grid.lh' unselectable='on' onselectstart='return false;' style='height:25px;'><TABLE cellSpacing='0' atype='grid.lht' cellPadding='0' border='0' style='width:25px'><TBODY><TR class='grid-hl'></TR><TR height=25></TR></TBODY></TABLE></DIV><DIV class='grid-lb' atype='grid.lb' style='width:100%;height:255px'></DIV></DIV>").insertFirst(bd.wrap.dom, {},
							ag);
							bd.lh = bg.child("div[atype=grid.lh]");
							bd.lb = bg.child("div[atype=grid.lb]");
							bd.lht = bg.child("table[atype=grid.lht]");
							bd.lb[aN](p, bd.onClick, bd)[aN](a6, bd.onDblclick, bd);
							bd.lht[aN](ay, bd.onLockHeadMove, bd);
							bd.lh[aN](z, bd.onHeadMouseDown, bd)[aN](p, bd.onHeadClick, bd)
						}
						bd.createHead(bk, bh, bf, bd.lht, bj)
					}
					if (bb.length) {
						bd.createHead(bb, umethod, uname, bd.uht, bj)
					}
					if (bd.lb) {
						bd.lb.update(x)
					}
					bd.ub.update(x);
					ai(U,
					function(bn) {
						bd.setColumnSize(bn.name, bn.width)
					});
					bd.dataset.query()
				}
			}
		},
		insertColumnBefore: function(C, A) {
			this.addColumn(A, C, f)
		},
		insertColumnAfter: function(C, A) {
			this.addColumn(A, C, 1)
		},
		setWidth: function(U) {
			var ba = this;
			if (ba.width == U) {
				return
			}
			ba.width = U;
			ba.wrap.setWidth(U);
			var C = aC.CmpManager.get(ba.id + b);
			if (C) {
				C.setWidth(U)
			}
			var A = aC.CmpManager.get(ba.id + l);
			if (A) {
				A.setWidth(U)
			}
			if (ba.fb) {
				ba.fb.setWidth(U)
			}
			var bb = U - ba.lockWidth;
			ba.uc.setWidth(bb);
			ba.uh.setWidth(bb);
			ba.ub.setWidth(bb);
			if (ba.uf) {
				ba.uf.setWidth(bb)
			}
		},
		setHeight: function(ba) {
			var bb = this;
			if (bb.height == ba) {
				return
			}
			bb.height = ba;
			var C = aC.CmpManager.get(bb.id + b);
			if (C) {
				ba -= 25
			}
			var A = aC.CmpManager.get(bb.id + l);
			if (A) {
				ba -= 25
			}
			if (bb.fb) {
				ba -= 25
			}
			bb.wrap.setHeight(ba);
			var U = ba - 25;
			if (bb.lb) {
				bb.lb.setHeight(U)
			}
			bb.ub.setHeight(U)
		},
		deleteSelectRows: function(U) {
			var C = this.dataset,
			A = [].concat(C.getSelected());
			if (A.length > 0) {
				C.remove(A)
			}
		},
		remove: function() {
			var A = this.dataset.getSelected();
			if (A.length > 0) {
				aC.showConfirm(_lang["grid.remove.confirm"], _lang["grid.remove.confirmMsg"], this.deleteSelectRows.createDelegate(this))
			}
		},
		clear: function() {
			var C = this.dataset,
			A = C.getSelected();
			while (A[0]) {
				C.removeLocal(A[0])
			}
		},
		_export: function(C, A, U) {
			this.exportOptions = {
				type: C || "xls",
				filename: A,
				separator: U
			};
			this.showExportConfirm()
		},
		showExportConfirm: function() {
			var ba = this,
			be = 0,
			bd = ba.id + "_export",
			bc = ['<div class="item-export-wrap" style="margin:15px;width:270px" id="', bd, '">', '<div class="grid-uh" atype="grid.uh" style="width: 270px; -moz-user-select: none; text-align: left; height: 25px; cursor: default;" onselectstart="return false;" unselectable="on">', '<table cellSpacing="0" cellPadding="0" border="0"><tbody><tr height="25px">', '<td class="export-hc" style="width:22px;" atype="export.rowcheck"><center><div title="', _lang["grid.export.selectinfo"], '" atype="export.headcheck" class="', a3, aF, '"></div></center></td>', '<td class="export-hc" style="width:222px;" atype="grid-type">', _lang["grid.export.column"], "</td>", "</tr></tbody></table></div>", '<div style="overflow:auto;height:200px;"><table cellSpacing="0" cellPadding="0" border="0"><tbody>'],
			U = ag,
			A = 360,
			bb = ba.exportOptions || (ba.exportOptions = {}),
			C = bb && bb.type;
			ai(ba.columns,
			function(bg, bf) {
				if (!ba.isFunctionCol(bg.type)) {
					if (U) {
						U = bg.forexport !== L
					}
					bc.push("<tr", (be + bf) % 2 == 0 ? x: ' class="', d, '"', '><td class="', F, '" style="width:22px;" ', D, '="', bf, '" atype="export.rowcheck"><center><div id="', ba.id, k, bf, '" class="', a3, bg.forexport === L ? aF: aO, '"></div></center></td><td style="width:222px"><div class="', q, '">', bg.prompt, bg.hidden ? ['<div style="float:right;color:red">&lt;', _lang["grid.export.hidecolumn"], "&gt;</div>"].join("") : x, "</div></td></tr>")
				} else {
					be++
				}
			});
			if (U) {
				bc[9] = aO
			}
			bc.push("</tbody></table></div></div>");
			if (C == "xls" || C == "xlsx") {
				A += 30;
				bc.push('<div class="item-radio" class="item-radio" style="margin:15px;width:270px;height:30px">', '<div class="item-radio-option" style="width:128px;float:left" itemvalue="xls">', '<div class="item-radio-img  item-radio-img-', C == "xls" ? "c": "u", '"></div>', '<label class="item-radio-lb">excel2003</label>', "</div>", '<div class="item-radio-option" style="width:128px;float:left" itemvalue="xlsx">', '<div class="item-radio-img  item-radio-img-', C == "xlsx" ? "c": "u", '"></div>', '<label class="item-radio-lb">excel2007</label>', "</div>", "</div>")
			}
			bc.push('<div style="margin:15px;width:270px;color:red">', _lang["grid.export.confirmMsg"], "</div>");
			ba.exportwindow = aC.showOkCancelWindow(_lang["grid.export.config"], bc.join(x),
			function(bf) {
				ba.doExport();
				bf.body.un(p, ba.onExportClick, ba)
			},
			az, az, A);
			ba.exportwindow.body.on(p, ba.onExportClick, ba)
		},
		onExportClick: function(bd, bj) {
			bj = Ext.fly(bj);
			var bc = this,
			bf = bj.parent("td.grid-rowbox") || bj.parent("td.export-hc"),
			C = bj.hasClass("item-radio-option") ? bj: bj.parent("div.item-radio-option");
			if (bf) {
				var U = bf.getAttributeNS(x, aS);
				if (U == "export.rowcheck") {
					var bh = bf.getAttributeNS(x, D),
					ba = bf.child(ar),
					bg = ba.hasClass(aO),
					bb = ba.getAttributeNS(x, aS),
					be = bc.columns;
					bc.setCheckBoxStatus(ba, !bg);
					if (bb == "export.headcheck") {
						var bi = (bc.isFunctionCol(be[0].type) ? 1 : 0) + (bc.isFunctionCol(be[1].type) ? 1 : 0),
						A = bd.ctrlKey;
						bc.exportwindow.body.select("td[atype=export.rowcheck] div[atype!=export.headcheck]").each(function(bk, bm, bl) {
							bm = be[bl + bi];
							if (!A || !bm.hidden) {
								bc.setCheckBoxStatus(bk, !bg);
								bm.forexport = !bg
							}
						})
					} else {
						be[bh].forexport = !bg
					}
				}
			} else {
				if (C) {
					bc.setRadioStatus(C.child("div"), ag);
					bc.setRadioStatus((C.prev() || C.next()).child("div"), L);
					bc.exportOptions.type = C.getAttributeNS(x, "itemvalue")
				}
			}
		},
		doExport: function() {
			var C = this,
			A = C.exportOptions || {};
			aC.doExport(C.dataset, C.columns, az, A.type, A.separator, A.filename);
			delete C.exportOptions
		},
		destroy: function() {
			aC.Grid.superclass.destroy.call(this);
			this.processDataSetLiestener("un");
			this.sp.remove();
			delete this.sp
		},
		createCompositeEditor: function(bq, ba, bc, bg) {
			var bp = this,
			bj = bp.id,
			bi = bp.dataset,
			bk = bc.id,
			bd = bp.findColByName(bq),
			bo = bd.lock,
			U = Ext.get(bj + (bo ? aM: aG) + bk),
			bh = Ext.get(bj + (bo ? aG: aM) + bk),
			bn = bo ? bp.lbt: bp.ubt,
			be = this.dataset.indexOf(bc);
			if (bp.currentEditor && bp.currentEditor.editor instanceof a1) {
				bp.hideEditor()
			}
			var bm = bn.dom,
			bb = bm.tBodies[0],
			bl = document.createElement(a2),
			bf = document.createElement(a);
			bl.id = bj + "_cmp_" + bq + ah + bk;
			Ext.fly(bl).addClass(be % 2 == 0 ? x: d);
			Ext.fly(bl).set({
				_row: bc.id
			});
			bf.colSpan = ba;
			bf.innerHTML = bg.html;
			bl.appendChild(bf);
			if (bi.indexOf(bc) >= bi.data.length - 1) {
				bb.appendChild(bl)
			} else {
				var A = bi.getAt(bi.indexOf(bc) + 1);
				var C = Ext.get(bj + (bo ? aM: aG) + A.id);
				bb.insertBefore(bl, C.dom)
			}
			if (bh) {
				bh.setHeight(bg.height)
			}
			Ext.each(U.dom.childNodes,
			function(bs) {
				var br = Ext.get(bs).getAttributeNS(x, R);
				if (br == bq) {
					return L
				}
				bs.rowSpan = 2
			});
			this.hideEditor()
		},
		createCompositeRow: function(C, bc, bb, be, A, ba) {
			var U = [];
			bc.name = C;
			if (ba.find("name", C)) {
				var bd = this.dataset.indexOf(A);
				U.push('<tr id="', this.id, "_cmp_", C, ah, A.id, '" class="' + (bd % 2 == 0 ? x: d) + '" _row="' + A.id + '"><td colSpan="', be, '">');
				U.push(bb.html);
				U.push("</td></tr>");
				bc.html = U.join("")
			} else {
				bc.height = bb.height
			}
		},
		removeCompositeEditor: function(A, bb) {
			var bc = this,
			C = bc.id,
			bg = bb.id,
			ba = bc.findColByName(A),
			bf = ba.lock,
			U = Ext.get(C + (bf ? aM: aG) + bg),
			be = Ext.get(C + (bf ? aG: aM) + bg);
			if (bc.currentEditor && bc.currentEditor.editor instanceof a1) {
				bc.hideEditor()
			}
			if (be) {
				be.setHeight(22)
			}
			Ext.each(U && U.dom.childNodes,
			function(bh) {
				if (Ext.get(bh).getAttributeNS(x, R) == A) {
					return L
				}
				bh.rowSpan = 1
			});
			var bd = Ext.get(C + "_cmp_" + A + ah + bg);
			if (bd) {
				bd.remove()
			}
		},
		show: function() {
			aC.Grid.superclass.show.call(this);
			this.wb.show()
		},
		hide: function() {
			aC.Grid.superclass.hide.call(this);
			this.wb.hide()
		}
	});
	aC.Grid.revision = "$Rev: 8146 $"
})($A);