var ajaxLoading = false;
$(function(){
	
	// a href="#" 적용 안되게 막기
	$(document).on('click', 'a[href="#"]', function(e){ e.preventDefault(); });
	
});

/*********************************************** Common function start ***********************************************/

/* 
 * 동기화 ajax로 데이터 전송(GET)
 * url(필수) : url
 * errorMessage : 에러시 메시지
 * fn_success : 성공시 호출 될 함수
 * fnComnAjaxGetDataSync
 */
var fnComnAjaxGetDataSync = function(url, errorMessage, fn_success ) {
	$.ajax({
		url: url,
		type: "GET",
		async: false,
		beforeSend: function(xhr, opts){
			if( ajaxLoading )	$("#loading").show();
		},
		complete: function(){
			if( ajaxLoading )	$("#loading").fadeOut();
		},
		success: function(response) {
			if (fn_success)	fn_success(response);
		},
		error: function(response){
			fnComnAjaxErrorMessage(response);
		}
	});
};

/* 
 * 동기화 ajax로 데이터 전송(POST,PATCH)
 * url(필수) : url
 * req_data : 파라메터. json 타입"
 * errorMessage : 에러시 메시지
 * fn_success : 성공시 호출 될 함수
 * fnComnAjaxDataSync
 */
var fnComnAjaxDataSync = function(url, type, req_data, errorMessage, fn_success ) {
	$.ajax({
		url: url,
		type: type,
		dataType: "json",
		contentType: 'application/json',
		data: req_data,
		async: false,
		beforeSend: function(xhr, opts){
			$("#loading").show();
		},
		complete: function(){
			$("#loading").fadeOut();
		},
		success: function(response) {
			if (fn_success)	fn_success(response);
		},
		error: function(response){
			fnComnAjaxErrorMessage(response);
		}
	});
};

/* 
 * 동기화 ajax로 데이터 전송(DELETE)
 * url(필수) : url
 * req_data : 파라메터. json 타입"
 * errorMessage : 에러시 메시지
 * fn_success : 성공시 호출 될 함수
 * fnComnAjaxDeleteDataSync
 */
var fnComnAjaxDeleteDataSync = function(url, errorMessage, fn_success ) {
	$.ajax({
		url: url,
		type: "DELETE",
		contentType: 'application/json',
		async: false,
		beforeSend: function(xhr, opts){
			$("#loading").show();
		},
		complete: function(){
			$("#loading").fadeOut();
		},
		success: function(response) {
			if (fn_success)	fn_success(response);
		},
		error: function(response){
			fnComnAjaxErrorMessage(response);
		}
	});
};

/* 
 * 동기화 ajax로 error 메시지
 * response : ajax 결과
 * fnComnAjaxErrorMessage
 */
var fnComnAjaxErrorMessage = function(response){
	if( fnComnNotNullAndEmpty(response.responseJSON.errorMessage) ){
		var errorMsg = response.responseJSON.errorMessage;
		if( errorMsg.indexOf("ConnectException")  )
			fnTaErrorMessage("Failed to connection...", response.responseText);
		else
			fnTaErrorMessage(errorMessage, response);
	}else{
		fnTaErrorMessage(errorMessage, response);				
	}
}

function fnComnSetDatepicker(){
	$('.startDate').datepicker({
	    language:  'ko'
		,weekStart: 1
	    ,format: "yyyy-mm-dd"
	});

	$('.endDate').datepicker({
	    language:  'ko'
	    ,weekStart: 1
	    ,format: "yyyy-mm-dd"
	});
	
//	$(".startDate").val("2018-08-01");
	$(".startDate").val(fnComnGetDate("lastMonth").searchStartDate);
	$(".endDate").val(fnComnGetFormatDate(new Date()));
}




