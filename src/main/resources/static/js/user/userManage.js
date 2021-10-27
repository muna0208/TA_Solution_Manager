$(function(){
	fnInit();
	
	/*사용자 등록/수정*/
	$(document).on("click", "#saveUserBtn", function(){
		if( "등록" == $(this).text() )	fnSaveUser("insert");
		else fnSaveUser("update");
	});
	
	/* 사용여부 변경 */
	$(document).on("click", "input[name='useYn']", function(){
		fnUpdateUseYn($(this).attr("data-id"), $(this).is(":checked"));
	});
	
	/* 테이블 클릭시 */
	$(document).on("click", "#tbodyHtml td", function(){
		if( $(this).index() == 9 ){
			var clickRows = $("#datatable-user").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
			var data = $("#datatable-user").dataTable().fnGetData($(this).parent());
			clickRow = clickRows[0];
//			fnUpdateModal(data[1]);
		}
	});
});

var fnInit = function(){
	fnSearch();
	// dataTable 생성
	fnTaCreateDataTable("datatable-user", 7, "desc");
	$("#loading").fadeOut();
}


/*프로젝트 목록 조회*/
var fnSearch = function(){
	var userList = fnGetUserListByAjax();
	$("#tbodyHtml").html(fnCreateListHtml(userList));
	
}

/*프로젝트 목록 생성*/
var fnCreateListHtml = function(userList){
	var html = "";
	for( var i in userList ){
		var data = userList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat userCheckbox' id='"+data.id+"'/></td>";
		html += "	<td>"+data.userName+"</td>";
		html += "	<td>"+data.userId+"</td>";
		html += "	<td>"+data.email+"</td>";
		html += "	<td>"+data.userAuth+"</td>";
		html += "	<td>"+data.lastAccessDate+"</td>";
		html += "	<td>"+data.registerer+"</td>";
		html += "	<td>"+data.registerDate+"</td>";
		if( data.useFlag == 1)
			html += "	<td><div class='switch_box'><label class='switch'><input type='checkbox' name='useYn' data-id=\""+data.id+"\" checked><span class='slider round'></span></label></div></tc>"
		else
			html += "	<td><div class='switch_box'><label class='switch'><input type='checkbox' name='useYn' data-id=\""+data.id+"\"><span class='slider round'></span></label></div></tc>"
		
		html += "	<td><button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
				"	data-target='.infoModal' onClick='fnUpdateModal("+data.id+")'>" +
				"	<i class='fa fa-edit'></i> 수정</button></td>";
		html += "</tr>";
	}
	return html;
}

/*프로젝트 등록 모달*/
var fnAddUserModal = function(){
	$("#modalTitle").text("사용자 등록");
	$("#saveUserBtn").text("등록");
	$("#userForm").find("input").each(function(){
		$(this).val("");
	});
	$("#m_userId").prop("readonly", false);
	$("#user").iCheck("check");
	$("#Y").iCheck("check");
}

/*프로젝트 수정 모달*/
var fnUpdateModal = function(id){
	$("#modalTitle").text("사용자 수정");
	$("#saveUserBtn").text("수정");
	
	var user = fnGetUserByAjax(id);
	$("#m_Id").val(user.id);
	$("#m_userId").val(user.userId).prop("readonly", true).prop("required", false);
	$("#m_userName").val(user.userName);
	$("#email").val(user.email);
	$("#password").val("wjdgusakstp");
	$("#confirmPassword").val("wjdgusakstp");
	
	if( user.useFlag == 1 ) $("#Y").iCheck("check");
	else 					   $("#N").iCheck("check");
	
	$("#"+user.userAuth).iCheck("check");
}


