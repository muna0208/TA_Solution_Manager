package com.daumsoft.taSolutionManager.restFullApi.controller;

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
import com.daumsoft.taSolutionManager.restFullApi.domain.MonitServer;
import com.daumsoft.taSolutionManager.restFullApi.service.ServerStateRestService;

@RestController
public class ServerStateRestController {

	@Autowired
	ServerStateRestService serverStateRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 서버 구동 현황 조회
	 * @param searchData
	 * @return
	 */
	@GetMapping(value="/getServerStateList")
    public ResponseEntity<Object> getServerStateList() {
        try {
        	return new ResponseEntity<Object>(serverStateRestService.getServerStateList(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getServerStateList"));
		}
    }
	
	/**
	 * 서버 구동 현황 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getServerState/{serverSeq}")
	public ResponseEntity<Object> getServerState(@PathVariable Integer serverSeq){
        try {
           	return new ResponseEntity<Object>(serverStateRestService.getServerState(serverSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getServerState"));
		}
	}
	
	/**
	 * 서버 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertServer")
	public ResponseEntity<Object> insertServer(@RequestBody MonitServer monitServer){
        try {
        	return new ResponseEntity<Object>(serverStateRestService.insertServer(monitServer),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertServer"));
		}
	}
	
	/**
	 * 서버 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateServer")
	public ResponseEntity<Object> updateServer(@RequestBody MonitServer monitServer){
        try {
        	return new ResponseEntity<Object>(serverStateRestService.updateServer(monitServer),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateServer"));
		}
	}
	
	/**
	 * 서버 삭제
	 * @param nmSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteServer/{serverSeq}")
	public ResponseEntity<Object> deleteServer(@PathVariable Integer serverSeq){
        try {
        	return new ResponseEntity<Object>(serverStateRestService.deleteServer(serverSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteServer"));
		}
	}
	
	/**
	 * 서버 시작/중지
	 * @param paramServer
	 * @return
	 */
	@PatchMapping(value="/commandServer")
	public ResponseEntity<Object> commandServer(@RequestBody MonitServer paramServer){
        try {
        	return new ResponseEntity<Object>(serverStateRestService.commandServer(paramServer),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "commandServer"));
		}
	}
	
	
	/**
	 * 서버 새로고침
	 * @return
	 */
	@GetMapping(value="/refreshServerByAjax")
    public ResponseEntity<Object> refreshServerByAjax() {
        try {
        	return new ResponseEntity<Object>(serverStateRestService.refreshServerByAjax(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "refreshServerByAjax"));
		}
    }
}
