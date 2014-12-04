_pur_ve_info_reports = new Object();

var logger = _fnd_flex_dynamic_tools.logger;
var tool = _fnd_flex_dynamic_tools;

_pur_ve_info_reports.init_properties = function(columnTag,structure_config_id){
	
	if(!structure_config_id){
		logger.log('(_pur_ve_info_reports.init_properties) structure_config_id is null!!!');
		return;
	}
	
	if(!columnTag){
		logger.log('(_pur_ve_info_reports.init_properties) columnTag is null!!!');
		return;
	}
	
	var initBm = new ModelService('pur_ve.PUR_VE3040.pur_ve_config_properties');
	
	var param = {};
	param.structure_config_id = structure_config_id;
	var propertiesDBs = initBm.queryAsMap(param).getChildren();
	
	for ( var i = 0; i < propertiesDBs.length; i++) {
		eval('columnTag.'+String(propertiesDBs.PROPERTY_CODE)+' = "'+String(propertiesDBs.PROPERTY_VALUE)+'"');
	}
	
}


_pur_ve_info_reports.create_report = function(columnsTag,templet_config_id){
	
	if(!templet_config_id){
		logger.log('(_pur_ve_info_reports.create_report) templet_config_id is null!!!');
		return;
	}
	
	var initBm = new ModelService('pur_ve.PUR_VE3040.pur_ve_temp_struct_configs');
	
	var param = {};
	param.templet_config_id = templet_config_id;
	
	var structureDBs = initBm.queryAsMap(param).getChildren();
	
	
	
	for ( var i = 0; i < structureDBs.length; i++) {
		var structure = structureDBs[i];
		var columnTag = tool.newMap('column');
		columnTag.name = String(structure.STATISTICAL_ATTRIBUTE);
		columnTag.prompt = String(structure.STRUCTURE_CONFIG_DESC);
		_pur_ve_info_reports.init_properties(columnTag,String(structure.STRUCTURE_CONFIG_ID));
		columnsTag.addChild(columnTag);
	}
}



_pur_ve_info_reports.main = function(){
	var info_templet_id = tool.getAttributeByPath('/parameter/@info_templet_id',$ctx.getData().get('parameter'));
	
	var columnsTag = tool.find('columns','id','pur_ve30501_detail_grid_columns');
	if(!columnsTag){
		logger.log('(_pur_ve_info_reports.main) 获取【columns】错误!');
		return;
	}
	
	var current_parameter = $ctx.getData().get('current_parameter');
	
	var templet_config_id = tool.getAttributeByPath('/parameter/@templet_config_id',$ctx.getData().get('templet_config_id'));
	if(!templet_config_id){
		logger.log('(_pur_ve_info_reports.main) 获取【templet_config_id】错误!');
		return;
	}
	
	_pur_ve_info_reports.create_report(columnsTag,templet_config_id);
	
	//还原当前参数
	if(current_parameter){
		$ctx.getData().put('current_parameter', current_parameter);
	}
	
}

_pur_ve_info_reports.main();