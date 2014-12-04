var _dynamicPage = {};

var config = $config();
var ns_uri = 'http://www.aurora-framework.org/application';
function find(tagName, proName, value) {
	var m = CompositeUtil.findChild(config, tagName, proName, value);
	if (m)
		return new CompositeMap(m);
}
function newMap(name) {
	return new CompositeMap('a', ns_uri, name);
}

function lower(str) {

	return String(str).toLowerCase();
}

var logger = Packages.uncertain.logging.LoggingContext.getLogger($ctx
		.getData(), "aurora.database");

_dynamicPage.event = function() {
	this.name = null;
	this.handler = null;
	this.functionHeader = null;
	this.functionEnd = ' } ';
	this.eventTag = newMap('event');

	this.init = function(name, handler, functionScript,dataSetId) {
		this.name = lower(name);
		this.handler = handler;
		this.functionHeader = '\n ' + functionScript + ' { ';
		this.eventTag.name = lower(this.name);
		this.eventTag.handler = this.handler;
	};

	this.addFunctionScript = function(text) {
		this.functionHeader += ' ' + text + ' ';
	};

	this.getFunctionScriptText = function() {
		return this.functionHeader + this.functionEnd;
	};

	this.getEventTag = function() {
		return this.eventTag;
	};
	
	this.getEventHandler = function() {
		return this.handler;
	};

}

_dynamicPage.field = function() {
	this.name = '';
	this.displayName = '';
	this.required = 'false';
	this.prompt = '';
	this.fieldTag = newMap('field');
	this.component = {};
	this.componentType = '';
	this.componentId = '';
	this.allowDecimals = 'false';
	this.decimalPrecision = '';
	this.renderer = '';
	this.rendererFunction = '';
	this.bindTarget = '';
	this.updatScript = '';
	this.pageType = 'edit';
	this.forQuery = 'Y';
	this.forUpdate = 'Y';
	this.readonly = 'N';
	this.functionName = '';
	this.init = function(bindTarget, field, fieldCode, fieldDesc,pageType,forQuery,forUpdate,readonly,functionName) {
		fieldCode = lower(fieldCode);
		if(pageType){
			this.pageType = pageType;
		}
		if(forQuery){
			this.forQuery = forQuery;
		}
		if(forUpdate){
			this.forUpdate = forUpdate;
		}
		if(readonly){
			this.readonly = readonly;
		}
		if(functionName){
			this.functionName = functionName;
		}
		
		if (!field.COMPONENT_TYPE || field.COMPONENT_TYPE == '') {

			if (field.FORMAT_CATEGORY == 'STRING') {
				this.componentType = 'textField';
			} else if (field.FORMAT_CATEGORY == 'NUMBER') {
				this.componentType = 'numberField';
			} else if (field.FORMAT_CATEGORY == 'DATE') {
				this.componentType = 'datePicker';
			}
		} else {
			this.componentType = field.COMPONENT_TYPE;
		}

		this.component = newMap(this.componentType);
		if(this.pageType == 'query'){
			this.fieldTag.readonly = 'true';
		}
		this.name = lower(fieldCode);
		this.fieldTag.name = lower(fieldCode);
		this.component.name = lower(fieldCode);
		this.displayName = this.fieldTag.name;
		this.prompt = fieldDesc;
		this.fieldTag.prompt = fieldDesc;

		if (field.NULLABLE_FLAG == 'N' && this.pageType == 'edit') {
			this.required = 'true';
			this.fieldTag.required = 'true';
		}

		if (bindTarget) {
			this.bindTarget = String(bindTarget);
			this.component.bindtarget = String(bindTarget);
		}
		if (field.DATABASE_LENGTH) {
			this.maxLength = formField.DATABASE_LENGTH;
			this.component.maxlength = formField.DATABASE_LENGTH;
		}
		logger.log("field.FORMAT_CATEGORY:" + field.FORMAT_CATEGORY);
		logger.log("field.NUMBER_FORMATY:" + field.NUMBER_FORMAT);
		logger.log("field.TAUSENDSTEL_FLAG:" + field.TAUSENDSTEL_FLAG);
		logger.log("field.DECIMAL_NUMBER:" + field.DECIMAL_NUMBER);
		
		if (field.FORMAT_CATEGORY == 'NUMBER') {
			if (field.DECIMAL_NUMBER && field.FORMAT_CATEGORY == 'NUMBER') {
				this.allowDecimals = 'true';
				this.component.allowdecimals = 'true';
				this.decimalPrecision = String(field.DECIMAL_NUMBER);
				this.component.decimalprecision = String(field.DECIMAL_NUMBER);
			}
			if (field.TAUSENDSTEL_FLAG == 'Y') {
				if(field.DECIMAL_NUMBER && String(field.DECIMAL_NUMBER) == '2'){
					this.renderer = 'Aurora.formatMoney';
					this.component.renderer = 'Aurora.formatMoney';
				}else if(field.DECIMAL_NUMBER){
					this.renderer = '__dynamicPage'+ this.functionName + this.name + 'renderer';
					this.component.renderer = String(this.renderer);
					this.rendererFunction = '\n function ' + String(this.renderer)
							+ '(value, record, name) { \n' + 'return "'
							+ '"+Aurora.formatNumber(value, ' + String(field.DECIMAL_NUMBER) + ' );' + ' } ';
				}
				
			}
			if (field.CURRENCY_SYMBOL) {
				// 
				this.renderer = '__dynamicPage'+ this.functionName + this.name + 'renderer';
				this.component.renderer = String(this.renderer);
				this.rendererFunction = '\n function ' + String(this.renderer)
						+ '(value, record, name) { \n' + 'return "'
						+ String(field.CURRENCY_SYMBOL)
						+ '"+Aurora.formatMoney(value, record, name);' + ' } ';
			}
		}

		if (field.FORMAT_CATEGORY == 'DATE') {
			if (String(field.DATE_FORMAT) == 'YYYY-MM-DD') {
				this.renderer = 'Aurora.formatDate';
				this.component.renderer = 'Aurora.formatDate';
			} else if (String(field.DATE_FORMAT) == 'YYYY-MM-DD HH:MM:SS') {
				this.renderer = 'Aurora.formatDateTime';
				this.component.renderer = 'Aurora.formatDateTime';
			}
		}

		if (field.FORMAT_CATEGORY == 'STRING') {
			if (field.STRING_FORMAT == 'UPPER') {
				this.fieldTag.typecase = "upper";
			} else if (field.STRING_FORMAT == 'LOWER') {
				this.fieldTag.typecase = "lower"
			}
		}
		logger.log("this.renderer:" + this.renderer);
		logger.log("this.rendererFunction:" + this.rendererFunction);
//		if(field.RENDERER){
//			this.renderer = String(field.RENDERER);
//			this.component.renderer = String(field.RENDERER);
//		}
//		
//		if(field.RENDERER_FUNCTION){
//			this.rendererFunction = String(field.RENDERER_FUNCTION);
//		}

	};
	this.getFieldTag = function() {
		return this.fieldTag;
	};
	this.getComponent = function() {
		return this.component;
	};
	this.getUpdatScript = function() {
		return this.updatScript;
	};
	this.getRendererScrip = function() {
		return this.rendererFunction;
	};

}

