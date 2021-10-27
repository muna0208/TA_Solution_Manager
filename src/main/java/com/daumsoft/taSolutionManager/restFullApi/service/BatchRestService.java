package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.BatchService;
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.mapper.BatchRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class BatchRestService {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	BatchRestMapper batchRestMapper;

	/**
	 * 배치 조회
	 * @return
	 * @throws Exception 
	 */
	public JSONArray getBatchList(HttpSession session) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		String userAuth = session.getAttribute("userAuth")+"";
		String userId = "admin".equals(userAuth) ? null : session.getAttribute("userId")+"";
		List<BatchService> list = batchRestMapper.getBatchList(userId);
		
		for (BatchService batch : list) {
			if( MakeUtil.isNotNullAndEmpty(batch) )	jsonArr.add(new JSONObject().fromObject(batch));
		}
		return jsonArr;
	}

	/**
	 * 배치 상세조회
	 * @param batchServiceSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getBatch(Integer batchServiceSeq) throws Exception {
		BatchService detail = batchRestMapper.getBatch(batchServiceSeq);
		return MakeUtil.nvlJson(new JSONObject().fromObject(detail));
	}
	
	/**
	 * 배치 등록
	 * @param paramMap
	 * @return
	 */
	public JSONObject insertBatch(BatchService batch) throws Exception {
		JSONObject result = new JSONObject();
		
		// 이름 중복 체크
		int checkCnt = batchRestMapper.duplicateCheckBatchName(batch.getName());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication name");
			return result;
		}
		
		batchRestMapper.insertBatch(batch);
		
		BatchService detail = batchRestMapper.getBatch(batch.getBatchServiceSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("batch", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}
	
	/**
	 * 배치 수정
	 * @param batch
	 * @return
	 */
	public JSONObject updateBatch(BatchService batch) throws Exception {
		JSONObject result = new JSONObject();
		
		batchRestMapper.updateBatch(batch);
		
		BatchService detail = batchRestMapper.getBatch(batch.getBatchServiceSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("batch", new JSONObject().fromObject(detail));
		
		if( "START".equals(batch.getBatchState()) ) {
			// 배치 실행 명령
			logger.info("배치 실행 명령");	
		}
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 배치 삭제
	 * @param batchServiceSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteBatch(Integer batchServiceSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		BatchService batch =  new BatchService();
		batch.setBatchServiceSeq(batchServiceSeq);
		batch.setDeleteFlag(1);
		batchRestMapper.updateBatch(batch);
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 배치 시작/중지
	 * @param paramMap
	 * @return
	 */
	public JSONObject commandBatch(BatchService batch) throws Exception {
		JSONObject result = new JSONObject();
		
		if( "START".equals(batch.getBatchState()) ) {
			// 배치 시작 명령
			logger.info("배치 시작 명령");
		}else {
			// 배치 중지 명령
			logger.info("배치 중지 명령");
		}
		
		batchRestMapper.updateBatch(batch);
		
		BatchService detail = batchRestMapper.getBatch(batch.getBatchServiceSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("batch", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

}
