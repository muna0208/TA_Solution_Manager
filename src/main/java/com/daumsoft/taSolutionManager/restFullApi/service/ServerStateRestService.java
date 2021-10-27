package com.daumsoft.taSolutionManager.restFullApi.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.server.SSHManager;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.MonitServer;
import com.daumsoft.taSolutionManager.restFullApi.mapper.ServerStateRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class ServerStateRestService {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	ServerStateRestMapper serverStateRestMapper;
	
	@Value("${ssh.rsakey}")
	private String sshRsaKey;
	
	@Value("${checklinuxCommand}")
	private String checklinuxCommand;
	
	@Value("${isLocalTest}")
	private boolean isLocalTest;
	
	

	/**
	 * 서버 구동 현황 조회
	 * @return
	 * @throws Exception 
	 */
	
	public Object getServerStateList() throws Exception {
		JSONObject result = new JSONObject();
		JSONArray jsonArr = new JSONArray();
		
		List<MonitServer> list = serverStateRestMapper.getServerStateList();
		MonitServer monitServer = null;
		
		for (MonitServer server : list) {
			if( MakeUtil.isNotNullAndEmpty(server) ) {
				// 서버 상태 체크
				if( "REQUEST".equals(server.getState()) ) {	// 서버 요청
					
					if( "127.0.0.1".equals(server.getIp()) || getServerIp().equals(server.getIp()) ) {
						// command 실행
						result = doCommand(server, "STATE");			
					}else {
						// ssh command 실행
						result = doSSHCommand(server, "STATE");		
					}
					
					
					if( "success".equals(result.get("result")) ){
						logger.info("getServerStateList 요청완료 서버: "+result.toString());
						String resultMsg = ""+result.get("resultMsg");
						
						monitServer = new MonitServer();
						monitServer.setServerSeq(server.getServerSeq());
						
						String[] resultMsgs = resultMsg.split("\n");
						boolean flag = false;
						for( String msg : resultMsgs ) {
							if( !msg.contains("grep") ) flag = true;
						}
						
						if( flag )	monitServer.setState("START");
						else monitServer.setState("STOP");
						
						logger.info("## server state: "+monitServer.getState()+" ##");
						serverStateRestMapper.updateServer(monitServer);
						
					}else if( "error".equals(result.get("result")) ){
						monitServer = new MonitServer();
						monitServer.setServerSeq(server.getServerSeq());
						monitServer.setState("ERROR");
						logger.info("## server state: "+monitServer.getState()+" ##");
						logger.info("## error resultMsg: "+result.get("errorMsg")+" ##");
						serverStateRestMapper.updateServer(monitServer);
						return result;
					}
				}
				
				jsonArr.add(new JSONObject().fromObject(server));
			}
		}
		
		return jsonArr;
	}

	/**
	 * 서버 구동 현황 상세조회
	 * @param nmSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getServerState(Integer serverSeq) throws Exception {
		MonitServer detail = serverStateRestMapper.getServerState(serverSeq);
		return new JSONObject().fromObject(detail);
	}
	
	/**
	 * 서버 등록
	 * @param monitServer
	 * @return
	 */
	public JSONObject insertServer(MonitServer monitServer) throws Exception {
		JSONObject result = new JSONObject();
		
		// 서버 중복체크
		int checkCnt = serverStateRestMapper.duplicateCheckServer(monitServer);
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","이미 등록되어 있습니다.");
			return result;
		}
		
		// 위험한 linux command 체크
		if( checkLinuxCommand(monitServer.getCommandRun())
				|| checkLinuxCommand(monitServer.getCommandKill())
				|| checkLinuxCommand(monitServer.getCommandState()) ) {
			result.put("result", "error");
			result.put("errorMsg", "사용 불가능한 명령어입니다.");
			return result;
		}

		serverStateRestMapper.insertServer(monitServer);
		result.put("result", "success");			
		return result;
	}

	/**
	 * 서버 수정
	 * @param monitServer
	 * @return
	 */
	public JSONObject updateServer(MonitServer monitServer) throws Exception {
		JSONObject result = new JSONObject();
		
		// 위험한 linux command 체크
		if( checkLinuxCommand(monitServer.getCommandRun())
				|| checkLinuxCommand(monitServer.getCommandKill())
				|| checkLinuxCommand(monitServer.getCommandState()) ) {
			result.put("result", "error");
			result.put("errorMsg", "사용 불가능한 명령어입니다.");
			return result;
		}
		
		serverStateRestMapper.updateServer(monitServer);
		result.put("result", "success");			
		return result;
	}

	/**
	 * 서버 삭제
	 * @param nmSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteServer(Integer serverSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		serverStateRestMapper.deleteServer(serverSeq);
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 서버 시작/중지
	 * @param paramServer
	 * @return
	 */
	public JSONObject commandServer(MonitServer paramServer) throws Exception{
		JSONObject result = new JSONObject();
		
		// 서버 시작/중지 
		MonitServer monitServer = serverStateRestMapper.getServerState(paramServer.getServerSeq());
		logger.info("## commandServer server: "+paramServer.getState()+" ##");
		
		if( "127.0.0.1".equals(monitServer.getIp()) || getServerIp().equals(monitServer.getIp()) ) {
			// command 실행
			result = doCommand(monitServer, paramServer.getState());
		}else {
			// ssh command 실행
			result = doSSHCommand(monitServer, paramServer.getState());		
		}
		
		/* 업데이트 */
		if( "success".equals(result.get("result")) ){
			monitServer.setState("REQUEST");
			serverStateRestMapper.updateServer(monitServer);
			
		}else if( "error".equals(result.get("result")) ){
			monitServer = new MonitServer();
			monitServer.setServerSeq(monitServer.getServerSeq());
			monitServer.setState("ERROR");
			logger.info("## server state: "+monitServer.getState()+" ##");
			logger.info("## error resultMsg: "+result.get("errorMsg")+" ##");
			serverStateRestMapper.updateServer(monitServer);	
		}
		
		return result;
	}
	
	/**
	 * 서버 IP
	 * @return
	 * @throws UnknownHostException
	 */
	public String getServerIp() throws UnknownHostException {
		InetAddress local;
		local = InetAddress.getLocalHost();
		String ip = local.getHostAddress();
		logger.info("## myIp ip: "+ip+" ##");
		
		return ip;
	}
	
	/**
	 * command 실행
	 * @param monitServer
	 * @param option
	 * @return
	 */
	public JSONObject doCommand(MonitServer monitServer, String option) {
		logger.info("## doCommand server: "+monitServer.getServiceName()+", option: "+option+" ##");
		JSONObject result = new JSONObject();
		List<String> cmdList = new ArrayList<String>();
        StringBuffer successOutput = new StringBuffer(); // 성공 스트링 버퍼
        StringBuffer errorOutput = new StringBuffer(); // 오류 스트링 버퍼
        BufferedReader successBufferReader = null; // 성공 버퍼
        BufferedReader errorBufferReader = null; // 오류 버퍼
		Process process = null;
		ProcessBuilder runBuilder = null;
		String line;
		
		try {
			cmdList.add("/bin/sh");
			cmdList.add("-c");
			// 서버 시작
			if( "START".equals(option) ) {
				String commandRun = ""+monitServer.getCommandRun();
				if( commandRun.contains(",") ) {
					String[] cmds = commandRun.split(",");
					for(String cmd : cmds ) {
						cmdList.add(cmd);
					}					
				}else {
					cmdList.add(commandRun);	
				}
				
			// 서버 중지
			}else if( "STOP".equals(option) ) {
				String commandKill = ""+monitServer.getCommandKill();
				if( commandKill.contains(",") ) {
					String[] cmds = commandKill.split(",");
					for(String cmd : cmds ) {
						cmdList.add(cmd);
					}					
				}else {
					cmdList.add(commandKill);	
				}
			
			// 서버 상태 체크
			}else {
				cmdList.add(""+monitServer.getCommandState());
			}
			
			logger.info("## doCommand command: "+cmdList.toString());
			
			runBuilder = new ProcessBuilder(cmdList);
			runBuilder.directory(new File(""+monitServer.getModulePath()));
			process = runBuilder.start();
			
			// shell 실행이 정상 동작했을 경우
            successBufferReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
            while ((line = successBufferReader.readLine()) != null) {
                successOutput.append(line+"\n");
            }
 
            // shell 실행시 에러가 발생했을 경우
            errorBufferReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "EUC-KR"));
            while ((line = errorBufferReader.readLine()) != null) {
            	errorOutput.append(line+"\n");
            }
 
            // 프로세스의 수행이 끝날때까지 대기
            process.waitFor();
            if (process.exitValue() == 0) {
            	result.put("result", "success");
            	result.put("resultMsg", successOutput.toString());
            } else {
            	result.put("result", "error");
            	result.put("errorMsg", errorOutput.toString());
            }
			
            logger.info("## doCommand result: "+result+" ##");
            
		} catch (Exception e) {
			result.put("result", "error");
			result.put("errorMsg", MakeUtil.printErrorLogger(e, "doCommand Exception"));
			if( e.toString().contains("Auth fail") ) {
				result.put("errorMsg", "접속 권한이 없습니다.");
			}
		}finally {
			try {
				if( successBufferReader != null ) successBufferReader.close();
				if( errorBufferReader != null )	errorBufferReader.close();
			} catch (IOException e) {
				MakeUtil.printErrorLogger(e, "doCommand Error");
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
	/**
	 * ssh command 실행
	 * @param monitServer
	 * @param option
	 * @return
	 */
	public JSONObject doSSHCommand(MonitServer monitServer, String option) {
		logger.info("## doSSHCommand option: "+option+" ##");
		JSONObject result = new JSONObject();
		String username = ""+monitServer.getConnectId();
		String hostname = ""+monitServer.getIp();
		String command = "";
		String base_dir = ""+monitServer.getModulePath();
		String resultMsg = "";
		
		try {
			
			SSHManager sshManager = new SSHManager(username, hostname, sshRsaKey);
			// 서버 시작
			if( "START".equals(option) ) {
				command = ""+monitServer.getCommandRun();
			
			// 서버 중지
			}else if( "STOP".equals(option) ) {
				command = ""+monitServer.getCommandKill();
			
			// 서버 상태 체크
			}else {
				command = ""+monitServer.getCommandState();
			}
			
			if ( command == null || command.equals("null") || command.equals("") ){
				result.put("errorMsg", "등록된 명령어가 없습니다.");
				return result;
			}
			
			resultMsg = sshManager.runCommand(base_dir, command);
			logger.info("## doSSHCommand resultMsg: "+resultMsg+" ##");
			
			result.put("resultMsg", resultMsg);
			result.put("result", "success");
			
			if( resultMsg.contains("Auth fail") ) {
				result.put("result", "error");
				result.put("errorMsg", "접속 권한이 없습니다.");
			}
			
			logger.info("## doSSHCommand result: "+result+" ##");
			
		} catch (Exception e) {
			logger.info("## doSSHCommand Exception: "+e.toString()+" ##");
			String errorMsg = "";
			if( e.toString().contains("Auth fail") ) {
				errorMsg = "접속 권한이 없습니다.";
			}
			result.put("result", "error");
			result.put("errorMsg", errorMsg);
		}
		
		return result;
	}
	
	/**
	 * 위험한 linux command 체크
	 * @param cmd
	 * @return
	 */
	public boolean checkLinuxCommand(String cmd) {
		if( MakeUtil.isNotNullAndEmpty(cmd) ) {
			String[] chkCmds = checklinuxCommand.split(",",-1);
			for( String chkCmd : chkCmds ) {
				if( MakeUtil.isNotNullAndEmpty(chkCmd) && cmd.contains(chkCmd) ) 
					return true;
			}
		}
		
		return false;
	}

	/**
	 * 서버 새로고침
	 * @return
	 */
	public JSONObject refreshServerByAjax() {
		JSONObject result = new JSONObject();
		if( !isLocalTest ) {
			List<MonitServer> list = serverStateRestMapper.getServerStateList();
			for (MonitServer server : list) {
				if( MakeUtil.isNotNullAndEmpty(server) ) {
					result = new JSONObject();
					// 서버 상태 체크
					try {
						if( "127.0.0.1".equals(server.getIp()) || getServerIp().equals(server.getIp()) ) {
							// command 실행
							result = doCommand(server, "STATE");			
						}else {
							// ssh command 실행
							result = doSSHCommand(server, "STATE");
						}
						
						if( "success".equals(result.get("result")) ){
							logger.info("##### getServerStateList 요청완료 서버: "+result.toString() +" #####");
							String resultMsg = ""+result.get("resultMsg");
							MonitServer monitServer = new MonitServer();
							monitServer.setServerSeq(server.getServerSeq());
							
							String[] resultMsgs = resultMsg.split("\n");
							boolean flag = false;
							for( String msg : resultMsgs ) {
								if( !msg.contains("grep") ) flag = true;
							}
							
							if( flag )	monitServer.setState("START");
							else monitServer.setState("STOP");
							
							serverStateRestMapper.updateServer(monitServer);
						}
						
					} catch (Exception e) {
						MakeUtil.printErrorLogger(e, "refreshServerByAjax");
					}
				}
			}
		}else {
			result.put("result", "success");
		}
		return result;
	}
}
