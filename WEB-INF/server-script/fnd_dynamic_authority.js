var _fnd_dynamic_authority = new Object();

var tool = _fnd_flex_dynamic_tools;

//权限类型
var c_authority_type_1 = 'CREATER';//创建人
var c_authority_type_2 = 'RECEIVER';//接收人
var c_authority_type_3 = 'COMPANY';//公司
var c_authority_type_4 = 'BUSINESS_UNIT';//业务单元
var c_authority_type_5 = 'PUR_ORGANIZATION';//采购组织
var c_authority_type_6 = 'INV_ORGANIZATION';//库存组织
var c_authority_type_7 = 'SD_ORGANIZATION';//销售组织
var c_authority_type_8 = 'VENDOR';//供应商
var c_authority_type_9 = 'CLIENT';//客户
var c_authority_type_10 = 'PURHASE_MATERIAL';//采购物料
var c_authority_type_11 = 'SALES_PRODUCTION';//销售产品
var c_authority_type_12 = 'VENDOR_SITE';//供应商地点
var c_authority_type_13 = 'CLIENT_SITE';//客户地点

var screen_error_remind = false; // screen页面错误提醒开关,true打开，false关闭

/**
 * 错误处理函数，主要作用：统一校验异常处理。
 * 业务功能在开启了动态权限查询，但可能因为配置问题而出现不友好页面，此功能在规避这些不友好页面。
 * error_message，BM执行LOG中的提示信息
 */
_fnd_dynamic_authority.error_processing = function(error_message) {
	
	// 获取当前参数
	var current_parameter = $ctx.getData().get('current_parameter');
	tool.logDefined(error_message);
	$ctx.getData().put('current_parameter', current_parameter); //还原当前参数

	if (!screen_error_remind) {

		// 获取BM文件的全部内容，在获取查询SQL节点的内容
		var model = $this.getObjectContext();
		var logger = tool.logger;
		var querySqlNode = tool.findChild(model, "query-sql");

		var querySql; // 查询SQL

		// 进行权限动态SQL的整理与替换
		if (querySqlNode) {

			// 获取查询SQL的内容
			querySql = querySqlNode.getData().getText();

			// 将#AUTHORIY_FROM#和#AUTHORIY_WHERE#的替换成空
			querySql = String(querySql).replaceAll('#AUTHORIY_FROM#', '');
			querySql = String(querySql).replaceAll('#AUTHORIY_WHERE#',' and 1=2'); // 加1=2是为了查不出数据，而不报出数据库错误

			// 设置替换后的SQL内容
			querySqlNode.getData().setText(querySql);

		} else {
			tool.logDefined('找不到<query-sql>标签！');
		}
	}
}




/**
 * #AUTHORIY_FROM#内容动态拼接的方法。 
 * 每一个<authority-segment>标签，都会执行一次这个方法，拼接出一段SQL并返回。
 * sequence-序号 
 * authoriy_from-已存在的来源表
 */
_fnd_dynamic_authority.get_user_authority_from = function(sequence, authoriy_from, type) {
	var user_authority_from;
	//权限类型为创建人、接收人
	if(type == c_authority_type_1 || type == c_authority_type_2){
		user_authority_from = authoriy_from;
	}else{
		if (authoriy_from) {
			user_authority_from = authoriy_from + ' ,fnd_user_authority user_auth_' + sequence;
		} else {
			user_authority_from = ' ,fnd_user_authority user_auth_' + sequence;
		}
	}
	user_authority_from = user_authority_from + '\n';
	return user_authority_from;
}




/**
 * #AUTHORIY_WHERE#内容动态拼接的方法。 
 * 每一个<authority-segment>标签，都会执行一次这个方法，拼接出一段SQL并返回。
 * sequence-序号
 * authoriy_where-已存在的关联条件
 * type-权限类型
 * source_alias-SQL数据集的别名
 * source_name-SQL数据集的字段名
 */
