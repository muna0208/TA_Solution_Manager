package com.daumsoft.taSolutionManager.common.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import ds.aisolution.tm.management.api.TMMGAPIRunner;


@Service
@Async("threadPoolTaskExecutor")
public class AsyncService {
	
	private Logger logger = LoggerFactory.getLogger(AsyncService.class);
	
	/**
	 * 지식 적용
	 * @param args
	 */
	@SuppressWarnings("static-access")
	public void applyDicAsync(String[] args) {

		logger.info("##### Call TMMGAPIRunner.apiDicApply #####");
		for( String arg : args) logger.info("args : "+arg);

		TMMGAPIRunner runner = new TMMGAPIRunner();
		int returnCode = runner.apiDicApply(args);

		logger.info("TMMGAPIRunner return: "+runner.returnCodeToMSG(returnCode));
		logger.info("##### End TMMGAPIRunner.apiDicApply #####");
	}
}
