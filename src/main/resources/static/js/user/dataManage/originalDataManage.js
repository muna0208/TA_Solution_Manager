userAuth = $("#userAuth").val();
$(function(){
	fnInit();
	
	/* 테이블 클릭시 */
	$(document).on("click", "#tbodyHtml td", function(){
		if( $(this).index() == 6 ){
			var clickRows = $("#datatable-originalData").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
//			var data = $("#datatable-originalData").dataTable().fnGetData($(this).parent());
			clickRow = clickRows[0];
//			fnUpdateModal(data);
		}
	});
})

var fnInit = function(){
	// 원본데이터 목록
	$("#tbodyHtml").html(fnCreateListHtml(fnGetOriginalDataListByAjax()));

	// dataTable 생성
	fnTaCreateDataTable("datatable-originalData", 5, "desc");
	
	$("#loading").fadeOut();
}


var fnCreateListHtml = function(originalDataList){
	var html = "";
	for( var i in originalDataList ){
		var data = originalDataList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.originalDataSeq+"'/></td>";
		html += "	<td>"+data.originalFileName+"</td>";
		html += "	<td>"+data.description+"</td>";
		html += "	<td>"+fnComnConvertSizeExp(data.fileSize)+"</td>";
		if (userAuth == "admin") html += "	<td>" + data.userId + "</td>";
		html += "	<td>"+data.createDatetime+"</td>";
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
				"data-target='.originalDataModal' onClick='fnUpdateModal("+data.originalDataSeq+")'>" +
				"<i class='fa fa-edit'></i> 수정</button></td>";
		html += "</tr>";
	}
	return html;
}


/*원본데이터 등록*/
var fnInsertOriginalData = function(){
	var currentNodeId = $("#jstree_demo").jstree("get_selected");
	var parentPath = "",originalFileName = "";
	console.log($("#jstree_demo").jstree("get_node", currentNodeId));
	if( fnComnNotNullAndEmpty(currentNodeId) ){
		var currentNode = $("#jstree_demo").jstree("get_node", currentNodeId);
		if( currentNode.original.type == "file" ){
			originalFileName = currentNode.original.text;
			parentPath = currentNode.original.parentPath;
			var data = {
					"originalFileName" : originalFileName
					,"parentPath" : parentPath
					,"description" : $("#description").val()
					,"userId" : $("#userId").val()
			}
			
			if( confirm("등록하시겠습니까?") ){
				var response = fnInsertOriginalDataByAjax(data);
				if( response.result == "success" ){
					fnTaNotify("success", "등록 완료");
					$(".originalDataModal").modal("hide");
					
					fnUpdateTable(response.originalData, "insert");
					
				}else if( response.errorMessage == "duplication file" ){
					fnTaNotify("warning", originalFileName+"은 이미 등록되어 있습니다.");
					
				}else{
					fnTaNotify("danger", "원본데이터 등록 에러");
				}
			}
		}else{
			fnTaNotify("warning", "파일을 선택해주세요.");	
		}
	}else{
		fnTaNotify("warning", "선택한 파일을 알수없습니다.");
	}
}

/*업데이트 data*/
var fnUpdateTable = function(data, option){
	var checkbox = "<input type='checkbox' name='table_records' id='"+data.originalDataSeq+"' class='flat dataTableCheckbox'/>";
	var modifyBtn = "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
					"data-target='.originalDataModal' onClick='fnUpdateModal("+data.originalDataSeq+")'>" +
					"<i class='fa fa-edit'></i> 수정</button></td>";

	if( option == "insert" ){
		if (userAuth == "admin") {
			$("#datatable-originalData").dataTable().fnAddData([
				checkbox, data.originalFileName, data.description, fnComnConvertSizeExp(data.fileSize), data.userId, data.createDatetime, modifyBtn
			]);
		}else{
			$("#datatable-originalData").dataTable().fnAddData([
				checkbox, data.originalFileName, data.description, fnComnConvertSizeExp(data.fileSize), data.createDatetime, modifyBtn
			]);	
		}
		
		$("#datatable-originalData").DataTable().order([5, "desc"]).draw();
		
	}else{
		if (userAuth == "admin") {
			$("#datatable-originalData").dataTable().fnUpdate([
				checkbox, data.originalFileName, data.description, fnComnConvertSizeExp(data.fileSize), data.userId, data.createDatetime, modifyBtn
			], clickRow);
		}else{
			$("#datatable-originalData").dataTable().fnUpdate([
				checkbox, data.originalFileName, data.description, fnComnConvertSizeExp(data.fileSize), data.createDatetime, modifyBtn
			], clickRow);	
		}
		
	}
}

/*수정모달*/
var fnUpdateModal = function(originalDataSeq){
	var originalData = fnGetOriginalDataByAjax(originalDataSeq);
	$("#originalDataSeq").val(originalData.originalDataSeq);
	$("#originalFileName").val(originalData.originalFileName);
	$("#description").val(originalData.description);
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*원본데이터 수정*/
var fnUpdateOriginalData = function(){
	var data = {
			"originalDataSeq" : $("#originalDataSeq").val()
			,"originalFileName" : $("#originalFileName").val()			
			,"description" : $("#description").val()
	}
	
	if( confirm("수정하시겠습니까?") ){
		var response = fnUpdateOriginalDataByAjax(data);
		if( response.result == "success" ){
			fnTaNotify("success", "수정 완료");
			$(".originalDataModal").modal("hide");
			
			fnUpdateTable(response.originalData, "update");
			
		}else{
			fnTaNotify("danger", "원본데이터 등록 에러");
		}
	}
}

/*원본데이터 삭제*/
var fnDeleteOriginalData = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("원본 데이터를 삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteOriginalDataByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "원본 데이터를 삭제하였습니다.");
					successFlug = true;
					
				} else if( response.errorMessage == "originalData in use") {
					fnTaNotify("warning", "전처리 데이터에 사용중이라 삭제할수 없습니다.");
					
				} else {
					fnTaErrorMessage("원본 데이터 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-originalData", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}



