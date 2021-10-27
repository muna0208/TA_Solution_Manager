package com.daumsoft.taSolutionManager.restFullApi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.service.PreprocessorRestService;

@RestController
public class PreprocessorRestController {

	@Autowired
	private PreprocessorRestService preprocessorRestService;

	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 전처리기 조회
	 * @return
	 */
	@GetMapping(value="/getPreprocessorList")
    public ResponseEntity<Object> getPreprocessorList() {
        try {
        	return new ResponseEntity<Object>(preprocessorRestService.getPreprocessorList(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getPreprocessorList"));
		}
    }
	
	/**
	 * 전처리기 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getPreprocessor/{preprocessorSeq}")
	public ResponseEntity<Object> getPreprocessor(@PathVariable Integer preprocessorSeq){
        try {
            return new ResponseEntity<Object>(preprocessorRestService.getPreprocessor(preprocessorSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getPreprocessor"));
		}
	}
}