/*사용자 등록/수정*/
var fnSaveUser = function(option){
	if( $("#userForm").parsley().validate() ){
		var data = {
				"id" : $("#m_Id").val()
				,"userId" : $("#m_userId").val()
				,"userName" : $("#m_userName").val()
				,"email" : $("#email").val()
				,"userPw" : $("#password").val()
				,"userAuth" : $("input:radio[name='userAuth']:checked").attr("id")
				,"useFlag" : $("input:radio[name='useFlag']:checked").attr("id") == "Y" ? 1 : 0
		}
		
		var optionText = "등록";
		var url = "/insertUser";
		var type = "POST";
		if( option == "update" ){
			optionText = "수정";
			url = "/updateUser";
			type = "PATCH";
		}
		if( confirm(optionText+"하시겠습니까?") ){
			var response = fnSaveUserByAjax(url, type, data);
			if( fnComnNotNullAndEmpty(response.result) ){
				if( response.errorMessage == "duplication userId" ){
					$("#m_userId").focus();
					fnTaNotify("warning", "사용자 ID가 중복되었습니다.");
					
				}else{
					fnTaNotify("danger", "사용자 "+optionText+" 에러");
				}	
			}else{
				fnTaNotify("success", optionText+" 완료");
				$(".infoModal").modal("hide");
				
				fnUpdateTable(response, option);
			}
		}
	}
}

/*업데이트 data*/
var fnUpdateTable = function(data, option){
	var checkbox = "<input type='checkbox' name='table_records' id='"+data.id+"' class='flat userCheckbox'/>";
	var useFlag = "";
	if( data.useFlag == 1 )
		useFlag += "	<div class='switch_box'><label class='switch'><input type='checkbox' name='useYn' data-id=\""+data.id+"\" checked><span class='slider round'></span></label></div>"
	else
		useFlag += "	<div class='switch_box'><label class='switch'><input type='checkbox' name='useYn' data-id=\""+data.id+"\" ><span class='slider round'></span></label></div>"
	
	var modifyBtn = "	<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
					"	data-target='.infoModal' onClick='fnUpdateModal("+data.id+")'>" +
					"	<i class='fa fa-edit'></i> 수정</button>";

	if( option == "insert" ){
		$("#datatable-user").dataTable().fnAddData([
			checkbox, data.userName, data.userId, data.email, data.userAuth, data.lastAccessDate, 
			data.registerer, data.registerDate, useFlag, modifyBtn
		]);
		$("#datatable-user").DataTable().order([7, "desc"]).draw();
		
	}else{
		$("#datatable-user").dataTable().fnUpdate([
			checkbox, data.userName, data.userId, data.email, data.userAuth, data.lastAccessDate, 
			data.registerer, data.registerDate, useFlag, modifyBtn
		], clickRow);
	}
	
	/* iCheck 생성 */
	$('.userCheckbox').iCheck({checkboxClass: 'icheckbox_flat-green',radioClass: 'iradio_flat-green'});
}


var fnDeleteUser = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if( checkIdList.length > 0 ){
		if( confirm("사용자를 삭제하시겠습니까?") ){
			for( var i in checkIdList ){
				var response = fnDeleteUserByAjax(checkIdList[i]);
				if( response.result == "success" ){
					$("input").iCheck("uncheck");
					fnTaNotify("success", "사용자를 삭제하였습니다.");
					successFlug = true;
				}else{
					fnTaErrorMessage("사용자 삭제 에러!!", response.errorMessage);
				}
			}
			/* 테이블 삭제 */
			if( successFlug )	fnTaDeleteTable("datatable-user", checkRowList);
		}
		
	}else{
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

/* 사용여부 변경 */
var fnUpdateUseYn = function(id, useYn){
	var data = {
		"id" : id
		,"useFlag" : ( useYn == true ) ? 1 : 0
	}
	
	var url = "/updateUser";
	var type = "PATCH";
	var response = fnSaveUserByAjax(url, "PATCH", data);
	if( fnComnNotNullAndEmpty(response.result) ){
		fnTaErrorMessage("수정 에러", response.errorMessage);
		fnTaNotify("danger", "수정 에러");
	}else{
		fnTaNotify("success", "수정 완료");
	}
}





















