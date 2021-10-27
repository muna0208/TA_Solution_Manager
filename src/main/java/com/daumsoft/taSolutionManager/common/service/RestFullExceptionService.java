package com.daumsoft.taSolutionManager.common.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import net.sf.json.JSONObject;

@Component
public class RestFullExceptionService {
	
	public ResponseEntity<Object> exceptionFailed(String errorMessage){
		JSONObject result = new JSONObject();
		result.put("result", "error");
		result.put("errorMessage", errorMessage.toString());
		return new ResponseEntity<Object>(result,HttpStatus.EXPECTATION_FAILED);
	}
	
	public ResponseEntity<Object> exceptionBadRequest(String errorMessage){
		JSONObject result = new JSONObject();
		result.put("result", "error");
		result.put("errorMessage", errorMessage);
		return new ResponseEntity<Object>(result,HttpStatus.BAD_REQUEST);
	}
}
