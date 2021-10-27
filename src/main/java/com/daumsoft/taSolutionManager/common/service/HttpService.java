package com.daumsoft.taSolutionManager.common.service;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.daumsoft.taSolutionManager.common.utils.FileUtil;

import net.sf.json.JSONObject;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Component
public class HttpService {

	private Logger logger = LoggerFactory.getLogger(HttpService.class);
	private int TIMEOUT_VALUE =180000;   // 3분
	
	private OkHttpClient client;
	
	public HttpService() {
		try {
			client = new OkHttpClient();
			OkHttpClient.Builder builder = new OkHttpClient.Builder();
			builder.connectTimeout(2, TimeUnit.MINUTES); 
            builder.readTimeout(2, TimeUnit.MINUTES); 
            builder.writeTimeout(2, TimeUnit.MINUTES); 
            client = builder.build();
            
            logger.info("--- HttpService : Set client ");
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("--- HttpService : "+e.toString());
		}
	}

	/**
	 * HttpService GET 
	 * @param connUrl
	 * @return
	 * @throws IOException
	 */
	public JSONObject httpServiceGET(String connUrl) throws Exception{
		logger.info("--- httpServiceGET connUrl: "+connUrl+" ---");
		JSONObject result = new JSONObject();
		Request request = null;
		
		request = new Request.Builder().url(connUrl).build();
		String resMessage = "";
		
		Response response = client.newCall(request).execute();
		resMessage = response.body().string();
		
		result.put("code", ""+response.code());
		result.put("message", response.message());
		result.put("data", resMessage);
		
		response.body().close();
		logger.info("--- httpServiceGET result : "+result.toString());
		return result;
	}
	