_fnd_dynamic_authority.get_user_authority_where = function(sequence, authoriy_where, type, source_alias, source_name) {
	var user_authority_where;
	//权限类型为创建人、接收人
	if(type == c_authority_type_1 || type == c_authority_type_2){
		if (authoriy_where) {
			user_authority_where = authoriy_where + ' and ' + source_alias + '.' + source_name + ' = ' + $session.user_id;
		} else {
			user_authority_where = ' and ' + source_alias + '.' + source_name + ' = ' + $session.user_id;
		}
	
	//其他权限类型
	}else{
		if (authoriy_where) {
			user_authority_where = authoriy_where + ' and user_auth_' + sequence + '.user_id = ' + $session.user_id;
		} else {
			user_authority_where = ' and user_auth_' + sequence + '.user_id = ' + $session.user_id;
		}
		user_authority_where = user_authority_where + ' and user_auth_' + sequence + '.authority_type = \'' + type + '\'';
		user_authority_where = user_authority_where + ' and user_auth_' + sequence + '.assign_id = ' + source_alias + '.' + source_name;
	}
	user_authority_where = user_authority_where + '\n';
	return user_authority_where;
}




/**
 * 查询SQL初始化方法 主要作用：将需要进行权限过滤的BM文件中的查询SQL（手写SQL）按照事先定义好的权限控制类型，进行数据的替换，来达到过滤的目的
 * authority_segment_records, 也是main函数传递过来，<authority-segment>标签的数据
 */
_fnd_dynamic_authority.init_query = function(authority_segment_records) {
	
	// 获取BM文件的全部内容，在获取查询SQL节点的内容
	var model = $this.getObjectContext();
	var logger = tool.logger;
	var querySqlNode = tool.findChild(model, "query-sql");

	// 定义三个参数
	var querySql; // 查询SQL
	var authoriy_from = ''; // 权限关联表
	var authoriy_where = ''; // 权限关联条件

	// 定义2个session里的值，business_group,user_id
	var s_bg = $session.business_group;
	var s_user_id = $session.user_id;
	
	// 进行权限动态SQL的整理与替换
	if (querySqlNode) {
		
		// 获取查询SQL的内容
		querySql = querySqlNode.getData().getText();
	
		//循环<authority-segment>标签的数据
		for (var i = 0; i < authority_segment_records.length; i++) {
			authoriy_from = _fnd_dynamic_authority.get_user_authority_from(i, authoriy_from, authority_segment_records[i].type);
			authoriy_where = _fnd_dynamic_authority.get_user_authority_where(i, authoriy_where, authority_segment_records[i].type, authority_segment_records[i].source_alias, authority_segment_records[i].source_name);
		}

		// #AUTHORIY_FROM#和#AUTHORIY_WHERE#的替换
		querySql = String(querySql).replaceAll('#AUTHORIY_FROM#', authoriy_from);
		querySql = String(querySql).replaceAll('#AUTHORIY_WHERE#',authoriy_where);

		// 设置替换后的SQL内容
		querySqlNode.getData().setText(querySql);

	} else {
		tool.logDefined('\n 找不到<query-sql>标签！');
		return;
	}
};




/**
 * main函数，入口函数 主要作用：对需要进行权限过滤的BM文件，进行内容解析和判断，然后初始化查询SQL 校验块包括： 
 * 校验一，标签<authority>和标签<authority-segment>的结构。
 * 校验二：<authority>是否存在且唯一。 
 * 校验三：<authority>各属性是否定义完整正确 
 * 校验四：<authority-segment>属性是否定义完整正确。
 */