_dynamicPage.flexValueSet = function() {
	this.name = '';
	this.valueName = '', this.flexValueSetCode = '';
	this.displayName = '';
	this.componentType = 'lov';
	this.required = 'false';
	this.prompt = '';
	this.valueFieldTag = newMap('field');
	this.fieldTag = newMap('field');
	this.mapping = newMap('mapping');
	this.component = newMap('lov');
	this.bindTarget = '';
	//this.lovUrl = '${/request/@context_path}/modules/flex/fnd_flex_value_set_lov.screen';
	this.lovService = 'flex.PUBLIC.fnd_flex_values_lov';
	this.autoCompleteField ='code_name';
	this.setType = '';
	this.parent = null;
	this.lovGridHeight = "300";
	this.lovHeight = "430";
	this.lovWidth = "600";
	this.title = '';
	this.updatScript = '';
	this.pageType = 'edit';
	this.forQuery = 'Y';
	this.forUpdate = 'Y';
	this.readonly = 'N';
	this.functionName = '';
	this.init = function(bindTarget, fieldCode, fieldDesc, flexValueSetId,
			nullableFlag, parentFieldCode, parentFieldDesc,pageType,forQuery,forUpdate,readonly,functionName) {
		
		if(pageType){
			this.pageType = pageType;
		}
		if(forQuery){
			this.forQuery = forQuery;
		}
		if(forUpdate){
			this.forUpdate = forUpdate;
		}
		if(readonly){
			this.readonly = readonly;
		}
		if(functionName){
			this.functionName = functionName;
		}
		
		this.name = lower(fieldCode);
		this.valueName = lower(fieldCode);
		var parentFieldCodeV;
		var parentFieldDescV;
		if(parentFieldCode){
			parentFieldCodeV = lower(parentFieldCode);
			parentFieldDescV = lower(parentFieldDesc)
		} 
		this.displayName = lower(fieldCode + '_desc');
		this.fieldTag.name = lower(this.displayName);

		this.valueFieldTag.name = lower(this.valueName);

		this.component.name = lower(this.displayName);
		this.prompt = fieldDesc;
		this.fieldTag.prompt = fieldDesc;
		this.title = fieldDesc;
		if(this.pageType == 'query'){
			this.fieldTag.readonly = 'true';
		}
		this.fieldTag.title = fieldDesc;
		this.flexValueSetCode = fieldCode;
		this.fieldTag.lovgridheight = this.lovGridHeight;
		this.fieldTag.lovheight = this.lovHeight;
		this.fieldTag.lovwidth = this.lovWidth;
		this.fieldTag.lovservice = this.lovService + '?flex_value_set_id='
				+ flexValueSetId;
		this.fieldTag.autocompletefield = this.autoCompleteField;
		this.fieldTag.autocomplete = 'true';
		
		if (nullableFlag == 'N'&&this.pageType == 'edit') {
			this.fieldTag.required = 'true';
		}

		var map = newMap('map');
		map.from = 'flex_value_id';
		map.to = this.valueName;
		this.mapping.addChild(map);

		map = newMap('map');
		map.from = 'flex_desc';
		map.to = this.displayName;
		this.mapping.addChild(map);

		this.fieldTag.addChild(this.mapping);

		if (bindTarget) {
			this.bindTarget = String(bindTarget);
			this.component.bindtarget = String(bindTarget);
		}

		if (parentFieldCodeV) {
			this.parentName = parentFieldCodeV;
			this.updatScript = '\n	if (name == "' + parentFieldCodeV + '") { ';
			this.updatScript += ' record.set("' + this.valueName + '", ""); ';
			this.updatScript += ' record.set("' + this.displayName + '", "");';
			this.updatScript += ' record.getField("' + this.displayName
					+ '").setLovPara("parent_flex_value_id", record.get("'
					+ parentFieldCodeV + '"));';
			this.updatScript += ' } ';
		}
	};
	/*
	 * this.init = function(bindTarget, field, type, parentFlexValueSet) { var
	 * fieldCode; var fieldDesc; var parentFieldCode; var parentFieldDesc;
	 * if(type=='FORM'){ fieldCode = lower(field.TEMP_FORM_FIELD_CODE);
	 * fieldDesc = field.TEMP_FORM_FIELD_DESC; if(parentFlexValueSet){
	 * parentFieldCode = lower(parentFlexValueSet.TEMP_FORM_FIELD_CODE);
	 * parentFieldDesc = parentFlexValueSet.TEMP_FORM_FIELD_DESC; } }else
	 * if(type=='GRID'){ fieldCode = lower(field.TEMP_GRID_FIELD_CODE);
	 * fieldDesc = field.TEMP_GRID_FIELD_DESC; if(parentFlexValueSet){
	 * parentFieldCode = lower(parentFlexValueSet.TEMP_GRID_FIELD_CODE);
	 * parentFieldDesc = parentFlexValueSet.TEMP_GRID_FIELD_DESC; } }
	 * 
	 * this.name = lower(fieldCode); this.valueName = fieldCode;
	 * this.displayName = fieldCode + '_desc'; this.fieldTag.name =
	 * lower(this.displayName);
	 * 
	 * this.valueFieldTag.name = lower(this.valueName);
	 * 
	 * this.component.name = lower(this.displayName); this.prompt = fieldDesc;
	 * this.fieldTag.prompt = fieldDesc; this.title = fieldDesc;
	 * this.fieldTag.title = fieldDesc; this.flexValueSetCode = fieldCode;
	 * this.fieldTag.lovgridheight = this.lovGridHeight; this.fieldTag.lovheight =
	 * this.lovHeight; this.fieldTag.lovwidth = this.lovWidth;
	 * this.fieldTag.lovurl = this.lovUrl + '?flex_value_set_id=' +
	 * field.FLEX_VALUE_SET_ID;
	 * 
	 * if (field.NULLABLE_FLAG == 'N') { this.fieldTag.required = 'true'; } //
	 * this.lovService = "sys.sys_user_lov";
	 * 
	 * var map = newMap('map'); map.from = 'flex_value_id'; map.to =
	 * this.valueName; this.mapping.addChild(map);
	 * 
	 * map = newMap('map'); map.from = 'flex_desc'; map.to = this.displayName;
	 * this.mapping.addChild(map);
	 * 
	 * this.fieldTag.addChild(this.mapping);
	 * 
	 * if (bindTarget) { // this.bindTarget=String(bindTarget); this.bindTarget =
	 * String(bindTarget); // this.component.prompt = this.fieldTag.prompt; //
	 * this.component.bindTarget=String(bindTarget); this.component.bindtarget =
	 * String(bindTarget); }
	 * 
	 * if (parentFlexValueSet) { this.parent = parentFlexValueSet;
	 * this.updatScript = '\n if (name == "' + parentFieldCode + '_desc' + '") { ';
	 * this.updatScript += ' record.set("' + this.valueName + '", ""); ';
	 * this.updatScript += ' record.set("' + this.displayName + '", "");';
	 * this.updatScript += ' record.getField("' + this.displayName +
	 * '").setLovPara("parent_flex_value_id", record.get("' + parentFieldCode +
	 * '"));'; this.updatScript += ' } '; } };
	 */
	this.getFieldTag = function() {
		return this.fieldTag;
	};
	this.getComponent = function() {
		return this.component;
	};
	this.getUpdatScript = function() {
		return this.updatScript;
	};
	this.getRendererScrip = function() {
		return this.rendererFunction;
	};
	this.getValueFieldTag = function() {
		return this.valueFieldTag;
	};

}

