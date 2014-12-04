var _dynamicPageApplView = {};

Object.extend = function (source,destination) {
	for ( var property in source) {
	    destination[property] = source[property];
	}
	return destination;
};
_dynamicPageApplView.Object = function(){
	
};

_dynamicPageApplView.config = $config();
_dynamicPageApplView.ns_uri = 'http://www.aurora-framework.org/application';
_dynamicPageApplView.find = function(tagName, proName, value) {
	var m;
	if(proName&&value){
		m =CompositeUtil.findChild(_dynamicPageLink.config, tagName, proName, value);
	}else if(tagName){
		m =CompositeUtil.findChild(_dynamicPageLink.config, tagName);
	}
	
	if (m){
		return new CompositeMap(m);
	}
};

_dynamicPageApplView.newMap = function(name) {
	return new CompositeMap('a', _dynamicPageApplView.ns_uri, name);
};

var logger = Packages.uncertain.logging.LoggingContext.getLogger($ctx
		.getData(), "aurora.database");

_dynamicPageApplView.create = function(){
	this.initBm = new ModelService('flex.fnd_flex_temp_appl_select_query');
	this.saveHeader = new ModelService('flex.save_temp_header_data');
	
	this.init = function(){
		
		
		var label = _dynamicPageApplView.find('dynamicPage', 'id', 'dynamicPageApplSelect');
		if(!label){
			return;
		}
		var pageType = label.pagetype;
		if(pageType){
			pageType = String(pageType).toLowerCase();
		}else{
			pageType = 'edit';
		}
		var parameter = $ctx.parameter;
		var source_record_id = eval('parameter.'+String(label.pkname));
		var initBmParam={table_name:String(label.tablename),
				source_record_id:source_record_id,
				framework_type:'DYNAMIC_PAGE'};
		var resultMap = this.initBm.queryAsMap(initBmParam);
		if(resultMap){
			this.tempBDs = this.initBm.queryAsMap(initBmParam).getChildren();
		}
		
		if(this.tempBDs&&this.tempBDs.length>0){
			var temp_instance_id = this.tempBDs[0].temp_instance_id;
			
			
			
			//var saveParam = $ctx.createChild("saveParam");
//			var saveParam = {temp_instance_id:temp_instance_id,
//					source_record_id:source_record_id}
//			saveParam.session = $ctx.session;
			$ctx.temp_instance_id =  temp_instance_id;
			$ctx.source_record_id =  source_record_id;
			
			this.saveHeader.execute($ctx);
			
			//$ctx.parameter.temp_header_data_id = $ctx.temp_header_data_id;
			logger.log('temp_header_data_id:'+$ctx.parameter.temp_header_data_id);
			
			var view = _dynamicPageApplView.find('view');
			var script = _dynamicPageApplView.find('script');
			var dateSets = _dynamicPageApplView.find('dataSets');
			var accordionPanel = _dynamicPageApplView.newMap('accordionPanel');
			accordionPanel.height = 600;
			accordionPanel.marginwidth = 130;
			accordionPanel.singleMode="false";
			
				
			var accordions = _dynamicPageApplView.newMap('accordions');
			var accordion = _dynamicPageApplView.newMap('accordion');
			accordion.selected="true";
			accordion.prompt=String(this.tempBDs[0].template_desc);
			accordionPanel.addChild(accordions);
			accordions.addChild(accordion);
			
			var tabPanel = _dynamicPageApplView.newMap('tabPanel');
			//var defaultScreen = _dynamicPageApplView.newMap('defaultScreen');
			tabPanel.height = 570;
			tabPanel.marginwidth = 140;
			var tabs = _dynamicPageApplView.newMap('tabs');
			tabPanel.addChild(tabs);
			var tabsField=new _dynamicPage.tabs();
			
			tabsField.init(temp_instance_id,pageType,dateSets,tabs,script);
			accordion.addChild(tabPanel);
			view.addChild(accordionPanel);

		}
		
	}
}

new _dynamicPageApplView.create().init();