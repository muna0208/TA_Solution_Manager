var applyDicIntervalId = 0;

$(function(){
	fnInit();
	
     $("#tree").treeview({
         collapsed: false,
         animated: "medium",
         control:"#sidetreecontrol",
         persist: "location"
     });
    
 	/*형태소 사전 클릭시*/
 	$("#morphDic").on("ifToggled",function(){
 		var text = "uncheck";
 		if( $(this).is(":checked") )	text = "check";
 		
 		$("#morphDicUl").find("li").each(function(){
 			$(this).iCheck(text);
 		});
 	});
 		
})

var fnInit = function(){
	fnSearch();
	$("#loading").fadeOut();
}

var fnSearch = function(){
	$("#tbodyHtml").html(fnCreateListHtml(fnGetApplyDicListByAjax()));
	
}

var fnCreateListHtml = function(applyDicList){
	var html = "";
	fnCheckState(applyDicList);
	for( var i in applyDicList ){
		var data = applyDicList[i];
		if( data.id > 10 ){
			html += "";
			html += "<tr>";
			html += "	<td>"+data.name+"</td>";
			html += "	<td>"+fnStateTranslation(data.state)+"</td>";
			html += "	<td>"+data.applyCnt+"</td>";
			if( data.state == "complete" ) html += "	<td>성공</td>";
			else if( fnComnNotNullAndEmpty(data.stateError) ) html += "	<td>"+data.stateError+"</td>";
			else html += "	<td>진행중</td>";
			html += "	<td>"+data.applyStartTime+"</td>";
			html += "	<td>"+data.applyEndTime+"</td>";
			html += "	<td>"+data.applyRunTime+"</td>";
			html += "</tr>";			
		}
	}
	return html;
}

/*사전 적용*/
var fnApplyDic = function(){
	var morphDicIds = "", objectDicIds = "";
	$("#morphDicUl").find("li").each(function(){
		if( $(this).find("input").is(":checked") ){
			if( morphDicIds == "" )	morphDicIds += $(this).find("input").attr("id");
			else morphDicIds += ","+$(this).find("input").attr("id");
		}
	});
	$("#objectDic").find("li").each(function(){
		if( $(this).find("input").is(":checked") ){
			if( objectDicIds == "" )	objectDicIds += $(this).find("input").attr("id");
			else objectDicIds += ","+$(this).find("input").attr("id");
		}
	});
	
	if( fnComnNotNullAndEmpty(morphDicIds) || fnComnNotNullAndEmpty(objectDicIds)){
		if( confirm("적용하시겠습니까?") ){
			var data = {
				"morphDicIds" : morphDicIds
				,"objectDicIds" : objectDicIds
				,"delay" : "3000"
			}
			var response = fnApplyDicByAjax(data);
			if (response.result == "success") {
				$("input").iCheck("uncheck");
				fnTaNotify("success", "지식 적용을 요청하였습니다.");
				applyDicIntervalId = setInterval(fnSearch, 2000);

			}else{
				fnTaErrorMessage("지식 적용 에러!!", response);
			}
		}
	}else{
		fnTaNotify("warning", "적용할 항목을 선택해주세요.");
	}
}


/*지식 적용 현황 상태값 체크*/
var fnCheckState = function(applyDicList){
	clearInterval(applyDicIntervalId);
	
	for(var i in applyDicList){
		var data = applyDicList[i];
		if( data.id > 10 ){
			if( data.state != "complete" ){
				applyDicIntervalId = setInterval(fnSearch, 5000);
				break;
			}			
		}
	}
}

/*상태값 변환*/
var fnStateTranslation = function(state){
	var text = "";
	switch(state){
	case "backup":
		text = "백업";
		break;
	case "download":
		text = "다운로드";
		break;
	case "compile":
		text = "컴파일";
		break;
	case "reload":
		text = "리로드";
		break;
	case "complete":
		text = "완료";
		break;
	default:
		text = state;
		break;
	}
	return text;
}