	/**
	 * httpService POST
	 * @param connUrl
	 * @param jsonMessage
	 * @return
	 * @throws IOException
	 */
	public JSONObject httpServicePOST(String connUrl, String jsonMessage) throws Exception{
		logger.info("--- httpServicePOST connUrl: "+connUrl+", jsonMessage: "+jsonMessage+" ---");
		JSONObject result = new JSONObject();
		Request okRequest = null;
		Response response = null;
		String resMessage = "";
		
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),jsonMessage.toString());
		okRequest = new Request.Builder().url(connUrl).post(requestBody).build();
		
		response = client.newCall(okRequest).execute();
		resMessage = response.body().string();
		
		result.put("code", ""+response.code());
		result.put("message", response.message());
		result.put("data", resMessage);
		
		response.body().close();
		logger.info("--- httpServicePOST result : "+result.toString());
		return result;
		
	}
	
	/**
	 * httpService PATCH
	 * @param connUrl
	 * @param jsonMessage
	 * @param option
	 * @return
	 * @throws Exception
	 */
	public JSONObject httpServicePATCH(String connUrl, String jsonMessage) throws Exception{
		logger.info("--- httpServicePATCH connUrl: "+connUrl+", jsonMessage: "+jsonMessage+" ---");
		JSONObject result = new JSONObject();
		Request okRequest = null;
		Response response = null;
		String resMessage = "";
		
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),jsonMessage.toString());
		okRequest = new Request.Builder().url(connUrl).patch(requestBody).build();
		
		response = client.newCall(okRequest).execute();
		resMessage = response.body().string();
		
		result.put("code", ""+response.code());
		result.put("message", response.message());
		result.put("data", resMessage);
		
		response.body().close();
		logger.info("--- httpServicePATCH result : "+result.toString());
		return result;
		
	}
	
	
	/**
	 * httpService DELETE
	 * @param connUrl
	 * @return
	 * @throws Exception
	 */
	public JSONObject httpServiceDELETE(String connUrl) throws Exception{
		logger.info("--- httpServiceDELETE connUrl: "+connUrl+" ---");
		JSONObject result = new JSONObject();
		Request request = null;
		
		request = new Request.Builder().url(connUrl).delete().build();
		
		String resMessage = "";
		
		Response response = client.newCall(request).execute();
		resMessage = response.body().string();
		
		result.put("code", ""+response.code());
		result.put("message", response.message());
		result.put("data", resMessage);
		
		response.body().close();
		logger.info("--- httpServiceDELETE result : "+result.toString());
		return result;
	}
	
	
	
	/**
	 * 파일 다운로드 후 저장
	 * @param connUrl
	 * @param filePath
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	public void httpServiceDownloader(String connUrl, String filePath, String fileName) throws Exception{
		logger.info("--- httpServiceDownloader connUrl: "+connUrl+", filePath: "+filePath+", fileName: "+fileName+" ---");
        FileOutputStream fos = null;
        InputStream is = null;
        try {
        	FileUtil.mkdir(filePath);
            fos = new FileOutputStream(filePath + "\\" + fileName);
 
            URL url = new URL(connUrl);
            URLConnection urlConnection = url.openConnection();
            is = urlConnection.getInputStream();
            byte[] buffer = new byte[1024];
            int readBytes;
            while ((readBytes = is.read(buffer)) != -1) {
                fos.write(buffer, 0, readBytes);
            }
        } finally {
            if (fos != null)	fos.close();
            if (is != null)		is.close();
        }
        logger.info("--- httpServiceDownloader compleate download!! ---");
	}
	
	
	/**
	 * 파일 다운로드 후 내려받기
	 * @param url
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	public void httpServiceDirectDownloader(HttpServletResponse response, String url, String jsonParams, String fileName) throws Exception{
		logger.info("--- httpServiceDownloader url: "+url+", jsonParams:"+jsonParams+", fileName: "+fileName+" ---");
		URL connUrl = null;
		HttpURLConnection urlConnection = null;
		BufferedInputStream inStream = null;
		OutputStream outStream = null;
		
        try {
            connUrl = new URL(url);
			urlConnection = (HttpURLConnection)connUrl.openConnection();
			urlConnection.setRequestMethod("POST");
			urlConnection.setConnectTimeout(TIMEOUT_VALUE);
			urlConnection.setReadTimeout(TIMEOUT_VALUE);
			
			// json으로 message를 전달 설정
			urlConnection.setRequestProperty("content-type", "application/json");
			// POST 데이터를 OutputStream으로 넘겨 주겠다는 설정
			urlConnection.setDoInput(true);
			urlConnection.setDoOutput(true);
			urlConnection.setUseCaches(false);
			urlConnection.setDefaultUseCaches(false);
			
			OutputStreamWriter wr = new OutputStreamWriter(urlConnection.getOutputStream());
			wr.write(jsonParams); // json 형식
			wr.flush();
			
//			response.setContentLength((int) file.length());
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=\""+fileName+"\"");
            
            
        	inStream = new BufferedInputStream(urlConnection.getInputStream());
        	outStream = response.getOutputStream();

            byte[] buffer = new byte[65536];
            int bytesRead;
            while ((bytesRead = inStream.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
            
        } finally {
        	outStream.flush();
            outStream.close();
        }
        logger.info("--- httpServiceDownloader compleate download!! ---");
	}
	
/* ****************************************************************************************************************************** */
/* *************************************************** 국회사무처 전자정부프레임워크 사용 *************************************************** */
/* ****************************************************************************************************************************** */
	/**
	 * 
	 * Http GET
	 * @param url
	 * @return
	 * @throws Exception
	 * JSONObject
	 */
	public JSONObject httpGET(String url) throws Exception {
		logger.info("--- httpGET url: "+url+" ---");
		URL connUrl = null;
		HttpURLConnection urlConnection = null;
		JSONObject result = new JSONObject();
		
		try {
			connUrl = new URL(url);
			urlConnection = (HttpURLConnection)connUrl.openConnection();
			urlConnection.setRequestMethod("GET");
			urlConnection.setConnectTimeout(TIMEOUT_VALUE);
			urlConnection.setReadTimeout(TIMEOUT_VALUE);
			urlConnection.connect();
			
			result = responseData(urlConnection);
			
		}finally {
			urlConnection.disconnect();
		}
		
		logger.info("--- httpServiceGET result : "+result.toString());
		return result;
	}
	
	/**
	 * 
	 * Http POST
	 * @param url
	 * @param jsonParams
	 * @return
	 * @throws Exception
	 * JSONObject
	 */
	public JSONObject httpPOST(String url, String jsonParams) throws Exception {
		logger.info("--- httpPOST url:"+url+", jsonParams:"+jsonParams+" ---");
		URL connUrl = null;
		HttpURLConnection urlConnection = null;
		JSONObject result = new JSONObject();
		
		try {
			connUrl = new URL(url);
			urlConnection = (HttpURLConnection)connUrl.openConnection();
			urlConnection.setRequestMethod("POST");
			urlConnection.setConnectTimeout(TIMEOUT_VALUE);
			urlConnection.setReadTimeout(TIMEOUT_VALUE);
			
			// json으로 message를 전달 설정
			urlConnection.setRequestProperty("content-type", "application/json");
			// POST 데이터를 OutputStream으로 넘겨 주겠다는 설정
			urlConnection.setDoInput(true);
			urlConnection.setDoOutput(true);
			urlConnection.setUseCaches(false);
			urlConnection.setDefaultUseCaches(false);
			
			OutputStreamWriter wr = new OutputStreamWriter(urlConnection.getOutputStream());
			wr.write(jsonParams); // json 형식
			wr.flush();
			
			urlConnection.connect();
			result = responseData(urlConnection);
			
		}finally {
			urlConnection.disconnect();
		}
		
		logger.info("--- httpServicePOST result : "+result.toString());
		return result;
	}
	
	/**
	 * 
	 * HttpURLConnection Response 처리
	 * @param urlConnection
	 * @return
	 * @throws ParseException
	 * @throws IOException
	 * JSONObject
	 */
	public JSONObject responseData(HttpURLConnection urlConnection) throws Exception{
		JSONObject result = new JSONObject();
		InputStream body = null;
		BufferedReader bufReader = null;		
		InputStreamReader inStReader = null;
		JSONParser parser = new JSONParser();
		String response = "";

		try {
			int responseCode = urlConnection.getResponseCode();
			if( responseCode == HttpURLConnection.HTTP_OK ) {
				body = urlConnection.getInputStream();
			}else {
				body = urlConnection.getErrorStream();
			}
			inStReader = new InputStreamReader(body, "UTF-8"); 
		    bufReader = new BufferedReader(inStReader);
			response = IOUtils.toString(bufReader).replaceAll("null", "\"\"").replaceAll("@\"\"", "");
															// null 제거                                           @"" 제거
			
			result = (JSONObject) parser.parse(response);
			
		} finally {
			if( body != null )	body.close();
			if( bufReader != null )	bufReader.close();
			if( inStReader != null )	inStReader.close();
		}
		
		return result;
	}
	
}
