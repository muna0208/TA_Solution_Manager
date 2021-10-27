package com.daumsoft.taSolutionManager.restFullApi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphColloc;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphEoj49;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphNm;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphStopword;
import com.daumsoft.taSolutionManager.restFullApi.domain.SearchData;
import com.daumsoft.taSolutionManager.restFullApi.service.MorphDicRestService;

@RestController
public class MorphDicRestController {

	@Autowired
	private MorphDicRestService morphDicRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	
	/**
	 * 코드 조회
	 * @return
	 */
	@GetMapping(value="/getCodeList")
    public ResponseEntity<Object> getCodeList(@RequestParam(value="groupCode") String groupCode) {
        try {
        	return new ResponseEntity<Object>(morphDicRestService.getCodeList(groupCode),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getCodeList"));
		}
    }
	
/************************************************************* 신조어 사전 *************************************************************/
	/**
	 * 신조어 조회
	 * @return
	 */
	@PostMapping(value="/getNmDicList")
    public ResponseEntity<Object> getNmDicList(@ModelAttribute SearchData searchData) {
        try {
        	return new ResponseEntity<Object>(morphDicRestService.getNmDicList(searchData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getNmDicList"));
		}
    }
	
	/**
	 * 신조어 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getNmDic/{nmSeq}")
	public ResponseEntity<Object> getNmDic(@PathVariable Integer nmSeq){
        try {
           	return new ResponseEntity<Object>(morphDicRestService.getNmDic(nmSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getNmDic"));
		}
	}
	
	
	/**
	 * 신조어 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertNmDic")
	public ResponseEntity<Object> insertNmDic(@RequestBody DicMorphNm nmDic){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.insertNmDic(nmDic),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertNmDic"));
		}
	}
	
	/**
	 * 신조어 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateNmDic")
	public ResponseEntity<Object> updateNmDic(@RequestBody DicMorphNm nmDic){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.updateNmDic(nmDic),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateNmDic"));
		}
	}
	
	/**
	 * 신조어 삭제
	 * @param nmSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteNmDic/{nmSeq}")
	public ResponseEntity<Object> deleteNmDic(@PathVariable Integer nmSeq){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.deleteNmDic(nmSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteNmDic"));
		}
	}
	
	
	
/************************************************************* 복합명사 사전 *************************************************************/
	
	/**
	 * 복합명사 조회
	 * @return
	 */
	@PostMapping(value="/getCompDicList")
    public ResponseEntity<Object> getCompDicList(@ModelAttribute SearchData searchData) {
        try {
        	return new ResponseEntity<Object>(morphDicRestService.getCompDicList(searchData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getCompDicList"));
		}
    }
	
	/**
	 * 복합명사 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getCompDic/{compSeq}")
	public ResponseEntity<Object> getCompDic(@PathVariable Integer compSeq){
        try {
           	return new ResponseEntity<Object>(morphDicRestService.getCompDic(compSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getCompDic"));
		}
	}
	
	
	/**
	 * 복합명사 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertCompDic")
	public ResponseEntity<Object> insertCompDic(@RequestBody Map<String, Object> paramMap){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.insertCompDic(paramMap),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertCompDic"));
		}
	}
	
	/**
	 * 복합명사 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateCompDic")
	public ResponseEntity<Object> updateCompDic(@RequestBody Map<String, Object> paramMap){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.updateCompDic(paramMap),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateCompDic"));
		}
	}
	
	/**
	 * 복합명사 삭제
	 * @param compSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteCompDic/{compSeq}")
	public ResponseEntity<Object> deleteCompDic(@PathVariable Integer compSeq){
        try {
        	return new ResponseEntity<Object>(morphDicRestService.deleteCompDic(compSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteCompDic"));
		}
	}
	
	
/************************************************************* 기분석 사전 *************************************************************/

	
	/**
	 * 기분석 조회
	 * @return
	 */
	@PostMapping(value="/getEoj49DicList")
	public ResponseEntity<Object> getEoj49DicList(@ModelAttribute SearchData searchData) {
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.getEoj49DicList(searchData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getEoj49DicList"));
		}
	}
	
	/**
	 * 기분석 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getEoj49Dic/{eoj49Seq}")
	public ResponseEntity<Object> getEoj49Dic(@PathVariable Integer eoj49Seq){
	    try {
	       	return new ResponseEntity<Object>(morphDicRestService.getEoj49Dic(eoj49Seq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getEoj49Dic"));
		}
	}
	
	
	/**
	 * 기분석 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertEoj49Dic")
	public ResponseEntity<Object> insertEoj49Dic(@RequestBody DicMorphEoj49 dicMorphEoj49){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.insertEoj49Dic(dicMorphEoj49),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertEoj49Dic"));
		}
	}
	
	/**
	 * 기분석 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateEoj49Dic")
	public ResponseEntity<Object> updateEoj49Dic(@RequestBody DicMorphEoj49 dicMorphEoj49){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.updateEoj49Dic(dicMorphEoj49),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateEoj49Dic"));
		}
	}
	
	/**
	 * 기분석 삭제
	 * @param eoj49Seq
	 * @return
	 */
	@DeleteMapping(value="/deleteEoj49Dic/{eoj49Seq}")
	public ResponseEntity<Object> deleteEoj49Dic(@PathVariable Integer eoj49Seq){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.deleteEoj49Dic(eoj49Seq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteEoj49Dic"));
		}
	}
/************************************************************* 후처리 사전 *************************************************************/
	
	/**
	 * 후처리 조회
	 * @return
	 */
	@PostMapping(value="/getCollocDicList")
	public ResponseEntity<Object> getCollocDicList(@ModelAttribute SearchData searchData) {
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.getCollocDicList(searchData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getCollocDicList"));
		}
	}
	
	/**
	 * 후처리 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getCollocDic/{collocSeq}")
	public ResponseEntity<Object> getCollocDic(@PathVariable Integer collocSeq){
	    try {
        	return new ResponseEntity<Object>(morphDicRestService.getCollocDic(collocSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getCollocDic"));
		}
	}
	
	
	/**
	 * 후처리 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertCollocDic")
	public ResponseEntity<Object> insertCollocDic(@RequestBody DicMorphColloc dicMorphColloc){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.insertCollocDic(dicMorphColloc),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertCollocDic"));
		}
	}
	
	/**
	 * 후처리 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateCollocDic")
	public ResponseEntity<Object> updateCollocDic(@RequestBody DicMorphColloc dicMorphColloc){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.updateCollocDic(dicMorphColloc),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateCollocDic"));
		}
	}
	
	/**
	 * 후처리 삭제
	 * @param collocSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteCollocDic/{collocSeq}")
	public ResponseEntity<Object> deleteCollocDic(@PathVariable Integer collocSeq){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.deleteCollocDic(collocSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteCollocDic"));
		}
	}
	
/************************************************************* 불용어 사전 *************************************************************/
	/**
	 * 불용어 조회
	 * @return
	 */
	@PostMapping(value="/getStopWordDicList")
	public ResponseEntity<Object> getStopWordDicList(@ModelAttribute SearchData searchData) {
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.getStopWordDicList(searchData),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getStopWordDicList"));
		}
	}
	
	/**
	 * 불용어 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getStopWordDic/{stopWordSeq}")
	public ResponseEntity<Object> getStopWordDic(@PathVariable Integer stopWordSeq){
	    try {
        	return new ResponseEntity<Object>(morphDicRestService.getStopWordDic(stopWordSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getStopWordDic"));
		}
	}
	
	
	/**
	 * 불용어 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertStopWordDic")
	public ResponseEntity<Object> insertStopWordDic(@RequestBody DicMorphStopword dicMorphStopword){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.insertStopWordDic(dicMorphStopword),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertStopWordDic"));
		}
	}
	
	/**
	 * 불용어 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateStopWordDic")
	public ResponseEntity<Object> updateStopWordDic(@RequestBody DicMorphStopword dicMorphStopword){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.updateStopWordDic(dicMorphStopword),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateStopWordDic"));
		}
	}
	
	/**
	 * 불용어 삭제
	 * @param stopWordSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteStopWordDic/{stopWordSeq}")
	public ResponseEntity<Object> deleteStopWordDic(@PathVariable Integer stopWordSeq){
	    try {
	    	return new ResponseEntity<Object>(morphDicRestService.deleteStopWordDic(stopWordSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteStopWordDic"));
		}
	}
	
}
