var _dynamicPageSelect = {};

_dynamicPageSelect.config = $config();
_dynamicPageSelect.ns_uri = 'http://www.aurora-framework.org/application';
_dynamicPageSelect.find = function(tagName, proName, value) {
	var m = CompositeUtil.findChild(_dynamicPageSelect.config, tagName, proName, value);
	if (m)
		return new CompositeMap(m);
}

_dynamicPageSelect.newMap= function (name) {
	return new CompositeMap('a', _dynamicPageSelect.ns_uri, name);
}

_dynamicPageSelect.select=function(){
		this.initBm=new ModelService('flex.fnd_flex_temp_select_instances'),
		this.tempBDs=[],
		this.screenTopToolbar=_dynamicPageSelect.newMap('screenTopToolbar'),
		this.toolbarButtons=[],
		this.scriptText='',
		
		this.init=function(flex_appl_relevance_id,sourceRecordId,pageType){
			var param={flex_appl_relevance_id:flex_appl_relevance_id,
					framework_type:'DYNAMIC_PAGE'};
			
			this.tempBDs = this.initBm.queryAsMap(param).getChildren();
			println('this.tempBDs:'+this.tempBDs.length);
			for(var i=0;i<this.tempBDs.length;i++){
				var tempBD = this.tempBDs[i]
				var toolbarButton = _dynamicPageSelect.newMap('toolbarButton');
				toolbarButton.text=tempBD.TEMPLATE_DESC;
				toolbarButton.click='_dynamicPageSelect'+tempBD.TEMPLATE_CODE+'open';
				
				this.scriptText+=' \nfunction _dynamicPageSelect'+tempBD.TEMPLATE_CODE+'open(){'
				
				this.scriptText+=" _newDynamicPageFunction('_dynamicPage"+tempBD.TEMPLATE_CODE+"Window','"+tempBD.TEMPLATE_DESC+"',"+sourceRecordId+","+tempBD.TEMP_INSTANCE_ID+",'"+pageType+"');";
					
				this.scriptText+=" } ";
				this.toolbarButtons.push(toolbarButton);
				
				this.screenTopToolbar.addChild(toolbarButton);

			}	
		};
		this.getScreenTopToolbar=function(){
			return this.screenTopToolbar;
		};
		this.getScriptText=function(){
			return this.scriptText;
		};
		this.getToolbarButtons=function(){
			return this.toolbarButtons;
		}
}

_dynamicPageSelect.main=function(){
	var sourceRecordId = $ctx.parameter.source_record_id;
	var group_id = $ctx.parameter.group_id;
	var script = _dynamicPageSelect.find('script','id','_dynamicPageSelectScript');
	var pageType = $ctx.parameter.pageType;
	if(!pageType){
		pageType = 'edit';
	}
	
	var select = new _dynamicPageSelect.select();
	select.init(group_id,sourceRecordId,pageType);
	
	var scriptText = script.getData().getText();
	
	scriptText+= select.getScriptText();
	
	script.getData().setText(scriptText);
	
	var screenTopToolbar = _dynamicPageSelect.find('screenTopToolbar','id','_dynamicPageSelectScreenTopToolbar');
	
	var toolbarButtons = select.getToolbarButtons();
	
	for (var i=0;i<toolbarButtons.length;i++){
		screenTopToolbar.addChild(toolbarButtons[i]);
	}

}

_dynamicPageSelect.main();
