ko.validation.init();

ko.validation.rules['url'] = {
    validator: function (val, otherVal) {
		var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        return val.match(urlRegex);
    },
    message: 'Please provide a valid url.'
};
ko.validation.registerExtenders();

SwaggerViewModel = function(data){
	if (!data.name) data.name = 'New API';
	if (!data.apiVersion) data.apiVersion = '0.01';
	if (!data.swaggerVersion) data.swaggerVersion = '1.1';
	var self = this;
	
	self.name = ko.observable(data.name).extend({ required: true });
	self.apiVersion = ko.observable(data.apiVersion).extend({ required: true });
	self.swaggerVersion = ko.observable(data.swaggerVersion).extend({ required: true });
	self.basePath = ko.observable(data.basePath).extend({ required: true, url: true  });
	self.apis = ko.observableArray(data.apis ? $.map(data.apis, function(el){ return new SwaggerAPI(el); }) : null);
	self.models = ko.observableArray(data.models ? $.map(data.models, function(el){ return new SwaggerModel(el); }) : null);
	
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
}


SwaggerOperation = new function(data){
}


SwaggerParameter = new function(data){
}


SwaggerErrorResponse = new function(data){
}

SwaggerModel = new function(data){
}

SwaggerComplexType = new function(data){
}

SwaggerComplexTypeProperty = new function(data){
}

SwaggerContainer = new function(data){
}
