$(function(){
	fnInit();
	
})

var fnInit = function(){
	fnSearch();
	$("#loading").fadeOut();
}

var fnSearch = function(){
	var algorithmList = fnGetAlgorithmListByAjax();
	$("#tbodyHtml").html(fnCreateListHtml(algorithmList));
	
}

var fnCreateListHtml = function(algorithmList){
	var html = "";
	for( var i in algorithmList ){
		var data = algorithmList[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.description+"</td>";
		html += "	<td>"+data.supportedExtension+"</td>";
		html += "	<td>"+data.applycation+"</td>";
		html += "	<td><button type='button' class='btn btn-success btn-xs' data-toggle='modal' " +
						"data-target='.bs-example-modal-lg' onClick='fnSetModal("+data.algorithmSeq+")'>" +
						"See detail</button></td>";
		html += "</tr>";
	}
	return html;
}

var fnSetModal = function(algorithmSeq){
	var data = fnGetAlgorithmByAjax(algorithmSeq);
	$("#name").text(fnComnReplaceNull(data.name));
	$("#supportedExtension").text(fnComnReplaceNull(data.supportedExtension));
	$("#detail").text(data.description);
	$("#applycation").text(data.applycation);
	$("#parameters").html(fnCreateModalHtml(data.parameters));
	
}

var fnCreateModalHtml = function(list){
	var html = "";
	for( var i in list ){
		var data = list[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.type+"</td>";
		html += "	<td>"+data.default+"</td>";
		html += "	<td>"+data.comment+"</td>";
		html += "</tr>";
	}
	return html;
}