/*********************************************** 페이징 처리 ***********************************************/
/*
divId : 페이징 태그가 그려질 div
pageIndx : 현재 페이지 위치가 저장될 input 태그 id
recordCount : 페이지당 레코드 수
totalCount : 전체 조회 건수
eventName : 페이징 하단의 숫자 등의 버튼이 클릭되었을 때 호출될 함수 이름
*/
var gfv_pageIndex = null;
var gfv_eventName = null;
function fnComnRenderPaging(params){
    var divId = params.divId; //페이징이 그려질 div id
    gfv_pageIndex = params.pageIndex; //현재 위치가 저장될 input 태그
    var totalCount = params.totalCount; //전체 조회 건수
    var currentIndex = $("#"+params.pageIndex).val(); //현재 위치
    if($("#"+params.pageIndex).length == 0 || currentIndex.trim() == "" ){
        currentIndex = 1;
    }
     
    var recordCount = params.recordCount; //페이지당 레코드 수
    if( recordCount == ""){
        recordCount = 20;
    }
    var totalIndexCount = Math.ceil(totalCount / recordCount); // 전체 인덱스 수
    gfv_eventName = params.eventName;
     
    $("#"+divId).empty();
    var preStr="", postStr="", str="", first, last, prev, next;
     
    first = (parseInt((currentIndex-1) / 10) * 10) + 1;
    if( totalIndexCount == 0 ) last = 0;
    else {
		last = first+9;
		if(last > totalIndexCount) last = totalIndexCount;
	}
    //else last = (parseInt(totalIndexCount/10) == parseInt(currentIndex/10)) ? (totalIndexCount%10 != 0 ? totalIndexCount%10 : 10) : 10;
    prev = (parseInt((currentIndex-1)/10)*10) - 9 > 0 ? (parseInt((currentIndex-1)/10)*10) - 9 : 1;
    next = (parseInt((currentIndex-1)/10)+1) * 10 + 1 < totalIndexCount ? (parseInt((currentIndex-1)/10)+1) * 10 + 1 : totalIndexCount;
    
    if(totalIndexCount > 10){ //전체 인덱스가 10이 넘을 경우, 맨앞, 앞 태그 작성
    	preStr += "<a href='javascript:void(0);' class='first'  onclick='fnComnPageMove(1)'>처음</a>";
    	preStr += "<a href='javascript:void(0);' class='prev' onclick='fnComnPageMove("+prev+")'>이전</a>";
    }
    else if(totalIndexCount <=10 && totalIndexCount > 1){ //전체 인덱스가 10보다 작을경우, 맨앞 태그 작성
    	/*preStr += "<a href='javascript:void(0);' class='first'  onclick='fnComnPageMove(1)'>처음</a>";*/
    }
     
    if(totalIndexCount > 10){ //전체 인덱스가 10이 넘을 경우, 맨뒤, 뒤 태그 작성
    	postStr += "<a href='javascript:void(0);' class='next' onclick='fnComnPageMove("+next+")'>다음</a>";
    	postStr += "<a href='javascript:void(0);' class='last' onclick='fnComnPageMove("+totalIndexCount+")'>마지막</a>";
    }
    else if(totalIndexCount <=10 && totalIndexCount > 1){ //전체 인덱스가 10보다 작을경우, 맨뒤 태그 작성
    	/*postStr += "<a href='javascript:void(0);' class='last' onclick='fnComnPageMove("+next+")'>마지막</a>";*/
    }
     
    //for(var i=first; i<(first+last); i++){
    for(var i=first; i<=last; i++){
        if(i != currentIndex){
            str += "<a href='javascript:void(0);' onclick='fnComnPageMove("+i+")'>"+i+"</a>";
            
        }else{
        	str += "<a href='javascript:void(0);' class='active' style='cursor:default;'>"+i+"</a>";
        }
    }
    $("#"+divId).append(preStr + str + postStr);
    $("#"+divId+"_TOP").html(preStr + str + postStr);
}
 
function fnComnPageMove(value){
    $("#"+gfv_pageIndex).val(value);
    if(typeof(gfv_eventName) == "function"){
        gfv_eventName(value);
    }else {
        eval(gfv_eventName + "(value);");
    }
}

/**
 * 페이징 처리
 * @param method 검색함수
 * @param totalCount 총 카운트
 * @returns
 */
function fnComnPagingPrc(method, totalCount){
	var params = {
            divId : "PAGE_NAVI",
            pageIndex : "pageIndex",
            totalCount : totalCount,
            recordCount : 10,
            eventName : method
        };
	fnComnRenderPaging(params);
}
/*********************************************** 페이징 처리 End ***********************************************/


/**
 * POST 방식 페이지 이동
 * @param url
 * @param keyList
 * @param valueList
 * @returns
 */
function fnComnMovePage(url, keyList, valueList){
	var form = $('<form></form>');
    form.prop('action', url);
    form.prop('method', 'POST');
    form.appendTo('body');
    
    for( var i in keyList ){
    	if( fnComnNotNullAndEmpty(keyList[i]) ){
    		form.append('<input type="hidden" name="'+keyList[i]+'" value="' + valueList[i] + '">');
    	}
    }
	form.submit();
}

