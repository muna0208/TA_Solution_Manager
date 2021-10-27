package com.daumsoft.taSolutionManager.restFullApi.service;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.daumsoft.taSolutionManager.common.service.HttpService;
import com.daumsoft.taSolutionManager.common.utils.FileUtil;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.OriginalData;
import com.daumsoft.taSolutionManager.restFullApi.domain.PreProcessedData;
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.mapper.DataManageRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class DataManageRestService {
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	DataManageRestMapper dataManageRestMapper;
	
	@Autowired
	private HttpService httpService;
	
	@Value("${userFilePath}")
	private String userFilePath;
	
	@Value("${originalFilePath}")
	private String originalFilePath;
	
	@Value("${preprocessedDataFilePath}")
	private String preprocessedDataFilePath;
	
	@Value("${module.url}")
	private String moduleUrl;
	
	@Value("${module.version}")
	private String moduleVersion;
	
	@Value("${module.method.preprocessedData}")
	private String moduleMethodPreprocessedData;

	@Value("${isLocalTest}")
	private boolean isLocalTest;
	/**
	 * 원본데이터 조회
	 * @return
	 * @throws Exception 
	 */
	public JSONArray getOriginalDataList(HttpSession session) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		String userAuth = session.getAttribute("userAuth")+"";
		String userId = "admin".equals(userAuth) ? null : session.getAttribute("userId")+"";
		List<OriginalData> list = dataManageRestMapper.getOriginalDataList(userId);
		
		for (OriginalData originalData : list) {
			if( MakeUtil.isNotNullAndEmpty(originalData) )	jsonArr.add(new JSONObject().fromObject(originalData));
		}
		return jsonArr;
	}

	/**
	 * 원본데이터 상세조회
	 * @param originalDataSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getOriginalData(Integer originalDataSeq) throws Exception {
		OriginalData originalData = dataManageRestMapper.getOriginalData(originalDataSeq);
		
		return new JSONObject().fromObject(originalData);
	}



	/**
	 * 원본데이터 등록
	 * @param originalData
	 * @return
	 */
	public JSONObject insertOriginalData(OriginalData originalData) throws Exception {
		JSONObject result = new JSONObject();
		
		// 파일명 중복체크
		int checkCnt = dataManageRestMapper.duplicateCheckOriginalData(originalData);
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication file");
			return result;
		}
				
		String fileName = originalData.getOriginalFileName();
		String filePath = originalData.getParentPath();
		String extension = fileName.substring(fileName.lastIndexOf(".")+1);
		
		originalData.setExtension(extension);
		originalData.setStoredFileName(fileName);
		File file = new File(filePath + "/" + fileName);
		originalData.setFileSize(file.length());
		
		dataManageRestMapper.insertOriginalData(originalData);
		
		// 원본데이터 복사
		String originalDataPath = originalFilePath+"/originalData_"+originalData.getOriginalDataSeq();
		FileUtil.mkdir(originalDataPath);
		FileUtil.fileCopy(filePath+"/"+fileName, originalDataPath+"/"+fileName);
		
		// 파일 경로 업데이트
		originalData.setPath(originalDataPath);
		dataManageRestMapper.updateOriginalData(originalData);
		
		OriginalData detail = dataManageRestMapper.getOriginalData(originalData.getOriginalDataSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("originalData", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 원본데이터 수정
	 * @param originalData
	 * @return
	 */
	public JSONObject updateOriginalData(OriginalData originalData) throws Exception {
		JSONObject result = new JSONObject();
		
		dataManageRestMapper.updateOriginalData(originalData);
		
		OriginalData detail = dataManageRestMapper.getOriginalData(originalData.getOriginalDataSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("originalData", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 원본데이터 삭제
	 * @param originalDataSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteOriginalData(Integer originalDataSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		/* 사용중인지 체크 */
		int checkCnt = dataManageRestMapper.isUseCheckOriginalData(originalDataSeq);
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","originalData in use");
			return result;	
		}
		
		OriginalData originalData = new OriginalData();
		originalData.setOriginalDataSeq(originalDataSeq);
		originalData.setDeleteFlag(1);
		dataManageRestMapper.updateOriginalData(originalData);
		
		// 원본데이터 삭제
		OriginalData detail = dataManageRestMapper.getOriginalData(originalData.getOriginalDataSeq());
		FileUtil.deleteAllFiles(detail.getPath());
		
		result.put("result", "success");
		return result;
	}
	
	
	/**
	 * 파일 목록 조회
	 * @param session
	 * @return
	 */
	public JSONObject getFileList(HttpSession session) throws Exception {
		JSONObject result = new JSONObject();

		String userAuth = session.getAttribute("userAuth")+"";
		String userId = session.getAttribute("userId")+"";
		// 사용자 폴더 생성
		String userPath = "admin".equals(userAuth) ? userFilePath : userFilePath+"/"+userId;
		// 폴더 생성
		FileUtil.mkdir(userPath);
		
		List<Map<String,Object>> fileList = FileUtil.getDirFileListObject(userPath);
		Map<String, Object> rootMap = new HashMap<String, Object>();
		rootMap.put("type", "folder");
		rootMap.put("children", fileList);
		if( "admin".equals(userAuth) )	rootMap.put("text", userFilePath.substring(userFilePath.lastIndexOf("/")+1));
		else rootMap.put("text", userId);
		rootMap.put("path", userPath);
		
		result.put("result", "success");
		if( "admin".equals(userAuth) ) result.put("filePath", userFilePath+"/");
		else result.put("filePath", userFilePath+"/"+userId+"/");
		result.put("fileList", rootMap);
		
		return result;
	}

	/**
	 * 폴더 생성
	 * @param params
	 * @return
	 */
	public JSONObject createDirectory(Map<String, Object> params) throws Exception {
		JSONObject result = new JSONObject();
		String targetFullPath = ""+params.get("targetFullPath");
		String fileName = ""+params.get("fileName");
		targetFullPath = FileUtil.appendEndsPath(targetFullPath)+fileName;
		
		if( FileUtil.fileIsLive(targetFullPath) ) {
			result.put("result", "error");
			result.put("errorMessage", "["+fileName+"] 이미 존재하는 파일입니다.");
		
		} else {
			FileUtil.makeFolder(targetFullPath);
			logger.info("폴더 생성: "+targetFullPath);
			result.put("result", "success");
			
			if(!FileUtil.fileIsLive(targetFullPath)) {
				result.put("result", "error");
				result.put("errorMessage", "["+fileName+"] 파일생성 실패");
				logger.info("파일생성 실패: "+targetFullPath);
			}
		}
		
		return result;
	}

	/**
	 * 파일/폴더 삭제 (내부디렉토리 및 내용 모두 삭제)
	 * @param params
	 * @param session
	 * @return
	 */
	public JSONObject deleteDirectory(Map<String, Object> params) throws Exception {
		JSONObject result = new JSONObject();
		String targetFullPath = ""+params.get("targetFullPath");
		
		if( MakeUtil.isNotNullAndEmpty(targetFullPath) ) {
			File f = new File(targetFullPath);
			if(f.isDirectory()) 
				FileUtil.deleteAllFiles(targetFullPath);
			f.delete();
			logger.info("파일삭제: "+targetFullPath);
			result.put("result", "success");
		}else {
			result.put("result", "error");
			result.put("errorMessage", "파일 경로가 없습니다.");
			logger.info("파일 경로가 없습니다. "+targetFullPath);
		}
		
			
		return result;
	}

	/**
	 * 파일/폴더 이름 수정
	 * @param params
	 * @return
	 */
	public JSONObject renameFileFolder(Map<String, Object> params) throws Exception {
		JSONObject result = new JSONObject();
		
		String targetPath = ""+params.get("targetPath");
		String targetParentPath = ""+params.get("targetParentPath");
		String targetType = ""+params.get("targetType");
		String oldName = ""+params.get("oldName");
		String newName = ""+params.get("newName");
		
		targetParentPath = FileUtil.appendEndsPath(targetParentPath);
		targetPath = FileUtil.appendEndsPath(targetPath);
		
		//새로만들어진 경우 바로 수정이벤트가 발생 한다, 이때 target은 부모를 바라보고 있음
		if("folder".equals(targetType) && oldName.contains("New node") )
			targetParentPath =targetPath;
			
		if( MakeUtil.isNotNullAndEmpty(targetPath) ) {
			targetPath = FileUtil.appendEndsPath(targetPath);
			
			String oldPath = ("file".equals(targetType)) ? targetPath+oldName : targetParentPath+oldName;
			String newPath = ("file".equals(targetType)) ? targetPath+newName : targetParentPath+newName;
			
			File file = new File(oldPath);
			File fileNew = new File(newPath);
			if(fileNew.exists()) {
				result.put("result", "error");
				result.put("errorMessage", "["+newName+"]이미 존재하는 파일/폴더 입니다");
				logger.info("["+newName+"]이미 존재하는 파일/폴더 입니다");
			} else {
				if(file.exists()) {
					file.renameTo(fileNew);
					result.put("result", "success");
					result.put("message", "rename");
					logger.info("이름 수정: "+fileNew);
				}else {
					FileUtil.makeFolder(newPath);
					result.put("result", "success");
					result.put("message", "create");
					logger.info("폴더 생성: "+newPath);
				}
			}
			
		}else {
			result.put("result", "error");
			result.put("errorMessage", "파일 경로가 없습니다.");
		}
		return result;
	}
	
	/**
	 * 데이터 업로드
	 * @param multipartFile
	 * @param uploadFile
	 * @return
	 */
	public JSONObject fileUpload(MultipartFile multipartFile, String uploadFile) {
		JSONObject result = new JSONObject();
		File targetFile = null;
		targetFile = new File(FileUtil.appendEndsPath(uploadFile) + multipartFile.getOriginalFilename());	
		
		try {
			InputStream fileStream = multipartFile.getInputStream();
			FileUtils.copyInputStreamToFile(fileStream, targetFile);
			result.put("result", "success");
			logger.error("파일 업로드: "+targetFile);
		} catch (Exception e) {
			FileUtils.deleteQuietly(targetFile);
			result.put("result", "error");
			result.put("errorMessage", e.toString());
			logger.error("파일 업로드 실패!!! "+e.toString());
		}
		return result;
	}
	
	
/* ***************************************************** 전처리 데이터 관리 ***************************************************** */
	/**
	 * 전처리 데이터 조회
	 * @return
	 */
	public JSONArray getPreprocessedDataList(HttpSession session) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		String userAuth = session.getAttribute("userAuth")+"";
		String userId = "admin".equals(userAuth) ? null : session.getAttribute("userId")+"";
		List<PreProcessedData> list = dataManageRestMapper.getPreprocessedDataList(userId);
		
		for (PreProcessedData preprocessedData : list) {
			if( MakeUtil.isNotNullAndEmpty(preprocessedData) )	jsonArr.add(new JSONObject().fromObject(preprocessedData));
		}
		return jsonArr;
	}

	/**
	 * 전처리 데이터 상세조회
	 * @param preprocessedDataSeq
	 * @return
	 */
	public JSONObject getPreprocessedData(Integer preprocessedDataSeq) throws Exception {
		PreProcessedData detail = dataManageRestMapper.getPreprocessedData(preprocessedDataSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) ) {
			if( MakeUtil.isNotNullAndEmpty(detail.getStartDatetime()) && MakeUtil.isNotNullAndEmpty(detail.getEndDatetime()) )
				detail.setDiffDateTime(MakeUtil.diffOfDateAll(detail.getStartDatetime(), detail.getEndDatetime()));
		}
		
		return MakeUtil.nvlJson(new JSONObject().fromObject(detail));
	}

	/**
	 * 전처리 데이터 생성
	 * @param params
	 * @return
	 * @throws Exception 
	 */
	public JSONObject insertPreprocessedData(PreProcessedData preprocessedData) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		JSONObject params = null;
		
		// 사용자 ID 중복체크
		int checkCnt = dataManageRestMapper.duplicateCheckPreprocessedData(""+preprocessedData.getName());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication name");
			return result;
		}
		
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodPreprocessedData;
		params = new JSONObject();
		params.put("name", preprocessedData.getName());
		params.put("original_data_seq", preprocessedData.getOriginalDataSeq());
		params.put("preprocessor_seq", preprocessedData.getPreprocessorSeq());
		params.put("parameters", preprocessedData.getParameters());
		// 유효성 체크
		httpJson = httpService.httpServicePOST(httpUrl, params.toString());
		if( "200".equals(httpJson.get("code")) ) {
			
			/* 전처리데이터 저장 */
			httpJson = new JSONObject().fromObject(httpJson.get("data"));
			preprocessedData.setFileName(httpJson.get("file_name").toString());
			preprocessedData.setExtension(httpJson.get("extension").toString());
			preprocessedData.setParameters(httpJson.get("parameters").toString());
			dataManageRestMapper.insertPreprocessedData(preprocessedData);
			
			// 파일 path 업데이트
			String path = preprocessedDataFilePath+"/"+preprocessedData.getPreprocessedDataSeq();
			if( isLocalTest )	path = "/home/tasolver/TASOLVER/files/preprocessedData_files/preprocessedData_"+preprocessedData.getPreprocessedDataSeq();
			else FileUtil.mkdir(path); // 전처리 파일 폴더 생성
			preprocessedData.setPath(path);
			dataManageRestMapper.updatePreprocessedData(preprocessedData);
			
			result.put("preprocessedData", preprocessedData);
			result.put("result", "success");
		
		}else if( "500".equals(httpJson.get("code")) ){
			result.put("result", "Internal Server Error");
			result.put("errorMessage", httpJson);
		}else {
			result.put("errorMessage", httpJson);
		}
		return result;
	}

	/**
	 * 전처리 데이터 삭제
	 * @param preprocessedDataSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deletePreprocessedData(Integer preprocessedDataSeq) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		
		/* 사용중인지 체크 */
		int checkCnt = dataManageRestMapper.isUseCheckPreprocessedDataData(preprocessedDataSeq);
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","preprocessedData in use");
			return result;	
		}

		// 실행중일경우 중치요청  http://10.1.1.61:2021/v1.0/preprocessed-data/24/revoke
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodPreprocessedData + "/" 
						+ preprocessedDataSeq + "/revoke";
		try {
			httpJson = httpService.httpServiceGET(httpUrl);
			if( "200".equals(httpJson.get("code")) ) {
				
				dataManageRestMapper.deletePreprocessedData(preprocessedDataSeq);
				result.put("result", "success");
				
			}else {
				result.put("result", "error");
				result.put("errorMessage", httpJson);
			}	
		} catch (Exception e) {
			result.put("result", "error");
			result.put("errorMessage", e.toString());
			MakeUtil.printErrorLogger(e, "deletePreprocessedData");
		}
		
		return result;
	}

	/**
	 * 전처리데이터 시작/중지
	 * @param preprocessedData
	 * @return
	 * @throws Exception 
	 */
	public JSONObject changePreprocessedData(PreProcessedData preprocessedData) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodPreprocessedData + "/" 
					+ preprocessedData.getPreprocessedDataSeq() + "/" + preprocessedData.getTask();
		httpJson = httpService.httpServiceGET(httpUrl);
		if( "200".equals(httpJson.get("code")) ) {
			httpJson = new JSONObject().fromObject(httpJson.get("data"));
			preprocessedData.setState(httpJson.get("state").toString());
			dataManageRestMapper.updatePreprocessedData(preprocessedData);
			result = getPreprocessedData(preprocessedData.getPreprocessedDataSeq());
			result.put("result", "success");
			
		}else {
			result.put("result", "error");
			result.put("errorMessage", httpJson);
		}
		return result;
	}

	/**
	 * 전처리데이터 검색조회
	 * @param paramMap
	 * @return
	 */
	public JSONObject getPreprocessedDataSearchList(PreProcessedData preprocessedData) {
		JSONObject result = new JSONObject();
		JSONArray jsonArr = new JSONArray();
		
		List<PreProcessedData> list = dataManageRestMapper.getPreprocessedDataSearchList(preprocessedData);
		
		for (PreProcessedData map : list) {
			if( MakeUtil.isNotNullAndEmpty(map) )	jsonArr.add(new JSONObject().fromObject(map));
		}
		result.put("result", "success");
		result.put("preprocessedDataList", jsonArr);
		return result;
	}

}
