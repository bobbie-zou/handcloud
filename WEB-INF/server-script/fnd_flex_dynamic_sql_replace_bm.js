_fnd_flex_dynamic_sql_replace_bm = new Object();


var tool = _fnd_flex_dynamic_tools;



_fnd_flex_dynamic_sql_replace_bm.main = function(){
	
	var logger=tool.logger;
	
	var model = $this.getObjectContext();
	
	tool.logger.log('model:'+model.toXML());
	tool.logger.log('_fnd_flex_dynamic_tools.config:'+_fnd_flex_dynamic_tools.config);
	tool.logger.log('_fnd_flex_dynamic_tools:'+_fnd_flex_dynamic_tools.config.toXML());
	
	var modelLabels = tool.findChildsByRoot(model,'flex-model-bm');
	
	if(!modelLabels||modelLabels.length==0){
		tool.logger.log('标签：<flex-model-bm>属性【model】为空！');
		return;
	}

	logger.log('\n ctx.toXML():'+$ctx.toXML());

	var current_parameter = $ctx.getData().get('current_parameter');
	
	
	for(var i=0;i<modelLabels.length;i++){
		var labels = modelLabels[i];
		var modelBm = String(labels.model);
		if(!modelBm){
			tool.logger.log('标签：<flex-model-bm>属性【model】为空！');
			continue;
		}
		
		var replaceTags = tool.findChildsByRoot(labels,'flex-model-replace-bm');
		if(!replaceTags||!replaceTags.length||replaceTags.length==0){
			tool.logger.log('标签：<flex-model-bm>属性name=【'+String(labels.name)+'】未找到替换子标签<flex-model-replace-bm>');
			continue;
		}
		
		var operation = tool.lower(String(replaceTags[i].operation));
		var sqlTag;
		if(!operation){
			tool.logger.log('标签：<flex-model-replace-bm>属性operation未定义');
			continue;
		}else if(operation == 'query'){
			sqlTag =tool.findChild(model,"query-sql");
		}else if(operation = 'insert'){
			var insertNode = tool.findChild(model,"operation",'name','insert');
			if(insertNode){
				sqlTag = tool.findChild(insertNode.getData(),"update-sql");
			}
		}else if(operation == 'update'){
			var updateNode = tool.findChild(model,"operation",'name','update');
			if(updateNode){
				sqlTag = tool.findChild(updateNode.getData(),"update-sql");
			}
		}else if(operation == 'execute'){
			var executeNode = tool.findChild(model,"operation",'name','execute');
			if(executeNode){
				sqlTag = tool.findChild(executeNode.getData(),"update-sql");
			}
		}
		
		if(!sqlTag){
			logger.log('获取sql节点错误！');
			return;
		}
		
		var sql = String(sqlTag.getData().getText());
		
		var paramPath = String(replaceTags.parameterpath);
		if(!paramPath){
			paramPath = '@';
		}
		
		
		var modelBmService = new ModelService(modelBm);
		
		var param = tool.getAttributeByPath(paramPath,current_parameter);
		
		var records = modelBmService.queryAsMap(param).getChildren();
		if(!records||!records.length||records.length<1){
			tool.logger.log('查询【'+modelBm+'】，返回数据为空');
			return null; 	
		}
		
		
		
		for(var j=0;j<replaceTags.length;j++){
			var replaceFrom = String(replaceTags[j].replacefrom);
			var replaceTo = String(replaceTags[j].replaceto);
			var replaceToStr = eval('records[0].'+tool.lower(replaceTo));
			tool.logger.log("replaceToStr:"+replaceToStr);
			if(!replaceToStr){
				replaceToStr = '';
			}
			
			sql=sql.replaceAll(replaceFrom,replaceToStr);
		}
		
		sqlTag.getData().setText(sql);
		
	}
	
	//还原当前参数
	$ctx.getData().put('current_parameter', current_parameter);
};

_fnd_flex_dynamic_sql_replace_bm.main();