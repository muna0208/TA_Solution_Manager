
$(function(){
	fnInit();
	
	/* 테이블 클릭시 */
	$(document).on("click", "#tbodyHtml td", function(){
		var clickRows = $("#nmDicTable").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
		clickRow = clickRows[0];
	});
	
	$("#sSearchValue").keydown(function() {
	  if (event.keyCode === 13) {
		  event.preventDefault();
		  fnSearchNmDicList('search');
	  };
	});
})

var fnInit = function(){
	// 신조어 목록
	fnSearchNmDicList();
	$("#loading").fadeOut();
	
	// 신조어 코드 
	fnGetNmDicCodeList();
}

/*배치 이력 목록 조회*/
var fnSearchNmDicList = function(option){
	var columns = ["NM_SEQ","WORD","TAG","ADD_INFO1","ADD_INFO2","CREATE_DATETIME"];
	var ajaxUrl = "/getNmDicList?columns="+columns;
	if( fnComnNotNullAndEmpty(option) && "search" == option )
		ajaxUrl = ajaxUrl+"&sSearch="+$("#sSearchValue").val()+"&searchColumn="+$("#searchColumn").val()+"&searchOption="+$("#searchOption").val();
	
     $("#nmDicTable").dataTable().fnDestroy();
	  $("#nmDicTable").DataTable( {
		  	bSortable: true
			,bPaginate: true
			,bLengthChange: true
			,responsive: true
			,bAutoWidth: false
			,processing: false
			,ordering: true
			,bServerSide: true
			,searching: false
			,sAjaxSource: ajaxUrl
			,sServerMethod: "POST"
			,columns: [
				{data: "nmSeq"}
				,{data: "word"}
				,{data: "tagName"}
				,{data: "addInfo1"}
				,{data: "addInfo2"}
				,{data: "createDatetime"}
				,{data: "nmSeq"}
			]
	  		,order: [[ 5, 'desc' ]]
	  		,columnDefs: [
	  			{
	  				"targets": 0
	  				,"orderable": false
	  				,"render": function(nmSeq){
	  					return "<input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+nmSeq+"'/>";
	  				}
	  			}
	  			,{
	  				"targets": 6
	  				,"render": function(nmSeq){
	  					return "<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.morphNMDicModal' onClick='fnUpdateModal("+nmSeq+")'>" +
								"<i class='fa fa-edit'></i> 수정</button>";
	  				}
	  			}
	  		]
		  ,"drawCallback": function( settings ) {
			  $('.dataTableCheckbox').iCheck({
				checkboxClass: 'icheckbox_flat-green'
				,radioClass: 'iradio_flat-green'
			  });
		    }
	  } );
	  	  
	  $('.dataTables_filter').hide();
	  $('.dataTables_length').hide();
}

/*신조어사전 등록 모달*/
var fnInsertNmDicModal = function(){
	$("#word").focus().prop("readonly",false);
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*신조어 등록*/
var fnInsertNmDic = function(){
	if( $("#nmDicForm").parsley().validate() ){
		var data = {
				"word" : $("#word").val()
				,"tag" : $("#tag").val()
				,"addInfo1" : $("#addInfo1").val()
				,"addInfo2" : $("#addInfo2").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertNmDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".morphNMDicModal").modal("hide");
				fnSearchNmDicList();
				
			}else if( response.errorMessage == "duplication word" ){
				fnTaNotify("warning", $("#word").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "신조어 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(nmSeq){
	var nmDic = fnGetNmDicByAjax(nmSeq);
	$("#nmSeq").val(nmDic.nmSeq);
	$("#word").val(nmDic.word).prop("readonly",true);
	$("#tag").val(nmDic.tag);
	$("#addInfo1").val(nmDic.addInfo1);
	$("#addInfo2").val(nmDic.addInfo2);
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*신조어 수정*/
var fnUpdateNmDic = function(){
	if( $("#nmDicForm").parsley().validate() ){
		var data = {
				"nmSeq" : $("#nmSeq").val()
				,"word" : $("#word").val()			
				,"tag" : $("#tag").val()
				,"addInfo1" : $("#addInfo1").val()
				,"addInfo2" : $("#addInfo2").val()
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateNmDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".morphNMDicModal").modal("hide");
				fnSearchNmDicList();
				
			}else{
				fnTaNotify("danger", "신조어 수정 에러");
			}
		}
	}
}

/*신조어 삭제*/
var fnDeleteNmDic = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteNmDicByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("데이터 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			fnSearchNmDicList();
//			if (successFlug) fnTaDeleteTable("nmDicTable", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

/*신조어 코드 목록 가져오기*/
var fnGetNmDicCodeList = function(){
	var codeList = fnGetNmDicCodeListByAjax("MORPH_NM");
	var html = "";
	for( var i in codeList ){
		var data = codeList[i];
		html += "<option value='"+data.comnCode+"'>"+data.comnCodeName+"</option>";
	}
	$("#tag").html(html);
}




