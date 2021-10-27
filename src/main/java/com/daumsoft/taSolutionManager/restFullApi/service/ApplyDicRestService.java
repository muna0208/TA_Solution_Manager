package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.service.AsyncService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.MonitDicApply;
import com.daumsoft.taSolutionManager.restFullApi.mapper.ApplyDicRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class ApplyDicRestService {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	ApplyDicRestMapper applyDicRestMapper;
	
	@Autowired
	private AsyncService asyncService;
	
	@Value("${trendmap.path}")
	private String trendmapPath;

	@Value("${trendmap.jdbc}")
	private String trendmapJdbc;
	
	@Value("${trendmap.dbUser}")
	private String trendmapDbUser;

	@Value("${trendmap.dbPw}")
	private String trendmapDbPw;
	
	/**
	 * 지식 현황 조회
	 * @return
	 */
	public JSONArray getApplyDicList() {
		JSONArray jsonArr = new JSONArray();
		
		List<MonitDicApply> list = applyDicRestMapper.getApplyDicList();
		
		for (MonitDicApply monitDicApply : list) {
			if( MakeUtil.isNotNullAndEmpty(monitDicApply) )	jsonArr.add(new JSONObject().fromObject(monitDicApply));
		}
		return jsonArr;
	}

	/**
	 * 지식 적용
	 * @param monitDicApply
	 * @return
	 * @throws InterruptedException 
	 */
	public JSONObject applyDicByAjax(MonitDicApply monitDicApply) throws InterruptedException {
		JSONObject result = new JSONObject();
		
		String[] args = new String[6];
		args[0] = trendmapPath;
		args[1] = monitDicApply.getMorphDicIds();
		args[2] = trendmapJdbc;
		args[3] = trendmapDbUser;
		args[4] = trendmapDbPw;
		args[5] = monitDicApply.getDelay();
		
		// 지식 적용 비동기 
		asyncService.applyDicAsync(args);
		
		result.put("result", "success");
		return result;
	}
}
