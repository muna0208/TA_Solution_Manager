var url, errorMessage;

/* 코드 목록 가져오기*/
var fnGetNmDicCodeListByAjax = function(groupCode){
	var result;
	url = "/getCodeList?groupCode="+groupCode;
	errorMessage = "코드 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.codeList;
	});
	return result;
}

/************************************************** 전처리기 **************************************************/
/*전처리기 조회*/
var fnGetPreprocessorListByAjax = function(){
	var result;
	url = "/getPreprocessorList";
	errorMessage = "전처리기 목록 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*전처리기 상세조회*/
var fnGetPreprocessorByAjax = function(preprocessorSeq){
	var result;
	url = "/getPreprocessor/"+preprocessorSeq;
	errorMessage = "전처리기 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result; 
}

/************************************************** 알고리즘 **************************************************/
/*알고리즘 조회*/
var fnGetAlgorithmListByAjax = function(){
	var result;
	url = "/getAlgorithmList";
	errorMessage = "알고리즘 목록 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*알고리즘 상세조회*/
var fnGetAlgorithmByAjax = function(algorithmSeq){
	var result;
	url = "/getAlgorithm/"+algorithmSeq;
	errorMessage = "알고리즘 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/************************************************** 사용자 관리 **************************************************/

/*사용자 조회*/
var fnGetUserListByAjax = function(){
	var result;
	url = "/getUserList";
	errorMessage = "사용자 목록 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*사용자 상세조회*/
var fnGetUserByAjax = function(id){
	var result;
	url = "/getUser/"+id;
	errorMessage = "사용자 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/*사용자 등록/수정*/
var fnSaveUserByAjax = function(url, type, data){
	var result;
	errorMessage = "사용자 등록/수정 에러";
	fnComnAjaxDataSync(url, type, JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*사용자 삭제*/
var fnDeleteUserByAjax = function(id){
	var result;
	url = "/deleteUser/"+id;
	errorMessage = "사용자 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/*사용자 찾기*/
var fnFindUserByAjax = function(data){
	var result;
	url = "/login/findUser";
	errorMessage = "사용자 찾기 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}


/************************************************** 원본데이터 관리 **************************************************/
/*원본데이터 조회*/
var fnGetOriginalDataListByAjax = function(){
	var result;
	url = "/getOriginalDataList";
	errorMessage = "원본데이터 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*원본데이터 상세조회*/
var fnGetOriginalDataByAjax = function(originalDataSeq){
	var result;
	url = "/getOriginalData/"+originalDataSeq;
	errorMessage = "원본데이터 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}



/*원본데이터 등록*/
var fnInsertOriginalDataByAjax = function(data){
	var result;
	url = "/insertOriginalData";
	errorMessage = "원본데이터 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*원본데이터 수정*/
var fnUpdateOriginalDataByAjax = function(data){
	var result;
	url = "/updateOriginalData";
	errorMessage = "원본데이터 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*원본데이터 삭제*/
var fnDeleteOriginalDataByAjax = function(originalDataSeq){
	var result;
	url = "/deleteOriginalData/" + originalDataSeq;
	errorMessage = "원본데이터 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*파일목록 가져오기*/
var fnGetFileListByAjax = function(){
	var result;
	url = "/getFileList";
	errorMessage = "파일 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/*jstree 폴더 생성 후 실제 폴더 생성*/
var fnCreateDirectoryByAjax = function(data){
	var result;
	url = "/createDirectory";
	errorMessage = "폴더생성 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*jstree 삭제후 실제 파일/폴더 삭제요청*/ 
var fnDeleteDirectoryByAjax = function(data){
	var result;
	url = "/deleteDirectory";
	errorMessage = "폴더삭제 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*jstree 수정후 실제 파일/폴더 수정*/
var fnRenameFileFolderByAjax = function(data){
	var result;
	url = "/renameFileFolder";
	errorMessage = "폴더수정 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}


/************************************************** 전처리데이터 관리 **************************************************/
/*전처리데이터 조회*/
var fnGetPreprocessedDataListByAjax = function(){
	var result;
	url = "/getPreprocessedDataList";
	errorMessage = "전처리데이터 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*전처리데이터 상세조회*/
var fnGetPreprocessedDataByAjax = function(preprocessedDataSeq){
	var result;
	url = "/getPreprocessedData/"+preprocessedDataSeq;
	errorMessage = "전처리데이터 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/*전처리데이터 등록*/
var fnInsertPreprocessedDataByAjax = function(data){
	var result;
	url = "/insertPreprocessedData";
	errorMessage = "전처리데이터 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*전처리데이터 수정*/
var fnUpdatePreprocessedDataByAjax = function(data){
	var result;
	url = "/updatePreprocessedData";
	errorMessage = "전처리데이터 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*전처리데이터 시작/중지 */
var fnChangePreprocessedDataByAjax = function(data){
	var result;
	url = "/changePreprocessedData";
	errorMessage = "전처리데이터 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*전처리데이터 삭제*/
var fnDeletePreprocessedDataByAjax = function(preprocessedDataSeq){
	var result;
	url = "/deletePreprocessedData/" + preprocessedDataSeq;
	errorMessage = "전처리데이터 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*전처리데이터 검색조회*/
var fnGetPreprocessedDataSearchListByAjax = function(data){
	var result;
	url = "/getPreprocessedDataSearchList";
	errorMessage = "전처리데이터 검색 조회 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response.preprocessedDataList;
	});
	return result;
};

/************************************************** 신조어 사전 관리 **************************************************/
/*신조어 조회*/
var fnGetNmDicListByAjax = function(){
	var result;
	url = "/getNmDicList";
	errorMessage = "신조어 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.nmDicList;
	});
	return result;
};

/*신조어 상세조회*/
var fnGetNmDicByAjax = function(nmSeq){
	var result;
	url = "/getNmDic/"+nmSeq;
	errorMessage = "신조어 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.nmDic;
	});
	return result;
}



/*신조어 등록*/
var fnInsertNmDicByAjax = function(data){
	var result;
	url = "/insertNmDic";
	errorMessage = "신조어 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*신조어 수정*/
var fnUpdateNmDicByAjax = function(data){
	var result;
	url = "/updateNmDic";
	errorMessage = "신조어 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*신조어 삭제*/
var fnDeleteNmDicByAjax = function(nmSeq){
	var result;
	url = "/deleteNmDic/" + nmSeq;
	errorMessage = "신조어 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}


/************************************************** 복합명사 사전 관리 **************************************************/
/*복합명사 조회*/
var fnGetCompDicListByAjax = function(){
	var result;
	url = "/getCompDicList";
	errorMessage = "복합명사 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.compDicList;
	});
	return result;
};

/*복합명사 상세조회*/
var fnGetCompDicByAjax = function(compSeq){
	var result;
	url = "/getCompDic/"+compSeq;
	errorMessage = "복합명사 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.compDic;
	});
	return result;
}



/*복합명사 등록*/
var fnInsertCompDicByAjax = function(data){
	var result;
	url = "/insertCompDic";
	errorMessage = "복합명사 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*복합명사 수정*/
var fnUpdateCompDicByAjax = function(data){
	var result;
	url = "/updateCompDic";
	errorMessage = "복합명사 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*복합명사 삭제*/
var fnDeleteCompDicByAjax = function(compSeq){
	var result;
	url = "/deleteCompDic/" + compSeq;
	errorMessage = "복합명사 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/************************************************** 기분석 사전 관리 **************************************************/
/*기분석 조회*/
var fnGetEoj49DicListByAjax = function(){
	var result;
	url = "/getEoj49DicList";
	errorMessage = "기분석 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.eoj49DicList;
	});
	return result;
};

/*기분석 상세조회*/
var fnGetEoj49DicByAjax = function(eoj49Seq){
	var result;
	url = "/getEoj49Dic/"+eoj49Seq;
	errorMessage = "기분석 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.eoj49Dic;
	});
	return result;
}



/*기분석 등록*/
var fnInsertEoj49DicByAjax = function(data){
	var result;
	url = "/insertEoj49Dic";
	errorMessage = "기분석 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*기분석 수정*/
var fnUpdateEoj49DicByAjax = function(data){
	var result;
	url = "/updateEoj49Dic";
	errorMessage = "기분석 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*기분석 삭제*/
var fnDeleteEoj49DicByAjax = function(eoj49Seq){
	var result;
	url = "/deleteEoj49Dic/" + eoj49Seq;
	errorMessage = "기분석 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/************************************************** 후처리 사전 관리 **************************************************/
/*후처리 조회*/
var fnGetCollocDicListByAjax = function(){
	var result;
	url = "/getCollocDicList";
	errorMessage = "후처리 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.collocDicList;
	});
	return result;
};

/*후처리 상세조회*/
var fnGetCollocDicByAjax = function(collocSeq){
	var result;
	url = "/getCollocDic/"+collocSeq;
	errorMessage = "후처리 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.collocDic;
	});
	return result;
}



/*후처리 등록*/
var fnInsertCollocDicByAjax = function(data){
	var result;
	url = "/insertCollocDic";
	errorMessage = "후처리 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*후처리 수정*/
var fnUpdateCollocDicByAjax = function(data){
	var result;
	url = "/updateCollocDic";
	errorMessage = "후처리 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*후처리 삭제*/
var fnDeleteCollocDicByAjax = function(collocSeq){
	var result;
	url = "/deleteCollocDic/" + collocSeq;
	errorMessage = "후처리 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/************************************************** 불용어 사전 관리 **************************************************/
/*불용어 조회*/
var fnGetStopWordDicListByAjax = function(){
	var result;
	url = "/getStopWordDicList";
	errorMessage = "불용어 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.stopWordDicList;
	});
	return result;
};

/*불용어 상세조회*/
var fnGetStopWordDicByAjax = function(stopWordSeq){
	var result;
	url = "/getStopWordDic/"+stopWordSeq;
	errorMessage = "불용어 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response.stopWordDic;
	});
	return result;
}



/*불용어 등록*/
var fnInsertStopWordDicByAjax = function(data){
	var result;
	url = "/insertStopWordDic";
	errorMessage = "불용어 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*불용어 수정*/
var fnUpdateStopWordDicByAjax = function(data){
	var result;
	url = "/updateStopWordDic";
	errorMessage = "불용어 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*불용어 삭제*/
var fnDeleteStopWordDicByAjax = function(stopWordSeq){
	var result;
	url = "/deleteStopWordDic/" + stopWordSeq;
	errorMessage = "불용어 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}


/************************************************** 지식 적용 현황 **************************************************/
/*지식 현황 조회*/
var fnGetApplyDicListByAjax = function(){
	var result;
	url = "/getApplyDicList";
	errorMessage = "지식 현황 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*지식 적용*/
var fnApplyDicByAjax = function(data){
	var result;
	url = "/applyDicByAjax";
	errorMessage = "지식 적용 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}




/************************************************** 분석 테스트 **************************************************/
/*분석 테스트 조회*/
var fnAnalyzeTestByAjax = function(data){
	var result;
	url = "/analyzeTest";
	errorMessage = "분석 테스트 조회 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}


/************************************************** 서버 구동 현황 **************************************************/
/*서버 구동 현황 조회*/
var fnGetServerStateListByAjax = function(){
	var result;
	url = "/getServerStateList";
	errorMessage = "서버 구동 현황 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*서버 구동 현황 상세조회*/
var fnGetServerStateByAjax = function(serverSeq){
	var result;
	url = "/getServerState/"+serverSeq;
	errorMessage = "서버 구동 현황 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/*서버 등록*/
var fnInsertServerByAjax = function(data){
	var result;
	url = "/insertServer";
	errorMessage = "서버 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*서버 수정*/
var fnUpdateServerByAjax = function(data){
	var result;
	url = "/updateServer";
	errorMessage = "서버 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*서버 삭제*/
var fnDeleteServerByAjax = function(serverSeq){
	var result;
	url = "/deleteServer/" + serverSeq;
	errorMessage = "서버 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*서버 시작/정지 */
var fnCommandServerByAjax = function(data){
	var result;
	url = "/commandServer";
	errorMessage = "서버 시작/중지 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*서버 상태 리로딩*/
var fnRefreshServeByAjax = function(){
	var result;
	url = "/refreshServerByAjax";
	errorMessage = "서버 새로고침 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}

/************************************************** 프로젝트 관리 **************************************************/
/*프로젝트 조회*/
var fnGetProjectListByAjax = function(){
	var result;
	url = "/getProjectList";
	errorMessage = "프로젝트 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*프로젝트 상세조회*/
var fnGetProjectByAjax = function(projectSeq){
	var result;
	url = "/getProject/"+projectSeq;
	errorMessage = "프로젝트 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}


/*프로젝트 등록*/
var fnInsertProjectByAjax = function(data){
	var result;
	url = "/insertProject";
	errorMessage = "프로젝트 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*프로젝트 수정*/
var fnUpdateProjectByAjax = function(data){
	var result;
	url = "/updateProject";
	errorMessage = "프로젝트 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*프로젝트 삭제*/
var fnDeleteProjectByAjax = function(projectSeq){
	var result;
	url = "/deleteProject/" + projectSeq;
	errorMessage = "프로젝트 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/************************************************** 모델 관리 **************************************************/

/*모델 목록 조회*/
var fnGetModelListByAjax = function(projectSeq){
	var result;
	url = "/getModelList/"+projectSeq;
	errorMessage = "모델 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*모델 상세조회*/
var fnGetModelByAjax = function(modelSeq){
	var result;
	url = "/getModel/"+modelSeq;
	errorMessage = "모델 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}


/*모델 등록*/
var fnInsertModelByAjax = function(data){
	var result;
	url = "/insertModel";
	errorMessage = "모델 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}


/*모델 삭제*/
var fnDeleteModelByAjax = function(modelSeq){
	var result;
	url = "/deleteModel/" + modelSeq;
	errorMessage = "모델 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*학습/평가 실행/중지*/
var fnModelCommandByAjax = function(data){
	var result;
	url = "/modelCommand";
	errorMessage = "모델 학습/평가 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*모델 검색 목록 조회*/
var fnGetModelSearchListByAjax = function(projectSeq, data){
	var result;
	url = "/getModelSearchList/"+projectSeq;
	errorMessage = "모델 검색 조회 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response.modelList;
	});
	return result;
};

/************************************************** 데몬 관리 **************************************************/
/*데몬 목록 조회*/
var fnGetDemonListByAjax = function(){
	var result;
	url = "/getDemonList/";
	errorMessage = "데몬 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*데몬 상세조회*/
var fnGetDemonByAjax = function(demonServiceSeq){
	var result;
	url = "/getDemon/"+demonServiceSeq;
	errorMessage = "데몬 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response
	});
	return result;
}


/*데몬 등록*/
var fnInsertDemonByAjax = function(data){
	var result;
	url = "/insertDemon";
	errorMessage = "데몬 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*데몬 수정*/
var fnUpdateDemonByAjax = function(data){
	var result;
	url = "/updateDemon";
	errorMessage = "데몬 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*데몬 삭제*/
var fnDeleteDemonByAjax = function(demonServiceSeq){
	var result;
	url = "/deleteDemon/" + demonServiceSeq;
	errorMessage = "데몬 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*데몬 실행*/
var fnCommandDemonByAjax = function(data){
	var result;
	url = "/commandDemon";
	errorMessage = "데몬 실행 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/************************************************** 배치 관리 **************************************************/
/*배치 목록 조회*/
var fnGetBatchListByAjax = function(){
	var result;
	url = "/getBatchList/";
	errorMessage = "배치 조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
};

/*배치 상세조회*/
var fnGetBatchByAjax = function(batchServiceSeq){
	var result;
	url = "/getBatch/"+batchServiceSeq;
	errorMessage = "배치 상세조회 에러";
	fnComnAjaxGetDataSync(url, errorMessage, function(response){
		result = response;
	});
	return result;
}


/*배치 등록*/
var fnInsertBatchByAjax = function(data){
	var result;
	url = "/insertBatch";
	errorMessage = "배치 등록 에러";
	fnComnAjaxDataSync(url, "POST", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*배치 수정*/
var fnUpdateBatchByAjax = function(data){
	var result;
	url = "/updateBatch";
	errorMessage = "배치 수정 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}

/*배치 삭제*/
var fnDeleteBatchByAjax = function(batchServiceSeq){
	var result;
	url = "/deleteBatch/" + batchServiceSeq;
	errorMessage = "배치 삭제 에러";
	fnComnAjaxDeleteDataSync(url, errorMessage, function (response) {
		result = response;
	});
	return result;
}

/*배치 시작/중지*/
var fnCommandBatchByAjax = function(data){
	var result;
	url = "/commandBatch";
	errorMessage = "배치 시작/중지 에러";
	fnComnAjaxDataSync(url, "PATCH", JSON.stringify(data), errorMessage, function(response){
		result = response;
	});
	return result;
}


/************************************************** 불용어 사전 관리 **************************************************/


