package com.daumsoft.taSolutionManager.restFullApi.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.service.AlgorithmRestService;


@RestController
public class AlgorithmRestController{
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AlgorithmRestService algorithmRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;

	/**
	 * 알고리즘 조회
	 * @return
	 */
	@GetMapping(value="/getAlgorithmList")
    public ResponseEntity<Object> getAlgorithmList() {
        try {
        	return new ResponseEntity<Object>(algorithmRestService.getAlgorithmList(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getAlgorithmList"));
		}
    }
	
	/**
	 * 알고림즘 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getAlgorithm/{algorithmSeq}")
	public ResponseEntity<Object> getAlgorithm(@PathVariable Integer algorithmSeq){
        try {
            return new ResponseEntity<Object>(algorithmRestService.getAlgorithm(algorithmSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getAlgorithm"));
		}
	}
	
    
    
}