_dynamicPage.form = function() {
	this.name = '';
	this.isNull = false;
	this.initBm = new ModelService('flex.fnd_flex_temp_forms');
	this.datasetBmName = 'flex.fnd_flex_form_save';
	this.submitUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_tab_save.svc";
	this.queryUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_tab_form_query.svc";
	this.forms = [];
	this.datasetTag = newMap('dataSet');
	this.fieldsTag = newMap('fields');
	this.hBoxs = [];
	this.rowColumns = 3;//每行显示几个字段
	this.formFields = [];

	this.eventsTag = newMap('events');
	this.updateEvent = new _dynamicPage.event();
	this.submitsuccessEvent = new _dynamicPage.event();
	this.submitfailedEvent = new _dynamicPage.event();

	this.scriptText = '';
	this.pageType = 'edit';

	this.analyzeFormField = function(formField, hBox) {

		this.fieldsTag.addChild(formField.getFieldTag());
		if (formField.getValueFieldTag && formField.getValueFieldTag()) {
			this.fieldsTag.addChild(formField.getValueFieldTag());
		}
		hBox.addChild(formField.getComponent());
		if(this.pageType == 'edit'){
			this.updateEvent.addFunctionScript(formField.getUpdatScript());
		}
		if (formField.getRendererScrip()) {
			this.scriptText += ' ' + formField.getRendererScrip() + ' ';
		}
	};

	this.init = function(template_tab_id, tabCode, temp_form_table_pk_name,
			temp_data_table_pk_name,pageType) {
		if(pageType){
			this.pageType = pageType;
		}
		tabCode = lower(tabCode);
		temp_form_table_pk_name = lower(temp_form_table_pk_name);
		temp_data_table_pk_name = lower(temp_data_table_pk_name);
		
		this.name = lower('_dynamic' + tabCode + 'form');
		// this.submitUrl += '?template_tab_id='+template_tab_id;
		// this.queryUrl += '?template_tab_id='+template_tab_id;
		this.datasetTag.id = 'dynamic' + tabCode + 'form_ds_id';
		this.datasetTag.submiturl = this.submitUrl;
		this.datasetTag.queryurl = this.queryUrl;

		this.datasetTag.queryurl += '?' + lower(temp_data_table_pk_name) + '='
				+ $ctx.parameter.temp_header_data_id;
		this.datasetTag.queryurl += '&template_tab_id=' + template_tab_id;
		this.datasetTag.submiturl += '?template_tab_id=' + template_tab_id;

		this.datasetTag.model = this.datasetBmName;
		this.datasetTag.autoquery = "true";
		this.datasetTag.fetchall = "false";
		//this.datasetTag.autopagesize = "true";
		this.datasetTag.autocreate = "true";
		// this.datasetTag.selectable="true";
		var param = {
			template_tab_id : template_tab_id
		};
		this.forms = this.initBm.queryAsMap(param).getChildren();
		
		if(this.pageType == 'edit'){
			this.updateEvent.init('update', '_dynamicForm' + tabCode + 'Update',
					'function _dynamicForm' + tabCode
							+ 'Update(ds, record, name, value, oldvalue)');
			this.submitsuccessEvent.init('submitsuccess', '_dynamicForm' + tabCode
					+ 'Submitsuccess', ' function _dynamicForm' + tabCode
					+ 'Submitsuccess(ds, res)');
			this.submitfailedEvent.init('submitfailed', '_dynamicForm' + tabCode
					+ 'Submitfailed', ' function _dynamicForm' + tabCode
					+ 'Submitfailed(ds, res)');
		}
		if (this.forms.length == 0) {
			this.isNull = true;
			return;
		}

		for ( var i = 0; i < this.forms.length; i++) {
			var formField = {};
			var parentFlexValueSet;
			if (this.forms[i].DATA_SOURCE == 'FLEX_VALUE_SET') {//
				
				parentFlexValueSet = null;
				if (this.forms[i].PARENT_FLEX_VALUE_SET_ID) {

					for ( var j = 0; j < i; j++) {

						if (this.forms[j].FLEX_VALUE_SET_ID == this.forms[i].PARENT_FLEX_VALUE_SET_ID) {
							parentFlexValueSet = this.forms[j];
						}
					}
				}
				formField = new _dynamicPage.flexValueSet();

				formField
						.init(
								String(this.datasetTag.id),
								this.forms[i].TEMP_FORM_FIELD_CODE,
								this.forms[i].TEMP_FORM_FIELD_DESC,
								this.forms[i].FLEX_VALUE_SET_ID,
								this.forms[i].NULLABLE_FLAG,
								parentFlexValueSet ? parentFlexValueSet.TEMP_FORM_FIELD_CODE
										: null,
								parentFlexValueSet ? parentFlexValueSet.TEMP_FORM_FIELD_DESC
										: null,
								this.pageType);

			} else if (this.forms[i].DATA_SOURCE == 'MANUAL') {
				formField = new _dynamicPage.field();
				formField.init(String(this.datasetTag.id), this.forms[i],
						this.forms[i].TEMP_FORM_FIELD_CODE,
						this.forms[i].TEMP_FORM_FIELD_DESC,
						this.pageType);
			}
			this.formFields.push(formField);
		}

		var tabIdField = newMap('field');
		tabIdField.name = 'template_tab_id';
		tabIdField.defaultvalue = template_tab_id;
		var formPkField = newMap('field');
		formPkField.name = lower(temp_form_table_pk_name);
		var headerDataIdField = newMap('field');
		headerDataIdField.name = lower(temp_data_table_pk_name);
		headerDataIdField.defaultvalue = $ctx.parameter.temp_header_data_id;

		this.fieldsTag.addChild(tabIdField);
		this.fieldsTag.addChild(formPkField);
		this.fieldsTag.addChild(headerDataIdField);

		var isNewHbox = false;
		var hBoxChildren = 0;
		var hBox = newMap('hBox');
//		hBox.height = "50";
		hBox.labelwidth = "150";
		for ( var i = 0; i < this.formFields.length; i++) {

			if ((hBoxChildren) % this.rowColumns == 0 && hBoxChildren != 0) {
				hBoxChildren == 1;
				if (hBox) {
					this.hBoxs.push(hBox);
				}
				hBox = newMap('hBox');
//				hBox.height = "50";
				hBox.labelwidth = "150";
			}

			this.analyzeFormField(this.formFields[i], hBox);

			hBoxChildren++;
			if (this.formFields[i].component.componentType == 'textArea'
					|| i + 1 == this.formFields.length) {
				this.hBoxs.push(hBox);
				hBoxChildren = this.rowColumns;
			}
		}

		this.datasetTag.addChild(this.fieldsTag);
		if(this.pageType == 'edit'){
			this.scriptText += ' ' + this.updateEvent.getFunctionScriptText() + ' ';
			this.eventsTag.addChild(this.updateEvent.getEventTag());
			this.scriptText += ' '
					+ this.submitsuccessEvent.getFunctionScriptText() + ' ';
			this.eventsTag.addChild(this.submitsuccessEvent.getEventTag());
			this.scriptText += ' ' + this.submitfailedEvent.getFunctionScriptText()
					+ ' ';
			this.eventsTag.addChild(this.submitfailedEvent.getEventTag());
		}
		
		this.datasetTag.addChild(this.eventsTag);

	};
	this.getDatasetTag = function() {
		return this.datasetTag;
	};
	this.getHBoxs = function() {
		return this.hBoxs;
	};
	this.getScriptText = function() {
		return this.scriptText
	};

}

