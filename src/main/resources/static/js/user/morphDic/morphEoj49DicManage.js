
$(function(){
	fnInit();
	
	$("#sSearchValue").keydown(function() {
	  if (event.keyCode === 13) {
		  event.preventDefault();
		  fnSearchEoj49DicList('search');
	  };
	});
})

var fnInit = function(){
	// 기분석 목록
	fnSearchEoj49DicList();
	$("#loading").fadeOut();
}


/*배치 이력 목록 조회*/
var fnSearchEoj49DicList = function(option){
	var columns = ["EOJ49_SEQ","EOJEOL","RESULT","FREQ","CREATE_DATETIME"];
	var ajaxUrl = "/getEoj49DicList?columns="+columns;
	if( fnComnNotNullAndEmpty(option) && "search" == option )
		ajaxUrl = ajaxUrl+"&sSearch="+$("#sSearchValue").val()+"&searchColumn="+$("#searchColumn").val()+"&searchOption="+$("#searchOption").val();
	
     $("#eoj49DicTable").dataTable().fnDestroy();
	  $("#eoj49DicTable").DataTable( {
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
				{data: "eoj49Seq"}
				,{data: "eojeol"}
				,{data: "result"}
				,{data: "freq"}
				,{data: "createDatetime"}
				,{data: "eoj49Seq"}
			]
	  		,order: [[ 4, 'desc' ]]
	  		,columnDefs: [
	  			{
	  				"targets": 0
	  				,"orderable": false
	  				,"render": function(eoj49Seq){
	  					return "<input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+eoj49Seq+"'/>";
	  				}
	  			}
	  			,{
	  				"targets": 5
	  				,"render": function(eoj49Seq){
	  					return "<button type='button' class='btn btn-info btn-xs' data-toggle='modal' " +
								"data-target='.morphEoj49DicModal' onClick='fnUpdateModal("+eoj49Seq+")'>" +
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

/*기분석사전 등록 모달*/
var fnInsertEoj49DicModal = function(){
	$("#eojeol").focus().prop("readonly",false);
	$("#eoj49DicTestDiv").hide()
	$(".registDiv").show();
	$(".updateDiv").hide();
}


/*기분석 등록*/
var fnInsertEoj49Dic = function(){
	if( $("#eoj49DicForm").parsley().validate() ){
		var data = {
				"eojeol" : $("#eojeol").val()
				,"result" : $("#result").val()
				,"freq" : $("#freq").val()
		}
		
		if( confirm("등록하시겠습니까?") ){
			var response = fnInsertEoj49DicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "등록 완료");
				$(".morphEoj49DicModal").modal("hide");
				fnSearchEoj49DicList();
				
			}else if( response.errorMessage == "duplication eojeol" ){
				fnTaNotify("warning", $("#eojeol").val()+"은 이미 등록되어 있습니다.");
				
			}else{
				fnTaNotify("danger", "기분석 등록 에러");
			}
		}
	}
}


/*수정모달*/
var fnUpdateModal = function(eoj49Seq){
	var eoj49Dic = fnGetEoj49DicByAjax(eoj49Seq);
	$("#eoj49Seq").val(eoj49Dic.eoj49Seq);
	$("#eojeol").val(eoj49Dic.eojeol).prop("readonly",true);
	$("#result").val(eoj49Dic.result);
	$("#freq").val(eoj49Dic.freq);
	$("#eoj49DicTestDiv").hide()
	$(".registDiv").hide();
	$(".updateDiv").show();
}

/*기분석 수정*/
var fnUpdateEoj49Dic = function(){
	if( $("#eoj49DicForm").parsley().validate() ){
		var data = {
				"eoj49Seq" : $("#eoj49Seq").val()
				,"eojeol" : $("#eojeol").val()			
				,"result" : $("#result").val()
				,"freq" : $("#freq").val()
		}
		
		if( confirm("수정하시겠습니까?") ){
			var response = fnUpdateEoj49DicByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", "수정 완료");
				$(".morphEoj49DicModal").modal("hide");
				fnSearchEoj49DicList();
				
			}else{
				fnTaNotify("danger", "기분석 수정 에러");
			}
		}
	}
}

/*기분석 삭제*/
var fnDeleteEoj49Dic = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeleteEoj49DicByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "삭제하였습니다.");
					successFlug = true;
					
				} else {
					fnTaErrorMessage("기분석 삭제 에러!!", response.errorMessage);
				}
			}
			 /*테이블 삭제 */
			fnSearchEoj49DicList();
//			if (successFlug) fnTaDeleteTable("eoj49DicTable", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}

// 형태소 분석
var fnEoj49DicTest = function(){
	if( fnComnNotNullAndEmpty($("#eojeol").val()) ){
		
		$("#loading").show();
		setTimeout(function() {
			var data = {"body" : $("#eojeol").val() }
			var response = fnAnalyzeTestByAjax(data);
			if( response.result == "success" ){
				$("#morphResult").val(response.resultTM_Eoj49);
				$("#eoj49DicTestDiv").fadeIn();
				fnTaNotify("success", "분석을 완료하였습니다.");
			}else{
				fnTaNotify("danger", response.errorMessage);
			}
			$("#loading").fadeOut();
		}, 100);
		
	}else{
		$("#eojeol").focus();
		fnTaNotify("warning", "단어를 입력해주세요.");
	}
}
