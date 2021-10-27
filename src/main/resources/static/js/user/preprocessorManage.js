$(function(){
	fnInit();
	
})

var fnInit = function(){
	fnSearch();
	$("#loading").fadeOut();
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetPreprocessorListByAjax()));
}

var fnCreateListHtml = function(preprocessor){
	var html = "";
	for( var i in preprocessor ){
		var data = preprocessor[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.description+"</td>";
		html += "	<td>"+data.supportedExtension+"</td>";
		html += "	<td>"+data.applycation+"</td>";
		html += "	<td><button type='button' class='btn btn-success btn-xs' data-toggle='modal' " +
						"data-target='.bs-example-modal-lg' onClick='fnSetModal("+data.preprocessorSeq+")'>" +
						"See detail</button></td>";
		
		html += "</tr>";
	}
	return html;
}

var fnSetModal = function(preprocessorSeq){
	var data = fnGetPreprocessorByAjax(preprocessorSeq);
	$("#name").text(fnComnReplaceNull(data.name));
	$("#supportedExtension").text(fnComnReplaceNull(data.supportedExtension));
	$("#detail").text(data.description);
	$("#applycation").text(data.applycation);
	if( fnComnNotNullAndEmpty(data.parameters) ){
		$("#parameters").html(fnCreateModalHtml(data.parameters));
		$("#parametersDiv").show();
	}else{
		$("#parametersDiv").hide();
	}
}

var fnCreateModalHtml = function(list){
	var html = "";
	for( var i in list ){
		var data = list[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.type+"</td>";
		if( data.default.length >= 10 ){
			var defaultData = "";
			var cnt = 1;
			for( var d in data.default ){
				if( data.default.length-1 == d ) defaultData += data.default[d];
				else{
					defaultData += data.default[d]+", ";
					if( cnt % 10 == 0 ) defaultData += "<br>";
				}
				cnt++;
			}
			html += "	<td>"+defaultData+"</td>";
		}else{
			html += "	<td>"+data.default+"</td>";	
		}
		
		html += "	<td>"+data.comment+"</td>";
		html += "</tr>";
	}
	return html;
}