_dynamicPage.grid = function() {
	this.name = '';
	this.isNull = false;
	this.initBm = new ModelService('flex.fnd_flex_temp_grids');
	this.datasetBmName = 'flex.fnd_flex_grid_save';
	this.submitUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_tab_save.svc";
	this.queryUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_tab_grid_query.svc";
	this.deleteUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_tab_delete.svc"
	this.gridTag = newMap('grid');
	this.gridDBs = [];
	this.datasetTag = newMap('dataSet');
	this.fieldsTag = newMap('fields');
	this.columnsTag = newMap('columns');
	this.gridColumns = [];
	this.editorsTag = newMap('editors');
	this.toolBarTag = newMap('toolBar');
	this.eventsTag = newMap('events');
	this.updateEvent = new _dynamicPage.event();
	this.submitsuccessEvent = new _dynamicPage.event();
	this.submitfailedEvent = new _dynamicPage.event();
	this.pageType = 'edit';

	this.scriptText = '';

	this.analyzeGridField = function(gridColumn) {
		this.fieldsTag.addChild(gridColumn.getFieldTag());

		var columnTag = newMap('column');
		columnTag.name = lower(String(gridColumn.displayName));
		var component = gridColumn.getComponent();
		component.id = String(component.name)
				+ 'editor';
		if(this.pageType == 'edit'){
			columnTag.editor = String(component.id);
			this.updateEvent.addFunctionScript(gridColumn.getUpdatScript());
			if(component.renderer){
				columnTag.renderer = component.renderer;
				component.renderer = null;
			}
			this.editorsTag.addChild(component);
		}
		this.columnsTag.addChild(columnTag);
		
		// hBox.addChild(formField.getComponent());
		if (gridColumn.getRendererScrip()) {
			this.scriptText += ' ' + gridColumn.getRendererScrip() + ' ';
		}
	};

	this.init = function(template_tab_id, tabCode, temp_grid_table_pk_name,
			temp_data_table_pk_name,pageType) {
		if(pageType){
			this.pageType = pageType;
		}
		
		this.name = '_dynamic' + lower(tabCode) + 'grid';

		this.datasetTag.id = '_dynamic' + tabCode + 'grid_ds_id';
		this.datasetTag.submiturl = this.submitUrl;
		this.datasetTag.queryurl = this.queryUrl;
		this.datasetTag.deleteurl = this.deleteUrl;

		this.datasetTag.queryurl += '?' + lower(temp_data_table_pk_name) + '='
				+ $ctx.parameter.temp_header_data_id;
		this.datasetTag.queryurl += '&template_tab_id=' + template_tab_id;
		this.datasetTag.submiturl += '?template_tab_id=' + template_tab_id;
		this.datasetTag.deleteurl += '?template_tab_id=' + template_tab_id;

		this.datasetTag.model = this.datasetBmName;
		this.datasetTag.autoquery = "true";
		this.datasetTag.fetchall = "false";
		this.datasetTag.autopagesize = "true";
		
		var param = {
			template_tab_id : template_tab_id
		};
		this.gridDBs = this.initBm.queryAsMap(param).getChildren();
		if(this.pageType == 'edit'){
			this.updateEvent.init('update', '_dynamicGrid' + tabCode + 'Update',
					'function _dynamicGrid' + tabCode
							+ 'Update(ds, record, name, value, oldvalue)');
			this.submitsuccessEvent.init('submitsuccess', '_dynamicGrid' + tabCode
					+ 'Submitsuccess', ' function _dynamicGrid' + tabCode
					+ 'Submitsuccess(ds, res)');
			this.submitfailedEvent.init('submitfailed', '_dynamicGrid' + tabCode
					+ 'Submitfailed', ' function _dynamicGrid' + tabCode
					+ 'Submitfailed(ds, res)');
			this.datasetTag.selectable = "true";
		}
		this.gridTag.id = this.name + 'Id';
		this.gridTag.name = lower(this.name);
		this.gridTag.marginheight = "240";
		this.gridTag.marginwidth = "160";
		this.gridTag.navbar = "true";
		this.gridTag.bindtarget = String(this.datasetTag.id);

		if (this.gridDBs.length == 0) {
			this.isNull = true;
			return;
		}

		var tabIdField = newMap('field');
		tabIdField.name = 'template_tab_id';
		tabIdField.defaultvalue = template_tab_id;
		var gridPkField = newMap('field');
		gridPkField.name = lower(temp_grid_table_pk_name);
		var headerDataIdField = newMap('field');
		headerDataIdField.name = lower(temp_data_table_pk_name);
		headerDataIdField.defaultvalue = $ctx.parameter.temp_header_data_id;

		this.fieldsTag.addChild(tabIdField);
		this.fieldsTag.addChild(gridPkField);
		this.fieldsTag.addChild(headerDataIdField);

		for ( var i = 0; i < this.gridDBs.length; i++) {
			var gridColumn = {};
			var parentFlexValueSet;
			if (this.gridDBs[i].DATA_SOURCE == 'FLEX_VALUE_SET') {//
				parentFlexValueSet = null;
				if (this.gridDBs[i].PARENT_FLEX_VALUE_SET_ID) {
					for ( var j = 0; j < this.gridDBs.length; j++) {
						if (this.gridDBs[j].FLEX_VALUE_SET_ID == this.gridDBs[i].PARENT_FLEX_VALUE_SET_ID) {
							parentFlexValueSet = this.gridDBs[j];
						}
					}
				}
				gridColumn = new _dynamicPage.flexValueSet();
				// gridColumn.init(null, this.gridDBs[i],
				// 'GRID',parentFlexValueSet);
				gridColumn
						.init(
								null,
								this.gridDBs[i].TEMP_GRID_FIELD_CODE,
								this.gridDBs[i].TEMP_GRID_FIELD_DESC,
								this.gridDBs[i].FLEX_VALUE_SET_ID,
								this.gridDBs[i].NULLABLE_FLAG,
								parentFlexValueSet ? parentFlexValueSet.TEMP_GRID_FIELD_CODE
										: null,
								parentFlexValueSet ? parentFlexValueSet.TEMP_GRID_FIELD_DESC
										: null,
								this.pageType);

			} else if (this.gridDBs[i].DATA_SOURCE == 'MANUAL') {
				gridColumn = new _dynamicPage.field();
				gridColumn.init(null, this.gridDBs[i],
						this.gridDBs[i].TEMP_GRID_FIELD_CODE,
						this.gridDBs[i].TEMP_GRID_FIELD_DESC,
						this.pageType);
			}
			this.gridColumns.push(gridColumn);
		}

		for ( var i = 0; i < this.gridColumns.length; i++) {
			this.analyzeGridField(this.gridColumns[i]);
		}

		// var deleteButton = new _dynamicPage.button();
		// deleteButton.init('_dynamicGrid' + tabCode + 'DeleteBtnId',
		// '_dynamicGrid' + tabCode + 'DeleteBtn', null, 'delete', null,
		// null, 'button');
		if(this.pageType == 'edit'){
			var addButton = new _dynamicPage.button();
			addButton.init('_dynamicGrid' + tabCode + 'AddBtnId', '_dynamicGrid'
					+ tabCode + 'AddBtn', null, 'add', null, null, 'button');
	
			var deleteButton = new _dynamicPage.gridDeleteButton();
			deleteButton.init(tabCode, this,temp_grid_table_pk_name);
			
			this.toolBarTag.addChild(addButton.getTag());
			this.toolBarTag.addChild(deleteButton.getTag());
			this.scriptText += ' ' + deleteButton.getFunctionScript() + ' ';
			
		}

		this.datasetTag.addChild(this.fieldsTag);

		if(this.pageType == 'edit'){
			this.scriptText += ' ' + this.updateEvent.getFunctionScriptText() + ' ';
			this.eventsTag.addChild(this.updateEvent.getEventTag());
			this.scriptText += ' '
					+ this.submitsuccessEvent.getFunctionScriptText() + ' ';
			this.eventsTag.addChild(this.submitsuccessEvent.getEventTag());
			this.scriptText += ' ' + this.submitfailedEvent.getFunctionScriptText()
					+ ' ';
			this.eventsTag.addChild(this.submitfailedEvent.getEventTag());
	
			this.datasetTag.addChild(this.eventsTag);
		}

		this.gridTag.addChild(this.toolBarTag);
		this.gridTag.addChild(this.columnsTag);
		this.gridTag.addChild(this.editorsTag);

	};
	this.getDatasetTag = function() {
		return this.datasetTag;
	};
	this.getGridTag = function() {
		return this.gridTag;
	};
	this.getScriptText = function() {
		return this.scriptText
	};

}

