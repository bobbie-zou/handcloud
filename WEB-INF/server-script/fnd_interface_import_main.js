var _fnd_interface_import_main = new Object();

var tool = _fnd_flex_dynamic_tools;


_fnd_interface_import_main.init = function(){
	
}

_fnd_interface_import_main.column = function(){
	this.columnName;
	this.excelColumnNumber;
	this.prompt;
	this.importLineColumnName;
	this.importLineColumnNamePrefix = "attribute_";
	
	this.init = function(columnName,excelColumnNumber,prompt){
		this.columnName = columnName;
		this.excelColumnNumber = excelColumnNumber;
		this.importLineColumnName = this.importLineColumnNamePrefix + excelColumnNumber;
		this.prompt = prompt;
	}
	
}



_fnd_interface_import_main.dataSets = function(){
	this.dataSetsTag = new tool.newMap("dataSets");
	
}

_fnd_interface_import_main.grid = function(){
	this.gridTag = new tool.newMap("grid");
	this.scriptTag = {};
	
	
	
	
}


















_fnd_interface_import_main.run = function(){
	var dynamicImportTag = tool.find('dynamic-import');
	
	
	
	
}