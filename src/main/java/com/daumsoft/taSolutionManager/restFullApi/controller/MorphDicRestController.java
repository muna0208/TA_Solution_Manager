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
	 * ์ฝ๋ ์กฐํ
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
	
/************************************************************* ์?์กฐ์ด ์ฌ์? *************************************************************/
	/**
	 * ์?์กฐ์ด ์กฐํ
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
	 * ์?์กฐ์ด ์์ธ์กฐํ
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
	 * ์?์กฐ์ด ๋ฑ๋ก
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
	 * ์?์กฐ์ด ์์?
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
	 * ์?์กฐ์ด ์ญ์?
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
	
	
	
/************************************************************* ๋ณตํฉ๋ช์ฌ ์ฌ์? *************************************************************/
	
	/**
	 * ๋ณตํฉ๋ช์ฌ ์กฐํ
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
	 * ๋ณตํฉ๋ช์ฌ ์์ธ์กฐํ
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
	 * ๋ณตํฉ๋ช์ฌ ๋ฑ๋ก
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
	 * ๋ณตํฉ๋ช์ฌ ์์?
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
	 * ๋ณตํฉ๋ช์ฌ ์ญ์?
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
	
	
/************************************************************* ๊ธฐ๋ถ์ ์ฌ์? *************************************************************/

	
	/**
	 * ๊ธฐ๋ถ์ ์กฐํ
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
	 * ๊ธฐ๋ถ์ ์์ธ์กฐํ
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
	 * ๊ธฐ๋ถ์ ๋ฑ๋ก
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
	 * ๊ธฐ๋ถ์ ์์?
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
	 * ๊ธฐ๋ถ์ ์ญ์?
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
/************************************************************* ํ์ฒ๋ฆฌ ์ฌ์? *************************************************************/
	
	/**
	 * ํ์ฒ๋ฆฌ ์กฐํ
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
	 * ํ์ฒ๋ฆฌ ์์ธ์กฐํ
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
	 * ํ์ฒ๋ฆฌ ๋ฑ๋ก
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
	 * ํ์ฒ๋ฆฌ ์์?
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
	 * ํ์ฒ๋ฆฌ ์ญ์?
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
	
/************************************************************* ๋ถ์ฉ์ด ์ฌ์? *************************************************************/
	/**
	 * ๋ถ์ฉ์ด ์กฐํ
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
	 * ๋ถ์ฉ์ด ์์ธ์กฐํ
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
	 * ๋ถ์ฉ์ด ๋ฑ๋ก
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
	 * ๋ถ์ฉ์ด ์์?
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
	 * ๋ถ์ฉ์ด ์ญ์?
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