_dynamicPage.button = function() {
	this.id = '';
	this.name = '';
	this.text = '';
	this.type = '';
	this.click = '';
	this.width = "100";
	this.functionScript = '';
	this.tag = {};
	

	this.init = function(id, name, text, type, click, functionscript,
			buttonType,width) {
		this.id = id;
		this.name = lower(name);
		this.text = text;
		this.type = type;
		this.click = click;
		if(width){
			this.width = width;
		}
		this.functionscript = functionscript;
		if (!buttonType) {
			this.tag = newMap('toolbarButton');
		} else {
			this.tag = newMap(buttonType);
		}
	};
	this.getTag = function() {
		if (this.id) {
			this.tag.id = this.id;
		}
		if (this.name) {
			this.tag.name = this.name;
		}
		if (this.text) {
			this.tag.text = this.text;
		}
		if (this.type) {
			this.tag.type = this.type;
		}
		if (this.click) {
			this.tag.click = this.click;
		}
		if (this.width) {
			this.tag.width = this.width;
		}
		return this.tag;
	};

	this.getFunctionScript = function() {
		return this.functionscript;
	}

}

_dynamicPage.gridDeleteButton = function() {
	this.id = '';
	this.name = '';
	this.text = '删除';
	this.type = 'delete';
	this.icon="${/request/@context_path}/images/remove.gif"
	this.click = '';
	this.functionScript = '';
	this.tag = {};

	this.init = function(tabCode, grid,pkNmae) {
		pkNmae = lower(pkNmae);
		this.id = '_dynamic' + tabCode + 'deletebtnid';
		this.name = lower('_dynamic' + tabCode + 'deletebtnname');
		this.click = '_dynamic' + tabCode + 'delete';
		this.tag = newMap('button');
		this.tag.id = this.id;
		this.tag.name = lower(this.name);
		this.tag.click = this.click;
		this.tag.icon = this.icon;
		this.tag.text = this.text;
		// this.tag.type = this.type;

		this.functionscript = "\n";

		this.functionscript += " function _dynamic" + tabCode + "delete(){ \n";
		this.functionscript += " var data = {}; \n";
		this.functionscript += " var	url; \n";
		this.functionscript += " data['_status'] = 'delete'; \n";

		this.functionscript += " var gridDs = $('" + grid.datasetTag.id
				+ "'); \n";

		//this.functionscript += " if (!gridDs.validate()){return;} \n";
		this.functionscript += " var dataRecords = gridDs.getSelected(); \n";
		this.functionscript += " var datas = new Array(); \n";
		this.functionscript += " for (var i = 0;i < dataRecords.length;i++) { \n";
		this.functionscript += "    if(Aurora.isEmpty(dataRecords[i].get('"+pkNmae+"'))){ \n";
		this.functionscript += " 	   gridDs.removeLocal(dataRecords[i]); \n";
		this.functionscript += "    }else{ \n";
		this.functionscript += "       datas.push(dataRecords[i].data); \n";
		this.functionscript += " 	} \n";
		this.functionscript += " } \n";

		this.functionscript += " data['grids']=datas; \n";
		this.functionscript += " if(Aurora.isEmpty(url)){ ";
		this.functionscript += " url = '" + grid.datasetTag.deleteurl + "'; \n";
		this.functionscript += " } \n";

		//this.functionscript += " Aurora.Masker.mask($(_newDynamicPageId).wrap, 'saving...'); \n";

		this.functionscript += " 	Aurora.request({ \n";
		this.functionscript += "         url: url, \n";
		this.functionscript += "         para: data, \n";
		this.functionscript += "         success: function() { \n";
		this.functionscript += "           		gridDs.query(); \n";
		this.functionscript += "                  Aurora.showMessage('', '保存成功!'); \n";
		//this.functionscript += "             Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "             }, \n";
		this.functionscript += "            failure: function() { \n";
		//this.functionscript += "             	Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "                   return; \n";
		this.functionscript += "             }, \n";
		this.functionscript += "              error: function() { \n";
		//this.functionscript += "             	Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "                  return; \n";
		this.functionscript += "              } \n";
		this.functionscript += "          }); \n";
		this.functionscript += " } \n";
	}

	this.getTag = function() {
		return this.tag;
	}

	this.getFunctionScript = function() {
		return this.functionscript;
	}

}

