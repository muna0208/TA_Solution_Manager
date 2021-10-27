$(function(){
	$("#loading").fadeOut();
})


var fnAnalyzeTest = function(){
	if( $("#analyzeTestForm").parsley().validate() ){
		$("#loading").show();
		var data = {
				"serverIp" : $("#serverIp").val()
				,"maPort" : $("#maPort").val()
				,"tmPort" : $("#tmPort").val()
				,"body" : $("#body").val()
		}

		setTimeout(function() {
			var response = fnAnalyzeTestByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "분석을 완료하였습니다.");
				$("#morthAnalysis1").text(response.resultMA);
				$("#keywordList1").text(response.resultTM_KL);
				$("#associatedKeyword1").text(response.resultTM_KK);
				$("#analyzeResult").fadeIn();
				
			}else{
				fnTaNotify("danger", response.errorMessage);
			}
			$("#loading").fadeOut();
		}, 100);
	}
}
