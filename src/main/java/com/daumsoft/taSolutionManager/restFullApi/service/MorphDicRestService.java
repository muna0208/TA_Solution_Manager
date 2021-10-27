package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.CommonCode;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphColloc;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphEoj49;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphNm;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphStopword;
import com.daumsoft.taSolutionManager.restFullApi.domain.SearchData;
import com.daumsoft.taSolutionManager.restFullApi.mapper.MorphDicRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class MorphDicRestService {

	@Autowired
	private MorphDicRestMapper morphDicRestMapper;
	
	
	/**
	 * 코드 조회
	 * @param groupCode
	 * @return
	 */
	public JSONObject getCodeList(String groupCode) {
		JSONObject result = new JSONObject();
		JSONArray jsonArr = new JSONArray();
		
		List<CommonCode> list = morphDicRestMapper.getCodeList(groupCode);
		
		for (CommonCode code : list) {
			if( MakeUtil.isNotNullAndEmpty(code) )	jsonArr.add(new JSONObject().fromObject(code));
		}
		result.put("result", "success");
		result.put("codeList", jsonArr);
		return result;
	}
	
	/**
	 * 신조어 조회
	 * @return
	 * @throws Exception 
	 */
	
	public JSONObject getNmDicList(SearchData searchData) throws Exception {
		JSONObject result = new JSONObject();
		
		// sort 컬럼명 지정
		String[] columns = searchData.getColumns();
		searchData.setSSortCol(columns[searchData.getISortCol_0()]);
		
		List<DicMorphNm> list = morphDicRestMapper.getNmDicList(searchData);
		int searchTotalCount = morphDicRestMapper.nMDicSearchTotalCount(searchData);
		int totalCount = morphDicRestMapper.nMDicTotalCount(searchData);
		
		result.put("aaData", list);
		result.put("iTotalDisplayRecords", searchTotalCount);
		result.put("iTotalRecords", totalCount);
		
		return result;
	}

	/**
	 * 신조어 상세조회
	 * @param nmSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getNmDic(Integer nmSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		DicMorphNm detail = morphDicRestMapper.getNmDic(nmSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("nmDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}



	/**
	 * 신조어 등록
	 * @param nmDic
	 * @return
	 */
	public JSONObject insertNmDic(DicMorphNm nmDic) throws Exception {
		JSONObject result = new JSONObject();
		
		// 사용자 ID 중복체크
		int checkCnt = morphDicRestMapper.duplicateCheckNmDic(nmDic.getWord());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication word");
			return result;
		}
		
		morphDicRestMapper.insertNmDic(nmDic);
		
		DicMorphNm detail = morphDicRestMapper.getNmDic(nmDic.getNmSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("nmDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 신조어 수정
	 * @param nmDic
	 * @return
	 */
	public JSONObject updateNmDic(DicMorphNm nmDic) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.updateNmDic(nmDic);
		
		DicMorphNm detail = morphDicRestMapper.getNmDic(nmDic.getNmSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("nmDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 신조어 삭제
	 * @param nmSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteNmDic(Integer nmSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.deleteNmDic(nmSeq);
		
		
		result.put("result", "success");
		return result;
	}
	
/************************************************************* 복합명사 사전 *************************************************************/
	/**
	 * 복합명사 조회
	 * @return
	 * @throws Exception 
	 */
	
	public JSONObject getCompDicList(SearchData searchData) throws Exception {
		JSONObject result = new JSONObject();
		
		// sort 컬럼명 지정
		String[] columns = searchData.getColumns();
		searchData.setSSortCol(columns[searchData.getISortCol_0()]);
		
		List<Map<String, Object>> list = morphDicRestMapper.getCompDicList(searchData);
		int searchTotalCount = morphDicRestMapper.compDicSearchTotalCount(searchData);
		int totalCount = morphDicRestMapper.compDicTotalCount(searchData);
		
		result.put("aaData", list);
		result.put("iTotalDisplayRecords", searchTotalCount);
		result.put("iTotalRecords", totalCount);
		return result;
	}

	/**
	 * 복합명사 상세조회
	 * @param compSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getCompDic(Integer compSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		Map<String, Object> detail = morphDicRestMapper.getCompDic(compSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("compDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}



	/**
	 * 복합명사 등록
	 * @param paramMap
	 * @return
	 */
	public JSONObject insertCompDic(Map<String, Object> paramMap) throws Exception {
		JSONObject result = new JSONObject();
		
		// 사용자 ID 중복체크
		int checkCnt = morphDicRestMapper.duplicateCheckCompDic(""+paramMap.get("word"));
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication word");
			return result;
		}
		
		morphDicRestMapper.insertCompDic(paramMap);
		
		Map<String, Object> detail = morphDicRestMapper.getCompDic(Integer.parseInt(""+paramMap.get("compSeq")));
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("compDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 복합명사 수정
	 * @param paramMap
	 * @return
	 */
	public JSONObject updateCompDic(Map<String, Object> paramMap) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.updateCompDic(paramMap);
		
		Map<String, Object> detail = morphDicRestMapper.getCompDic(Integer.parseInt(""+paramMap.get("compSeq")));
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("compDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 복합명사 삭제
	 * @param compSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteCompDic(Integer compSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.deleteCompDic(compSeq);
		
		result.put("result", "success");
		return result;
	}
	
/************************************************************* 기분석 사전 *************************************************************/
	/**
	 * 기분석 조회
	 * @return
	 * @throws Exception 
	 */
	
	public JSONObject getEoj49DicList(SearchData searchData) throws Exception {
		JSONObject result = new JSONObject();
		// sort 컬럼명 지정
		String[] columns = searchData.getColumns();
		searchData.setSSortCol(columns[searchData.getISortCol_0()]);
		
		List<DicMorphEoj49> list = morphDicRestMapper.getEoj49DicList(searchData);
		int searchTotalCount = morphDicRestMapper.eoj49DicSearchTotalCount(searchData);
		int totalCount = morphDicRestMapper.eoj49DicTotalCount(searchData);
		
		result.put("aaData", list);
		result.put("iTotalDisplayRecords", searchTotalCount);
		result.put("iTotalRecords", totalCount);
		return result;
	}

	/**
	 * 기분석 상세조회
	 * @param eoj49Seq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getEoj49Dic(Integer eoj49Seq) throws Exception {
		JSONObject result = new JSONObject();
		
		DicMorphEoj49 detail = morphDicRestMapper.getEoj49Dic(eoj49Seq);
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("eoj49Dic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}



	/**
	 * 기분석 등록
	 * @param paramMap
	 * @return
	 */
	public JSONObject insertEoj49Dic(DicMorphEoj49 dicMorphEoj49) throws Exception {
		JSONObject result = new JSONObject();
		
		// 사용자 ID 중복체크
		int checkCnt = morphDicRestMapper.duplicateCheckEoj49Dic(dicMorphEoj49.getEojeol());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication eojeol");
			return result;
		}
		
		morphDicRestMapper.insertEoj49Dic(dicMorphEoj49);
		
		DicMorphEoj49 detail = morphDicRestMapper.getEoj49Dic(dicMorphEoj49.getEoj49Seq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("eoj49Dic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 기분석 수정
	 * @param dicMorphEoj49
	 * @return
	 */
	public JSONObject updateEoj49Dic(DicMorphEoj49 dicMorphEoj49) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.updateEoj49Dic(dicMorphEoj49);
		
		DicMorphEoj49 detail = morphDicRestMapper.getEoj49Dic(dicMorphEoj49.getEoj49Seq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("eoj49Dic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 기분석 삭제
	 * @param eoj49Seq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteEoj49Dic(Integer eoj49Seq) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.deleteEoj49Dic(eoj49Seq);
		
		result.put("result", "success");
		return result;
	}
	
/************************************************************* 후처리 사전 *************************************************************/
	/**
	 * 후처리 조회
	 * @return
	 * @throws Exception 
	 */
	
	public JSONObject getCollocDicList(SearchData searchData) throws Exception {
		JSONObject result = new JSONObject();
		
		// sort 컬럼명 지정
		String[] columns = searchData.getColumns();
		searchData.setSSortCol(columns[searchData.getISortCol_0()]);
		
		List<DicMorphColloc> list = morphDicRestMapper.getCollocDicList(searchData);
		int searchTotalCount = morphDicRestMapper.collocDicSearchTotalCount(searchData);
		int totalCount = morphDicRestMapper.collocDicTotalCount(searchData);
		
		result.put("aaData", list);
		result.put("iTotalDisplayRecords", searchTotalCount);
		result.put("iTotalRecords", totalCount);
		
		return result;
	}

	/**
	 * 후처리 상세조회
	 * @param collocSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getCollocDic(Integer collocSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		DicMorphColloc detail = morphDicRestMapper.getCollocDic(collocSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("collocDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}



	/**
	 * 후처리 등록
	 * @param paramMap
	 * @return
	 */
	public JSONObject insertCollocDic(DicMorphColloc dicMorphColloc) throws Exception {
		JSONObject result = new JSONObject();
		
		// 사용자 ID 중복체크
		int checkCnt = morphDicRestMapper.duplicateCheckCollocDic(dicMorphColloc.getInput());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication input");
			return result;
		}
		
		morphDicRestMapper.insertCollocDic(dicMorphColloc);
		
		DicMorphColloc detail = morphDicRestMapper.getCollocDic(dicMorphColloc.getCollocSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("collocDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 후처리 수정
	 * @param dicMorphColloc
	 * @return
	 */
	public JSONObject updateCollocDic(DicMorphColloc dicMorphColloc) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.updateCollocDic(dicMorphColloc);
		
		DicMorphColloc detail = morphDicRestMapper.getCollocDic(dicMorphColloc.getCollocSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("collocDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 후처리 삭제
	 * @param collocSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteCollocDic(Integer collocSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.deleteCollocDic(collocSeq);
		
		result.put("result", "success");
		return result;
	}
	
	/************************************************************* 불용어 사전 *************************************************************/
	/**
	 * 불용어 조회
	 * @return
	 * @throws Exception 
	 */
	
	public JSONObject getStopWordDicList(SearchData searchData) throws Exception {
		JSONObject result = new JSONObject();
		
		// sort 컬럼명 지정
		String[] columns = searchData.getColumns();
		searchData.setSSortCol(columns[searchData.getISortCol_0()]);
		
		List<DicMorphStopword> list = morphDicRestMapper.getStopWordDicList(searchData);
		int searchTotalCount = morphDicRestMapper.stopWordDicSearchTotalCount(searchData);
		int totalCount = morphDicRestMapper.stopWordDicTotalCount(searchData);
		
		result.put("aaData", list);
		result.put("iTotalDisplayRecords", searchTotalCount);
		result.put("iTotalRecords", totalCount);
		
		return result;
	}

	/**
	 * 불용어 상세조회
	 * @param stopWordSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getStopWordDic(Integer stopWordSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		DicMorphStopword detail = morphDicRestMapper.getStopWordDic(stopWordSeq);
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("stopWordDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}



	/**
	 * 불용어 등록
	 * @param dicMorphStopword
	 * @return
	 */
	public JSONObject insertStopWordDic(DicMorphStopword dicMorphStopword) throws Exception {
		JSONObject result = new JSONObject();
		
		// 사용자 ID 중복체크
		int checkCnt = morphDicRestMapper.duplicateCheckStopWordDic(dicMorphStopword.getWord());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication word");
			return result;
		}
		
		morphDicRestMapper.insertStopWordDic(dicMorphStopword);
		
		DicMorphStopword detail = morphDicRestMapper.getStopWordDic(dicMorphStopword.getStopwordSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("stopWordDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 불용어 수정
	 * @param dicMorphStopword
	 * @return
	 */
	public JSONObject updateStopWordDic(DicMorphStopword dicMorphStopword) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.updateStopWordDic(dicMorphStopword);
		
		DicMorphStopword detail = morphDicRestMapper.getStopWordDic(dicMorphStopword.getStopwordSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("stopWordDic", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 불용어 삭제
	 * @param stopWordSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteStopWordDic(Integer stopWordSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		morphDicRestMapper.deleteStopWordDic(stopWordSeq);
		
		result.put("result", "success");
		return result;
	}

	
}