// _dynamicPage.gridDeleteButton = Ext.extend(_dynamicPage.button,
// {
// }
// );

_dynamicPage.saveButton = function() {
	this.id = '';
	this.name = '';
	this.text = '保存';
	this.type = '';
	this.click = '';
	this.width = "100";
	this.functionscript = '';
	this.tag = {};
	this.form = null;
	this.grid = null;

	this.init = function(tabCode, form, grid) {
		this.form = form;
		this.grid = grid;

		this.id = '_dynamic' + tabCode + 'savebtnid';
		this.name = lower('_dynamic' + tabCode + 'savebtnname');
		this.click = '_dynamic' + tabCode + 'save';
		this.tag = newMap('toolbarButton');
		this.tag.text = this.text;
		this.tag.id = this.id;
		this.tag.name = lower(this.name);
		this.tag.click = this.click;
		this.tag.width = this.width;

		this.functionscript = "\n";

		this.functionscript += " function _dynamic" + tabCode + "save(){ \n";
		this.functionscript += " var data = {}; \n";
		this.functionscript += " var	url; \n";
		this.functionscript += " data['_status'] = 'update'; \n";

		if (form && !form.isNull) {

			this.functionscript += " var formDs = $('" + form.datasetTag.id
					+ "'); \n";
			this.functionscript += " if (!formDs.validate()){return;} \n";
			this.functionscript += " data['forms']=formDs.getJsonData(); \n";
			this.functionscript += " url = '" + form.datasetTag.submiturl
					+ "' ;\n";
		}
		if (grid && !grid.isNull) {

			this.functionscript += " var gridDs = $('" + grid.datasetTag.id
					+ "'); \n";

			this.functionscript += " if (!gridDs.validate()){return;} \n";
			this.functionscript += " data['grids']=gridDs.getJsonData(); \n";
			this.functionscript += " if(Aurora.isEmpty(url)){ ";
			this.functionscript += " url = '" + grid.datasetTag.submiturl
					+ "'; \n";
			this.functionscript += " } \n";

		}

		//this.functionscript += " Aurora.Masker.mask($(_newDynamicPageId).wrap, 'saving...'); \n";

		this.functionscript += " 	Aurora.request({ \n";
		this.functionscript += "         url: url, \n";
		this.functionscript += "         para: data, \n";
		this.functionscript += "         success: function() { \n";
		if (form && !form.isNull) {
			this.functionscript += "         		formDs.query(); \n";
		}
		if (grid && !grid.isNull) {
			this.functionscript += "           		gridDs.query(); \n";
		}

		this.functionscript += "                  Aurora.showMessage('', '保存成功!'); \n";
		//this.functionscript += "             Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "             }, \n";
		this.functionscript += "            failure: function() { \n";
		//this.functionscript += "             	Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "                   return; \n";
		this.functionscript += "             }, \n";
		this.functionscript += "              error: function() { \n";
		//this.functionscript += "             	Aurora.Masker.unmask($(_newDynamicPageId).wrap); \n";
		this.functionscript += "                  return; \n";
		this.functionscript += "              } \n";
		this.functionscript += "          }); \n";

		this.functionscript += " } \n";

	}

	this.getTag = function() {
		return this.tag;
	}

	this.getFunctionScript = function() {
		return this.functionscript;
	}
}

