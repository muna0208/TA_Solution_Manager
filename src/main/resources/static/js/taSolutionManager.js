var clickRow, userAuth, userId;
$(function(){
	
	var urlName = window.location.pathname;
	
	$(".commonMenuUl").find("li").each(function(){
		$(this).removeClass("active");
	});
		
	if( urlName == "/preprocessorManage" )		$(".preprocessorActive").addClass("active");
	else if( urlName == "/algorithmManage" )		$(".algorithmActive").addClass("active");
	else if( urlName == "/originalDataManage" ){
		$(".dataManageActive").addClass("active");
		$(".dataManageDepth1").css("display","block");
		$(".originalDataActive").addClass("current-page");		
	}
	else if( urlName == "/preprocessedDataManage" || urlName == "/preprocessedDataDetail" ){
		$(".dataManageActive").addClass("active");
		$(".dataManageDepth1").css("display","block");
		$(".preprocessedDataActive").addClass("current-page");		
	}
	else if( urlName == "/projectManage" || urlName == "/projectDetail" )
		$(".projectManageActive").addClass("active");
	else if( urlName == "/demonManage"  || urlName == "/demonDetail" )		
		$(".demonManageActive").addClass("active");
	else if( urlName == "/batchManage" )		$(".batchManageActive").addClass("active");
	else if( urlName == "/morphNMDicManage" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".morphManageDepth2").css("display","block");
		$(".morphNMDicManageActive").addClass("current-page");
	
	}else if( urlName == "/morphEoj49DicManage" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".morphManageDepth2").css("display","block");
		$(".morphEoj49DicManageActive").addClass("current-page");
	
	}else if( urlName == "/morphCollocDicManage" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".morphManageDepth2").css("display","block");
		$(".morphCollocDicManageActive").addClass("current-page");
	
	}else if( urlName == "/morphStopWordDicManage" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".morphManageDepth2").css("display","block");
		$(".morphStopWordDicManageActive").addClass("current-page");
		
	}else if( urlName == "/applyDic" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".applyDicActive").addClass("current-page");
		
	}else if( urlName == "/analyzeTest" ){
		$(".morphActive").addClass("active");
		$(".morphManageDepth1").css("display","block");
		$(".analyzeTestActive").addClass("current-page");
	
	}else if( urlName == "/serverState" )		$(".serverStateActive").addClass("active");
	else if( urlName == "/userManage" )		$(".userManageActive").addClass("active");
	
	
	
	
	// a href="#" 적용 안되게 막기
	$(document).on('click', 'a[href="#"]', function(e){ e.preventDefault(); });
	
	/*체크박스의 모두체크버튼*/
	$("#check-all").click(function(){
		var chkFlug = false;
		if( $(this).is(":checked") )	chkFlug = true;
		$("input[name='table_records']").each(function(){
			$(this).prop("checked", chkFlug);
		});
	});
	
	/*모달 닫을때 input 내용 삭제*/
	$(document).on('hidden.bs.modal', function () {
		/*모달 값 초기화*/
		$("form").find("input").each(function(){
			$(this).val("");
		});
		$("form").find("textarea").each(function(){
			$(this).val("");
		});

		// parsley validation 초기화
		$("form").each(function(){
			var formId= $(this).attr("id");
			if( formId != undefined )	$("#"+formId).parsley().reset();
		});

		$(document).off('focusin.modal');
	})
	
	/*모달 열때*/
	$(document).on('shown.bs.modal', function () {
		$(document).off('focusin.modal');
		
	})
	
});



/*********************************************** project function start ***********************************************/

var fnTaMoveMenu = function(url){
	if( url != window.location.pathname )	fnComnGetMovePage(url);
}



/**
 * Notification
 * type = info, success, warning, danger
 * @param type
 * @param text
 * @returns fnTaNotify("warning", text);
 */
var fnTaNotify = function(type, text){
	new PNotify({
        title: type,
        text: text,
        type: type,
        styling: 'bootstrap3'
    });
}


/**
 * fnTaErrorMessage
 * @param text
 * @param message
 * @returns
 */
var fnTaErrorMessage = function(text, message){
	console.log(text+" : ");
	console.log(message);
	fnTaNotify("error",text);
}

/*목록 체크된 값 가져오기*/
var fnTaTableCheckList = function(id){
	var checkMap = {};
	var checkIdList = [];
	var checkRowList = [];
	$("#"+id).find("input[name='table_records']").each(function(){
		if( $(this).is(":checked") ){
			checkRowList.push($(this).parent().parent().parent());
			checkIdList.push($(this).attr("id"));
		}
	});
	
	checkMap["checkIdList"] = checkIdList;
	checkMap["checkRowList"] = checkRowList;
	
	return checkMap;
}

