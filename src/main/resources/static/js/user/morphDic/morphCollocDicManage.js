
$(function(){
	fnInit();
	
	$("#sSearchValue").keydown(function() {
	  if (event.keyCode === 13) {
		  event.preventDefault();
		  fnSearchCollocDicList('search');
	  };
	});
})

var fnInit = function(){
	// 후처리 목록
	fnSearchCollocDicList();
	$("#loading").fadeOut();
}

/*배치 이력 목록 조회*/
var fnSearchCollocDicList = function(option){
	var columns = ["COLLOC_SEQ","INPUT","RESULT","IS_COMBINE","NER_TAG","CREATE_DATETIME"];
	var ajaxUrl = "/getCollocDicList?columns="+columns;
	if( fnComnNotNullAndEmpty(option) && "search" == option )
		ajaxUrl = ajaxUrl+"&sSearch="+$("#sSearchValue").val()+"&searchColumn="+$("#searchColumn").val()+"&searchOption="+$("#searchOption").val();
	
     $("#collocDicTable").dataTable().fnDestroy();
	  $("#collocDicTable").DataTable( {
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
				{data: "collocSeq"}
				,{data: "input"}
				,{data: "result"}
				,{data: "isCombine"}
				,{data: "nerTag"}
				,{data: "createDatetime"}
				,{data: "collocSeq"}
			]
	  		,order: [[ 5, 'desc' ]]
	  		,columnDefs: [
	  			{
	  				"targets": 0
	  				,"orderable": false
	  				,"render": function(collocSeq){
	  					return "<input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+collocSeq+"'/>";
	  				}
	  			}
	  			,{
	  				"targets": 6
	  				,"render": function(collocSeq){
	  					return "<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.morphCollocDicModal' onClick='fnUpdateModal("+collocSeq+")'>" +
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

/*후처리사전 등록 모달*/
var fnInsertCollocDicModal = function(){
	$("#input").focus().prop("readonly",false);
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*후처리 등록*/
var fnInsertCollocDic = function(){
	if( $("#collocDicForm").parsley().validate() ){
		var data = {
				"input" : $("#input").val()
				,"result" : $("#result").val()
				,"isCombine" : $("#isCombine").val()
				,"nerTag" : $("#nerTag").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertCollocDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".morphCollocDicModal").modal("hide");
				fnSearchCollocDicList();
				
			}else if( response.errorMessage == "duplication input" ){
				fnTaNotify("warning", $("#input").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "후처리 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(collocSeq){
	var collocDic = fnGetCollocDicByAjax(collocSeq);
	$("#collocSeq").val(collocDic.collocSeq);
	$("#input").val(collocDic.input).prop("readonly",true);
	$("#result").val(collocDic.result);
	$("#isCombine").val(collocDic.isCombine);
	$("#nerTag").val(collocDic.nerTag);
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*후처리 수정*/
var fnUpdateCollocDic = function(){
	if( $("#collocDicForm").parsley().validate() ){
		var data = {
				"collocSeq" : $("#collocSeq").val()
				,"input" : $("#input").val()			
				,"result" : $("#result").val()
				,"isCombine" : $("#isCombine").val()
				,"nerTag" : $("#nerTag").val()
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateCollocDicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".morphCollocDicModal").modal("hide");
				fnSearchCollocDicList();
				
			}else{
				fnTaNotify("danger", "후처리 수정 에러");
			}
		}
	}
}

/*후처리 삭제*/
var fnDeleteCollocDic = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteCollocDicByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("데이터 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			fnSearchCollocDicList();
//			if (successFlug) fnTaDeleteTable("collocDicTable", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

//형태소 분석
var fnCollocDicTest = function(){
	if( fnComnNotNullAndEmpty($("#body").val()) ){
		
		$("#loading").show();
		setTimeout(function() {
			var data = {"body" : $("#body").val() }
			var response = fnAnalyzeTestByAjax(data);
			if( response.result == "success" ){
				$("#morphResult").val(response.resultTM_Colloc_MorpyResult);
				$("#input").val(response.resultTM_Colloc_Input).prop("readonly",true);
				fnTaNotify("success", "분석을 완료하였습니다.");
				
			}else{
				fnTaNotify("danger", response.errorMessage);
			}
			$("#loading").fadeOut();
		}, 100);
		
	}else{
		$("#body").focus();
		fnTaNotify("warning", "단어를 입력해주세요.");
	}
}