/**
 * Popup 페이지 이동
 * @param url
 * @param option
 * @param keyList
 * @param valueList
 * @returns
 */
function fnComnMovePopupPage(url, option, keyList, valueList){
	if( !fnComnNotNullAndEmpty(option) )
		option = "width=1024,height=768";
	var form = $('<form></form>');
    form.prop('action', url);
    form.prop('method', 'POST');
    form.prop('target', 'movePoupuPage');
    form.appendTo('body');
    
    for( var i in keyList ){
    	if( fnComnNotNullAndEmpty(keyList[i]) )
    		form.append('<input type="hidden" name="'+keyList[i]+'" value="' + valueList[i] + '">');
    }
    
	window.open(url, "movePoupuPage", option);
	form.submit();
}

/**
 * Get방식 페이지 이동
 * @param url
 * @param seq
 * @param option
 */
function fnComnGetMovePage(url, param1, param2){
	
	if( fnComnNotNullAndEmpty(param1) )	url += "?param1="+encodeURIComponent(param1);
	if( fnComnNotNullAndEmpty(param2) )	url += "&param2="+encodeURIComponent(param2);
	
	location.href = url;
}

/**
 * Null 또는 공백 또는 undefined일 아닐 경우 true 반환
 * @param val
 * @returns {Boolean}
 */
function fnComnNotNullAndEmpty(val) {
	if (typeof val == 'undefined')	return false;
	else if (val == null)	return false;
	else if (val == "null")	return false;
	else if ($.trim(val) == "")	return false;
	else if (val.length < 1)	return false;
	else return true;
}

/**
 * Null, 공백, undefined일 경우 separator로 반환
 * @param val
 * @param separator
 * @returns
 */
function fnComnReplaceNull(val, separator){
	var sp = separator != null ? separator : "";
	if (typeof val == 'undefined')	return sp;
	else if (val == null)	return sp;
	else if (val == "null")	return sp;
	else if (val.length < 1)	return sp;
	else return val;
}

/**
 * 파일 다운로드
 * @param url
 * @param fileName
 * @param filePath
 * @param checkDelete
 */
function fnComnFileDownload(url, fileName, filePath, checkDelete){
	var form = $('<form></form>');
    form.prop('action', url);
    form.prop('method', 'POST');
    form.appendTo('body');
	form.append('<input type="hidden" name="fileName" value="' + fileName + '">');
	form.append('<input type="hidden" name="filePath" value="' + filePath + '">');
	form.append('<input type="hidden" name="checkDelete" value="' + checkDelete + '">');
	form.submit();
}


/**
 *  yyyy-MM-dd 포맷으로 반환(separator)
 */
function fnComnGetFormatDate(date, sep){
	var separator = "-";
	
	if( sep != undefined )	separator = sep;
	
	var year = date.getFullYear();             //yyyy
	var month = (1 + date.getMonth());         //M
	month = month >= 10 ? month : '0' + month; // month 두자리로 저장
	var day = date.getDate();                  //d
	day = day >= 10 ? day : '0' + day;         //day 두자리로 저장
	return  year + separator + month + separator + day;
}

/**
 * 날짜 변경
 * @param option
 * @param sep
 * $.datepicker.formatDate 안될때...
 */
function fnComnGetDate(option, sep){
	var nowDate = new Date();
	
	nowDate.setDate(nowDate.getDate() - 1);
	
	var startDate = "";
	var endDate = fnComnGetFormatDate(nowDate, sep);
	
	if( option === "lastWeek" ){
		nowDate.setDate(nowDate.getDate() - 7);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastTwoWeek" ){
		nowDate.setDate(nowDate.getDate() - 14);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastThreeWeek" ){
		nowDate.setDate(nowDate.getDate() - 21);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastMonth" ){
		nowDate.setMonth(nowDate.getMonth() -1 );
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastThreeMonth" ){
		nowDate.setMonth(nowDate.getMonth() -3 );
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastYear" ){
		nowDate.setFullYear(nowDate.getFullYear() - 1);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastTwoYear" ){
		nowDate.setFullYear(nowDate.getFullYear() - 2);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "lastThreeYear" ){
		nowDate.setFullYear(nowDate.getFullYear() - 3);
		startDate = fnComnGetFormatDate(nowDate, sep);
		
	}else if( option === "today" ){
		return fnComnGetFormatDate(nowDate, sep);
	}
	
	var date = {
		"searchStartDate"	: 	startDate,
		"searchEndDate"		:	endDate
	}
	return date;
}