_fnd_dynamic_authority.main = function() {

	// 定义日志对象，将请求的XML信息输出到日志文件里
	var logger = tool.logger;
	logger.log('\n ctx.toXML(): \n' + $ctx.toXML());
	
	// 获取当前参数
	var current_parameter = $ctx.getData().get('current_parameter');

	// 获取BM的内容
	var model = $this.getObjectContext();
	
	//通过当前角色，当前用户，当前集团，确定需要的权限类型数据数组
	var role_user_authority_array = [];

	
	
	/*
	 * 校验一，检查标签结构 。 标准标签结构如下(属性值可更改)： 
	 * <authority foundation_code="PUR_PO" only_user_authority="Y"> 
	 * 		<authority-segment type="CREATER" source_alias="v" source_name="created_by"/>
	 * 		<authority-segment type="COMPANY" source_alias="v" source_name="company_id"/>
	 * </authority>
	 */
	var authoritySegmentTag = tool.findChild(model, 'authority-segment');
	if (authoritySegmentTag) {
		var parentTag = tool.getParent(authoritySegmentTag);
		if (parentTag != 'authority') {
			_fnd_dynamic_authority.error_processing('\n 标签结构不符合规范,标准的标签结构是 \n <authority> \n   <authority-segment/> \n   <authority-segment/> \n </authority> \n 请检查代码！');
			return;
		}
	}


	
	
	/*
	 * 校验二，<authority>是否存在且唯一 通用权限配置。
	 * <authority>标签一个BM只能定义一次，不能嵌套，不能重复
	 */
	var authorityTags = tool.findChildsByRoot(model, 'authority');
	if (authorityTags == '') {
		_fnd_dynamic_authority.error_processing('标签<authority>没有定义，请检查代码！');
		return;
	}
	if (authorityTags.length > 1) {
		_fnd_dynamic_authority.error_processing('标签<authority>只能出现一次，请检查代码！');
		return;
	}
	
	
	
	
	/*
	 * 校验三，<authority>only_user_authority属性、foundation_code属性是否定义完整，正确 。 
	 * only_user_authority属性，只考虑用户权限进行数据过滤，适用于功能查询条件lov，list的取值BM
	 * 为N或不定义该属性，表示需要考虑角色权限进行数据过滤，会进行相关的校验 为Y，表示不需要考虑角色权限进行数据过滤，可以跳过相关校验
	 * foundation_code属性，角色权限对应的基础单据类型
	 * foundation_code 基础数据定义代码（单据类型），必须是sys_foundations表里foundation_type为DOCUMENT的数据
	 */
	// 获取authority标签对象
	var authorityTag = tool.findChild(model, 'authority');
	var only_user_authority;
	if (!authorityTag.only_user_authority || authorityTag.only_user_authority == 'N') {
		only_user_authority = 'N';
	} else if (authorityTag.only_user_authority == 'Y') {
		only_user_authority = 'Y';
	} else {
		_fnd_dynamic_authority.error_processing('标签<authority>属性 only_user_authority 的值只能为Y或N，或不定义该属性，请检查代码！');
		return;
	}
	if(only_user_authority == 'N'){
		if (!authorityTag.foundation_code) {
			_fnd_dynamic_authority.error_processing('标签<authority>属性 foundation_code 的值为空或没有定义该属性，请检查代码！');
			return;
		}
		// 定义一个新的BM，获取基础数据定义的数据
		var foundation_code_list_bm = new ModelService('public.get_dynamic_authority_foundation_code_list');
		var foundation_code_list_records = foundation_code_list_bm.queryAsMap().getChildren();
		// 循环获取的数据，判断BM定义的内容是否在获取的数据之内，循环中找到则结束循环
		var foundation_exists_flag;
		for ( var i = 0; i < foundation_code_list_records.length; i++) {
			foundation_exists_flag = (authorityTag.foundation_code == foundation_code_list_records[i].foundation_code) ? true : false;
			if (foundation_exists_flag) {
				break;
			}
		}
		if (!foundation_exists_flag) {
			_fnd_dynamic_authority.error_processing('标签<authority>属性 foundation_code 的值不是sys_foundations表里foundation_type为DOCUMENT的数据，请检查代码！');
			return;
		}
	}else{
		if (authorityTag.foundation_code) {
			_fnd_dynamic_authority.error_processing('标签<authority>属性 only_user_authority 的值为Y时，不能定义属性 foundation_code，请检查代码！');
			return;
		}
	}
	
	
	
	
	
	
	/*
	 * 校验四：<authority-segment>标签是否定义，各属性是否定义完整正确。
	 * 每一个<authority-segment>标签的三个属性（type，source_alias，source_name）都必须定义。
	 * 此标签必须在<authority>下，可以出现多个。 
	 * 此标签需要将所有类型全部定义出来，在使用角色权限过滤时，一共11种权限。
	 * type，权限类型，对应的是权限纬度代码和个人权限类型，不能重复。
	 * source_alias，对应BM查询SQL中，要用进行对应用户系统权限过滤的SQL别名。
	 * source_name，对应BM查询SQL中，要用进行对应用户系统权限过滤的SQL字段名。
	 */
	var authority_segment_records = tool.findChildsByRoot(authorityTags[0],'authority-segment');
	if(authority_segment_records.length == 0){
		_fnd_dynamic_authority.error_processing('标签<authority-segment>没有定义，请检查代码！');
		return;
	}
	if(only_user_authority == 'N' && authority_segment_records.length != 13){
		_fnd_dynamic_authority.error_processing('标签<authority-segment>数量不到13种，需要定义全部11种权限类型，请检查代码！');
		return;
	}
	// 校验type,source_alias,source_name属性是否定义
	for ( var i = 0; i < authority_segment_records.length; i++) {
		//type属性
		if (!authority_segment_records[i].type) {
			_fnd_dynamic_authority.error_processing('标签<authority-segment>的"type"属性值为空或没有定义该属性，请检查代码！');
			return;
		}
		//source_alias属性
		if (!authority_segment_records[i].source_alias) {
			_fnd_dynamic_authority.error_processing('标签<authority-segment>的"source_alias"属性值为空或没有定义该属性，请检查代码！');
			return;
		}
		//source_name属性
		if (!authority_segment_records[i].source_name) {
			_fnd_dynamic_authority.error_processing('标签<authority-segment>的"source_name"属性值为空或没有定义该属性，请检查代码！');
			return;
		}
		
		//校验"type"属性是否有重复
		for (k = 0; k < i; k++) {
			if (authority_segment_records[i].type == authority_segment_records[k].type) {
				_fnd_dynamic_authority.error_processing('标签<authority-segment>，存在"type"属性['+ authority_segment_records[i].type + ']定义重复，请检查代码！');
				return;
			}
		}
	}
	
	//权限全部类型是否在规则的11中权限类型范围之内
	var flag = false;
	var error_type = '';
	for (var i = 0;i < authority_segment_records.length; i++) {
		
		flag = false; //重置标志
		
		//创建人
		if(authority_segment_records[i].type == c_authority_type_1){
			flag = true;
			continue;
			
		//接收人
		}else if(authority_segment_records[i].type == c_authority_type_2){
			flag = true;
			continue;
		
		//公司
		}else if(authority_segment_records[i].type == c_authority_type_3){
			flag = true;
			continue;
			
		//业务单元
		}else if(authority_segment_records[i].type == c_authority_type_4){
			flag = true;
			continue;
			
		//采购组织
		}else if(authority_segment_records[i].type == c_authority_type_5){
			flag = true;
			continue;
			
		//库存组织
		}else if(authority_segment_records[i].type == c_authority_type_6){
			flag = true;
			continue;
			
		//销售组织
		}else if(authority_segment_records[i].type == c_authority_type_7){
			flag = true;
			continue;
			
		//供应商
		}else if(authority_segment_records[i].type == c_authority_type_8){
			flag = true;
			continue;
			
		//客户
		}else if(authority_segment_records[i].type == c_authority_type_9){
			flag = true;
			continue;
			
		//采购物料
		}else if(authority_segment_records[i].type == c_authority_type_10){
			flag = true;
			
			continue;
			
		//销售产品
		}else if(authority_segment_records[i].type == c_authority_type_11){
			flag = true;
			continue;
		
		//供应商地点
		}else if(authority_segment_records[i].type == c_authority_type_12){
			flag = true;
			continue;
		
		//客户地点
		}else if(authority_segment_records[i].type == c_authority_type_13){
			flag = true;
			continue;
		}
		
		
		error_type = authority_segment_records[i].type;
		
		break; //发现不在范围内的TYPE值，直接结束循环
	}
	if(!flag){
		_fnd_dynamic_authority.error_processing('标签<authority-segment>的"type"属性值[' + error_type + ']不再允许范围之内，请检查代码！');
		return;
	}

	
	
		
	/*
	 * 校验五，在当前角色，当前集团，此单据类型是否有定义权限。
	 * 权限是否配置，在fnd_bg_role_authority表里是否能查找到对应数据。
	 * 
	 * 校验六，角色权限类型为“限定业务范围”时，bm定义的是否在配置的范围里面
	 * 权限是否配置，在fnd_bg_role_authority_area表里是否能查找到对应数据。
	 * 
	 * 校验七，校验当前角色配置的业务范围下，此用户是否有配置用户权限范围数据
	 * 权限是否配置，在fnd_user_authority表里是否能查找到对应数据。
	 * 
	 * 校验八，校验在使用用户权限的前提下，当前用户是否定义了用户权限。
	 * 权限是否配置，在fnd_user_authority表里是否能查找到对应数据
	 */
	if(only_user_authority == 'N'){ //角色权限过滤
		var bg_role_authority_bm = new ModelService('public.get_dynamic_authority_bg_role_authority');
		var param = {};
		param.role_id = $session.role_id; //当前角色
		param.business_group = $session.business_group; //当前集团
		param.foundation_code = authorityTag.foundation_code; //bm文件定义的基础数据代码
		var bg_role_authority_records = bg_role_authority_bm.queryAsMap(param).getChildren();
		if(bg_role_authority_records.length == 0){
			_fnd_dynamic_authority.error_processing('当前集团，当前角色下，在配置的['+ authorityTag.foundation_code +']基础数据类型下没有配置权限限定类型，请检查角色权限配置！');
			return;
		}
		var bg_role_authority_area_bm = new ModelService('public.get_dynamic_authority_bg_role_authority_area');
		var param = {};
		param.role_id = $session.role_id; //当前角色
		param.business_group = $session.business_group; //当前集团
		param.foundation_code = authorityTag.foundation_code; //bm文件定义的基础数据代码
		var bg_role_authority_area_records = bg_role_authority_area_bm.queryAsMap(param).getChildren();
		if(bg_role_authority_records[0].authority_type == 'LIMIT_BUSINESS_AREA'){ //限定至业务范围
			if(bg_role_authority_area_records.length == 0){
				_fnd_dynamic_authority.error_processing('当前集团，当前角色下，在配置的['+ authorityTag.foundation_code +']基础数据类型下没有配置限定业务范围，请检查角色权限配置！');
				return;
			}
			for (var i = 0; i < bg_role_authority_area_records.length; i ++){
				var user_authority_bm = new ModelService('public.get_dynamic_authority_user_authority');
				var param = {};
				param.user_id = $session.user_id; //当前用户
				param.authority_type = bg_role_authority_area_records[i].authority_type_code; //权限类型
				var user_authority_records = user_authority_bm.queryAsMap(param).getChildren();
				if(user_authority_records.length == 0){
					_fnd_dynamic_authority.error_processing('当前角色有配置['+ bg_role_authority_area_records[i].authority_type_code +']业务范围，但当前用户没有配置权限范围数据(多组织权限)，请检查用户权限配置！');
					return;
				}
			}
		}
	}else{ //只考虑用户权限
		var user_authority_bm = new ModelService('public.get_dynamic_authority_user_authority');
		var param = {};
		param.user_id = $session.user_id; //当前用户
		var user_authority_records = user_authority_bm.queryAsMap(param).getChildren();
		if(user_authority_records.length == 0){
			_fnd_dynamic_authority.error_processing('当前用户没有配置权限范围数据(多组织权限)，请检查用户权限配置！');
			return;
		}
	}
	
	//初始化权限类型参数，通过角色，用户，集团获取需要过滤的权限类型，放入到参数数组
	for ( var i = 0; i < authority_segment_records.length; i++) {
		
		//通过当前角色，当前用户，当前集团，确定需要的权限类型数据
		var role_user_authority_value = {};
		
		//创建人
		if(authority_segment_records[i].type == c_authority_type_1){
			//角色权限过滤
			if(only_user_authority == 'N'){
				if(bg_role_authority_records[0].authority_type == 'LIMIT_PERSONAL_USER' && bg_role_authority_records[0].authority_user == 'CREATER'){
					role_user_authority_value.type = authority_segment_records[i].type;
					role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
					role_user_authority_value.source_name = authority_segment_records[i].source_name;
					role_user_authority_array.push(role_user_authority_value);
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
			
		//接收人
		if(authority_segment_records[i].type == c_authority_type_2){
			//角色权限过滤
			if(only_user_authority == 'N'){
				if(bg_role_authority_records[0].authority_type == 'LIMIT_PERSONAL_USER' && bg_role_authority_records[0].authority_user == 'RECEIVER'){
					role_user_authority_value.type = authority_segment_records[i].type;
					role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
					role_user_authority_value.source_name = authority_segment_records[i].source_name;
					role_user_authority_array.push(role_user_authority_value);
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//公司
		if(authority_segment_records[i].type == c_authority_type_3){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_3){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
			
		//业务单元
		if(authority_segment_records[i].type == c_authority_type_4){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_4){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
			
		//采购组织
		if(authority_segment_records[i].type == c_authority_type_5){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_5){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
			
		//库存组织
		if(authority_segment_records[i].type == c_authority_type_6){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_6){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//销售组织
		if(authority_segment_records[i].type == c_authority_type_7){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_7){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//供应商
		if(authority_segment_records[i].type == c_authority_type_8){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_8){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//客户
		if(authority_segment_records[i].type == c_authority_type_9){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_9){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//采购物料
		if(authority_segment_records[i].type == c_authority_type_10){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_10){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//销售产品
		if(authority_segment_records[i].type == c_authority_type_11){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_11){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//供应商地点
		if(authority_segment_records[i].type == c_authority_type_12){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_12){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
		
		//客户地点
		if(authority_segment_records[i].type == c_authority_type_13){
			if(only_user_authority == 'N'){ //角色权限过滤
				for (var j = 0; j < bg_role_authority_area_records.length; j ++){
					if(bg_role_authority_area_records[j].authority_type_code == c_authority_type_13){
						role_user_authority_value.type = authority_segment_records[i].type;
						role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
						role_user_authority_value.source_name = authority_segment_records[i].source_name;
						role_user_authority_array.push(role_user_authority_value);
					}
				}
			}else{
				role_user_authority_value.type = authority_segment_records[i].type;
				role_user_authority_value.source_alias = authority_segment_records[i].source_alias;
				role_user_authority_value.source_name = authority_segment_records[i].source_name;
				role_user_authority_array.push(role_user_authority_value);
			}
			continue;
		}
	}
	
//	//测试代码
//	tool.logDefined('\n role_user_authority_array length is ' + role_user_authority_array.length);
//	
//	for (var i = 0; i < role_user_authority_array.length; i ++){
//		tool.logDefined('role_user_authority_array type is ' + role_user_authority_array[i].type);
//		tool.logDefined('role_user_authority_array source_alias is ' + role_user_authority_array[i].source_alias);
//		tool.logDefined('role_user_authority_array source_name is ' + role_user_authority_array[i].source_name);
//	}

	//通过数据校验，开始初始化查询
	_fnd_dynamic_authority.init_query(role_user_authority_array);

	//还原当前参数
	$ctx.getData().put('current_parameter', current_parameter);
};

_fnd_dynamic_authority.main();
