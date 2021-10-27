userAuth = $("#userAuth").val();
$(function(){
	fnInit();
	
	$(document).on("click", "#tbodyHtml td", function(){
		if( $(this).index() == 1 ){
			var data = $("#datatable-project").dataTable().fnGetData($(this));
			var dataHtml = $.parseHTML(data[0]);
			var projectSeq = $(dataHtml).attr("id")
			fnComnMovePage("/projectDetail", ["projectSeq"], [projectSeq]);
		}
		if( $(this).index() == 6 ){
			var clickRows = $("#datatable-project").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
//			var data = $("#datatable-project").dataTable().fnGetData($(this).parent());
			clickRow = clickRows[0];
//			fnUpdateModal(data);
		}
	});
})

var fnInit = function(){
	fnSearch();
	// dataTable 생성
	var orderTarget = (userAuth == "admin") ? 4 : 3;
	fnTaCreateDataTable("datatable-project", orderTarget, "desc");
	
	$("#loading").fadeOut();
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetProjectListByAjax()));
}

var fnCreateListHtml = function(projectList){
	var html = "";
	for( var i in projectList ){
		var data = projectList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.projectSeq+"'/></td>";
		html += "	<td class='cusor' role='button'>"+data.name+" <i class='fa fa-sign-in'></i></td>";
		html += "	<td>"+data.description+"</td>";
		if (userAuth == "admin") html += "	<td>" + data.userId + "</td>";
		html += "	<td>"+data.createDatetime+"</td>";
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
				"	data-target='.projectModal' onClick='fnUpdateModal("+data.projectSeq+")'>" +
				"	<i class='fa fa-edit'></i> 수정</button></td>";
		
		html += "</tr>";
	}
	return html;
}

/*프로젝트 등록 모달*/
var fnInsertProjectModal = function(){
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*프로젝트 등록*/
var fnInsertProject = function(){
	if( $("#projectForm").parsley().validate() ){
		var data = {
				"name" : $("#name").val()
				,"description" : $("#description").val()
				,"userId" : $("#userId").val()
		}

		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertProjectByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".projectModal").modal("hide");
				fnUpdateTable(response.project, "insert");
				
			}else if( response.errorMessage == "duplication name" ){
				fnTaNotify("warning", $("#name").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "프로젝트 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(projectSeq){
	var project = fnGetProjectByAjax(projectSeq);
	$("#projectSeq").val(project.projectSeq);
	$("#name").val(project.name);
	$("#description").val(project.description);
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*프로젝트 수정*/
var fnUpdateProject = function(){
	if( $("#projectForm").parsley().validate() ){
		var data = {
				"projectSeq" : $("#projectSeq").val()
				,"name" : $("#name").val()			
				,"description" : $("#description").val()
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateProjectByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".projectModal").modal("hide");
				fnUpdateTable(response.project, "update");
				
			}else{
				fnTaNotify("danger", "프로젝트 수정 에러");
			}
		}
	}
}

/*프로젝트 삭제*/
var fnDeleteProject = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("관련된 모델도 같이 삭제됩니다. \n삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteProjectByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("프로젝트 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-project", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

/*업데이트 data*/
var fnUpdateTable = function(data, option){
	var checkbox = "<input type='checkbox' name='table_records' id='"+data.projectSeq+"' class='flat dataTableCheckbox'/>";
	var name = data.name+" <i class='fa fa-sign-in'></i>";
	var modifyBtn = "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
					"data-target='.projectModal' onClick='fnUpdateModal("+data.projectSeq+")'>" +
					"<i class='fa fa-edit'></i> 수정</button></td>";

	if( option == "insert" ){
		if (userAuth == "admin") {
			$("#datatable-project").dataTable().fnAddData([
				checkbox, name, data.description, data.userId, data.createDatetime, modifyBtn
			]);
			$("#datatable-project").DataTable().order([4, "desc"]).draw();
		}else{
			$("#datatable-project").dataTable().fnAddData([
				checkbox, name, data.description, data.createDatetime, modifyBtn
			]);
			$("#datatable-project").DataTable().order([3, "desc"]).draw();
		}
		
	}else{
		if (userAuth == "admin") {
			$("#datatable-project").dataTable().fnUpdate([
				checkbox, name, data.description, data.userId, data.createDatetime, modifyBtn
			], clickRow);
		}else{
			$("#datatable-project").dataTable().fnUpdate([
				checkbox, name, data.description, data.createDatetime, modifyBtn
			], clickRow);	
		}
		
	}
}