_dynamicPage.tab = function() {
	this.tabDB = {};
	this.tabCode = '';
	this.name = '';
	this.id = '';
	this.tabTagWidth = '150';
	this.pageType = 'edit';
	this.tabTag = newMap('tab');
	this.form = null;
	this.grid = null;
	this.scriptText = '';
	this.screenTopToolbar = newMap('screenTopToolbar');
	this.buttons = [];

	this.init = function(tabDB,pageType) {
		this.tabDB = tabDB;
		if(pageType){
			this.pageType = pageType;
		}
		
		this.tabCode = tabDB.template_tab_code;

		this.id = "_dynamic" + tabDB.template_tab_code + "tabid";
		this.name = lower(tabDB.template_tab_code);
		this.tabTag.prompt = tabDB.template_tab_desc;
		this.tabTag.name = lower(this.name);
		this.tabTag.width = this.tabTagWidth;
		
		this.form = new _dynamicPage.form();
		this.form.init(tabDB.template_tab_id, this.tabCode,
				tabDB.temp_form_table_pk_name, tabDB.temp_data_table_pk_name,this.pageType);
		this.grid = new _dynamicPage.grid();
		this.grid.init(tabDB.template_tab_id, this.tabCode,
				tabDB.temp_grid_table_pk_name, tabDB.temp_data_table_pk_name,this.pageType);

		if(this.pageType == 'edit'){
			var saveBtn = new _dynamicPage.saveButton();
			saveBtn.init(this.tabCode, this.form, this.grid);
	
			this.buttons.push(saveBtn);
		}
		this.scriptText += this.form.getScriptText();

		for ( var i = 0; i < this.buttons.length; i++) {
			this.screenTopToolbar.addChild(this.buttons[i].getTag());
			this.scriptText += this.buttons[i].getFunctionScript();
		}

		this.tabTag.addChild(this.screenTopToolbar);
		var hBoxs = this.form.getHBoxs();
		for ( var i = 0; i < hBoxs.length; i++) {
			this.tabTag.addChild(hBoxs[i]);
		}
		if (!this.grid.isNull) {
			this.scriptText += this.grid.getScriptText();
			this.tabTag.addChild(this.grid.getGridTag());
		}

	};
	this.getScriptText = function() {
		return this.scriptText;
	};
	this.getTabTag = function() {
		return this.tabTag;
	};

}

