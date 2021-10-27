userAuth = $("#userAuth").val();
$(function(){
	fnInit();
	
	$(document).on("click", "#tbodyHtml td", function(){
		var clickRows = $("#datatable-batch").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
		clickRow = clickRows[0];
	});
	
	/* 프로젝트 목록 클릭시*/
	$("#datatable-project").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-project").DataTable().rows(indexes).data().toArray();
		var data = {
				"trainState":"FINISHED"
				,"domainFlag":1
			};
		var modelList = fnGetModelSearchListByAjax(rowData[0][0], data);
		
		$("#datatable-model").DataTable().clear().draw();
		fnSetModelData(modelList, "datatable-model");
	
		$("#modelDiv").fadeIn();
	});
})

var fnInit = function(){
	fnSearch();
	
	// dataTable 생성
	fnCreateDataTable();
	
	$("#loading").fadeOut();
}

var fnCreateDataTable = function(){
	var orderTarget = (userAuth == "admin") ? 8 : 7;
	fnTaCreateDataTable("datatable-batch", orderTarget, "desc");
	
	fnTaCreateModalDataTable("datatable-project", 3, "desc", 0);
	fnTaCreateModalDataTable("datatable-model", 2, "desc", 0);
	
	$("#datatable-project").DataTable().clear().draw();
	fnSetProjectList(fnGetProjectListByAjax(), "datatable-project");
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetBatchListByAjax()));
}

var fnCreateListHtml = function(batchList){
	var html = "";
	for( var i in batchList ){
		var data = batchList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.batchServiceSeq+"'/></td>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.projectName+"</td>";
		html += "	<td>"+data.modelName+"</td>";
		html += "	<td>"+data.executionCycle+"</td>";
		html += "	<td>"+data.batchState+"</td>";
		
		html += "	<td><button type='button' class='btn btn-info btn-xs' " +
		"onClick='fnCommandBatch(\""+data.batchServiceSeq+"\",\""+data.batchState+"\")'>";
		if( data.batchState == "START" ){
			html += "<i class='glyphicon glyphicon-stop'></i></button></td>";	
		}else if( data.batchState == "STOP" ){
			html += "<i class='glyphicon glyphicon-play'></i></button></td>";
		}else{
			html += "<img width='15px' height='15px' src='/images/loading.gif'></button></td>";
		}

		if (userAuth == "admin") html += "	<td>" + data.userId + "</td>";
		html += "	<td>"+data.createDatetime+"</td>";
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
				"	data-target='.batchModal' onClick='fnUpdateModal("+data.batchServiceSeq+")'>" +
				"	<i class='fa fa-edit'></i> 수정</button></td>";
		
		html += "</tr>";
	}
	return html;
}

