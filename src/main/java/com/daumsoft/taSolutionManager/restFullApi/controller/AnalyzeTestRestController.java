package com.daumsoft.taSolutionManager.restFullApi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.service.AnalyzeTestRestService;

@RestController
public class AnalyzeTestRestController {

	@Autowired
	AnalyzeTestRestService analyzeTestRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 분석 테스트 조회
	 * @param paramMap
	 * @return
	 */
	@PatchMapping(value="/analyzeTest")
	public ResponseEntity<Object> analyzeTest(@RequestBody Map<String, Object> paramMap){
        try {
        	return new ResponseEntity<Object>(analyzeTestRestService.analyzeTest(paramMap),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "analyzeTest"));
		}
	}
}
