package com.daumsoft.taSolutionManager.restFullApi.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.OriginalData;
import com.daumsoft.taSolutionManager.restFullApi.domain.PreProcessedData;
import com.daumsoft.taSolutionManager.restFullApi.service.DataManageRestService;

import net.sf.json.JSONObject;

@RestController
public class DataManageRestController {

	@Autowired
	private DataManageRestService dataManageRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 원본데이터 조회
	 * @return
	 */
	@GetMapping(value="/getOriginalDataList")
    public ResponseEntity<Object> getOriginalDataList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.getOriginalDataList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getOriginalDataList"));
		}
    }
	
	/**
	 * 원본데이터 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getOriginalData/{originalDataSeq}")
	public ResponseEntity<Object> getOriginalData(@PathVariable Integer originalDataSeq){
        try {
            return new ResponseEntity<Object>(dataManageRestService.getOriginalData(originalDataSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getOriginalData"));
		}
	}
	
	
	/**
	 * 원본데이터 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertOriginalData")
	public ResponseEntity<Object> insertOriginalData(@RequestBody OriginalData originalData){
        try {
        	return new ResponseEntity<Object>(dataManageRestService.insertOriginalData(originalData),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertOriginalData"));
		}
	}
	
	/**
	 * 원본데이터 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateOriginalData")
	public ResponseEntity<Object> updateOriginalData(@RequestBody OriginalData originalData){
        try {
        	return new ResponseEntity<Object>(dataManageRestService.updateOriginalData(originalData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateOriginalData"));
		}
	}
	
	/**
	 * 원본데이터 삭제
	 * @param originalDataSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteOriginalData/{originalDataSeq}")
	public ResponseEntity<Object> deleteOriginalData(@PathVariable Integer originalDataSeq){
        try {
        	return new ResponseEntity<Object>(dataManageRestService.deleteOriginalData(originalDataSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteOriginalData"));
		}
	}

	
	/**
	 * 파일 목록 조회
	 * @param session
	 * @return
	 */
	@GetMapping(value="/getFileList")
    public ResponseEntity<Object> getFileList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.getFileList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getFileList"));
		}
    }
	
	/**
	 * 폴더 생성
	 * @param request
	 * @param session
	 * @return
	 */
	@PostMapping(value="/createDirectory")
	public ResponseEntity<Object> createDirectory(@RequestBody Map<String, Object> params) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.createDirectory(params),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "createDirectory"));
		}
	}
	
	/**
	 * 파일/폴더 삭제 (내부디렉토리 및 내용 모두 삭제)
	 * @param params
	 * @param session
	 * @return
	 */
	@PostMapping(value="/deleteDirectory")
	public ResponseEntity<Object> deleteDirectory(@RequestBody Map<String, Object> params) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.deleteDirectory(params),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteDirectory"));
		}
	}
	
	/**
	 * 파일/폴더 이름 수정
	 * @param params
	 * @param session
	 * @return
	 */
	@PostMapping(value="/renameFileFolder")
	public ResponseEntity<Object> renameFileFolder(@RequestBody Map<String, Object> params) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.renameFileFolder(params),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "renameFileFolder"));
		}
	}
	
	/**
	 * 데이터 업로드
	 * 
	 * @param multipartFile
	 * @param request
	 * @return
	 */
	@PostMapping(value = "/dataManage/fileUpload")
	public Object fileUpload(@RequestParam("file") MultipartFile multipartFile, @RequestParam("uploadFile") String uploadFile) {
        try {
        	JSONObject result = dataManageRestService.fileUpload(multipartFile, uploadFile);
        	return result;
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "fileUpload"));
		}
	}

	
	
/* ***************************************************** 전처리 데이터 관리 ***************************************************** */
	/**
	 * 전처리 데이터 조회
	 * @return
	 */
	@GetMapping(value="/getPreprocessedDataList")
    public ResponseEntity<Object> getPreprocessedDataList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.getPreprocessedDataList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getPreprocessedDataList"));
		}
    }
	
	/**
	 * 전처리 데이터 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getPreprocessedData/{preprocessedDataSeq}")
	public ResponseEntity<Object> getPreprocessedData(@PathVariable Integer preprocessedDataSeq){
        try {
           	return new ResponseEntity<Object>(dataManageRestService.getPreprocessedData(preprocessedDataSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getPreprocessedData"));
		}
	}
	
	/**
	 * 전처리 데이터 생성
	 * @param params
	 * @return
	 */
	@PostMapping(value="/insertPreprocessedData")
	public ResponseEntity<Object>insertPreprocessedData(@RequestBody PreProcessedData preProcessedData){
		
		try {
        	return new ResponseEntity<Object>(dataManageRestService.insertPreprocessedData(preProcessedData),HttpStatus.OK);
			
		}catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertPreprocessedData"));
		}
	}
	
	/**
	 * 전처리데이터 시작/중지
	 * @param paramMap
	 * @return
	 */
	@PatchMapping(value="/changePreprocessedData")
	public ResponseEntity<Object>changePreprocessedData(@RequestBody PreProcessedData preProcessedData){
		
		try {
        	return new ResponseEntity<Object>(dataManageRestService.changePreprocessedData(preProcessedData),HttpStatus.OK);
			
		}catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "changePreprocessedData"));
		}
	}
	
	/**
	 * 전처리 데이터 삭제
	 * @param preprocessedDataSeq
	 * @return
	 */
	@DeleteMapping(value="/deletePreprocessedData/{preprocessedDataSeq}")
	public ResponseEntity<Object> deletePreprocessedData(@PathVariable Integer preprocessedDataSeq){
        try {
        	return new ResponseEntity<Object>(dataManageRestService.deletePreprocessedData(preprocessedDataSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deletePreprocessedData"));
		}
	}
	
	/**
	 * 전처리데이터 검색조회
	 * @return
	 */
	@PatchMapping(value="/getPreprocessedDataSearchList")
    public ResponseEntity<Object> getPreprocessedDataSearchList(@RequestBody PreProcessedData preProcessedData) {
        try {
        	return new ResponseEntity<Object>(dataManageRestService.getPreprocessedDataSearchList(preProcessedData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getPreprocessedDataSearchList"));
		}
    }
	
}
