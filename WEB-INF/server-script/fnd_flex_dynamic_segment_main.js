_dynamicSegment={};

var logger=Packages.uncertain.logging.LoggingContext.getLogger($ctx.getData(),"aurora.database");

_dynamicSegment.form = function(){

	this.initBm = new ModelService('flex.fnd_flex_segment_insc_attrs');
	
	this.name = '';
	this.isNull = false;
	this.datasetBmName = 'flex.fnd_flex_form_save';
	this.submitUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_segment_data_save.svc";
	this.queryUrl = "${/request/@context_path}/modules/flex/fnd_flex_dynamic_segment_data_query.svc";
	this.forms = [];
	this.datasetTag = newMap('dataSet');
	this.fieldsTag = newMap('fields');
	this.hBoxs = [];
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

	this.init = function(temp_code,temp_instance_id,appl_table_id,source_record_id,pageType) {
		if(pageType){
			this.pageType = pageType;
		}
		this.name = lower('_dynamicFlex' + temp_code + 'form');
		
		this.datasetTag.id = '_dynamicFlex' + temp_code + 'formDsId';
		this.datasetTag.submiturl = this.submitUrl;
		this.datasetTag.queryurl = this.queryUrl;
		
		this.datasetTag.queryurl += '?temp_instance_id='+temp_instance_id;
		this.datasetTag.queryurl += '&appl_table_id='+appl_table_id;
		this.datasetTag.queryurl += '&source_record_id='+source_record_id;
		this.datasetTag.submiturl += '?temp_instance_id='+temp_instance_id;
		this.datasetTag.submiturl += '&appl_table_id='+appl_table_id;
		this.datasetTag.submiturl += '&source_record_id='+source_record_id;
		
		this.datasetTag.model = this.datasetBmName;
		this.datasetTag.autoquery = "true";
		this.datasetTag.fetchall = "true";
		this.datasetTag.autocreate = "true";
		
		var param = {
				temp_instance_id : temp_instance_id
		};
		this.forms = this.initBm.queryAsMap(param).getChildren();
		if(this.pageType == 'edit'){
			this.updateEvent.init('update', '_dynamicFlexForm' + temp_code + 'Update',
					'function _dynamicFlexForm' + temp_code
							+ 'Update(ds, record, name, value, oldvalue)');
			this.submitsuccessEvent.init('submitsuccess', '_dynamicFlexForm' + temp_code
					+ 'Submitsuccess', ' function _dynamicFlexForm' + temp_code
					+ 'Submitsuccess(ds, res)');
			this.submitfailedEvent.init('submitfailed', '_dynamicFlexForm' + temp_code
					+ 'Submitfailed', ' function _dynamicFlexForm' + temp_code
					+ 'Submitfailed(ds, res)');
		}
		if (this.forms.length == 0) {
			this.isNull = true;
			return;
		}

		for ( var i = 0; i < this.forms.length; i++) {
			var formField = {};

			if (this.forms[i].FLEX_VALUE_SET_ID) {//值集
				var parentFlexValueSet;
				parentFlexValueSet = null;
				if (this.forms[i].PARENT_FLEX_VALUE_SET_ID) {
					
					for ( var j = 0; j < i; j++) {
						
						if (this.forms[j].FLEX_VALUE_SET_ID == this.forms[i].PARENT_FLEX_VALUE_SET_ID) {
							parentFlexValueSet = this.forms[j];
						}
					}
				}
				formField = new _dynamicPage.flexValueSet();
				
				formField.init(String(this.datasetTag.id),this.forms[i].APPL_ATTRIBUTE,
						this.forms[i].ATTRIBUTE_DESC,this.forms[i].FLEX_VALUE_SET_ID,
						this.forms[i].NULLABLE_FLAG,
						parentFlexValueSet?parentFlexValueSet.APPL_ATTRIBUTE:null,
						parentFlexValueSet?parentFlexValueSet.ATTRIBUTE_DESC:null,
								this.pageType);

			} else {//值集
				formField = new _dynamicPage.field();
				formField.init(String(this.datasetTag.id), this.forms[i],this.forms[i].APPL_ATTRIBUTE,
						this.forms[i].ATTRIBUTE_DESC,
						this.pageType);
			}

			this.formFields.push(formField);
		}

/*		var tabIdField = newMap('field');
		tabIdField.name = 'template_tab_id';
		tabIdField.defaultvalue = template_tab_id;
		var formPkField =  newMap('field');
		formPkField.name = lower(temp_form_table_pk_name);
		var headerDataIdField = newMap('field');
		headerDataIdField.name = lower(temp_data_table_pk_name);
		headerDataIdField.defaultvalue = $ctx.parameter.temp_header_data_id;*/
		
		/*this.fieldsTag.addChild(tabIdField);
		this.fieldsTag.addChild(formPkField);
		this.fieldsTag.addChild(headerDataIdField);*/
		
		var isNewHbox = false;
		var hBoxChildren = 0;
		var hBox = newMap('hBox');
		hBox.height = "50";
		hBox.labelwidth = "80";
		for ( var i = 0; i < this.formFields.length; i++) {

			if ((hBoxChildren) % 4 == 0&&hBoxChildren!=0) {
				hBoxChildren == 1;
				if (hBox) {
					this.hBoxs.push(hBox);
				}
				hBox = newMap('hBox');
				hBox.height = "50";
				hBox.labelwidth = "80";
			}

			this.analyzeFormField(this.formFields[i], hBox);

			hBoxChildren++;
			if (this.formFields[i].component.componentType == 'textArea'
					|| i + 1 == this.formFields.length) {
				this.hBoxs.push(hBox);
				hBoxChildren = 4;
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
	
			this.datasetTag.addChild(this.eventsTag);
		}
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


_dynamicSegment.segmentPage = function(){
	this.initBm = new ModelService('flex.fnd_flex_temp_select_instances');
	this.name = '';
	this.segmentDBS = [];
	this.form = new _dynamicSegment.form();
	this.dataSets = find('dataSets', 'id', '_dynamicSegmentMainDataSets');
	this.tag = find('defaultScreen', 'id', '_dynamicSegmentMainDefaultScreen');
	this.screenTopToolbar = find('screenTopToolbar', 'id', '_dynamicSegmentMainScreenTopToolbar');
	this.script = find('script', 'id', '_dynamicSegmentMainScript');
	this.scriptText = find('script', 'id', '_dynamicSegmentMainScript').getData()
			.getText();
	this.buttons = [];
	this.pageType = 'edit';

	this.init = function(flex_appl_relevance_id,pageType) {
		if(pageType){
			this.pageType = pageType;
		}
		var param = {
				flex_appl_relevance_id : flex_appl_relevance_id,
				framework_type : 'SEGMENT'
		};
		
		this.segmentDBS = this.initBm.queryAsMap(param).getChildren();
		
		if(!this.segmentDBS||this.segmentDBS.length==0){
			
			return;
		}
		
		this.name = this.segmentDBS[0].TEMPLATE_CODE;

		this.form.init(this.name,this.segmentDBS[0].TEMP_INSTANCE_ID, this.segmentDBS[0].APPL_TABLE_ID, this.segmentDBS[0].SOURCE_RECORD_ID,this.pageType);
		
		//this.tag.addChild(this.form.getHBoxs());
		//this.dataSets.addChild(this.form.getDatasetTag());
		
		
		if(this.pageType == 'edit'){
			var saveBtn = new _dynamicPage.saveButton();
			saveBtn.init(this.name, this.form, this.grid);
			this.buttons.push(saveBtn);
		}
		
		for ( var i = 0; i < this.buttons.length; i++) {
			this.screenTopToolbar.addChild(this.buttons[i].getTag());
			this.scriptText += this.buttons[i].getFunctionScript();
		}
		
		

		if (!this.form.isNull) {
			var hBoxs = this.form.getHBoxs();
			for ( var i = 0; i < hBoxs.length; i++) {
				this.tag.addChild(hBoxs[i]);
			}
		
			this.dataSets.addChild(this.form.getDatasetTag());
		}
		
		this.scriptText += this.form.getScriptText();
		this.script.getData().setText(this.scriptText + '\n');
	

	};
	
}


_dynamicSegment.create = function(){
	var framework_type = $ctx.parameter.framework_type;
	if(framework_type!='SEGMENT'){
		return;
	}
	
	var flex_appl_relevance_id = $ctx.parameter.group_id;
	var pageType = $ctx.parameter.pageType;
	if(pageType){
		pageType = String(pageType).toLowerCase();
	}else{
		pageType = 'edit';
	}

	var segmentPage = new _dynamicSegment.segmentPage();
	segmentPage.init(flex_appl_relevance_id,pageType);
	
}

_dynamicSegment.create();


