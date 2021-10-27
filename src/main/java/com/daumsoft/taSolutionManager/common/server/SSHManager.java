package com.daumsoft.taSolutionManager.common.server;

import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;


public class SSHManager { 
	private String username = null;
	private String hostname = null;
	private String privateKey;

	private static final Logger logger = LoggerFactory.getLogger(SSHManager.class);
	
	public SSHManager(String username, String hostname, String privateKey) {
		super();
		this.username = username;
		this.hostname = hostname;
		this.privateKey =privateKey;
		
	}

	private Session open() throws Exception{
		Session session;
		JSch jSch = new JSch();
		
		jSch.addIdentity(privateKey.trim());
		
		//make jsch session
		session = jSch.getSession(username, hostname, 22);
		logger.info("## open JSch open Connection : "+username+"@"+hostname+" ##"); 
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config);
 
		session.connect(); 
	
		return session;
	}

	public String runCommand(String base_dir, String command) {
		Session session=null;
		String ret = "";
		String execCommand="cd "+base_dir+" ; "+ command;
		InputStream in =null;
		ChannelExec channel = null;
 
		try {
			session=open(); 
			channel = (ChannelExec) session.openChannel("exec");
			logger.info("Jsch Command : "+execCommand);
 
			channel.setPty(false);
			channel.setCommand(execCommand);
			channel.setErrStream(System.err);
			in = channel.getInputStream();
			channel.connect();
			
			if (!session.isConnected()) {
				throw new RuntimeException("Not connected ot an open session. Call open() first");
			}
			
			ret = getChanneloutput(channel, in);
			logger.info("ExitStatus : "+channel.getExitStatus()+" , result :"+ret); 
		 
		} catch (Exception e1) {
			// TODO Auto-generated catch block 
			logger.info(e1.getMessage());
			return(e1.getMessage());
		}finally{
			if(session!=null){
				session.disconnect();
			}
			if(channel!=null){
				channel.disconnect();
			}
		}
		return ret;
	}
	
	public String runCommandForStop(String base_dir, String command) throws Exception {
		Session session=null;
		String ret = "";
		String execCommand="cd "+base_dir+" ; "+command;
		InputStream in =null;
		ChannelExec channel = null;
 
		try {
			session=open(); 
			channel = (ChannelExec) session.openChannel("exec");
			logger.info("Jsch Command : "+execCommand);
 
			channel.setPty(false); 
			channel.setCommand(execCommand);
			channel.setErrStream(System.err);
			in = channel.getInputStream();
			channel.connect();
			 
			if (!session.isConnected()) {
				throw new RuntimeException("Not connected ot an open session. Call open() first");
			}
			
			ret = getChanneloutput(channel, in);
			logger.info("## runCommandForStop ExitStatus : "+channel.getExitStatus()+"/ result :"+ret+" ##"); 
			
		} catch (Exception e1) {
			// TODO Auto-generated catch block 
			logger.info(e1.getMessage());
			throw e1; 
		}finally{
			if(session!=null){
				session.disconnect();
			}
			if(channel!=null){
				channel.disconnect();
			}
		}
		return ret;
	}
	
	public String runCommandForStart(String base_dir, String stopCommand, String startCommand) throws Exception{
		Session session=null;
		String ret = "";
		String execCommand="cd "+base_dir+" ; "+stopCommand+" ; "+startCommand;
		InputStream in =null;
		ChannelExec channel = null;
		try {
			session=open();
			
			channel = (ChannelExec) session.openChannel("exec"); 
			logger.info("Jsch Command : "+execCommand);
			
			channel.setPty(false); 
			channel.setCommand(execCommand);
			channel.setErrStream(System.err);
			in = channel.getInputStream();
			channel.connect();

			if (!session.isConnected()) {
				throw new RuntimeException("Not connected ot an open session. Call open() first");
			}
			
			ret = getChanneloutput(channel, in);
			logger.info("## runCommandForStart ExitStatus : "+channel.getExitStatus()+"/ result :"+ret+" ##"); 
			 
		} catch (Exception e1) {
			// TODO Auto-generated catch block 
			logger.info(e1.getMessage());
			throw e1;
		}finally{
			if(session!=null){
				session.disconnect();
			}
			if(channel!=null){
				channel.disconnect();
			}
		}
		return ret; 
	}
	
	public String runCommandForState(String base_dir, String command) throws Exception {
		Session session=null;
		String ret = "";
		String execCommand="cd "+base_dir+" ; "+command;
		InputStream in =null;
		ChannelExec channel = null;
 
		try {
			session=open(); 
			channel = (ChannelExec) session.openChannel("exec");
			logger.info("Jsch Command : "+execCommand);
 
			channel.setPty(false); 
			channel.setCommand(execCommand);
			channel.setErrStream(System.err);
			in = channel.getInputStream();
			channel.connect();
			 
			if (!session.isConnected()) {
				throw new RuntimeException("Not connected ot an open session. Call open() first");
			}
			
			ret = getChanneloutput(channel, in);
			logger.info("## runCommandForState ExitStatus : "+channel.getExitStatus()+"/ result :"+ret+" ##"); 
			
		} catch (Exception e1) {
			logger.info(e1.getMessage());
			throw e1; 
		}finally{
			if(session!=null){
				session.disconnect();
			}
			if(channel!=null){
				channel.disconnect();
			}
		}
		return ret;
	}

	private String getChanneloutput(Channel channel, InputStream in) throws Exception {
		byte[] buffer = new byte[1024];
		StringBuilder strBuilder = new StringBuilder();
		String line = "";

		while (true) {
			while (in.available() > 0) {
				int i = in.read(buffer, 0, 1024);
				if (i < 0) {
					break;
				}
				strBuilder.append(new String(buffer, 0, i));
			}
			
			if (line.contains("logout")) {
				break;
			}
			if (channel.isClosed()) {
				break;
			}
			Thread.sleep(1000);
		}
		return strBuilder.toString();
	} 
}
