
$(function(){
	fnInit();
	
	$(document).on("click", "#tbodyHtml td", function(){
		if( $(this).index() == 1 ){
			var data = $("#datatable-demon").dataTable().fnGetData($(this));
			var dataHtml = $.parseHTML(data[0]);
			var demonServiceSeq = $(dataHtml).attr("id")
			fnComnMovePage("/demonDetail", ["demonServiceSeq"], [demonServiceSeq]);
		}
		if( $(this).index() == 6 ){
			var clickRows = $("#datatable-demon").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
			clickRow = clickRows[0];
		}
	});
	
	/* 프로젝트 목록 클릭시*/
	$("#datatable-project").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-project").DataTable().rows(indexes).data().toArray();
		var data = {
				"trainState":"FINISHED"
				,"domainFlag": 1
			};
		var modelList = fnGetModelSearchListByAjax(rowData[0][0], data);
		
		$("#datatable-model").DataTable().clear().draw();
		fnSetModelData(modelList, "datatable-model");
	
		$("#modelDiv").fadeIn();
	});
})

var fnInit = function(){
	fnSearch();
	fnCreateDataTable();
	$("#loading").fadeOut();
}

var fnCreateDataTable = function(){
	// dataTable 생성
	fnTaCreateDataTable("datatable-demon", 5, "desc");
	
	fnTaCreateModalDataTable("datatable-project", 1, "desc", 0);
	fnTaCreateModalDataTable("datatable-model", 1, "desc", 0);
	
	$("#datatable-project").DataTable().clear().draw();
	fnSetProjectList(fnGetProjectListByAjax(), "datatable-project");	
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetDemonListByAjax()));
}

var fnCreateListHtml = function(demonList){
	var html = "";
	for( var i in demonList ){
		var data = demonList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.demonServiceSeq+"'/></td>";
		html += "	<td class='cusor' role='button'>"+data.name+" <i class='fa fa-sign-in'></i></td>";
		html += "	<td>"+data.projectName+"</td>";
		html += "	<td>"+data.modelName+"</td>";
		html += "	<td>"+data.userId+"</td>";
		html += "	<td>"+data.createDatetime+"</td>";
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
		"	data-target='.demonModal' onClick='fnUpdateModal("+data.demonServiceSeq+")'>" +
		"	<i class='fa fa-edit'></i> 수정</button></td>";
		html += "</tr>";
	}
	return html;
}


/*데몬 등록 모달*/
var fnInsertDemonModal = function(){
	$("#datatable-project").DataTable().rows().deselect();
	if ( $.fn.DataTable.isDataTable( '#datatable-model' ) )
		$("#datatable-model").DataTable().rows().deselect();
	
	$(".registDiv").show();
	$(".updateDiv").hide();
}

/*수정모달*/
var fnUpdateModal = function(demonServiceSeq){
	$("#datatable-project").DataTable().rows().deselect();
	
	var response = fnGetDemonByAjax(demonServiceSeq);
	var demon = response.demon;
	$("#demonServiceSeq").val(demon.demonServiceSeq);
	$("#name").val(demon.name);
	
	$("#datatable-project").find("#projectTbody tr").each(function(){
		var data = $("#datatable-project").dataTable().fnGetData($(this));
		if( demon.projectSeq == data[0] )
			$("#datatable-project").DataTable().rows($(this)).select();		
	});
	
	$("#datatable-model").find("#modelTbody tr").each(function(){
		var data = $("#datatable-model").dataTable().fnGetData($(this));
		if( demon.modelSeq == data[0] )
			$("#datatable-model").DataTable().rows($(this)).select();		
	});
	
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*데몬 등록/수정*/
var fnSaveDemon = function(option){
	if( $("#demonForm").parsley().validate() ){
		
		if( $("#datatable-project").DataTable().rows({selected:true}).data()[0] == undefined ){
			fnTaNotify("warning", "프로젝트를 선택해주세요.");
			return false;
		}else if( $("#datatable-model").DataTable().rows({selected:true}).data()[0] == undefined ){
			fnTaNotify("warning", "모델을 선택해주세요.");
			return false;
		}
		var projectSeq = $("#datatable-project").DataTable().rows({selected:true}).data()[0][0];
		var modelSeq = $("#datatable-model").DataTable().rows({selected:true}).data()[0][0];
		
		var data = {
				"demonServiceSeq" : (option=='insert') ? "" : $("#demonServiceSeq").val()
				,"name" : $("#name").val()
				,"projectSeq" : projectSeq
				,"modelSeq" : modelSeq
				,"userId" : $("#userId").val()
		}
		
		var comment = (option=='insert') ? "등록" : "수정";

		if( confirm(comment+"하시겠습니까?") ){
			var response = (option=='insert') ? fnInsertDemonByAjax(data) : fnUpdateDemonByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", comment+" 완료");
				$(".demonModal").modal("hide");
				fnUpdateTable(response.demon, option);
				
			}else if( response.errorMessage == "duplication name" ){
				fnTaNotify("warning", $("#name").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "데몬 "+comment+" 에러");
			}
		}
	}
}


/*데몬 삭제*/
var fnDeleteDemon = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("데몬을 삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteDemonByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("데몬 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-demon", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}


/*업데이트 data*/
var fnUpdateTable = function(data, option){
	var checkbox = "<input type='checkbox' name='table_records' id='"+data.demonServiceSeq+"' class='flat dataTableCheckbox'/>";
	var name = data.name+" <i class='fa fa-sign-in'></i>";
	var modifyBtn = "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
					"data-target='.demonModal' onClick='fnUpdateModal("+data.demonServiceSeq+")'>" +
					"<i class='fa fa-edit'></i> 수정</button></td>";

	if( option == "insert" ){
		$("#datatable-demon").dataTable().fnAddData([
			checkbox, name, data.projectName, data.modelName, data.userId, data.createDatetime, modifyBtn
		]);
		$("#datatable-demon").DataTable().order([5, "desc"]).draw();
		
	}else{
		$("#datatable-demon").dataTable().fnUpdate([
			checkbox, name, data.projectName, data.modelName, data.userId, data.createDatetime, modifyBtn
		], clickRow);
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