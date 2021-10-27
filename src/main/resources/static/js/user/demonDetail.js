$(function(){
	fnInit();
})


var fnInit = function(){
	fnSetDemonData();
	$("#loading").fadeOut();
}

var fnSetDemonData = function(){
	var response = fnGetDemonByAjax($("#demonServiceSeq").val());
	var demon = response.demon;
	
	$("#name").val(demon.name);
	$("#modelSeq").val(demon.modelSeq);
	$("#projectName").val(demon.projectName);
	$("#modelName").val(demon.modelName);
/*	
	var model = response.model;
	$("#trainDataName").val(model.trainDataName);
	$("#validationDataName").val(model.validationDataName);
	$("#evaluationDataName").val(model.evaluationDataName);
	$("#algorithmName").val(model.algorithmName);
	$("#embeddingModelName").val(model.embeddingModelName);
	$("#pretrainedModelName").val(model.pretrainedModelName);
	*/
}

var fnCommandDemon = function(){
	if( $("#demonDetailForm").parsley().validate() ){
		$("#loading").show();
		var data = {
				"modelSeq" : $("#modelSeq").val()
				,"content" : $("#content").val()
		}

		setTimeout(function() {
			var response = fnCommandDemonByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "분석을 완료하였습니다.");
				console.log(response);
				if( fnComnNotNullAndEmpty(response.data.prediction) ){
					var prediction = response.data.prediction;
					var preText = "";
					$.each(prediction, function(key, value){
						preText += key + ": " + value + "\n";
					});
					$("#demonResult").text(preText);
					$("#demonResultDiv").fadeIn();	
				}
			}else if("validationError" == response.result){
				fnTaNotify("danger", response.errorMessage);
			}else{
				fnTaErrorMessage("분석 에러", response);
			}
			$("#loading").hide();
		}, 100);
	}
}
