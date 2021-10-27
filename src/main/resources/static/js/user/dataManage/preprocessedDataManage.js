userAuth = $("#userAuth").val();
$(function(){
	fnInit();
	
	/* 테이블 클릭시 */
	$(document).on("click", "#tbodyHtml td", function(){
		if( $(this).index() == 1 ){
			var data = $("#datatable-preprocessedDataList").dataTable().fnGetData($(this));
			var dataHtml = $.parseHTML(data[0]);
			var preprocessedDataSeq = $(dataHtml).attr("id")
			fnComnMovePage("/preprocessedDataDetail", ["preprocessedDataSeq"], [preprocessedDataSeq]);
		}
	});
	
	/*전처리기 목록 클릭시*/
	$("#datatable-preprocessorList").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-preprocessorList").DataTable().rows(indexes).data().toArray();
		fnCreatePreprocessorParameter(rowData[0][4]);
	});
	
	
	/*PREV버튼 클릭 */
	$(document).on("click", "#prevBtn", function(){
		$("#myTab").find("li").each(function(){
			if( $(this).hasClass("active") ){
				if( "originalData-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_default"]').click();
					return false;
				}else if( "preprocessor-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_originalData"]').click();
					return false;
				}
			}
		});
		
	});
	
	/*NEXT버튼 클릭 */
	$(document).on("click", "#nextBtn", function(){
		$("#myTab").find("li").each(function(){
			if( $(this).hasClass("active") ){
				if( "default-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_originalData"]').click();
					return false;
				}else if( "originalData-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_preprocessor"]').click();
					return false;
				}
			}
		});
	});
	
})

var fnInit = function(){
	// 전처리 데이터 목록
	$("#tbodyHtml").html(fnCreateListHtml(fnGetPreprocessedDataListByAjax()));
	// 원본데이터 목록
	$("#originalDataTbody").html(fnCreateOriginalDataListHtml(fnGetOriginalDataListByAjax()));
	// 전처리기 목록
	$("#preprocessorTbody").html(fnCreatePreprocessorListHtml(fnGetPreprocessorListByAjax()));

	// dataTable 생성
	fnCreateDataTable();
	
	$("#loading").fadeOut();
}

// dataTable 생성
var fnCreateDataTable = function(){
	var orderTarget = (userAuth == "admin") ? 6 : 5;
	// 전처리 데이터 
	fnTaCreateDataTable("datatable-preprocessedDataList", orderTarget, "desc");
	fnTaCreateModalDataTable("datatable-originalDataList", 1, "asc");
	fnTaCreateModalDataTable("datatable-preprocessorList", 1, "asc", 4);
}

var fnCreateListHtml = function(preprocessedDataList){
	var html = "";
	for( var i in preprocessedDataList ){
		var data = preprocessedDataList[i];
		html += "";
		html += "<tr>";
		html += "	<td><input type='checkbox' name='table_records' class='flat dataTableCheckbox' id='"+data.preprocessedDataSeq+"'/></td>";
		html += "	<td class='cusor' role='button'>"+data.name+" <i class='fa fa-sign-in'></i></td>";
		html += "	<td>"+data.preprocessorName+"</td>";
		html += "	<td>"+fnComnReplaceNull(data.description)+"</td>";
		html += "	<td>"+data.state+"</td>";
		if (userAuth == "admin") html += "	<td>" + data.userId + "</td>";
		html += "	<td>"+data.createDatetime+"</td>";
		html += "</tr>";
	}
	return html;
}

/*전처리 데이터 등록 모달*/
var fnPreprocessedDataModal = function(){
	$('a[href="#tab_default"]').click();
	$("#name").val("");
	$("#preprocessedDataSeq").val("");
	$("#description").val("");
	$("#datatable-originalDataList").DataTable().rows().deselect();
	$("#datatable-preprocessorList").DataTable().rows().deselect();
	$("#preprocessorParameterDiv").hide();
}

