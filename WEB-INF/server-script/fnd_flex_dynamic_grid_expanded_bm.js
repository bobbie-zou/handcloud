var _fnd_flex_dynamic_grid_expanded_bm = new Object();

var tool = _fnd_flex_dynamic_tools;

//初始化查询SQL
_fnd_flex_dynamic_grid_expanded_bm.init_query = function(tmpl_instance_id,appl_table_id,appl_table_alias_name){
	var model = $this.getObjectContext();
	var logger=tool.logger;
	var querySqlNode =tool.findChild(model,"query-sql");
	
	var querySql;
	
	if(querySqlNode){
		if(!tmpl_instance_id){
			querySql = querySqlNode.getData().getText();
     	 	querySql = String(querySql).replaceAll('#flex_query_sql#','0');
     	 	querySqlNode.getData().setText(querySql);
     	 	return;
		}
		
		var param = {};
		param.appl_table_id = appl_table_id;
		param.tmpl_instance_id = tmpl_instance_id;
		param.user_id = $session.user_id;
		if(appl_table_alias_name){
			param.appl_table_alias_name = appl_table_alias_name;
		}
	
		var querySql;
		var querySqlBm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_query_sql');
		var querySqlDBs = querySqlBm.queryAsMap(param).getChildren();
	    if(querySqlDBs&&querySqlDBs.length>0){	 
     	 	querySql = querySqlNode.getData().getText();
     	 	tool.logOthers('\n String(querySqlDBs[0].query_sql):'+String(querySqlDBs[0].query_sql));
     	 	querySql = String(querySql).replaceAll('#flex_query_sql#',String(querySqlDBs[0].query_sql));
     	 	querySqlNode.getData().setText(querySql);

		}else{
			querySql = querySqlNode.getData().getText();
     	 	querySql = String(querySql).replaceAll('#flex_query_sql#','0');
     	 	querySqlNode.getData().setText(querySql);
		}
	}

};


_fnd_flex_dynamic_grid_expanded_bm.init_insert = function(tmpl_instance_id,appl_table_id,appl_pk_var_name){
	var model = $this.getObjectContext();
	var logger=tool.logger;
	var insertNode = tool.findChild(model,"operation",'name','insert');
    if(insertNode){
    	var insertSqlNode = tool.findChild(insertNode.getData(),"update-sql");
    	if(!tmpl_instance_id){
    		saveSql = insertSqlNode.getData().getText();
     	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#','');
     	 	insertSqlNode.getData().setText(saveSql);
     	 	return;
		}
    	
	    var param = {};
	    
		param.appl_table_id = appl_table_id;
		param.appl_pk_var_name = appl_pk_var_name;
		param.tmpl_instance_id = tmpl_instance_id;
		
		var saveSql;
	    var saveSqlBm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_save_sql');
	    var saveSqlDB = saveSqlBm.queryAsMap(param).getChildren();
	    if(saveSqlDB&&saveSqlDB.length>0){
     	 	saveSql = insertSqlNode.getData().getText();
     	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#',String(saveSqlDB[0].SAVE_SQL));
     	 	insertSqlNode.getData().setText(saveSql);
	    }else{
	    	saveSql = insertSqlNode.getData().getText();
     	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#','');
     	 	insertSqlNode.getData().setText(saveSql);
	    }
    }
    
};

_fnd_flex_dynamic_grid_expanded_bm.init_update = function(tmpl_instance_id,appl_table_id,appl_pk_var_name){
	var model = $this.getObjectContext();
	tool.logOthers('\n model:'+model.toXML());
	var logger=tool.logger;
	var updateNode = tool.findChild(model,"operation",'name','update');
	
    if(updateNode){
    	var updateSqlNode = tool.findChild(updateNode.getData(),"update-sql");
    	if(!tmpl_instance_id){
    		saveSql = updateSqlNode.getData().getText();
     	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#','');
     	 	updateSqlNode.getData().setText(saveSql);
     	 	return;
		}
    	
	    var param = {};
		
		param.appl_table_id = appl_table_id;
		param.tmpl_instance_id = tmpl_instance_id;
		param.appl_pk_var_name = appl_pk_var_name;
	    
		var saveSql;
	    var saveSqlBm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_save_sql');
	    var saveSqlDB = saveSqlBm.queryAsMap(param).getChildren();
	    if(saveSqlDB&&saveSqlDB.length>0){
	 	 	saveSql = updateSqlNode.getData().getText();
	 	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#',String(saveSqlDB[0].SAVE_SQL));
	 	 	updateSqlNode.getData().setText(saveSql);
	    }else{
	    	saveSql = updateSqlNode.getData().getText();
	 	 	saveSql = String(saveSql).replaceAll('#flex_save_sql#','');
	 	 	updateSqlNode.getData().setText(saveSql);
	    }
    }
    
};

