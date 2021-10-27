
var serverStateIntervalId = 0;
$(function(){
	fnInit();
	
})

var fnInit = function(){
	fnSearch();
	// dataTable 생성
	fnTaCreateDataTable("datatable-serverState", 1, "asc");
	$("#loading").fadeOut();
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetServerStateListByAjax()));
	$('.dataTableCheckbox').iCheck({
		checkboxClass: 'icheckbox_flat-green'
		,radioClass: 'iradio_flat-green'
	});
	
}

var fnCreateListHtml = function(serverStateList){
	var html = "";
	// 서버 상태값 체크
	fnCheckServerState(serverStateList);
	for( var i in serverStateList ){
		var data = serverStateList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.serverSeq+"'/></td>";
		html += "	<td>"+data.serviceName+"</td>";
		html += "	<td>"+data.ip+"</td>";
		html += "	<td>"+data.port+"</td>";
		html += "	<td>"+data.connectId+"</td>";
		html += "	<td>"+data.state+"</td>";
		
		html += "	<td><button type='button' class='btn btn-info btn-xs' " +
				"onClick='fnCommandServer(\""+data.serverSeq+"\",\""+data.state+"\")'>";
		if( data.state == "START" ){
			html += "<i class='glyphicon glyphicon-stop'></i></button></td>";	
		}else if( data.state == "STOP" ){
			html += "<i class='glyphicon glyphicon-play'></i></button></td>";
		}else{
			html += "<img width='15px' height='15px' src='/images/loading.gif'></button></td>";
		}
		
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.serverStateModal' onClick='fnUpdateModal("+data.serverSeq+")'>" +
								"<i class='fa fa-edit'></i> 수정</button></td>";
		html += "</tr>";
	}
	return html;
}

var fnInsertModal = function(){
	$("#ip").focus().prop("readonly",false);
	$("#port").prop("readonly",false);
	$(".registDiv").show();
	$(".updateDiv").hide();
}

/*서버 등록*/
var fnInsertServer = function(){
	if( $("#nmDicForm").parsley().validate() ){
		
		if( fnCheckLinuxCommand($("#commandRun").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandRun").focus();
			return false;
		}else if( fnCheckLinuxCommand($("#commandKill").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandKill").focus();
			return false;
		}else if( fnCheckLinuxCommand($("#commandState").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandState").focus();
			return false;
		}
		
		var data = {
				"ip" : $("#ip").val()
				,"port" : $("#port").val()
				,"serviceName" : $("#serviceName").val()
				,"connectId" : $("#connectId").val()
				,"modulePath" : $("#modulePath").val()
				,"commandRun" : $("#commandRun").val()
				,"commandKill" : $("#commandKill").val()
				,"commandState" : $("#commandState").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertServerByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".serverStateModal").modal("hide");
				fnSearch();
				
			}else if( response.result == "error" ){
				fnTaNotify("warning", response.errorMsg);
				
			}else{
				fnTaNotify("danger", "서버 등록 에러");
			}
		}
	}
}

var fnUpdateModal = function(serverSeq){
	var data = fnGetServerStateByAjax(serverSeq);
	$("#serverSeq").val(data.serverSeq);
	$("#ip").val(data.ip).prop("readonly",true);
	$("#port").val(data.port).prop("readonly",true);
	$("#serviceName").val(data.serviceName);
	$("#connectId").val(data.connectId);
	$("#modulePath").val(data.modulePath);
	$("#commandRun").val(data.commandRun);
	$("#commandKill").val(data.commandKill);
	$("#commandState").val(data.commandState);
	
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*서버 수정*/
var fnUpdateServer = function(){
	if( $("#nmDicForm").parsley().validate() ){
		
		if( fnCheckLinuxCommand($("#commandRun").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandRun").focus();
			return false;
		}else if( fnCheckLinuxCommand($("#commandKill").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandKill").focus();
			return false;
		}else if( fnCheckLinuxCommand($("#commandState").val()) ){
			fnTaNotify("warning", "사용 불가능한 명령어입니다.");
			$("#commandState").focus();
			return false;
		}
		
		var data = {
			"serverSeq" : $("#serverSeq").val()
			,"serviceName" : $("#serviceName").val()
			,"connectId" : $("#connectId").val()
			,"modulePath" : $("#modulePath").val()
			,"state" : "REQUEST"
			,"commandRun" : $("#commandRun").val()
			,"commandKill" : $("#commandKill").val()
			,"commandState" : $("#commandState").val()
		}
			
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateServerByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".serverStateModal").modal("hide");
				fnSearch();
			
			}else if( response.result == "error" ){
				fnTaNotify("warning", response.errorMsg);
				
			}else{
				fnTaNotify("danger", "서버 수정 에러");
			}
		}
	}
}

var fnDeleteServer = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("원본 데이터를 삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteServerByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "서버를 삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("서버  삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-serverState", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

/*서버 상태 체크*/
var fnCheckServerState = function(serverStateList){
	if( serverStateIntervalId != 0 )	clearInterval(serverStateIntervalId);
	
	for(var i in serverStateList){
		var data = serverStateList[i];
		if( data.state == "REQUEST" ){
			serverStateIntervalId = setInterval(fnSearch, 10000);
			break;
		}			
	}
}

/*서버 시작/중지*/
var fnCommandServer = function(serverSeq, state){
	var data = {
		"serverSeq":serverSeq
		,"state": (state == "STOP") ? "START" : "STOP"
	};
	if( state == "START" || state == "STOP"){
		var comment = (state == "STOP") ? "시작" : "중지";
		if( confirm("서버를 "+comment+"하시겠습니까?") ){
			var response = fnCommandServerByAjax(data);
			
			if( response.result == "success" ){
				fnTaNotify("success", "서버 "+comment+" 요청하였습니다.");
				fnSearch();
				
			}else if( fnComnNotNullAndEmpty(response.errorMsg) ){
				fnTaNotify("danger", response.errorMsg);
				fnSearch();
				
			}else{
				fnTaErrorMessage("서버  시작 에러!!", response.errorMessage);
			}
		}
		
	}else if( state == "REQUEST" ){
		fnTaNotify("warning", "요청중입니다.");
	}else{
		fnTaNotify("warning", "ERROR입니다. \n관리자에게 문의해주세요.");
	}
}


/* 리눅스 명령어 체크 */
var fnCheckLinuxCommand = function(text){
	var chkCmd = $("#checklinuxCommand").val().split(",",-1);
	for( var i in chkCmd ){
		if( fnComnNotNullAndEmpty(chkCmd[i]) 
				&& ( text.indexOf(chkCmd[i]) > -1 ) )
			return true;
	}
	return false;
}

/*서버 새로고침*/
var fnRefreshServer = function(){
	$("#loading").show();
	setTimeout(function() {
		var response = fnRefreshServeByAjax();
		if( response.result == "success" ){
			fnTaNotify("success", "새로고침 완료");
			fnSearch();
			
		}else if( fnComnNotNullAndEmpty(response.errorMsg) ){
			fnTaNotify("danger", response.errorMsg);
			fnSearch();
			
		}else{
			fnTaErrorMessage("새로고침 에러!!", response.errorMessage);
		}
		
		$("#loading").fadeOut();
	}, 100);
}