_dynamicPage.tabs = function() {
	this.initBm = new ModelService('flex.fnd_flex_temp_tabs');
	this.tabDBS = [];
	this.tabFields = [];
	this.dataSets = find('dataSets', 'id', '_dynamicPageMainDataSets');
	// this.screenTopToolbar=find('screenTopToolbar', 'id',
	// '_dynamicPageMainScreenTopToolbar');
	this.tabsTag = find('tabs', 'id', '_dynamicPageMaiTtabs');
	this.script = find('script', 'id', '_dynamicPageMainScript');

	this.init = function(temp_instance_id,pageType,dataSets,tabs,script) {
		if(dataSets){
			this.dataSets = dataSets;
		}
		if(tabs){
			this.tabsTag = tabs;
		}
		if(script){
			this.script = script;
			
		}
		this.scriptText = this.script.getData().getText();
		
		var param = {
			temp_instance_id : temp_instance_id
		};
		this.tabDBS = this.initBm.queryAsMap(param).getChildren();

		for ( var i = 0; i < this.tabDBS.length; i++) {
			var tabField = new _dynamicPage.tab();
			tabField.init(this.tabDBS[i],pageType);
			this.tabFields.push(tabField);
		}

		for ( var i = 0; i < this.tabFields.length; i++) {
			var tabField = this.tabFields[i];
			this.scriptText += tabField.getScriptText();
			this.tabsTag.addChild(tabField.getTabTag());

			if (!tabField.form.isNull) {

				this.dataSets.addChild(tabField.form.getDatasetTag());
			}
			if (!tabField.grid.isNull) {
				this.dataSets.addChild(tabField.grid.getDatasetTag());
			}
		}
		this.script.getData().setText(this.scriptText + '\n');

		
//		logger.log("this.dataSets:" + this.dataSets.toXML());
//		logger.log("this.tabsTag:" + this.tabsTag.toXML());
//		logger.log("this.scriptText:" + this.script.getData().getText());
		logger.log("config():" + $config().toXML());

	};
}

_dynamicPage.create = function() {

	var framework_type = $ctx.parameter.framework_type;
	if (framework_type != 'DYNAMIC_PAGE') {
		return;
	}

	var temp_instance_id = $ctx.parameter.temp_instance_id;
	var pageType = $ctx.parameter.pageType;
	if(!pageType){
		
		pageType = 'edit';
	}
	if (!temp_instance_id) {
		println('temp_instance_id is empty!!!!!');
		return;
	}
	var tabs = new _dynamicPage.tabs();
	tabs.init(temp_instance_id,pageType);
}

_dynamicPage.create();
