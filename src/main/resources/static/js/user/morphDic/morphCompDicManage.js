
$(function(){
	fnInit();
	
	$("#sSearchValue").keydown(function() {
	  if (event.keyCode === 13) {
		  event.preventDefault();
		  fnSearchCompDicList('search');
	  };
	});
})

var fnInit = function(){
	// 복합사전 목록
	fnSearchCompDicList();
	$("#loading").fadeOut();
}

/*배치 이력 목록 조회*/
var fnSearchCompDicList = function(option){
	var columns = ["COMP_SEQ","WORD","CREATE_DATETIME"];
	var ajaxUrl = "/getCompDicList?columns="+columns;
	if( fnComnNotNullAndEmpty(option) && "search" == option )
		ajaxUrl = ajaxUrl+"&sSearch="+$("#sSearchValue").val()+"&searchColumn="+$("#searchColumn").val()+"&searchOption="+$("#searchOption").val();
	
     $("#compDicTable").dataTable().fnDestroy();
	  $("#compDicTable").DataTable( {
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
				{data: "COMP_SEQ"}
				,{data: "WORD"}
				,{data: "createDatetime"}
				,{data: "COMP_SEQ"}
			]
	  		,order: [[ 2, 'desc' ]]
	  		,columnDefs: [
	  			{
	  				"targets": 0
	  				,"orderable": false
	  				,"render": function(COMP_SEQ){
	  					return "<input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+COMP_SEQ+"'/>";
	  				}
	  			}
	  			,{
	  				"targets": 3
	  				,"render": function(COMP_SEQ){
	  					return "<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.morphCompDicModal' onClick='fnUpdateModal("+COMP_SEQ+")'>" +
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

/*복합사전사전 등록 모달*/
var fnInsertCompDicModal = function(){
	$("#word").prop("readonly",false);
	$(".registDiv").show();
	$(".updateDiv").hide();
	$(".resultDiv").hide();
}


/*복합사전 등록*/
var fnInsertCompDic = function(){
	if( $("#compDicForm").parsley().validate() ){
		var data = {
				"word" : $("#word").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertCompDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".morphCompDicModal").modal("hide");
				fnSearchCompDicList();
				
			}else if( response.errorMessage == "duplication word" ){
				fnTaNotify("warning", $("#word").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "복합사전 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(compSeq){
	var compDic = fnGetCompDicByAjax(compSeq);
	$("#compSeq").val(compDic.COMP_SEQ);
	$("#word").val(compDic.WORD);
	$(".registDiv").hide();
	$(".updateDiv").show();
	$(".resultDiv").hide();
}

/*복합사전 수정*/
var fnUpdateCompDic = function(){
	if( $("#compDicForm").parsley().validate() ){
		var data = {
				"compSeq" : $("#compSeq").val()
				,"word" : $("#word").val()			
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateCompDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".morphCompDicModal").modal("hide");
				fnSearchCompDicList();
				
			}else{
				fnTaNotify("danger", "복합사전 수정 에러");
			}
		}
	}
}

/*복합사전 삭제*/
var fnDeleteCompDic = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteCompDicByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("데이터 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			fnSearchCompDicList();
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}


/*유효성 검사*/
var fnCheckValidity = function(){
	fnTaNotify("warning", "API 연결이 안되어있습니다.");
}

