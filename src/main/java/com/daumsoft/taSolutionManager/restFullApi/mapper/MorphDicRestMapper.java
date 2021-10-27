package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.CommonCode;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphColloc;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphEoj49;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphNm;
import com.daumsoft.taSolutionManager.restFullApi.domain.DicMorphStopword;
import com.daumsoft.taSolutionManager.restFullApi.domain.SearchData;

@Mapper
public interface MorphDicRestMapper {

	
	List<CommonCode> getCodeList(String groupCode);
	
/************************************************************* 신조어 사전 *************************************************************/
	List<DicMorphNm> getNmDicList(SearchData searchData);
	
	int nMDicSearchTotalCount(SearchData searchData);

	int nMDicTotalCount(SearchData searchData);

	DicMorphNm getNmDic(Integer nmSeq);

	int duplicateCheckNmDic(String word);

	void insertNmDic(DicMorphNm nmDic);

	void updateNmDic(DicMorphNm nmDic);
	
	void deleteNmDic(Integer nmSeq);
	

/************************************************************* 복합명사 사전 *************************************************************/
	List<Map<String, Object>> getCompDicList(SearchData searchData);

	int compDicSearchTotalCount(SearchData searchData);

	int compDicTotalCount(SearchData searchData);
	
	Map<String, Object> getCompDic(Integer compSeq);

	int duplicateCheckCompDic(String string);

	void insertCompDic(Map<String, Object> paramMap);

	void updateCompDic(Map<String, Object> paramMap);
	
	void deleteCompDic(Integer compSeq);
	

/************************************************************* 기분석 사전 *************************************************************/	
	List<DicMorphEoj49> getEoj49DicList(SearchData searchData);

	int eoj49DicSearchTotalCount(SearchData searchData);

	int eoj49DicTotalCount(SearchData searchData);
	
	DicMorphEoj49 getEoj49Dic(Integer eoj49Seq);

	int duplicateCheckEoj49Dic(String string);

	void insertEoj49Dic(DicMorphEoj49 dicMorphEoj49);

	void updateEoj49Dic(DicMorphEoj49 dicMorphEoj49);

	void deleteEoj49Dic(Integer eoj49Seq);
	
	
/************************************************************* 후처리 사전 *************************************************************/
	List<DicMorphColloc> getCollocDicList(SearchData searchData);

	int collocDicSearchTotalCount(SearchData searchData);

	int collocDicTotalCount(SearchData searchData);
	
	DicMorphColloc getCollocDic(Integer collocSeq);
	
	int duplicateCheckCollocDic(String string);

	void insertCollocDic(DicMorphColloc dicMorphColloc);
	
	void updateCollocDic(DicMorphColloc dicMorphColloc);
	
	void deleteCollocDic(Integer collocSeq);
	

/************************************************************* 불용어 사전 *************************************************************/
	List<DicMorphStopword> getStopWordDicList(SearchData searchData);

	int stopWordDicSearchTotalCount(SearchData searchData);

	int stopWordDicTotalCount(SearchData searchData);
	
	DicMorphStopword getStopWordDic(Integer stopWordSeq);
	
	int duplicateCheckStopWordDic(String string);
	
	void insertStopWordDic(DicMorphStopword dicMorphStopword);
	
	void updateStopWordDic(DicMorphStopword dicMorphStopword);
	
	void deleteStopWordDic(Integer stopWordSeq);



	


}
