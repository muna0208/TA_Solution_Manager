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
import com.daumsoft.taSolutionManager.restFullApi.domain.DemonService;
import com.daumsoft.taSolutionManager.restFullApi.service.DemonRestService;

@RestController
public class DemonRestController {

	@Autowired
	private DemonRestService demonRestService;

	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 데몬 조회
	 * @return
	 */
	@GetMapping(value="/getDemonList")
    public ResponseEntity<Object> getDemonList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(demonRestService.getDemonList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getDemonList"));
		}
    }
	
	/**
	 * 데몬 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getDemon/{demonServiceSeq}")
	public ResponseEntity<Object> getDemon(@PathVariable Integer demonServiceSeq){
        try {
           	return new ResponseEntity<Object>(demonRestService.getDemon(demonServiceSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getDemon"));
		}
	}
	
	/**
	 * 데몬 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertDemon")
	public ResponseEntity<Object> insertDemon(@RequestBody DemonService demon){
        try {
        	return new ResponseEntity<Object>(demonRestService.insertDemon(demon),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertDemon"));
		}
	}
	
	/**
	 * 데몬 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateDemon")
	public ResponseEntity<Object> updateDemon(@RequestBody DemonService demon){
        try {
        	return new ResponseEntity<Object>(demonRestService.updateDemon(demon),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateDemon"));
		}
	}
	
	/**
	 * 데몬 삭제
	 * @param demonServiceSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteDemon/{demonServiceSeq}")
	public ResponseEntity<Object> deleteDemon(@PathVariable Integer demonServiceSeq){
        try {
        	return new ResponseEntity<Object>(demonRestService.deleteDemon(demonServiceSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteDemon"));
		}
	}
	
	/**
	 * 데몬 실행
	 * @param demon
	 * @return
	 */
	@PostMapping(value="/commandDemon")
	public ResponseEntity<Object> commandDemon(@RequestBody DemonService demon){
        try {
        	return new ResponseEntity<Object>(demonRestService.commandDemon(demon),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "commandDemon"));
		}
	}
}