/**
 * 현재 날짜와 비교 후 true/false 반환
 * @param date
 * @returns {Boolean}
 */
function fnComnCompareNowDate(date){
	var result = false;
	if( date != null ){
		var nowDate = new Date();
		var expireDate = new Date(date);
		if( expireDate > nowDate ) result = true;
	}
	return result;
}


/**
 * 에러 메시지창
 */
function fnComnErrorMessage(error){
	alert("서비스가 원활하지 않습니다. 잠시뒤에 이용해주시길 바랍니다.");
	console.log(error);
}

/*숫자만 입력가능*/
function fnComnOnlyNumber(event){
    event = event || window.event;
 
    var keyID = (event.which) ? event.which : event.keyCode;
    
    if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39 ) {
        return;
    } else {
        return false;
    }
}

/*숫자, 콤마 입력*/
function fnComnOnlyNumberDot(event){
    event = event || window.event;
 
    var keyID = (event.which) ? event.which : event.keyCode;
    // Comma keyID == 188 , Dot keyID == 190, 110
    if ( keyID == 110 || keyID == 190 || (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39) {
        return;
    } else {
        return false;
    }
}

/*숫자 . , / *  입력*/
function fnComnOnlyNumberCommaDot(event){
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    // Comma keyID == 188 , Dot keyID == 190
    if ( keyID == 188 || keyID == 190 || keyID == 191 || keyID == 56 || (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39) {
        return;
    } else {
        return false;
    }
}

/* 숫자, 콤마 제외한 나머지 제거 */
function fnComnRemoveChar(event) {
    event = event || window.event;
     
    var keyID = (event.which) ? event.which : event.keyCode;
     
    if ( keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39 ) {
        return;
    } else {
        event.target.value = event.target.value.replace(/[^0-9|^.]/g, "");
    }
}

/**
 * 긴 단어/문장 변경
 * @param text
 * @param separator
 * @param limit
 * @returns
 */
function fnComnLongWordTranslation(text, separator, limit){
	if( !fnComnNotNullAndEmpty(separator) ) separator = "...";
	if( !fnComnNotNullAndEmpty(limit) ) limit = 20;
	
	if( fnComnNotNullAndEmpty(text) && (text.length > limit) ){
		text = text.substring(0,limit) + separator;
	}
	return text
}

/**
 * 3자리 콤마 찍기
 * @param text
 * @returns
 */
var fnComnNumberWithCommas = function(x){
	if( fnComnNotNullAndEmpty(x) ){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");	
	}else{
		return "";
	}	 
}

/**
 * Null을 -1로 변경
 * @param val
 * @returns
 */
function fnComnChangeNullToNum(val){
	if (typeof val == 'undefined')
		return -1;
	else if (val == null)
		return -1;
	else if (val.length < 1)
		return -1;
	
	return val;
}

/**
 * Object sort
 * @param obj
 * @param option
 * @returns
 */
function fnComnSortObj(obj, option){
	if( fnComnNotNullAndEmpty(obj) ){
		// keyword sort asc
		obj.sort(function(a, b){
			if( a.keyword > b.keyword )	return 1;
			if( a.keyword < b.keyword )	return -1;
			return 0;
		});
		
		// keyword_id sort desc
		obj.sort(function(a, b){
			if( fnComnChangeNullToNum(a.keyword_id) < fnComnChangeNullToNum(b.keyword_id) )	return 1;
			if( fnComnChangeNullToNum(a.keyword_id) > fnComnChangeNullToNum(b.keyword_id) )	return -1;
			return 0;
		});
		
		// weight sort desc
		obj.sort(function(a, b){
			if( fnComnChangeNullToNum(a.weight) < fnComnChangeNullToNum(b.weight) )	return 1;
			if( fnComnChangeNullToNum(a.weight) > fnComnChangeNullToNum(b.weight) )	return -1;
			return 0;
		});
		
		if( option == "string" ){
			return fnComnArrValueToString(obj, "keyword", " ,", 5);
		}else{
			return obj;
		}
	}
}


/**
 * 관련기관 및 인문 sort
 * @param personOrgan
 * @param option
 * @returns
 */
function fnComnSortPersonOrgan(personOrgan, option){
	if( fnComnNotNullAndEmpty(personOrgan) ){
		// name sort asc
		personOrgan.sort(function(a, b){
			if( a.name > b.name )	return 1;
			if( a.name < b.name )	return -1;
			return 0;
		});
		
		// type sort desc
		personOrgan.sort(function(a, b){
			if( a.type < b.type )	return 1;
			if( a.type > b.type )	return -1;
			return 0;
		});
		
		if( option == "string" ){
			return fnComnArrValueToString(personOrgan, "name", " ,", 5);
		}else{
			return personOrgan;
		}
	}else{
		return "-";
	}
}

/**
 * 숫자 배열 sort
 * @param personOrgan
 * @param option
 * @returns
 */
function fnComnNumberSort(arr, option){
	if( fnComnNotNullAndEmpty(arr) ){
		if( option == "desc" ){
			arr.sort(function(a,b){
				return b-a;
			});
		}else{
			arr.sort(function(a,b){
				return a-b;
			});			
		}
	}
}

/**
 * 배열의 value를 한줄로 생성
 * @param dataArr
 * @param value
 * @param separator
 * @param count
 * @returns {String}
 */
function fnComnArrValueToString(dataArr, value, separator, count){
	var result = "-";
	if( fnComnNotNullAndEmpty(dataArr) ){
		for(var index in dataArr ){
			if( fnComnNotNullAndEmpty(value) && value === "keyword" && fnComnNotNullAndEmpty(dataArr[index].keyword)){
				if( index == 0 ) result = dataArr[index].keyword;
				else result += separator+"&nbsp;"+dataArr[index].keyword;
				
			}else if( fnComnNotNullAndEmpty(value) && value === "name" && fnComnNotNullAndEmpty(dataArr[index].name)){
				if( index == 0 ) result = dataArr[index].name;
				else result += separator+"&nbsp;"+dataArr[index].name;
				
			}else if( fnComnNotNullAndEmpty(dataArr[index]) && value == null ){
				if( index == 0 ) result = dataArr[index];
				else result += separator+"&nbsp;"+dataArr[index];	
			}
			
			if( fnComnNotNullAndEmpty(count) && index == count ) break;
		}
	}
	
	return result;
}

//한글체크
var fnComnCheckKorean = function(value){
	var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	if( check.test(value) ){
		return true;
	}else{
		return false;
	}
}


/**
 * 파일 사이즈 표기 변환
 * @param dataArr
 * @param value
 * @param separator
 * @param count
 * @returns {String}
 */
var fnComnConvertSizeExp = function(size, unit){
	var result;
	if( fnComnNotNullAndEmpty(size) ){
		if( jQuery.isNumeric(size) && size > 1000 ){
			result = Math.round(size / 1024);
			if( unit == "MB" && result > 1000 ){
				result = Math.round(result / 1024);
				result = result+" MB";
			}else{
				result = fnComnNumberWithCommas(result)+" KB";
			}
		}else{
			return size;
		}
	}else{
		return "";
	}
	return result;
}



/* ajax file */
var ajaxToFile = function(o){
	o.url 		= o.url			|| "";
	o.done 		= o.done		|| {};
	o.fail 		= o.fail		|| {};
	o.always 	= o.always		|| {};
	
	if (com.util.str.isNull(o.url)) {
		console.error("URL이 존재하지 않습니다.");
        return;
    }
	
	var jqxhr = $.ajax({
		url: com.help.url(o.url),
		enctype: 'multipart/form-data',
		cache: false,
		type: "POST",
		data: o.params,
		processData: false,
        contentType: false,
        timeout: 600000,
        xhrFields: { responseType: 'blob' }
	
	}).done(function(response, status, xhr) {
		if (typeof o.done === 'function') {
    		o.done(response, status, xhr, o);
    	}
	}).fail(function(xhr) {
		com.help.failHandleMessage(xhr);
		if (typeof o.fail === 'function') {
    		o.fail(xhr);
    	}
	}).always(function() {
		if (typeof o.always === 'function') {
    		o.always(xhr);
    	}
	});
	
	return jqxhr;
}

/*ajax로 받은 파일 다운로드*/
var fileDownToRsp = function(response, status, xhr, o){
	// check for a filename
    var filename = "";
    var disposition = xhr.getResponseHeader('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
    }

    var type = xhr.getResponseHeader('Content-Type');
    var blob = new Blob([response], { type: type });

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
                window.location = downloadUrl;
            } else {
                a.href = downloadUrl;
                if( o.fileName != null && o.fileName != "" )
                	a.download = o.fileName;
                else
                	a.download = filename;
                
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.location = downloadUrl;
        }

        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    }
    
	$("#loadingBar").fadeOut();
}



/*********************************************** Common function end ***********************************************/
