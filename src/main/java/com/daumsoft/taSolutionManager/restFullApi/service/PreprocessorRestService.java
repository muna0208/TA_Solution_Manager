package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.PreProcessor;
import com.daumsoft.taSolutionManager.restFullApi.mapper.PreprocessorRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class PreprocessorRestService {

	@Autowired
	private PreprocessorRestMapper preprocessorRestMapper;
	
	/**
	 * 전처리기 조회
	 * @return
	 * @throws Exception
	 */
	public JSONArray getPreprocessorList() throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		List<PreProcessor> list = preprocessorRestMapper.getPreprocessorList();
		
		for (PreProcessor preprocessor : list) {
			if( MakeUtil.isNotNullAndEmpty(preprocessor) )	jsonArr.add(new JSONObject().fromObject(preprocessor));
		}
		return jsonArr;
	}

	/**
	 * 전처리기 상세조회
	 * @param preprocessorSeq
	 * @return
	 * @throws Exception
	 */
	public JSONObject getPreprocessor(Integer preprocessorSeq) throws Exception {
		JSONObject json = null;
		
		PreProcessor preprocessor = preprocessorRestMapper.getPreprocessor(preprocessorSeq);
		if( MakeUtil.isNotNullAndEmpty(preprocessor) )	
			json = MakeUtil.nvlJson(new JSONObject().fromObject(preprocessor));
		
		return json;
	}
}
