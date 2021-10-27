package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.mapper.AnalyzeTestRestMapper;

import ds.aisolution.tm.management.api.TMMGAPIConst.ANALYZE_TEST;
import ds.aisolution.tm.management.api.TMMGAPIRunner;
import net.sf.json.JSONObject;

@Service
public class AnalyzeTestRestService {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	AnalyzeTestRestMapper analyzeTestRestMapper;
	
	@Value("${trendmap.serverIp}")
	private String trendmapServerIp;
	
	@Value("${trendmap.maPort}")
	private String trendmapMaPort;
	
	@Value("${trendmap.tmPort}")
	private String trendmapTmPort;
	

	/**
	 * 분석 테스트 조회
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("static-access")
	public JSONObject analyzeTest(Map<String, Object> paramMap) throws Exception {
		JSONObject result = new JSONObject();
		
		if( MakeUtil.isNotNullAndEmpty(paramMap.get("body")) ) {
			String[] args = new String[4];
			args[0] = trendmapServerIp;
			args[1] = trendmapMaPort;
			args[2] = trendmapTmPort;
			args[3] = ""+paramMap.get("body");

			// api 전송
			logger.info("###### Start analyzeTest #######");
			for( String arg : args) logger.info("args : "+arg);
			
		    TMMGAPIRunner runner = new TMMGAPIRunner();
		    int returnCode = runner.apiAnalyzeTest(args, ANALYZE_TEST.ANALYZER.TM);
		    
		    if( returnCode == 0 ) {
		    	result.put("result", "success");
		    	result.put("returnCodeMsg", runner.returnCodeToMSG(returnCode));
		    	
			    result.put("resultMA", runner.getAnalyzeTestResultMA());		// 형태소 분석 결과
			    result.put("resultTM_KL", runner.getAnalyzeTestResultTM_KL());  // 텍스트 마이닝 키워드 리스트
			    result.put("resultTM_KK", runner.getAnalyzeTestResultTM_KK());	// 텍스트 마이닝 연관 키워드
			    
			    result.put("resultTM_Eoj49", runner.getAnalyzeTestResultMA_Eoj49());	// 형태소 분석 결과 (기분석 사전 추가 전용)
			    
			    String[] temp = runner.getAnalyzeTestResultMA_Colloc();
			    // 형태소 분석 결과 (Colloc 사전 추가 전용)
			    // 실제 DB Insert 값
			    result.put("resultTM_Colloc_Input", temp[0]);
			    // 형태소 분석 결과 (Colloc 사전 추가 전용)
			    // 사용자 편의를 위한 원래 형태소 분석 결과 (단순 display 용도)
			    result.put("resultTM_Colloc_MorpyResult", temp[1]);
		    }else {
		    	result.put("result", "error");
		    	result.put("errorMessage", runner.returnCodeToMSG(returnCode));
		    }
		    
		    result.put("returnMSG", runner.returnCodeToMSG(returnCode));
		    logger.info("###### result : "+result+" #######");
			logger.info("###### End analyzeTest #######");
		}else {
			result.put("result", "error");
			result.put("errorMessage", "텍스트가 없습니다.");
		}
		return result;
	}
}