//
//
//
//_fnd_flex_dynamic_grid_expanded_bm.init_bm = function(tmpl_instance_id,appl_table_id,appl_pk_var_name){
//	
//	
//	var model = $this.getObjectContext();
//    var logger=tool.logger;
//    var querySqlNode =tool.findChild(model,"query-sql");
//    var insertNode = tool.findChild(model,"operation",'name','insert');
//    var insertSqlNode = tool.findChild(insertNode.getData(),"update-sql");
//    
//    var updateNode = tool.findChild(model,"operation",'name','update');
//    var updateSqlNode = tool.findChild(updateNode.getData(),"update-sql");
//    
//    var querySql;
//    var saveSql;
//    
//    var current_parameter = $ctx.getData().get('current_parameter');
//    logger.log('\n current_parameter:'+current_parameter);
//    if(current_parameter){
//        logger.log('\n current_parameter:'+current_parameter);
//    }
//    
//    var querySqlBm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_query_sql');
//    var saveSqlBm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_save_sql');
//    
//    var param ={};
//    param.tmpl_instance_id = tmpl_instance_id;
//    param.appl_table_id = appl_table_id;
//    param.user_id=$session.user_id;
//    param.appl_pk_var_name=appl_pk_var_name;
//    
//    var querySqlDB = querySqlBm.queryAsMap(param).getChildren();
//    if(querySqlDB&&querySqlDB.length>0){
//     	 if(querySqlNode){
//     	 	querySql = querySqlNode.getData().getText();
//     	 	querySql = String.replace(querySql,'#flex_query_sql#',String(querySqlDB[0].query_sql));
//     	 	querySqlNode.getData().setText(querySql);
//     	 }
//    }
//    
//    var saveSqlDB = saveSqlBm.queryAsMap(param).getChildren();
//    if(saveSqlDB&&saveSqlDB.length>0){
//     	 if(insertSqlNode){
//     	 	saveSql = insertSqlNode.getData().getText();
//     	 	saveSql = String.replace(saveSql,'#flex_save_sql#',String(saveSqlDB[0].SAVE_SQL));
//     	 	insertSqlNode.getData().setText(saveSql);
//     	 }
//     	 if(updateSqlNode){
//     	 	saveSql = updateSqlNode.getData().getText();
//     	 	saveSql = String.replace(saveSql,'#flex_save_sql#',String(saveSqlDB[0].SAVE_SQL));
//     	 	updateSqlNode.getData().setText(saveSql);
//     	 }
//    }
//
//    $ctx.getData().put('current_parameter', current_parameter);
//    
//    current_parameter = $ctx.getData().get('current_parameter');
//    logger.log('\n current_parameter:'+current_parameter);
//    if(current_parameter){
//        logger.log('\n after  current_parameter:'+current_parameter);
//        //current_parameter.put('source_record_id', current_parameter.get('rfx_line_item_id'));
//        
//    }
//    
//    
//    logger.log('\n end ctx.toXML():'+$ctx.toXML());
//    if($ctx.getData().get('current_parameter')){
//    	logger.log('\n ctx.toXML():'+$ctx.toXML());
//    }
//};

