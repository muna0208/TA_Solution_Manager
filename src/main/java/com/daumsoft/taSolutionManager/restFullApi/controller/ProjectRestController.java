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
import com.daumsoft.taSolutionManager.restFullApi.domain.Model;
import com.daumsoft.taSolutionManager.restFullApi.domain.Project;
import com.daumsoft.taSolutionManager.restFullApi.service.ProjectRestService;

@RestController
public class ProjectRestController {
	
	@Autowired
	private ProjectRestService projectRestService;
	
	@Autowired
	private RestFullExceptionService restFullExceptionService;
	
	/**
	 * 프로젝트 조회
	 * @return
	 */
	@GetMapping(value="/getProjectList")
    public ResponseEntity<Object> getProjectList(HttpSession session) {
        try {
        	return new ResponseEntity<Object>(projectRestService.getProjectList(session),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getProjectList"));
		}
    }
	
	/**
	 * 프로젝트 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getProject/{projectSeq}")
	public ResponseEntity<Object> getProject(@PathVariable Integer projectSeq){
        try {
           	return new ResponseEntity<Object>(projectRestService.getProject(projectSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getProject"));
		}
	}
	
	/**
	 * 프로젝트 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertProject")
	public ResponseEntity<Object> insertProject(@RequestBody Project project){
        try {
        	return new ResponseEntity<Object>(projectRestService.insertProject(project),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertProject"));
		}
	}
	
	/**
	 * 프로젝트 수정
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PatchMapping(value="/updateProject")
	public ResponseEntity<Object> updateProject(@RequestBody Project project){
        try {
        	return new ResponseEntity<Object>(projectRestService.updateProject(project),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "updateProject"));
		}
	}
	
	/**
	 * 프로젝트 삭제
	 * @param projectSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteProject/{projectSeq}")
	public ResponseEntity<Object> deleteProject(@PathVariable Integer projectSeq){
        try {
        	return new ResponseEntity<Object>(projectRestService.deleteProject(projectSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteProject"));
		}
	}
	
	
	/**
	 * 모델 조회
	 * @return
	 */
	@GetMapping(value="/getModelList/{projectSeq}")
    public ResponseEntity<Object> getModelList(@PathVariable Integer projectSeq) {
        try {
        	return new ResponseEntity<Object>(projectRestService.getModelList(projectSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getModelList"));
		}
    }
	
	/**
	 * 모델 상세조회
	 * @param id
	 * @return
	 */
	@GetMapping(value="/getModel/{modelSeq}")
	public ResponseEntity<Object> getModel(@PathVariable Integer modelSeq){
        try {
           	return new ResponseEntity<Object>(projectRestService.getModel(modelSeq),HttpStatus.OK);	
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getModel"));
		}
	}
	
	/**
	 * 모델 등록
	 * @param userInfo
	 * @param session
	 * @return
	 */
	@PostMapping(value="/insertModel")
	public ResponseEntity<Object> insertModel(@RequestBody Model model){
        try {
        	return new ResponseEntity<Object>(projectRestService.insertModel(model),HttpStatus.CREATED);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "insertModel"));
		}
	}
	
	
	/**
	 * 모델 삭제
	 * @param modelSeq
	 * @return
	 */
	@DeleteMapping(value="/deleteModel/{modelSeq}")
	public ResponseEntity<Object> deleteModel(@PathVariable Integer modelSeq){
        try {
        	return new ResponseEntity<Object>(projectRestService.deleteModel(modelSeq),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "deleteModel"));
		}
	}
	
	/**
	 * 학습/평가 실행/중지
	 * @param paramMap
	 * @return
	 */
	@PatchMapping(value="/modelCommand")
	public ResponseEntity<Object> modelCommand(@RequestBody Model model){
        try {
        	return new ResponseEntity<Object>(projectRestService.modelCommand(model),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "modelCommand"));
		}
	}
	
	/**
	 * 모델 검색 조회
	 * @param paramMap
	 * @return
	 */
	@PatchMapping(value="/getModelSearchList/{projectSeq}")
	public ResponseEntity<Object> getModelSearchList(@PathVariable Integer projectSeq, @RequestBody Model model){
        try {
        	return new ResponseEntity<Object>(projectRestService.getModelSearchList(projectSeq, model),HttpStatus.OK);
		} catch (Exception e) {
			return restFullExceptionService.exceptionFailed(MakeUtil.printErrorLogger(e, "getModelSearchList"));
		}
	}

}