/*배치 등록 모달*/
var fnInsertBatchModal = function(){
	$("#datatable-project").DataTable().rows().deselect();
	if ( $.fn.DataTable.isDataTable( '#datatable-model' ) )
		$("#datatable-model").DataTable().rows().deselect();
	
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*수정모달*/
var fnUpdateModal = function(batchServiceSeq){
	$("#datatable-project").DataTable().rows().deselect();
	
	var batch = fnGetBatchByAjax(batchServiceSeq);
	$("#batchServiceSeq").val(batch.batchServiceSeq);
	$("#name").val(batch.name);
	
	$("#datatable-project").find("#projectTbody tr").each(function(){
		var data = $("#datatable-project").dataTable().fnGetData($(this));
		if( batch.projectSeq == data[0] )
			$("#datatable-project").DataTable().rows($(this)).select();		
	});
	
	$("#datatable-model").find("#modelTbody tr").each(function(){
		var data = $("#datatable-model").dataTable().fnGetData($(this));
		if( batch.modelSeq == data[0] )
			$("#datatable-model").DataTable().rows($(this)).select();		
	});

	var executionCycleArr = batch.executionCycle.split(" ");
	for( var i in executionCycleArr ){
		$("#executionCycle_"+i).val(executionCycleArr[i]); // 실행주기
	}
	
	$("#inputFilePath").val(batch.inputFilePath);
	$("#inputFileRule").val(batch.inputFileRule);
	$("#outputFilePath").val(batch.outputFilePath);
	$("#outputFileRule").val(batch.outputFileRule);
	
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*배치 등록/수정*/
var fnSaveBatch = function(option){
	if( $("#batchForm").parsley().validate() ){
		
		if( $("#datatable-project").DataTable().rows({selected:true}).data()[0] == undefined ){
			fnTaNotify("warning", "프로젝트를 선택해주세요.");
			return false;
			
		}else if( $("#datatable-model").DataTable().rows({selected:true}).data()[0] == undefined ){
			fnTaNotify("warning", "모델을 선택해주세요.");
			return false;
			
		}else if( fnTaDateFormatCheck($("#inputFileRule").val()) ){
			fnTaNotify("warning", "날짜포멧이 맞지 않습니다. \n 예) {yyyyMMddHH}");
			$("#inputFileRule").focus();
			return false;
			
		}else if( fnTaDateFormatCheck($("#outputFileRule").val()) ){
			fnTaNotify("warning", "날짜포멧이 맞지 않습니다. \n 예) {yyyyMMddHH}");
			$("#outputFileRule").focus();
			return false;
		}
		
		var projectSeq = $("#datatable-project").DataTable().rows({selected:true}).data()[0][0];
		var modelSeq = $("#datatable-model").DataTable().rows({selected:true}).data()[0][0];
		
		var executionCycle = "";
		/*실행주기 조합*/
		for(var i=0; i<5; i++ ){
			if($.trim($("#executionCycle_"+i).val()) == ""){
				fnTaNotify("warning", "실행주기를 입력해주세요.");
				$("#executionCycle_"+i).focus();
				return false;
			}
			// 실행주기 한글 금지
			if( fnComnCheckKorean($("#executionCycle_"+i).val()) ){
				fnTaNotify("warning", "한글은 입력불가능합니다.");
				$("#executionCycle_"+i).focus();
				return false;
			}
			if( i == 0 ) executionCycle = $("#executionCycle_"+i).val();
			else  executionCycle += " "+$("#executionCycle_"+i).val();
		}
		
		var data = {
				"batchServiceSeq" : (option=='insert') ? "" : $("#batchServiceSeq").val()
				,"name" : $("#name").val()
				,"projectSeq" : projectSeq
				,"modelSeq" : modelSeq
				,"userId" : $("#userId").val()
				,"executionCycle" : executionCycle
				,"inputFilePath" : $("#inputFilePath").val()
				,"inputFileRule" : $("#inputFileRule").val()
				,"outputFilePath" : $("#outputFilePath").val()
				,"outputFileRule" : $("#outputFileRule").val()
		}
		
		var comment = (option=='insert') ? "등록" : "수정";
		if( confirm(comment+"하시겠습니까?") ){
			var response = (option=='insert') ? fnInsertBatchByAjax(data) : fnUpdateBatchByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", comment+" 완료");
				$(".batchModal").modal("hide");
				fnUpdateTable(response.batch, option);
				
			}else if( response.errorMessage == "duplication name" ){
				fnTaNotify("warning", $("#name").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "데몬 "+comment+" 에러");
			}
		}
	}
}



/*배치 삭제*/
var fnDeleteBatch = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteBatchByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("배치 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-batch", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

/*업데이트 data*/
var fnUpdateTable = function(data, option){
	var checkbox = "<input type='checkbox' name='table_records' id='"+data.batchServiceSeq+"' class='flat dataTableCheckbox'/>";
	var stateHtml = "<button type='button' class='btn btn-info btn-xs' onClick='fnCommandBatch(\""+data.batchServiceSeq+"\",\""+data.batchState+"\")'>";
	if( data.batchState == "START" ){
		stateHtml += "<i class='glyphicon glyphicon-stop'></i></button>";	
	}else if( data.batchState == "STOP" ){
		stateHtml += "<i class='glyphicon glyphicon-play'></i></button>";
	}else{
		stateHtml += "<img width='15px' height='15px' src='/images/loading.gif'></button>";
	}
	var modifyBtn = "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
					"data-target='.batchModal' onClick='fnUpdateModal("+data.batchServiceSeq+")'>" +
					"<i class='fa fa-edit'></i> 수정</button></td>";

	if( option == "insert" ){
		if (userAuth == "admin") {
			$("#datatable-batch").dataTable().fnAddData([
				checkbox, data.name, data.projectName, data.modelName, data.executionCycle, 
				data.batchState, stateHtml, data.userId, data.createDatetime, modifyBtn
			]);
			$("#datatable-batch").DataTable().order([8, "desc"]).draw();
		}else{
			$("#datatable-batch").dataTable().fnAddData([
				checkbox, data.name, data.projectName, data.modelName, data.executionCycle, 
				data.batchState, stateHtml, data.createDatetime, modifyBtn
			]);
			$("#datatable-batch").DataTable().order([7, "desc"]).draw();
		}
		
	}else{
		if (userAuth == "admin") {
			$("#datatable-batch").dataTable().fnUpdate([
				checkbox, data.name, data.projectName, data.modelName, data.executionCycle, 
				data.batchState, stateHtml, data.userId, data.createDatetime, modifyBtn
			], clickRow);
		}else{
			$("#datatable-batch").dataTable().fnUpdate([
				checkbox, data.name, data.projectName, data.modelName, data.executionCycle, 
				data.batchState, stateHtml, data.createDatetime, modifyBtn
			], clickRow);	
		}
	}
}

/*프로젝트 목록*/
var fnSetProjectList = function(projectList,id){
	for( var i in projectList ){
		var data = projectList[i];
		var project = [];
		project[0] = data.projectSeq;
		project[1] = data.name;
		project[2] = data.description;
		project[3] = data.createDatetime;
		
		$("#"+id).dataTable().fnAddData(project);
	}
}


/*모델 데이터*/
var fnSetModelData = function(modelList, id){
	for( var i in modelList ){
		var data = modelList[i];
		var model = [];
		model[0] = data.modelSeq;
		model[1] = data.name;
		model[2] = data.createDatetime;
		
		$("#"+id).dataTable().fnAddData(model);
	}
}

/*배치 시작/중지*/
var fnCommandBatch = function(batchServiceSeq, batchState){
	var data = {
		"batchServiceSeq":batchServiceSeq
		,"batchState": (batchState == "STOP") ? "START" : "STOP"
	};
	if( batchState == "START" || batchState == "STOP"){
		var comment = (batchState == "STOP") ? "시작" : "중지";
		if( confirm("서버를 "+comment+"하시겠습니까?") ){
			$("#loading").show();
			setTimeout(function() {
				var response = fnCommandBatchByAjax(data);
				
				if( response.result == "success" ){
					fnTaNotify("success", "배치 "+comment+" 요청하였습니다.");
					fnUpdateTable(response.batch, "update");
					
				}else{
					fnTaErrorMessage("배치 "+comment+" 에러!!", response.errorMessage);
				}
				$("#loading").fadeOut();
			}, 100);
		}
		
	}else if( batchState == "REQUEST" ){
		fnTaNotify("warning", "요청중입니다.");
	}else{
		fnTaNotify("warning", "ERROR입니다. \n관리자에게 문의해주세요.");
	}
}