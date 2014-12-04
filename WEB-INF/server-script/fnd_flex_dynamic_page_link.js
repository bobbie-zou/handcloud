var _dynamicPageLink = {};

Object.extend = function (source,destination) {
	for ( var property in source) {
	    destination[property] = source[property];
	}
	return destination;
};
_dynamicPageLink.Object = function(){
	
};

_dynamicPageLink.config = $config();
_dynamicPageLink.ns_uri = 'http://www.aurora-framework.org/application';
_dynamicPageLink.find = function(tagName, proName, value) {
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

_dynamicPageLink.newMap = function(name) {
	return new CompositeMap('a', _dynamicPageLink.ns_uri, name);
};
_dynamicPageLink.findChilds = function(tagName) {
	var ms = CompositeUtil.findChilds(_dynamicPageLink.config, tagName);
	ms = new Array(ms);

	var maps = [];
	if (ms) {
		for ( var i = 0; i < ms.length; i++) {
			maps.push(new CompositeMap(ms[i]));
		}
	}
	
	return maps.length == 0 ? null : maps;
};

/*
 * _dynamicPageLink.gridLink = Object.extend(_dynamicPageLink.Object,function(){
 * name : '', columnTag : _dynamicPageLink.newMap('column'), renderer : '',
 * rendererText : '', init : function(name, tempApplPkName) {
 * 
 * this.renderer = name + 'renderer';
 * 
 * this.rendererText += " function " + this.renderer + "(value, record, name){ ";
 * this.rendererText += "
 * if(!record.isNew&&!Aurora.isEmpty(record.get('FLEX_APPL_TEMP_GROUP_ID'))){ ";
 * this.rendererText += " var id = record.get('" + tempApplPkName + "'); ";
 * this.rendererText += " var group_id = record.get('FLEX_APPL_TEMP_GROUP_ID'); ";
 * this.rendererText += " return '<a href=\"javascript:new" + this.renderer +
 * "('+id+','+group_id+')\">动态页面</a>'; "; this.rendererText += " } ";
 * this.rendererText += " } "; this.rendererText += " function new" +
 * this.renderer + "(id,group_id){ "; this.rendererText += " new Aurora.Window({ ";
 * this.rendererText += " id:'" + name + "_window', "; this.rendererText += "
 * url:'${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_select.screen'+'?='+id+'&group_id='+group_id, ";
 * this.rendererText += " title:'', "; this.rendererText += " fullScreen:true}); ";
 * this.rendererText += " } ";
 * 
 * this.columnTag.name = this.name; this.columnTag.renderer = this.renderer; }
 * 
 * });
 */

_dynamicPageLink.window = function(){
	this.name='';
	this.script = '';
	this.init = function(name,url,frameworkType){
		this.name = '_new'+name+'window';
		
		this.script += "  function "+this.name + "(id,group_id,pageType){ ";
		this.script += "          new Aurora.Window({ ";
		this.script += "        id:'" + name + "_window', ";
		this.script += "          url:'"+url+"'+'?source_record_id='+id+'&group_id='+group_id+'&framework_type="+frameworkType+"'+'&pageType='+pageType, ";
		this.script += "          title:'', ";
		this.script += "         fullScreen:true}); ";
		this.script += "  } ";
		
	};
	
	this.getScript=function(){
		return this.script;
	};
	
	
};




_dynamicPageLink.dynamicMaintaniLink = function(){
	this.name = '';
	this.url = '${/request/@context_path}/modules/flex/fnd_flex_dynamic_page_select.screen';
	this.frameworkType = 'DYNAMIC_PAGE';
	this.columnTag = _dynamicPageLink.newMap('column');
	this.renderer = '';
	this.rendererText = '';
	
	this.window=new _dynamicPageLink.window();
	this.init = function(name, tempApplPkName,pageType) {
		this.name = name;
		this.renderer = name + 'renderer';

		this.window.init(name,this.url,this.frameworkType);

		this.rendererText += " function " + this.renderer
				+ "(value, record, name){ ";
		this.rendererText += "     if(!record.isNew&&!Aurora.isEmpty(record.get('flex_appl_relevance_id'))){ ";
		this.rendererText += "         var id = record.get('" + tempApplPkName
				+ "'); ";
		this.rendererText += "         var group_id = record.get('flex_appl_relevance_id'); ";
		this.rendererText += "         return '<a href=\"javascript:"
				+ this.window.name + "('+id+','+group_id+','+\"'"+pageType+"'\"+')\">动态页面</a>'; ";
		this.rendererText += "     } ";
		this.rendererText += " } ";
		
		this.rendererText += this.window.getScript();
		
		this.columnTag.name = this.name;
		this.columnTag.renderer = this.renderer;
	};

};

_dynamicPageLink.segmentMaintaniLink = function(){
	this.name = '';
	this.url = '${/request/@context_path}/modules/flex/fnd_flex_dynamic_segment_main.screen';
	this.frameworkType = 'SEGMENT';
	this.columnTag = _dynamicPageLink.newMap('column');
	this.renderer = '';
	this.rendererText = '';
	
	this.window=new _dynamicPageLink.window();
	this.init = function(name, tempApplPkName,pageType) {
		this.name = name;
		this.renderer = name + 'renderer';
		this.window.init(name,this.url,this.frameworkType);

		this.rendererText += " function " + this.renderer
				+ "(value, record, name){ ";
		this.rendererText += "     if(!record.isNew&&!Aurora.isEmpty(record.get('flex_appl_relevance_id'))){ ";
		this.rendererText += "         var id = record.get('" + tempApplPkName
				+ "'); ";
		this.rendererText += "         var group_id = record.get('flex_appl_relevance_id'); ";
		this.rendererText += "         return '<a href=\"javascript:"
			+ this.window.name + "('+id+','+group_id+','+\"'"+pageType+"'\"+')\">标准段</a>'; ";
		this.rendererText += "     } ";
		this.rendererText += " } ";
		
		this.rendererText += this.window.getScript();
		
		this.columnTag.name = this.name;
		this.columnTag.renderer = this.renderer;
	};

};



_dynamicPageLink.link = function() {

	var script;
	var scriptText;
	
	var logger=Packages.uncertain.logging.LoggingContext.getLogger($ctx.getData(),"aurora.database");

	var dataSets = _dynamicPageLink.find("dataSets");
	
	var dynamicMaintainLabel = _dynamicPageLink.find('dynamicPage', 'id', 'dynamicMaintain');
	if (dynamicMaintainLabel) {
		script = _dynamicPageLink.find('script');
		scriptText = script.getData().getText();
		var pageType = dynamicMaintainLabel.pagetype;
		if(pageType){
			pageType=String(pageType).toLowerCase();
		}else{
			pageType='edit';
		}
		if (dynamicMaintainLabel.type == 'grid') {

			var columnsTag;
			
			columnsTag= _dynamicPageLink.find('columns', 'id',dynamicMaintainLabel.columns);
			
			
			columnsTag.removeChild(dynamicMaintainLabel);
			var dynamicMaintaniLink = new _dynamicPageLink.dynamicMaintaniLink();
			println("dynamicLabel.pkname:"+dynamicMaintainLabel.pkname);
			dynamicMaintaniLink.init('_dynamicMaintainLink' , String(dynamicMaintainLabel.pkname),pageType);
	
			scriptText += '\n ';
	
			scriptText += dynamicMaintaniLink.rendererText;
	
			columnsTag.addChild(dynamicMaintaniLink.columnTag);
			
			script.getData().setText(scriptText);
		}
	}
	
	var segmentMaintainLabel = _dynamicPageLink.find('dynamicPage', 'id', 'segmentMaintain');
	if (segmentMaintainLabel) {
		script = _dynamicPageLink.find('script');
		scriptText = script.getData().getText();
		var pageType = segmentMaintainLabel.pagetype;
		if(pageType){
			pageType=String(pageType).toLowerCase();
		}else{
			pageType='edit';
		}
		if (segmentMaintainLabel.type == 'grid') {
			var script = _dynamicPageLink.find('script');
			var columnsTag = _dynamicPageLink.newMap(segmentMaintainLabel.getData().getParent());
			columnsTag= _dynamicPageLink.find('columns', 'id',segmentMaintainLabel.columns);
			
			columnsTag.removeChild(segmentMaintainLabel);
			var segmentMaintainLink = new _dynamicPageLink.segmentMaintaniLink();
			
			segmentMaintainLink.init('_segmentMaintain' , String(segmentMaintainLabel.pkname),pageType);
	
			scriptText += '\n ';
	
			scriptText += segmentMaintainLink.rendererText;
	
			columnsTag.addChild(segmentMaintainLink.columnTag);
			
			script.getData().setText(scriptText);

		}
	}
	
	
	
}

_dynamicPageLink.link();
