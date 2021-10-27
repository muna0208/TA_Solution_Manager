package com.daumsoft.taSolutionManager.restFullApi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.MonitDicApply;
import com.daumsoft.taSolutionManager.restFullApi.service.ApplyDicRestService;

@RestController
public class ApplyDicRestController {

	@Autowired
	ApplyDicRestService applyDicRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 지식 현황 조회
	 * @return
	 */
	@GetMapping(value="/getApplyDicList")
    public ResponseEntity<Object> getApplyDicList() {
        try {
        	return new ResponseEntity<Object>(applyDicRestService.getApplyDicList(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getApplyDicList"));
		}
    }
	
	
	/**
	 * 지식 적용
	 * @param monitDicApply
	 * @return
	 */
	@PatchMapping(value="/applyDicByAjax")
    public ResponseEntity<Object> applyDicByAjax(@RequestBody MonitDicApply monitDicApply) {
        try {
        	return new ResponseEntity<Object>(applyDicRestService.applyDicByAjax(monitDicApply),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "applyDicByAjax"));
		}
    }
	
}
