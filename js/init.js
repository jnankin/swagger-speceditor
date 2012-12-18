dirtyUI = false;

$().ready(function(){
	$('input,select,textarea').on('change', function(){ dirtyUI = true; });
	
	$('#loadDataModal').modal({
		'show' : true,
		'backdrop' : 'static'
	});
	
	$('form#uploadFile').ajaxForm({
		'error' : function(a,b,c){
			alert('There was a problem processing your file: ' + b + ", " + c.message);
		},
		success : function(data) {
			if (!data.success){
				alert('There was a problem processing your file: ' + data.error);
				return;
			}
			init(data.data);
		}
	});
	
	$('form#uploadFile input[type=file]').change(function(){
		$('form#uploadFile').submit();
	});
	
	$('.newSpec').click(function() { 
		init({});
	});
});

function init(data){
	viewModel = new SwaggerViewModel(data);
	ko.applyBindings(viewModel);
	$('#loadDataModal').modal('hide');
}
