package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.Algorithm;
import com.daumsoft.taSolutionManager.restFullApi.mapper.AlgorithmRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class AlgorithmRestService {
	
	@Autowired
	private AlgorithmRestMapper algorithmRestMapper;


	public JSONArray getAlgorithmList() throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		List<Algorithm> list = algorithmRestMapper.getAlgorithmList();
		
		for (Algorithm algorithm : list) {
			if( MakeUtil.isNotNullAndEmpty(algorithm) )	jsonArr.add(new JSONObject().fromObject(algorithm));
		}
		return jsonArr;
	}


	public JSONObject getAlgorithm(Integer algorithmSeq) throws Exception {
		JSONObject json = null;
		
		Algorithm algorithm = algorithmRestMapper.getAlgorithm(algorithmSeq);
		if( MakeUtil.isNotNullAndEmpty(algorithm) )	
			json = MakeUtil.nvlJson(new JSONObject().fromObject(algorithm));
		
		return json;
	}
	
	
}
