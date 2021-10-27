/**
 * 공통 기능을 지원하는 스크립트이다.
 * =============================================================================
 * Name                Description
 * -----------------------------------------------------------------------------
 * ajax				   AJAX 통신을 수행한다.
 * url                 URL을 반환한다.
 * timestamp           타임 스탬프를 반환한다.
 * datepicker          날짜 선택기 옵션을 반환한다.
 * XSSfilter		   문자열을 XSS 필터링한다.
 * toHtmlBr			   문자를 HTML에서 확인할 수 있도록 BR태그로 변경한다.
 * openPop			   팝업을 오픈한다.
 * loadPage            페이징 navigation 로드한다.
 * initCombo		   콤보박스를 초기화한다.
 * loadCombo		   콤보박스를 로드한다.
 * initRadio		   라디오버튼을 초기화한다.
 * loadRadio		   라디오버튼을 로드화한다.
 * initCheck		   체크박스를 초기화한다.
 * loadCheck		   체크박스를 로드한다.
 * =============================================================================
 */

/**
 * AJAX 통신을 수행한다.
 *
 * Usage: com.help.ajax(object)
 * 
 * @param object {String} AJX 옵션
 * @returns {object} 통신결과객체
 * 예)
 * 	com.help.ajax({
	    url: "/prpl/rew/selectBillPrntSummary.do",
	    params : {billId : billId},
	    done : function(res) {
	        if ( res != null ) {
	            $("#bill-summary-sect").show();
	
	            var summary = _.replace(res.data.summary, /(\n|\r\n)/g, "<br>");
	            $("#bill-summary-sect-cont").empty()
	                .scrollTop(0)
	                .append(summary);
	        }
	    }
	});
 * 
 * 
 */
