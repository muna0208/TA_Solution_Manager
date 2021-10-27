package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.service.HttpService;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.DemonService;
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.mapper.DemonRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class DemonRestService {

	@Autowired
	DemonRestMapper demonRestMapper;
	
	@Autowired
	private HttpService httpService;
	
	@Autowired
	private ProjectRestService projectRestService;

	@Value("${module.url}")
	private String moduleUrl;
	
	@Value("${module.version}")
	private String moduleVersion;
	
	@Value("${module.method.demon}")
	private String moduleMethodDemon;

	/**
	 * 데몬 조회
	 * @return
	 * @throws Exception 
	 */
	public JSONArray getDemonList(HttpSession session) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		String userAuth = session.getAttribute("userAuth")+"";
		String userId = "admin".equals(userAuth) ? null : session.getAttribute("userId")+"";
		List<DemonService> list = demonRestMapper.getDemonList(userId);
		
		for (DemonService demon : list) {
			if( MakeUtil.isNotNullAndEmpty(demon) )	jsonArr.add(new JSONObject().fromObject(demon));
		}
		return jsonArr;
	}

	/**
	 * 데몬 상세조회
	 * @param originalDataSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getDemon(Integer demonServiceSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		DemonService detail = demonRestMapper.getDemon(demonServiceSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) ) {
			JSONObject getModel = projectRestService.getModel(detail.getModelSeq());
			result.put("model", getModel.get("model"));
			result.put("demon", new JSONObject().fromObject(detail));
		}
		
		return result;
	}
	
	/**
	 * 데몬 등록
	 * @param paramMap
	 * @return
	 */
	public JSONObject insertDemon(DemonService demon) throws Exception {
		JSONObject result = new JSONObject();
		
		// 이름 중복 체크
		int checkCnt = demonRestMapper.duplicateCheckDemonName(demon.getName());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication name");
			return result;
		}
		
		demonRestMapper.insertDemon(demon);
		
		DemonService detail = demonRestMapper.getDemon(demon.getDemonServiceSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("demon", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}
	
	/**
	 * 데몬 수정
	 * @param demon
	 * @return
	 */
	public JSONObject updateDemon(DemonService demon) throws Exception {
		JSONObject result = new JSONObject();
		
		demonRestMapper.updateDemon(demon);
		
		DemonService detail = demonRestMapper.getDemon(demon.getDemonServiceSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("demon", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 데몬 삭제
	 * @param demonServiceSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteDemon(Integer demonServiceSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		DemonService demon =  new DemonService();
		demon.setDemonServiceSeq(demonServiceSeq);
		demon.setDeleteFlag(1);
		demonRestMapper.updateDemon(demon);
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 데몬 실행
	 * @param paramMap
	 * @return
	 * @throws Exception 
	 */
	public JSONObject commandDemon(DemonService demon) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		JSONObject params = null;
		
		// 모듈 호출
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodDemon + "/" + demon.getModelSeq();
		params = new JSONObject();
		params.put("content", demon.getContent());
		httpJson = httpService.httpServicePOST(httpUrl, params.toString());
		
		if( "200".equals(httpJson.get("code")) ) {
			result.put("result", "success");
			result.put("data", httpJson.get("data"));
						
		}else {
			result.put("result", "validationError");
			result.put("errorMessage", httpJson.get("data"));
		}
		
		return result;
	}
}