/*원본데이터 목록*/
var fnCreateOriginalDataListHtml = function(originalDataList){
	var html = "";
	for( var i in originalDataList ){
		var data = originalDataList[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.originalDataSeq+"</td>";
		html += "	<td>"+data.originalFileName+"</td>";
		html += "	<td>"+data.description+"</td>";
		html += "	<td>"+fnComnConvertSizeExp(data.fileSize)+"</td>";
		html += "</tr>";
	}
	return html;
}


/*전처리기 목록*/
var fnCreatePreprocessorListHtml = function(preprocessor){
	var html = "";
	for( var i in preprocessor ){
		var data = preprocessor[i];
		html += "";
		html += "<tr>";
		html += "	<td>"+data.preprocessorSeq+"</td>";
		html += "	<td>"+data.name+"</td>";
		html += "	<td>"+data.supportedExtension+"</td>";
		html += "	<td>"+data.applycation+"</td>";
		html += "	<td>"+JSON.stringify(data.parameters)+"</td>";
		html += "</tr>";
	}
	return html;
}

/*파라미터 설정*/
var fnCreatePreprocessorParameter = function(param){
	var parameters = jQuery.parseJSON(param);
	if( fnComnNotNullAndEmpty(parameters) ){
		var mParamHtml = "";
		for( var i in parameters ){
			var mp = parameters[i];
			mParamHtml += "<tr>";
			mParamHtml += "	<td>"+mp.name+"</td>";
			mParamHtml += "	<td>"+mp.type+"</td>";
			if( mp.type == "int" )
				mParamHtml += "	<td><input type='text' class='form-control' onkeydown='return fnComnOnlyNumber();' onkeyup='fnComnRemoveChar(event);' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
			else if( mp.type == "float" )
				mParamHtml += "	<td><input type='text' class='form-control' onkeydown='return fnComnOnlyNumberDot();' onkeyup='fnComnRemoveChar(event);' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
			else
				mParamHtml += "	<td><input type='text' class='form-control' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
			
			mParamHtml += "</tr>";
		}
		$("#parameters").html(mParamHtml);
		$("#preprocessorParameterDiv").fadeIn();		
	}else{
		$("#preprocessorParameterDiv").hide();
	}
}

/*전처리 데이터 생성*/
var fnCreatePreprocessedData = function(){
	if( $.trim($("#name").val()) == "" ){
		fnTaNotify("warning", "전처리 데이터명을 입력해주세요.");
		$('a[href="#tab_default"]').click();
		$("#name").focus();
		return false;
	
	}else if( $("#datatable-originalDataList").DataTable().rows({selected:true}).data()[0] == undefined ){
		fnTaNotify("warning", "원본데이터를 선택해주세요.");
		$('a[href="#tab_originalData"]').click();
		return false;

	}else if( $("#datatable-preprocessorList").DataTable().rows({selected:true}).data()[0] == undefined ){
		fnTaNotify("warning", "전처리기를 선택해주세요.");
		$('a[href="#tab_preprocessor"]').click();
		return false;
		
	}else{
		var modelParameters = {};
		$("#parameters tr").each(function(i){
			var tr = $(this);
			var pName = tr.children().eq(0).text();
			var pType = tr.children().eq(1).text();
			var pValue = tr.children().children().val();
			
			if( fnComnNotNullAndEmpty(pValue) ){
				if( pType == "list" ){
					var list = pValue.split(",");
					modelParameters[pName] = list;
				}else{
					modelParameters[pName] = pValue;	
				}
			}
		});
		var data = {
				"name" : $("#name").val()
				,"description" : $("#description").val()
				,"originalDataSeq" : Number($("#datatable-originalDataList").DataTable().rows({selected:true}).data()[0][0])
				,"preprocessorSeq" : Number($("#datatable-preprocessorList").DataTable().rows({selected:true}).data()[0][0])
				,"parameters" : JSON.stringify(modelParameters)
				,"userId" : $("#userId").val()
		}
		console.log(data);
		if( confirm("생성하시겠습니까?") ){
			var response = fnInsertPreprocessedDataByAjax(data);
			if( response.result == "success" ){
				var preprocessedData = response.preprocessedData;
				// 전처리 상세페이지로 이동
				fnComnMovePage("/preprocessedDataDetail", ["preprocessedDataSeq"], [preprocessedData.preprocessedDataSeq]);
			
			}else if( response.result == "error" && response.errorMessage == "duplication name" ){
				fnTaNotify("warning", "전처리데이터명이 중복되었습니다. 다른 이름으로 입력해주세요.");
				$('a[href="#tab_default"]').click();
				$("#name").focus();
			}else if( response.result == "Internal Server Error" ){
				fnTaErrorMessage(response.result, response.errorMessage);
			}else{
				fnTaErrorMessage(response.errorMessage.data.title+"\n"+response.errorMessage.data.detail, response.errorMessage);
			}
		}
	}
}

/*전처리데이터 삭제*/
var fnDeletePreprocessedData = function(){
	// 체크된 항목 가져오기
	var checkMap = fnTaTableCheckList("tbodyHtml");
	var checkIdList = checkMap.checkIdList;
	var checkRowList = checkMap.checkRowList;
	var successFlug = false;
	if (checkIdList.length > 0) {
		if (confirm("전처리 데이터를 삭제 하시겠습니까?")) {
			for (var i in checkIdList) {
				var response = fnDeletePreprocessedDataByAjax(checkIdList[i]);
				if (response.result == "success") {
					$("input").iCheck("uncheck");
					fnTaNotify("success", "전처리데이터를 삭제하였습니다.");
					successFlug = true;
					
				} else if( response.errorMessage == "preprocessedData in use") {
					fnTaNotify("warning", "프로젝트에서 사용중이라 삭제할수 없습니다");
					
				} else {
					fnTaErrorMessage("전처리데이터 삭제 에러!!", response);
				}
			}
			 /*테이블 삭제 */
			if (successFlug) fnTaDeleteTable("datatable-preprocessedDataList", checkRowList);
		}

	} else {
		fnTaNotify("warning", "삭제할 목록을 선택해주세요.");
	}
}