_fnd_flex_dynamic_grid_expanded_bm.main = function(){
	
	var logger=tool.logger;
	
	var model = $this.getObjectContext();
	
	logger.log('\n ctx.toXML():'+$ctx.toXML());

	var current_parameter = $ctx.getData().get('current_parameter');
//	if(current_parameter){
//		logger.log('\n current_parameter.toXML():'+current_parameter.toXML());
//	}
	
	var operation_name;
//	logger.log('\n ctx.requested_operation:'+$ctx.requested_operation);
//	logger.log('\n ctx.BusinessModelOperation):'+$ctx.BusinessModelOperation);
	
	var getAttributeByParameter;
	
	if(current_parameter){
		operation_name = tool.lower(String(current_parameter.get('_status')));
		getAttributeByParameter = current_parameter;
	}else if($ctx.requested_operation){
		//logger.log('\n ctx.requested_operation:'+tool.lower(String($ctx.requested_operation)));
		operation_name = tool.lower(String($ctx.requested_operation));
		getAttributeByParameter = $ctx.getData().get('parameter');
	}
	//logger.log('\n operation_name:'+operation_name);
	if(!operation_name){
		tool.logOthers('\n operation_name为空，无operation操作！');
		return;
	}
	//记录当前参数
	
	
	//if(operation_name == 'query'){
		var queryTag = tool.findChild(model,'flex-segmentBm', 'type', 'grid_expanded_bm_query');
		if(queryTag){
			var header_table_name = String(queryTag.headertablename);
			var line_table_name = String(queryTag.linetablename);
			var header_id_path = String(queryTag.headeridpath);
			var header_id = tool.getAttributeByPath(header_id_path,getAttributeByParameter);
			var template_field_name = String(queryTag.templatefieldname);
			var appl_table_alias_name = String(queryTag.appltablealiasname?queryTag.appltablealiasname:'');
			
			var template_id = tool.getTemplateId(header_table_name,header_id,template_field_name);
			
			var param = {};
			param.header_table_name = header_table_name;
			param.line_table_name = line_table_name;
			param.source_record_id = header_id;
			param.template_id = template_id;
			param.framework_type = 'SEGMENT';
			param.user_id = $session.user_id;
			
			tool.logOthers('\n param.template_id:'+param.template_id);
			
			var bm_init_bm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_bm_init');
			var bm_init_records = bm_init_bm.queryAsMap(param).getChildren();
			if(!bm_init_records||!bm_init_records.length||bm_init_records.length<1){
				tool.logTag('初始化bm错误，请检查标签<flex-segmentBm>配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				return; 	
			}
			
			var tmpl_instance_id = bm_init_records[0].TMPL_INSTANCE_ID;
			var header_table_id = bm_init_records[0].HEADER_TABLE_ID;
			var line_table_id = bm_init_records[0].LINE_TABLE_ID;
			
//			if(!tmpl_instance_id){
//				logger.log('获取【tmpl_instance_id】错误，请检查！');
//				return; 
//			}
			if(!header_table_id){
				tool.logTag('获取header_table_id错误，请检查标签<flex-segmentBm>中属性【headerTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return; 
				tmpl_instance_id = null;
			}
			if(!line_table_id){
				tool.logTag('获取line_table_id错误，请检查标签<flex-segmentBm>中属性【lineTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return; 
				tmpl_instance_id = null;
			}
			
			tool.logOthers('\n tmpl_instance_id:'+tmpl_instance_id);
			
			_fnd_flex_dynamic_grid_expanded_bm.init_query(tmpl_instance_id,header_table_id,appl_table_alias_name);
		}
	//}else if(operation_name == 'insert'){
		var insertTag = tool.findChild(model,'flex-segmentBm', 'type', 'grid_expanded_bm_insert');
		if(insertTag){
			var header_table_name = String(insertTag.headertablename);
			var line_table_name = String(insertTag.linetablename);
			var header_id_path = String(insertTag.headeridpath);
			var header_id = tool.getAttributeByPath(header_id_path,getAttributeByParameter);
			var template_field_name = String(insertTag.templatefieldname);
			
			var template_id = tool.getTemplateId(header_table_name,header_id,template_field_name);
			
			var appl_pk_var_name = String(insertTag.applpkvarname);
			
			var param = {};
			param.header_table_name = header_table_name;
			param.line_table_name = line_table_name;
			param.source_record_id = header_id;
			param.template_id = template_id;
			param.framework_type = 'SEGMENT';
			param.user_id = $session.user_id;
			
			var bm_init_bm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_bm_init');
			var bm_init_records = bm_init_bm.queryAsMap(param).getChildren();
			if(!bm_init_records||!bm_init_records.length||bm_init_records.length<1){
				tool.logTag('初始化bm错误，请检查标签<flex-segmentBm>配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				return; 	
			}
			
			var tmpl_instance_id = bm_init_records[0].TMPL_INSTANCE_ID;
			var header_table_id = bm_init_records[0].HEADER_TABLE_ID;
			var line_table_id = bm_init_records[0].LINE_TABLE_ID;
			
//			if(!tmpl_instance_id){
//				logger.log('获取【tmpl_instance_id】错误，请检查！');
//				return; 
//			}
			if(!header_table_id){
				tool.logTag('获取header_table_id错误，请检查标签<flex-segmentBm>中属性【headerTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return; 
				tmpl_instance_id = null;
			}
			if(!line_table_id){
				tool.logTag('获取line_table_id错误，请检查标签<flex-segmentBm>中属性【lineTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return;
				tmpl_instance_id = null;
			}
			
			tool.logOthers('\n tmpl_instance_id:'+tmpl_instance_id);
			
			_fnd_flex_dynamic_grid_expanded_bm.init_insert(tmpl_instance_id,line_table_id,appl_pk_var_name);
		}
	//}else if(operation_name == 'update'){
		var updateTag = tool.findChild(model,'flex-segmentBm', 'type', 'grid_expanded_bm_update');
		if(updateTag){
		
			var header_table_name = String(updateTag.headertablename);
			var line_table_name = String(updateTag.linetablename);
			var header_id_path = String(updateTag.headeridpath);
			var header_id = tool.getAttributeByPath(header_id_path,getAttributeByParameter);
			logger.log('\n header_id_path:'+header_id_path);
			logger.log('\n header_id:'+header_id);
			var template_field_name = String(updateTag.templatefieldname);
			
			var template_id = tool.getTemplateId(header_table_name,header_id,template_field_name);
			
			var appl_pk_var_name = String(updateTag.applpkvarname);
			
			var param = {};
			param.header_table_name = header_table_name;
			param.line_table_name = line_table_name;
			param.source_record_id = header_id;
			param.template_id = template_id;
			param.framework_type = 'SEGMENT';
			param.user_id = $session.user_id;
			
			var bm_init_bm = new ModelService('flex.PUBLIC.fnd_flex_segment_grid_bm_init');
			var bm_init_records = bm_init_bm.queryAsMap(param).getChildren();
			if(!bm_init_records||!bm_init_records.length||bm_init_records.length<1){
				tool.logTag('初始化bm错误，请检查标签<flex-segmentBm>配置是否正确！');
				return; 	
			}
			
			var tmpl_instance_id = bm_init_records[0].TMPL_INSTANCE_ID;
			var header_table_id = bm_init_records[0].HEADER_TABLE_ID;
			var line_table_id = bm_init_records[0].LINE_TABLE_ID;
			
//			if(!tmpl_instance_id){
//				logger.log('获取【tmpl_instance_id】错误，请检查！');
//				return; 
//			}
			if(!header_table_id){
				tool.logTag('获取header_table_id错误，请检查标签<flex-segmentBm>中属性【headerTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return; 
				tmpl_instance_id = null;
			}
			if(!line_table_id){
				tool.logTag('获取line_table_id错误，请检查标签<flex-segmentBm>中属性【lineTableName】配置是否正确！');
				//还原当前参数
				$ctx.getData().put('current_parameter', current_parameter);
				//return;
				tmpl_instance_id = null;
			}
			
			tool.logOthers('\n tmpl_instance_id:'+tmpl_instance_id);
			
			_fnd_flex_dynamic_grid_expanded_bm.init_update(tmpl_instance_id,line_table_id,appl_pk_var_name);
		}
	//}
	//还原当前参数
	$ctx.getData().put('current_parameter', current_parameter);
};

_fnd_flex_dynamic_grid_expanded_bm.main();

