$(function(){
	var key = fnGetCookie("key");
	$("#userId").val(key);
	
	$("#userId").bind("keypress", function(e){
		if( e.which == 13 )	{
			fnLogin();
		}
	});
	
	$("#userPw").bind("keypress", function(e){
		if( e.which == 13 )	{
			fnLogin();
		}
	});
	
	
	$("input[name='userId']").focus();
	var message = $(location).attr('search');
	if( fnComnNotNullAndEmpty(message) && message == "?error=accountError" ){
	    fnTaErrorMessage("계정 정보가 정확하지 않습니다.", message);
	}
	
	if( $("#isLocalTest").val() == "true" ){
		$("#userId").val("admin");
		$("#userPw").val("admin");
	}
	
});


/*로그인*/
var fnLogin = function(){
	if( $.trim($("#userId").val()) == "" ){
    	fnTaNotify("warning", "ID를 입력해주세요.");
		$("#userId").focus();
		
	}else if( $.trim($("#userPw").val()) == "" ){
    	fnTaNotify("warning", "비밀번호를 입력해주세요.");
		$("#userPw").focus();
		
	}else{
		// 아이디 저장 체크
		if( $("#saveID").is(":checked") ){
			fnSetCookie("key", $("#userId").val(), 7); // 7일 동안 쿠키 보관
		}else{
			fnDeleteCookie("key");
		}
		
		$("#loginForm").submit();
	}
}

/*쿠키 설정*/
var fnSetCookie = function(cookieName, value, exdays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

/*쿠키 삭제*/
var fnDeleteCookie = function(cookieName){
	var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

/*쿠키 가져오기*/
var fnGetCookie = function(cookieName){
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

/*아이디 찾기*/
var fnFindUserId = function(){
	if( $("#findUserIdForm").parsley().validate() ){
		var data = {
			"userName": $("#findUserId_userName").val()
			,"email" : $("#findUserId_email").val()
			,"option" : "findUserId"
		}
		var response = fnFindUserByAjax(data);
		if( response.result == "success" ){
			fnTaNotify("success","사용자 ID : "+response.user.userId);
		}else{
			fnTaErrorMessage("해당 이름과 이메일이 일치하는 사용자가 없습니다.", response.errorMessage);	
		}
	}
}

/*비밀번호 찾기*/
var fnFindUserPw = function(){
	if( $("#findUserPwForm").parsley().validate() ){
		var data = {
			"userId": $("#findUserPw_userId").val()
			,"email" : $("#findUserPw_email").val()
			,"option" : "findUserPw"
		}
		var response = fnFindUserByAjax(data);
		if( response.result == "success" ){
			fnTaNotify("success","임시 비밀번호 발급 : "+response.tempPw);
		}else{
			fnTaErrorMessage("해당 아이디의 사용자가 없습니다.", response.errorMessage);	
		}
	}
}

/*회원가입*/
var fnRegistUser = function(option){
	if( $("#registUserForm").parsley().validate() ){
		var data = {
				"userId" : $("#m_userId").val()
				,"userName" : $("#m_userName").val()
				,"email" : $("#email").val()
				,"userPw" : $("#password").val()
				,"userAuth" : "user"
				,"useFlag" : 1
		}
		
		if( confirm("가입 하시겠습니까?") ){
			var response = fnSaveUserByAjax("/login/registUser", "POST", data);
			if( response.errorMessage == "duplication userId" ){
				$("#m_userId").focus();
				fnTaNotify("warning", "이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.");
				
			}else{
				fnTaNotify("success", "가입되었습니다.");
				$(".registUserModal").modal("hide");
			}			
		}
	}
}


