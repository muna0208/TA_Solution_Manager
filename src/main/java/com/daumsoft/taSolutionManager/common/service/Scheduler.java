package com.daumsoft.taSolutionManager.common.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.MonitServer;
import com.daumsoft.taSolutionManager.restFullApi.mapper.ServerStateRestMapper;
import com.daumsoft.taSolutionManager.restFullApi.service.ServerStateRestService;

import net.sf.json.JSONObject;

@Component
public class Scheduler {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	ServerStateRestService serverStateRestService;
	
	@Autowired
	ServerStateRestMapper serverStateRestMapper;
	
	@Value("${isLocalTest}")
	private boolean isLocalTest;
	
	/* 10분에 한번씩 체크 */
	@Scheduled(fixedDelay = 600000)
	public void serverStateCheck() {
		logger.info("######################### serverStateCheck Start #########################");
		JSONObject result = new JSONObject();
		
		if( !isLocalTest ) {
			List<MonitServer> list = serverStateRestMapper.getServerStateList();
			for (MonitServer server : list) {
				if( MakeUtil.isNotNullAndEmpty(server) ) {
					// 서버 상태 체크
					try {
						if( "127.0.0.1".equals(server.getIp()) || serverStateRestService.getServerIp().equals(server.getIp()) ) {
							// command 실행
							result = serverStateRestService.doCommand(server, "STATE");			
						}else {
							// ssh command 실행
							result = serverStateRestService.doSSHCommand(server, "STATE");
						}
						
						MonitServer serverInfo = new MonitServer();
						serverInfo.setServerSeq(server.getServerSeq());
						
						if( "success".equals(result.get("result")) ){
							logger.info("##### getServerStateList 요청완료 서버: "+result.toString() +" #####");
							String resultMsg = ""+result.get("resultMsg");
							
							
							
							String[] resultMsgs = resultMsg.split("\n");
							boolean flag = false;
							for( String msg : resultMsgs ) {
								if( !msg.contains("grep") ) flag = true;
							}
							
							if( flag )	serverInfo.setState("START");
							else serverInfo.setState("STOP");
							
							serverStateRestMapper.updateServer(serverInfo);
							
						}else if( "error".equals(result.get("result")) ){
							serverInfo.setState("ERROR");
							logger.info("## server state: "+serverInfo.getState()+" ##");
							logger.info("## error resultMsg: "+result.get("errorMsg")+" ##");
							serverStateRestMapper.updateServer(serverInfo);
						}
						
					} catch (Exception e) {
						MakeUtil.printErrorLogger(e, "##### serverStateCheck #####");
					}
				}
			}
		}
		
		logger.info("######################### serverStateCheck End #########################");
	}
	
}
