
$(function(){
	fnInit();
	
	/* 테이블 클릭시 */
	$(document).on("click", "#tbodyHtml td", function(){
		var clickRows = $("#stopWordDicTable").dataTable().fnGetPosition(this); // 변경하고자 하는 clickRow
		clickRow = clickRows[0];
	});
	
	$("#sSearchValue").keydown(function() {
	  if (event.keyCode === 13) {
		  event.preventDefault();
		  fnSearchStopWordDicList('search');
	  };
	});
})

var fnInit = function(){
	// 불용어 목록
	fnSearchStopWordDicList();
	
	$("#loading").fadeOut();
}


/*배치 이력 목록 조회*/
var fnSearchStopWordDicList = function(option){
	var columns = ["STOPWORD_SEQ","WORD","CREATE_DATETIME"];
	var ajaxUrl = "/getStopWordDicList?columns="+columns;
	if( fnComnNotNullAndEmpty(option) && "search" == option )
		ajaxUrl = ajaxUrl+"&sSearch="+$("#sSearchValue").val()+"&searchColumn="+$("#searchColumn").val()+"&searchOption="+$("#searchOption").val();
	
     $("#stopWordDicTable").dataTable().fnDestroy();
	  $("#stopWordDicTable").DataTable( {
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
				{data: "stopwordSeq"}
				,{data: "word"}
				,{data: "createDatetime"}
				,{data: "stopwordSeq"}
			]
	  		,order: [[ 2, 'desc' ]]
	  		,columnDefs: [
	  			{
	  				"targets": 0
	  				,"orderable": false
	  				,"render": function(stopwordSeq){
	  					return "<input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+stopwordSeq+"'/>";
	  				}
	  			}
	  			,{
	  				"targets": 3
	  				,"render": function(stopwordSeq){
	  					return "<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.morphStopWordDicModal' onClick='fnUpdateModal("+stopwordSeq+")'>" +
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

/*불용어사전 등록 모달*/
var fnInsertStopWordDicModal = function(){
	$("#word").focus();
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*불용어 등록*/
var fnInsertStopWordDic = function(){
	if( $("#stopWordDicForm").parsley().validate() ){
		var data = {
				"word" : $("#word").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertStopWordDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".morphStopWordDicModal").modal("hide");
				fnSearchStopWordDicList();
				
			}else if( response.errorMessage == "duplication word" ){
				fnTaNotify("warning", $("#word").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "불용어 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(stopwordSeq){
	var stopWordDic = fnGetStopWordDicByAjax(stopwordSeq);
	$("#stopwordSeq").val(stopWordDic.stopwordSeq);
	$("#word").val(stopWordDic.word);
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*불용어 수정*/
var fnUpdateStopWordDic = function(){
	if( $("#stopWordDicForm").parsley().validate() ){
		var data = {
				"stopwordSeq" : $("#stopwordSeq").val()
				,"word" : $("#word").val()			
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateStopWordDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".morphStopWordDicModal").modal("hide");
				fnSearchStopWordDicList();
				
			}else{
				fnTaNotify("danger", "불용어 수정 에러");
			}
		}
	}
}

/*불용어 삭제*/
var fnDeleteStopWordDic = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteStopWordDicByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("데이터 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			fnSearchStopWordDicList();
//			if (successFlug) fnTaDeleteTable("stopWordDicTable", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}