/* 테이블 삭제 */
var fnTaDeleteTable = function(id,checkRowList){
	for( var i in checkRowList ){
		$("#"+id).dataTable().fnDeleteRow(checkRowList[i]);
	}
}

/*타입에 따른 validation*/
var fnTaCheckTypeValue = function(type, value){
	var result = false;
	if( type == "string" || type == "bool" || type == "none" ){
		return true;
	}else{
		switch (type) {
			case "int" : 		  // '예) 5'
				if( value.replace(/^[0-9]+$/, "") == "" ) result = true; break;
				
			case "float" : 		  // 예) 5.5
				if( value.replace(/^\d+(?:[.]?[\d]?[\d]?[\d]?[\d])?$/, "") == "" ) result = true; break;
				
			case "numerical" :    // 예) 5.5
				if( value.replace(/^\d+(?:[.]?[\d]?[\d]?[\d]?[\d])?$/, "") == "" ) result = true; break;
				
			case "string, numerical" : // 예) String or 8 
				if( value.replace(/^[a-zA-Z]+|^\d+(?:[.]?[\d]?[\d]?[\d]?[\d])?$/, "") == "" ) result = true; break;
				
			case "numerical, string, np.nan" : // 예) String or 8.8
				if( value.replace(/^[a-zA-Z]+|^\d+(?:[.]?[\d]?[\d]?[\d]?[\d])?$/, "") == "" ) result = true; break;
				
			case "string, int, array" :  // 예) String or 1 or [String,String] or [3,5]
				if( value.replace(/^[a-zA-Z]+|^\d+|^\[+[a-zA-Z,]+\]+|^\[+[0-9,]+\]+$/, "") == "" ) result = true; break;
				
			case "string, array" :  // 예) String or [String,String]
				if( value.replace(/^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "string, list of ints, array" :  // 예) String or [3,5] or [String,String] or [3,5]
				if( value.replace(/^[a-zA-Z]+|^\[+[a-zA-Z,]+\]+|^\[+[0-9,]+\]+$/, "") == "" ) result = true; break;
				
			case "string, list, array" :	// 예) String or [String,String]
				if( value.replace(/^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "string, list of lists, array" :	// 예) String or [String,String] or [[String,String],[String,String]]
				if( value.replace(/^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "array-like" :		//예) [String,String] or [[String,String],[String,String]]
				if( value.replace(/^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "int, array-like" :	// 예) 2 or [3,5]
				if( value.replace(/^[0-9]+|^\[+[0-9,]+\]+$/, "") == "" ) result = true; break;
				
			case "string, sparse matrix" :	// 예) [[String,String],[String,String]]
				if( value.replace(/^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "array" :			// 예) [3]
				if( value.replace(/^\[+[0-9,]+\]+$/, "") == "" ) result = true; break;
				
			case "tuple" :			// 예) (2,3)
				if( value.replace(/^\(+[0-9,-]+\)+$/, "") == "" ) result = true; break;
				
			case "int, string, list" : // 예) 2 or String or [3,5] or [String,String]
				if( value.replace(/^[0-9]+|^\[+[0-9,]+\]|^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "int, list" :		// 예) 2 or [3,5]
				if( value.replace(/^[0-9]+|^\[+[0-9,]+\]+$/, "") == "" ) result = true; break;
				
			case "string, list" :	// 예) String or [String,String]
				if( value.replace(/^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
			
			case "string, list of list, array" :	// 예) String or [String,String]
				if( value.replace(/^[a-zA-Z]+|^\[+([a-zA-Z]+,?)*\]+$/, "") == "" ) result = true; break;
				
			case "int, string" : 	// 예) 2 or String
				if( value.replace(/^[a-zA-Z]+|^\d+$/, "") == "" ) result = true; break;
			default : ""; break;
		}
		
		return result;
	}
}

/*날짜 포멧 체크 {YYYYMMdd HHmm}*/
var fnTaDateFormatCheck = function(value){
	var expText = /\{+([YYYY|yyyy]{4})+([.:\-_@])*([MM]{2})+(([.:\-_@])*([dd]{2})+)*(([.:\-_@])*([HH]{2})+(([.:\-_@])*([mm]{2})+)*)*\}+/;
	if( expText.test(value) ){
		return false;
	}
	return true
}

var fnTaArraySplitBR  = function(value){
	if( $.isArray(value) ){
		var result = "";
		for( var i in value ){
			if( i == 0 ){
				result += value[i];
			}else if( i%5 == 0 ){
				result += ", <br>"+value[i];
			}else{
				result += ", "+value[i];
			}
		}
		return result;
	}else{
		return value;
	}
}

/*체크박스 체크해지*/
var fnTaUnCheckbox = function(id){
	$("#check-all").prop("checked", false);
	if( fnComnNotNullAndEmpty(id) )	$("#"+id).prop("checked", false);
	
	$("input[name='table_records']").each(function(){
		$(this).prop("checked", false);
	});
}



/*사용자별 프로젝트 목록 가져오기*/
var fnTaGetProjectOfUserId = function(){
	var html = "";
	var userProjectList = fnGetProjectListByAjax();
	for( var i in userProjectList ){
		var project = userProjectList[i];
		if( html == "" ){
			fnGetModelsOfProjectPk(project.PROJECT_SEQUENCE_PK);
			html += "<li class='projectList active pointerCorsor' data-projectSequencePk="+project.PROJECT_SEQUENCE_PK+">"+project.NAME+"</li>";
		}else{
			html += "<li class='projectList pointerCorsor' data-projectSequencePk="+project.PROJECT_SEQUENCE_PK+">"+project.NAME+"</li>";
		}
	}
	
	$("#selectedProject").html(html);
}

/*Profile 수정모달*/
var fnTaShowProfile = function(){
	var user = fnGetUserByAjax($("#id").val());
	console.log(user);
	$("#p_userId").val(user.userId);
	$("#p_userName").val(user.userName);
	$("#p_email").val(user.email);
	$("#p_password").val("wjdgusakstp");
	$("#p_confirmPassword").val("wjdgusakstp");
	$(".profileModal").modal("show");
}

/*Profile 수정*/
var fnTaSaveProfile = function(option){
	if( $("#profileForm").parsley().validate() ){
		var data = {
				"id" : $("#p_Id").val()
				,"userId" : $("#p_userId").val()
				,"userName" : $("#p_userName").val()
				,"email" : $("#p_email").val()
				,"userPw" : $("#p_password").val()
				,"useFlag" : 1
		}
		
		if( confirm("수정 하시겠습니까?") ){
			var response = fnSaveUserByAjax("/updateUser", "PATCH", data);
			fnTaNotify("success", "수정 완료");
			$(".profileModal").modal("hide");
		}
	}
}


// dataTable 생성
var fnTaCreateDataTable = function(tableId, orderTarget, order, visibleTarget, visibleTarget2){
	var columnDefs = [];
	columnDefs[0] = { targets: [0], orderable: false };
	if( fnComnNotNullAndEmpty(visibleTarget))
		columnDefs[1] = { targets: [visibleTarget], visible: false };
	
	if( fnComnNotNullAndEmpty(visibleTarget2))
		columnDefs[1] = { targets: [visibleTarget2], visible: false };

	$("#"+tableId).DataTable({
		 'order': [[ orderTarget, order ]]
	    ,'columnDefs': columnDefs 
    	,"drawCallback": function( settings ) {
			fnTaSetDataTableCheckbox();
	    }
	});
}

// modal dataTable 생성
var fnTaCreateModalDataTable = function(tableId, orderTarget, order, visibleTarget, visibleTarget2){
	var columnDefs = [];
	columnDefs[0] = { targets: [0], orderable: false };
	if( fnComnNotNullAndEmpty(visibleTarget))
		columnDefs[1] = { targets: [visibleTarget], visible: false };
	
	if( fnComnNotNullAndEmpty(visibleTarget2))
		columnDefs[2] = { targets: [visibleTarget2], visible: false };
	
	$("#"+tableId).DataTable({
	   order: [[ orderTarget, order ]]
	   ,select: {toggleable:true}
	   ,columnDefs: columnDefs
	   ,"drawCallback": function( settings ) {
		   fnTaSetDataTableCheckbox();
	    }
	});
	
	$("#"+tableId+"_length").hide();
	$("#"+tableId+"_filter").hide();
}

// dataTable checkbox 설정
var fnTaSetDataTableCheckbox = function(){
  $('.dataTableCheckbox').iCheck({
	checkboxClass: 'icheckbox_flat-green'
	,radioClass: 'iradio_flat-green'
  });
}