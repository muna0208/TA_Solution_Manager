package com.daumsoft.taSolutionManager.restFullApi.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.daumsoft.taSolutionManager.common.service.RestFullExceptionService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.BatchService;
import com.daumsoft.taSolutionManager.restFullApi.service.BatchRestService;

@RestController
public class BatchRestController {

	@Autowired
	private BatchRestService batchRestService;

	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 배치 조회
	 * @return
	 */
	@GetMapping(value="/getBatchList")
    public ResponseEntity<Object> getBatchList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(batchRestService.getBatchList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getBatchList"));
		}
    }
	
	/**
	 * 배치 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getBatch/{batchServiceSeq}")
	public ResponseEntity<Object> getBatch(@PathVariable Integer batchServiceSeq){
        try {
            return new ResponseEntity<Object>(batchRestService.getBatch(batchServiceSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getBatch"));
		}
	}
	
	/**
	 * 배치 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertBatch")
	public ResponseEntity<Object> insertBatch(@RequestBody BatchService batch){
        try {
        	return new ResponseEntity<Object>(batchRestService.insertBatch(batch),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertBatch"));
		}
	}
	
	/**
	 * 배치 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateBatch")
	public ResponseEntity<Object> updateBatch(@RequestBody BatchService batch){
        try {
        	return new ResponseEntity<Object>(batchRestService.updateBatch(batch),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateBatch"));
		}
	}
	
	/**
	 * 배치 삭제
	 * @param batchServiceSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteBatch/{batchServiceSeq}")
	public ResponseEntity<Object> deleteBatch(@PathVariable Integer batchServiceSeq){
        try {
        	return new ResponseEntity<Object>(batchRestService.deleteBatch(batchServiceSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteBatch"));
		}
	}
	
	/**
	 * 배치 시작/중지
	 * @param batch
	 * @return
	 */
	@PatchMapping(value="/commandBatch")
	public ResponseEntity<Object> commandBatch(@RequestBody BatchService batch){
        try {
        	return new ResponseEntity<Object>(batchRestService.commandBatch(batch),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "commandBatch"));
		}
	}
}