com.help.ajax = function(o) {
	o.url 		= o.url			|| "";
	o.type 		= o.type 		|| "POST";
	o.dataType	= o.dataType 	|| "json";
	o.async		= o.async		|| false;
	o.done 		= o.done		|| {};
	o.fail 		= o.fail		|| {};
	o.always 	= o.always		|| {};
	
	if (com.util.str.isNull(o.url)) {
		console.error("URL이 존재하지 않습니다.");
        return;
    }
	
	var jqxhr = $.ajax({
		url: com.help.url(o.url),
		async: o.async,
		type: o.type,
		data: o.params,
		dataType: o.dataType,
		beforeSend: function(xhr, opts) {
			xhr.setRequestHeader("requestAJAX", "true");
			if ( o.before == undefined ) {
				// nothing to do
			}
			else if ( !o.before ) {
				xhr.abort();
			}
	    }
	}).done(function(data) {
		if (typeof o.done === 'function') {
    		o.done(data);
    	}
	}).fail(function(xhr) {
		if ( xhr.status != null && xhr.status == 901 ) {
			alert("사용자 정보가 존재하지 않습니다!\n로그인 페이지로 이동합니다.");
			location.href = com.help.url("/login/loginPage.do");
			return false;
		}
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

/**
 * AJAX 통신을 수행한다.
 *
 * Usage: com.help.ajaxFile(object)
 * 
 * @param object {String} AJX 옵션
 * @returns {object} 통신결과객체
 * 예)
 * 			if ( self.valid(formData) ) {
				com.help.ajaxFile({
					url: "/portal/bod/insertBod.do",
					params: formData,
					done: app.Resp.saveCallBack
				});
			} 
 * 
 * 
 */
com.help.ajaxFile = function(o) {
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
	}).done(function(data) {
		if (typeof o.done === 'function') {
    		o.done(data);
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

/**
 * 데이터를 처리하는 화면으로 이동한다.
 * 
 * @param options {Object} 옵션
 */
com.help.goSubmit = function(options) {
	options.form   	= options.form   	|| "";
    options.url    	= options.url    	|| "";
    options.method 	= options.method 	|| "post";
    options.target 	= options.target 	|| "_self";
    options.schForm = options.schForm 	|| "";
    
    if (com.util.str.isNull(options.form)) {
    	return;
    }
    if (com.util.str.isNull(options.url)) {
        return;
    }
    
    var form = $("#" + options.form);
    
    if (options.data) {
        for (var i = 0; i < options.data.length; i++) {
            form.find("[name=" + options.data[i].name + "]").val(options.data[i].value);
        }
    }
    
    if ( options.appendData ) {
    	for (var i = 0; i < options.appendData.length; i++) {
            form.append("<input type=\"hidden\" title=\""+ options.appendData[i].name +"\" name=\""+ options.appendData[i].name +"\" value=\""+ options.appendData[i].value +"\">")
        }
    }
    
    form.attr("action", com.help.url(options.url));
    form.attr("method", options.method);
    form.attr("target", options.target);
    
    form.submit();
}

/**
 * 문자열이 json인지 체크한다.
 * 
 * @param str {String} 문자열
 */
com.help.isJsonString = function(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

/**
 * 결과 메세지를 처리한다.
 * 
 * @param resResult {Object} 결과객체
 * @param options {Object} 옵션
 */
com.help.handleMessage = function(result, options) {
	result = com.help.isJsonString(result) ? JSON.parse(result) : result;
	if (result.success) {
		alert(result.success);
		if (typeof options.CallBack === 'function') {
			options.CallBack();
		}
	} else if (result.errors) {
		console.error("[ERROR] 저장도중 에러가 발생하였습니다.");
		alert(result.errors);
	}
}

/**
 * 실패결과 메세지를 처리한다.
 * 
 * @param resResult {Object} 결과객체
 * @param options {Object} 옵션
 */
com.help.failHandleMessage = function(result, options) {
	var json = result.responseJSON;
	if ( json !== undefined ) {
		if ( json.message ) {
			alert(json.message);
		}
	}
}

/**
 * URL을 반환한다.
 * 
 * Usage: com.help.url(string);
 * 
 * @param s {String} 문자열
 * @returns {String} URL
 */
com.help.url = function(s) {
    var string = s ? s : "";
    
    return (glb_ctxPathJS || "") + string;
};

/**
 * 타임 스탬프를 반환한다.
 * 
 * Usage: com.help.timestamp()
 *        com.help.timestamp(date)
 * 
 * @param d {Date} 날짜
 * @returns {Number} 타임 스탬프
 */
com.help.timestamp = function(d) {
    var date = d ? d : new Date();
    
    return date.getTime();
};

/**
 * 날짜 선택 옵션을 반환한다.
 * 
 * Usage: com.help.datepicker()
 *        com.help.datepicker(options)
 * 
 * @param o {Object} 옵션
 * @returns {Object} 옵션
 */
com.help.datepicker = function(o) {
    var options = o ? o : {};
    
    options.changeYear         = options.changeYear         != null ? options.changeYear         : true;
    options.yearRange          = options.yearRange          != null ? options.yearRange          : "1900:2100";
    options.yearSuffix         = options.yearSuffix         != null ? options.yearSuffix         : "";
    options.changeMonth        = options.changeMonth        != null ? options.changeMonth        : true;
    options.prevText           = options.prevText           != null ? options.prevText           : "이전달";
    options.nextText           = options.nextText           != null ? options.nextText           : "다음달";
    options.showMonthAfterYear = options.showMonthAfterYear != null ? options.showMonthAfterYear : true;
    options.monthNames         = options.monthNames         != null ? options.monthNames         : [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ];
    options.monthNamesShort    = options.monthNamesShort    != null ? options.monthNamesShort    : [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ];
    options.weekHeader         = options.weekHeader         != null ? options.weekHeader         : "요일";
    options.dayNames           = options.dayNames           != null ? options.dayNames           : [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    options.dayNamesShort      = options.dayNamesShort      != null ? options.dayNamesShort      : [ "일", "월", "화", "수", "목", "금", "토"];
    options.dayNamesMin        = options.dayNamesMin        != null ? options.dayNamesMin        : [ "일", "월", "화", "수", "목", "금", "토"];
    options.firstDay           = options.firstDay           != null ? options.firstDay           : 0;
    options.showButtonPanel    = options.showButtonPanel    != null ? options.showButtonPanel    : true;
    options.currentText        = options.currentText        != null ? options.currentText        : "오늘";
    options.closeText          = options.closeText          != null ? options.closeText          : "닫기";
    options.isRTL              = options.isRTL              != null ? options.isRTL              : false;
    options.dateFormat         = options.dateFormat         != null ? options.dateFormat         : "yy-mm-dd";
    options.autoSize           = options.autoSize           != null ? options.autoSize           : false;
    options.buttonText         = options.buttonText         != null ? options.buttonText         : "달력";
    options.buttonImage        = options.buttonImage        != null ? options.buttonImage        : com.help.url("/assets/sheet/Main/calendar.gif");
    options.buttonImageOnly    = options.buttonImageOnly    != null ? options.buttonImageOnly    : true;
    options.showOn             = options.showOn             != null ? options.showOn             : "both";
    
    return options;
};

/**
 * 날짜 선택 기간 최소/최대값을 설정한다.
 *  - From은 To가 선택한 날짜 이후로 선택할 수 없음
 *  - To는 From이 선택한 날짜 이전으로는 선택할 수 없음
 * 
 * Usage: com.help.datepicker.setBetween(fromId, toid)
 * 
 * @param fromId {String} 기간시작 엘리먼트 id
 * @param toId {String} 기간종료 엘리먼트 id
 */
com.help.datepicker.setBetween = function(fromId, toId) {
	var from = $("#"+fromId),
		to = $("#"+toId);
	
	if ( from.length == 0 && to.length == 0 ) {
		return;
	}
	
	if ( from.hasClass("hasDatepicker") && to.hasClass("hasDatepicker") ) {
		from.datepicker('option', 'onClose', function(date) {
			to.datepicker( "option", "minDate", date );
		});
		to.datepicker('option', 'onClose', function(date) {
			from.datepicker( "option", "maxDate", date );
		});
	}
}

/**
 * 문자열을 XSS 필터링한다
 *
 * Usage: com.help.XSSfilter(string)
 * 
 * @param content {String} 문자열
 * @returns {String} 변환된 문자열
 */
com.help.XSSfilter = function( content ) {
    return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

/**
 * 문자를 HTML에서 확인할 수 있도록 BR태그로 변경한다
 *
 * Usage: com.help.toHtmlBr(string)
 * 
 * @param str {String} 문자열
 * @returns {String} 변환된 문자열
 */
com.help.toHtmlBr = function(str) {
	if ( !com.util.str.isNull(str) ) {
		return str.replace(/(?:\r\n|\r|\n)/g, '<br>')
	}
	return "";
}

/**
 * 팝업을 오픈한다.
 *
 * Usage: com.help.toHtmlBr(string)
 * 
 * @param url {String} 팝업 URL
 * @param name {String} 팝업이름
 * @param popWidth {Number} 팝업가로길이
 * @param popHeight {Number} 팝업세로길이
 * @param xPos {Number} x좌표위치
 * @param yPos {Number} y좌표위치
 */
com.help.openPop = function(url, name, popWidth, popHeight, xPos, yPos) {
	
	if ( com.util.str.isEmpty(url) ) {
		console.error("URL이 존재하지 않습니다.");
		return false;
	}
	if(com.util.str.isEmpty(name)) {
		name = '_blank';
	}
	var popupStr = "toolbar=0,menubar=0,location=0,status=0,resizable=0";
	
	// popup 너비, 높이값이 있을때만
    if ( popWidth && popHeight ){
        var winHeight = document.body.clientHeight;    // 현재창의 높이
        var winWidth = document.body.clientWidth;    // 현재창의 너비
        var winX = window.screenLeft;    // 현재창의 x좌표
        var winY = window.screenTop;    // 현재창의 y좌표
        var popX = winX + (winWidth - popWidth)/2;
        var popY = winY + (winHeight - popHeight)/2;
 
        popupStr += ",width="+popWidth;
        popupStr += ",height="+popHeight;
 
        // x좌표가 없을때만
        if (!xPos) {
            popupStr += ",top="+popY;
        }
        // 있을 때
        else {
            popupStr += ",top="+yPos;
        }
 
        // y좌표가 없을때만
        if(!yPos){
            popupStr += ",left="+popX;
        }
        // 있을 때
        else {
            popupStr += ",left="+xPos;
        }
    }

	// 도움말 처리 시 referer 이용
	// ie referer issue 로 분기 처리함.
	// added by giinie 2021-07-09
	if (name === 'helpPop') {
		var refer = document.createElement('a');
		refer.href = url;
		refer.target = name;
		refer.style.display = 'none';
		document.body.appendChild(refer);
		window.open('about:blank', name, popupStr);
		refer.click();
	} else {
		var popupWindow = window.open(url, name, popupStr);
	}
}

/**
 * 페이징 navigation 로드
 *
 * Usage: com.help.loadPage
 * 
 * @param pages {Numeric} 전체페이지
 * @param page {Numeric} 선택페이지
 * @param options {Object} 옵션값
 */
com.help.loadPage = function(pages, page, options) {
	options.pager = options.pager || "search-pager";
    
    var pagerSize = 5;	// 페이져 사이즈 기본 5
    
    var pager = $("#" + options.pager);
    
    pager.empty();
    
    if(page==1){
    	pager.append(
    	        "<div class=\"paging-navigation\">"                                                       +
//    	            "<a href=\"#\" class=\"btn_first\" title=\"처음페이지 이동\">처음페이지 이동</a>"   +
//    	            "<a href=\"#\" class=\"btn_prev\" title=\"이전 5페이지 이동\">이전 5페이지 이동</a>"  +
    	            "<a href=\"#\" class=\"btn-next\" title=\"다음 "+ pagerSize +"페이지 이동\">다음 "+ pagerSize +"페이지 이동</a> " +
    	            "<a href=\"#\" class=\"btn-last\" title=\"마지막페이지 이동\">마지막페이지 이동</a> "  +
    	        "</div>"                                                                          
    	    );
    }
    else{
    	pager.append(
    	        "<div class=\"paging-navigation\">"                                                       +
    	            "<a href=\"#\" class=\"btn-first\" title=\"처음페이지 이동\">처음페이지 이동</a> "   +
    	            "<a href=\"#\" class=\"btn-prev\" title=\"이전 "+ pagerSize +"페이지 이동\">이전 "+ pagerSize +"페이지 이동</a> "  +
    	            "<a href=\"#\" class=\"btn-next\" title=\"다음 "+ pagerSize +"페이지 이동\">다음 "+ pagerSize +"페이지 이동</a> " +
    	            "<a href=\"#\" class=\"btn-last\" title=\"마지막페이지 이동\">마지막페이지 이동</a> "  +
    	        "</div>"                                                                          
    	      
    	    );
    }
    
    /*
    if (pages > 0 && page > 1) {
        pager.find(".btn_page_first").addClass("first");
    }
    else {
        pager.find(".btn_page_first").css("cursor", "default");
    }
    
    if (pages > 0 && page > pagerSize) {
        pager.find(".btn_page_pre").addClass("previous");
    }
    else {
        pager.find(".btn_page_pre").css("cursor", "default");
    }*/
    
    var first = Math.floor((page - 1) / pagerSize) * pagerSize + 1;
    var last  = first;
    
    for (var i = 0, n = first; i < pagerSize; i++, n++) {
        if (n == page) {
            pager.find(".btn-next").before("<strong class=\"page-number\" style=\"cursor:default;\">" + n + "</strong>");
        }
        else {
            pager.find(".btn-next").before("<a href=\"#\" class=\"number page-number\">" + n + "</a>");
        }
        
        pager.find(".btn-next").before(" ");
        
        if (n >= pages) {
            last = n;
            break;
        }
    }
    
    // 페이징 이벤트
//    $(".paging-navigation").on("click", "a", function(event) {
    pager.find(".paging-navigation").on("click", "a", function(event) {
    	event.preventDefault();
    	var movePage = 0;
    	
    	if ( $(this).hasClass("page-number") ) {
    		movePage = Number($(this).text());
    	}
    	else if ( $(this).hasClass("btn-first") ) {
    		movePage = 1;
    	}
    	else if ( $(this).hasClass("btn-prev") ) {
    		movePage = Number(pager.find(".page-number:first").text()) - pagerSize;
    	}
    	else if ( $(this).hasClass("btn-next") ) {
    		movePage = Number(pager.find(".page-number:last").text());
    		movePage = movePage == 1 ? 1 : movePage + 1;	// 1페이지만 있을경우 이동안함
    	}
    	else if ( $(this).hasClass("btn-last") ) {
    		movePage = pages;
    	}
    	
    	// 0보다 큰경우만 이벤트수행
    	if ( movePage > 0 ) {
    		options.search(movePage);
    	}
    });
    
    /*
    if (pages > 0 && last < pages) {
        pager.find(".btn_page_next").addClass("next");
    }
    else {
        pager.find(".btn_page_next").css("cursor", "default");
    }
    
    if (pages > 0 && page < pages) {
        pager.find(".btn_page_last").addClass("last");
    }
    else {
        pager.find(".btn_page_last").css("cursor", "default");
    }
    
    pager.find(".presentPage strong").text(page);
    pager.find(".presentPage span").text(pages ? pages : 1);
    
    if (pages > 0 && page > 1) {
        pager.find(".btn_page_preStep").addClass("previousStep");
    }
    else {
        pager.find(".btn_page_preStep").css("cursor", "default");
    }
    
    if (pages > 0 && page < pages) {
        pager.find(".btn_page_nextStep").addClass("nextStep");
    }
    else {
        pager.find(".btn_page_nextStep").css("cursor", "default");
    }*/
    
    // 카운터 표시
    if ( typeof options.counter === "object" ) {
        options.counter.total = options.counter.total || "search-total";
        options.counter.pages = options.counter.pages || "search-pages";
        
        $("#" + options.counter.total).text( com.util.str.toCommaWon(options.counter.count) );
        $("#" + options.counter.pages).html("&#40;" + com.util.str.toCommaWon(page) + "&#47;" + ( pages ? com.util.str.toCommaWon(pages) : 1 ) + " page&#41;");
    }
}

/**
 * 콤보박스를 초기화한다.
 *
 * Usage: com.help.initCombo
 * 
 * @param id {String} id
 * @param data {String} 로드될 데이터
 * @param value {String} 선택될 데이터
 */
com.help.initCombo = function(id, data, value) {
	var combobox = $("#" + id);
    
    combobox.find("option").each(function(index, element) {
        $(this).remove();
    });
    
    for (var i = 0; i < data.length; i++) {
        var option = $("<option></option>");
        
        option.val(data[i].code);
        
        option.text(data[i].name);
        
        combobox.append(option);
    }
    
    if (value) {
        combobox.val(value);
    }
}

/**
 * 콤보박스를 로드한다.
 *
 * Usage: com.help.loadCombo
 * 
 * @param id {String} id
 * @param url {String} 데이터 조회 url
 * @param data {String} 파라미터
 * @param value {String} 선택될 데이터
 */
com.help.loadCombo = function(id, url, data, value) {
    // 옵션을 검색한다.
	com.help.ajax({
		url : com.help.url(url),
		params : data,
		done : function(data, status, request) {
            if (data.data) {
                // 콤보 옵션을 초기화한다.
            	com.help.initCombo(id, data.data, value);
            }
        }
	});
}

/**
 * 라디오버튼을 초기화한다.
 *
 * Usage: com.help.initRadio
 * 
 * @param id {String} id
 * @param url {String} 데이터 조회 url
 * @param data {String} 파라미터
 * @param value {String} 선택될 데이터
 * @param options {Object} 옵션값
 */
com.help.initRadio = function(id, name, data, value, options) {
	var isIdDiff = options.isIdDiff || false;
	var eleId = "";
    var section = $("#" + id);
    
    section.empty();
    
    for (var i = 0; i < data.length; i++) {
        var radio = $("<span class=\"radio\"><input type=\"radio\" autocomplete=\"on\" /> <label></label></span>");
        if (isIdDiff) {
        	eleId = id + "-" + data[i].code;
        } else {
        	eleId = id + "-" + i;
        }
        
        radio.find("input").attr("id",  eleId).attr("name", name).val(data[i].code).prop("checked", data[i].code == value);
        radio.find("label").attr("for", eleId).text(data[i].name);
        if ( i < data.length-1 ) {
        	radio.append("&nbsp;&nbsp;");
        }
       
        section.append(radio);
    }
}

/**
 * 라디오버튼을 로드한다.
 *
 * Usage: com.help.loadRadio
 * 
 * @param id {String} id
 * @param id {String} name
 * @param url {String} 데이터 조회 url
 * @param data {String} 파라미터
 * @param value {String} 선택될 데이터
 * @param options {Object} 옵션값
 */
com.help.loadRadio = function(id, name, url, data, value, options) {
	var isAll = options.isAll || false;
	
    // 옵션을 검색한다.
    $.post(
        com.wise.help.url(url),
        data,
        function(data, status, request) {
            if (data.data) {
            	if ( isAll ) {
            		data.data = [{
            			code:"",
                        name:"전체"
            		}].concat(data.data)
            	}
                // 라디오 옵션을 초기화한다.
            	com.help.initRadio(id, name, data.data, value, options);
            }
        },
        "json"
    );
}

/**
 * 체크박스를 초기화한다.
 *
 * Usage: com.help.initCheck
 * 
 * @param id {String} id
 * @param name {String} name
 * @param data {String} 데이터
 * @param value {String} 선택될 데이터
 * @param options {Object} 옵션값
 */
com.help.initCheck = function(id, name, data, value, options) {
	var isIdDiff = options.isIdDiff || false;
	var isDisEle = options.isDisEle || false;
	var isAllChk = options.isAllChk || false;
	
	var eleId  = ""
    var section = $("#" + id);
    
    section.empty();
    
    for (var i = 0; i < data.length; i++) {
        var checkbox = $("<span class=\"chk\"><input type=\"checkbox\" autocomplete=\"on\" /> <label></label></span>");
        if (isIdDiff) {
        	eleId = id + "-" + data[i].code;
        } else {
        	eleId = id + "-" + i;
        }
        
        var chkYn = function() {
        	if ( isAllChk ) {
        		return true;
        	} else {
        		return data[i].code == value;
        	}
        }
        
        if ( isDisEle ) {
        	checkbox.find("input").attr("id",  eleId).attr("name", name).val(data[i].code).prop("checked", chkYn).prop("disabled", data[i].code == value);
        } else {
        	checkbox.find("input").attr("id",  eleId).attr("name", name).val(data[i].code).prop("checked", chkYn);
        }
        checkbox.find("label").attr("for", eleId).text(data[i].name);
        
        if ( i < data.length-1 ) {
        	checkbox.append("&nbsp;&nbsp;");
        }
        section.append(checkbox);
    }
}

/**
 * 체크박스를 로드한다.
 *
 * Usage: com.help.loadCheck
 * 
 * @param id {String} id
 * @param name {String} name
 * @param url {String} 조회할 url
 * @param data {String} 파라미터
 * @param value {String} 선택될 데이터
 * @param options {Object} 옵션값
 */
com.help.loadCheck = function(id, name, url, data, value, options) {
    // 옵션을 검색한다.
    $.post(
        com.wise.help.url(url),
        data,
        function(data, status, request) {
            if (data.data) {
                // 체크 옵션을 초기화한다.
            	com.help.initCheck(id, name, data.data, value, options);
            }
        },
        "json"
    );
}

/**
 * 문자열의 byte를 리턴한다.
 *
 * Usage: com.help.byteCheck
 * 
 * @param val {String} 문자열
 * @param form {Object} form 객체
 */
com.help.byteCheck = function(val){
	
	var temp_estr = escape(val);	//16진수(ASCII) 문자로 변환
	var s_index = 0;	//시작 인덱스
	var e_index = 0;	//마지막 인덱스
	var temp_str = "";
	var cnt = 0;
	while((e_index = temp_estr.indexOf("%u", s_index)) >=0){ //한글자씩 카운트 한다.
		temp_str += temp_estr.substring(s_index, e_index);
		s_index = e_index + 6;
		cnt ++;
	}
	temp_str += temp_estr.substring(s_index);
	temp_str = unescape(temp_str);
	return ((cnt *2) + temp_str.length);
}

/**
 * 조회된 json 데이터를 dynaTree 구조에 맞게 변경
 * 
 * @param jsonData
 * @returns {Array}
 */
com.help.convertDataToTreeStructure = function(jsonData, options) {
	options = options || {};
	options.title   = options.title  || "title";
	options.seq 	= options.seq    || "seq";
	options.parSeq  = options.parSeq || "parSeq";
	
	var treeJson = [], children = [];   
	
	for ( i = 0; i < jsonData.length; i++ ) {  
		var item      = jsonData[i];  
		item.title    = item[options.title];
		item.key      = item[options.seq];
		item.expand   = item.open    == "true" ? true : false;
		item.select   = item.checked == "true" ? true : false;
		item.isFolder = item.leaf    == "C" || item.leaf == "O" ? true : false;
		
		var	id       = item[options.seq],
			parentId = item[options.parSeq];
		
		if ( children[parentId] ) {  
			if (!children[parentId].children) {  
				children[parentId].children = [];  
			}  
			children[parentId].children[children[parentId].children.length] = item;  
			children[id] = item;  
		}  
		else {  
			children[id] = item;  
			//treeJson[id] = children[id];  
			treeJson.push(children[id]);
		}  
	}  
	return treeJson;  
}

/**
 * Tree가 체크되어있는지 확인한다.
 * 
 * @param treeId
 * @returns {Boolean} 체크여부
 */
com.help.isTreeChecked = function(treeId) {
	var treeObjSelected = $("#"+treeId).dynatree("getSelectedNodes");
	return treeObjSelected.length > 0 ? true : false;
}

/**
 * 이번주 구하기.
 * 
 * @returns {Stirng} 벼열0은 주시작, 배열1은 현재날짜 반환
 */
com.help.getThisWeek = function() {
	var currentDay = new Date();  
	var theYear = currentDay.getFullYear();
	var theMonth = currentDay.getMonth();
	var theDate  = currentDay.getDate();
	var theDayOfWeek = currentDay.getDay();


	var thisWeek = [];
	 
	var resultDay = new Date(theYear, theMonth, theDate + (0 - theDayOfWeek));
	var yyyy = resultDay.getFullYear();
	var mm = Number(resultDay.getMonth()) + 1;
	var dd = resultDay.getDate();
	 
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	 
	// 주시작 날짜
	thisWeek[0] = yyyy + '-' + mm + '-' + dd;
	
	yyyy = currentDay.getFullYear();
	mm = Number(currentDay.getMonth()) + 1;
	dd = currentDay.getDate();
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	
	// 현재 날짜
	thisWeek[1] = yyyy + '-' + mm + '-' + dd;
	
	return thisWeek;
}
/**
 * 이번달 구하기.
 * 
 * @returns {Stirng} 벼열0은 달시작, 배열1은 현재날짜 반환
 */
com.help.getThisMonth = function() {
	var currentDay = new Date();  
	var theYear = currentDay.getFullYear();
	var theMonth = currentDay.getMonth();


	var thisMonth = [];
	 
	var resultDay = new Date(theYear, theMonth);
	var yyyy = resultDay.getFullYear();
	var mm = Number(resultDay.getMonth()) + 1;
	var dd = 1;
	 
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	 
	// 달시작 날짜
	thisMonth[0] = yyyy + '-' + mm + '-' + dd;
	
	yyyy = currentDay.getFullYear();
	mm = Number(currentDay.getMonth()) + 1;
	dd = currentDay.getDate();
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	
	// 현재 날짜
	thisMonth[1] = yyyy + '-' + mm + '-' + dd;
	
	return thisMonth;
}

/**
 * 이번해 구하기.
 * 
 * @returns {Stirng} 벼열0은 년시작, 배열1은 현재날짜 반환
 */
com.help.getThisYear = function() {
	var currentDay = new Date();  
	var theYear = currentDay.getFullYear();

	var thisYear = [];
	 
	var yyyy = currentDay.getFullYear();
	var mm = 1;
	var dd = 1;
	 
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	 
	// 해시작 날짜
	thisYear[0] = yyyy + '-' + mm + '-' + dd;
	
	yyyy = currentDay.getFullYear();
	mm = Number(currentDay.getMonth()) + 1;
	dd = currentDay.getDate();
	mm = String(mm).length === 1 ? '0' + mm : mm;
	dd = String(dd).length === 1 ? '0' + dd : dd;
	
	// 현재 날짜
	thisYear[1] = yyyy + '-' + mm + '-' + dd;
	
	return thisYear;
}
/**
 * 오늘 날짜 구하기.
 * 
 * @returns {Stirng} 반환
 */
com.help.getThisDay = function() {
	var currentDay = new Date();

	var yyyy = currentDay.getFullYear();
    var mm = currentDay.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;  
    var dd = currentDay.getDate(); dd = (dd < 10) ? '0' + dd : dd;
   
    return "" + yyyy + "-" + mm + "-" + dd; 
}

/**
 * 날짜 변경해주는 함수 (yyyy-mm-dd 형태만 사용가능)
 * Usage: com.help.getDateAddDel('2021-03-22', -10, 'd')
 * beforeDate : 변경전 날짜
 * addNumber : 변경하고 싶은 일(월,년)수
 * type : 일(월,년) 선택
 * @returns {Stirng} 반환
 */
com.help.getDateAddDel = function(beforeDate, addNumber, type) {
	
	var yyyy = parseInt(beforeDate.substr(0, 4), 10);
    var mm = parseInt(beforeDate.substr(5, 2), 10);
    var dd = parseInt(beforeDate.substr(8), 10);
    
    if (type == "d") {    //일
    	d = new Date(yyyy, mm - 1, dd + addNumber);
    }
    else if (type == "m") {   //월
    	d = new Date(yyyy, mm - 1, dd + (addNumber * 31));
    }
    else if (type == "y") {   //년
    	d = new Date(yyyy + addNumber, mm - 1, dd);
    }
    
    yyyy = d.getFullYear();
    mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;  
    dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;
    
    return '' + yyyy + '-' +  mm  + '-' + dd;
}
/**
 * 트리를 컨트롤한다.
 * 
 * @param treeId	트리 ID
 * @param action	chk:전체체크/unchk:전체체크해제/expd:전체열기/unexpd:전체닫기
 */
com.help.treeControl = function(treeId, action) {
	var tree = $("#"+treeId).dynatree("getRoot");
	
	if ( action === "chk" ) {
		tree.visit(function(dtnode){
            dtnode.select(true);
        });
	}
	else if ( action === "unchk" ) {
		tree.visit(function(dtnode){
            dtnode.select(false);
        });
	}
	else if ( action === "expd" ) {
		tree.visit(function(dtnode){
            dtnode.expand(true);
        });
	}
	else if ( action === "unexpd" ) {
		tree.visit(function(dtnode){
            dtnode.expand(false);
        });
	}
}

/**
 * 파일을 다운로드한다.
 * 
 * @param data {Object} 데이터
 * @param options {Object} 옵션
 */
com.help.downloadFile = function(data, options) {
    options.target = options.target || "global-process-iframe";
    
    if (com.util.str.isBlank(options.url)) {
        return;
    }
    
    var params = "";
    
    for (var key in data) {
        if (com.util.str.isBlank(params)) {
            params += "?";
        }
        else {
            params += "&";
        }
        
        params += key + "=" + data[key];
    }
    
    $("#" + options.target).attr("src", com.help.url(options.url) + params);
}

/**
 * 모바일 페이징 navigation 로드
 * 
 * @param pages {Numeric} 전체페이지
 * @param page {Numeric} 선택페이지
 * @param options {Object} 옵션값
 */
com.help.loadMobilePage = function(pages, page, options) {
	options.rows = options.rows || $("input[name=rows]").val() || 10;
	
	var pager = 
			"<ul>" +
	        "    <li>" +
	        "        <a href=\"javascript:;\" class=\"mbtn_arrow_first\"></a>" +
	        "        <a href=\"javascript:;\" class=\"mbtn_arrow_prev\"></a>" +
	        "    </li>" +
	        "    <li>" +
	        "        <a href=\"javascript:;\" class=\"mbtn_arrow_next\"></a>" +
	        "        <a href=\"javascript:;\" class=\"mbtn_arrow_last\"></a>" + 
	        "    </li>" + 
	        "</ul>";

	options.sect.empty();
	
	var $counter = $("<div></div>");
	$counter.append("<span><em>"+page+"</em> / "+pages+"</span>");
	
	options.sect.append($counter);		// append counter
	
	var $pager = $(pager);
	$pager.on("click", "a", function(event) {
		event.preventDefault();
		var movePage = 0;
		
		if ( $(this).hasClass("mbtn_arrow_first") ) {
			if ( page > 1 ) {
				movePage = 1;
			}
		}
		else if ( $(this).hasClass("mbtn_arrow_last") ) {
			if ( page < pages ) {
				movePage = pages;
			}
		}
		else if ( $(this).hasClass("mbtn_arrow_prev") ) {
			if ( page > 1 ) {
				movePage = page - 1;
			}
		}
		else if ( $(this).hasClass("mbtn_arrow_next") ) {
			if ( page < pages ) {
				movePage = page + 1;
			}
		}
		if ( movePage > 0 ) {
			options.search(movePage);
		}
	});
	
	options.sect.append($pager);	// append pager
}