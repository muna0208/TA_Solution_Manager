package com.daumsoft.taSolutionManager.restFullApi.controller;

import javax.servlet.http.HttpServletRequest;
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
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.service.UserRestService;

@RestController
public class UserRestController {
	
	@Autowired
	private UserRestService userRestService;

	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 사용자 조회
	 * @return
	 */
	@GetMapping(value="/getUserList")
    public ResponseEntity<Object> getUserList() {
        try {
        	return new ResponseEntity<Object>(userRestService.getUserList(),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getUserList"));
		}
    }
	
	/**
	 * 사용자 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getUser/{id}")
	public ResponseEntity<Object> getUser(@PathVariable Integer id){
        try {
            return new ResponseEntity<Object>(userRestService.getUser(id),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getUser"));
		}
	}
	
	/**
	 * 사용자 등록
	 * @param user
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertUser")
	public ResponseEntity<Object> insertUser(@RequestBody User user, HttpSession session){
        try {
        	return new ResponseEntity<Object>(userRestService.insertUser(user, session),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertUser"));
		}
	}
	
	/**
	 * 사용자 수정
	 * @param user
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateUser")
	public ResponseEntity<Object> updateUser(HttpServletRequest request, @RequestBody User user, HttpSession session){
        try {
        	return new ResponseEntity<Object>(userRestService.updateUser(request, session, user),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateUser"));
		}
	}
	
	/**
	 * 사용자 삭제
	 * @param id
	 * @return
	 */
	@DeleteMapping(value="/deleteUser/{id}")
	public ResponseEntity<Object> deleteUser(@PathVariable Integer id){
		try {
        	return new ResponseEntity<Object>(userRestService.deleteUser(id),HttpStatus.OK);
			
		}catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteUser"));
		}
	}
	
	/**
	 * 사용자 찾기
	 * @param user
	 * @return
	 */
	@PatchMapping(value="/login/findUser")
	public ResponseEntity<Object> findUser(@RequestBody User user){
        try {
        	return new ResponseEntity<Object>(userRestService.findUser(user),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "findUser"));
		}
	}
	
	/**
	 * 회원가입
	 * @param user
	 * @param session
	 * @return
	 */
	@PostMapping(value="/login/registUser")
	public ResponseEntity<Object> registUser(@RequestBody User user, HttpSession session){
        try {
        	return new ResponseEntity<Object>(userRestService.insertUser(user, session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "registUser"));
		}
	}
}
