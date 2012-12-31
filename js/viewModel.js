ko.validation.init();

ko.validation.rules['url'] = {
    validator: function (val, otherVal) {
		var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        return val.match(urlRegex);
    },
    message: 'Please provide a valid url.'
};
ko.validation.registerExtenders();

var SwaggerDataTypes = [
'byte',             
'boolean',          
'int',       
'long',            
'float',           
'double',          
'string',         
'Date'   
];

SwaggerViewModel = function(data){
	if (!data.name) data.name = 'New API';
	if (!data.apiVersion) data.apiVersion = '0.01';
	if (!data.swaggerVersion) data.swaggerVersion = '1.1';
	var self = this;
	
	self.name = ko.observable(data.name).extend({ required: true });
	self.apiVersion = ko.observable(data.apiVersion).extend({ required: true });
	self.swaggerVersion = ko.observable(data.swaggerVersion).extend({ required: true });
	self.basePath = ko.observable(data.basePath).extend({ required: true, url: true  });
	self.apis = ko.observableArray(data.apis ? $.map(data.apis, function(el){ return new SwaggerAPI(el); }) : []);
	self.models = ko.observableArray(data.models ? $.map(data.models, function(el){ return new SwaggerModel(el); }) : []);
	self.errors = ko.validation.group(self, true);

	self.serialize = function(){
		var ret = {
			'name' : self.name(),
			'apiVersion' : self.apiVersion(),
			'swaggerVersion' : self.swaggerVersion(),
			'basePath' : self.basePath(),
			'apis' : [],
			'models' : []
		};
		
		return ret;
	}
	
	self.save = function(){
		dirtyUI = false;
		var form = $("<form method='post' action='download.php'>");
		form.append($("<textarea name='data'>").val(JSON.stringify(self.serialize()))).submit();
	}
}

SwaggerAPI = new function(data){
	var self = this;
	self.path = ko.observable(data.path).extend({required: true});
	self.description = ko.observable(data.description);
	self.operations = ko.observable(data.operations ? $.map(data.operations, function(el){ return new SwaggerOperation(el); }) : []);
	
	self.methods = ['GET','POST','PUT','DELETE'];
	
	self.addRemoveOperationForMethod = function(){
		var method = $(this).val();
		var add = $(this).attr('checked');
		
		if (add){
			//first make sure there's not a method already in the array
			for(var idx in self.operations()){
				if (self.operations()[idx].method() == method){
					alert("This endpoint already has an operation with HTTP method " + method);
					$(this).attr('checked', false);
					break;
				}
			}
		
			self.operations.push(new SwaggerOperation({'method' : method});
		}
		else {
			for(var idx in self.operations()){
				if (self.operations()[idx].method() == method){
					self.operations.remove(self.operations()[idx]);
				}
			}
		}
	}
	
}


SwaggerOperation = new function(data){
	var self = this;
	self.method = ko.observable(data.httpMethod).extend();
	self.nickname = ko.observable(data.nickname).extend();
	self.responseClass = ko.observable(data.responseClass).extend();
	self.parameters = ko.observable(data.parameters ? $.map(data.parameters, function(el){ return new SwaggerParameter(el); }) : []);
	self.summary = ko.observable(data.summary).extend();
	self.notes = ko.observable(data.notes).extend();
	self.errorResponses = ko.observable(data.errorResponses ? $.map(data.errorResponses, function(el){ return new SwaggerErrorResponse(el); }) : []);
}


SwaggerParameter = new function(data){
	var self = this;
	self.paramType = ko.observable(data.paramType).extend();
	self.name = ko.observable(data.name).extend();
	self.description = ko.observable(data.description).extend();
	self.dataType = ko.observable(data.dataType).extend();
	self.required = ko.observable(data.required).extend();
	self.allowMultiple = ko.observable(data.allowMultiple).extend();
	self.allowableValues = ko.observable(data.allowableValues ? new SwaggerAllowableValues(data.allowableValues) : null);
	
	self.serialize = function(){
		var ret = {};
		
		ret['paramType'] = self.paramType();
		ret['name'] = self.name();
		ret['description'] = self.description();
		ret['dataType'] = self.dataType();
		ret['required'] = self.required();
		ret['allowMultiple'] = self.allowMultiple();
		
		if (self.allowableValues()){
			ret['allowableValues'] = self.allowableValues().serialize();
		}
	
		return ret;
	}
}


SwaggerAllowableValues = new function(data){
	var self = this;
	self.valueTypes = ['RANGE', 'LIST'];
	
	self.valueType = ko.observable(data.valueType).extend();
	
	self.max = ko.observable(data.max).extend();
	self.min = ko.observable(data.min).extend();

	self.values = ko.observableArray(data.values).extend();	
	
	self.serialize = function
		var ret = {};
		ret['valueType'] = self.valueType();
		
		if (self.valueType() == 'RANGE'){
			ret['max'] = self.max();
			ret['min'] = self.min();
		}
		else if (self.valueType() == 'LIST'){
			ret['values'] = self.values();
		}
		
		return ret;
	}
}

SwaggerErrorResponse = new function(data){
	var self = this;
	self.code = ko.observable(data.code).extend({required : true, number : true});
	self.description = ko.observable(data.description).extend({required : true});
	
	self.serialize = function(){
		return {
			'code' : self.code(),
			'description' : self.description()
		};
	}
	
}

SwaggerModel = new function(data){
	self.id = ko.observable(data.id).extend({required : true});
	self.properties = ko.observable(data.properties ? $.map(data.properties, function(el){ return new SwaggerModelProperty(el); }) : []);
}

SwaggerModelProperty = new function(data){
	self.type = ko.observable(data.type).extend({required : true, number : true});
	self.description = ko.observable(data.description).extend();
	self.allowableValues = ko.observable(data.allowableValues ? new SwaggerAllowableValues(data.allowableValues) : null);
}
