package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.daumsoft.taSolutionManager.common.service.HttpService;
import com.daumsoft.taSolutionManager.common.utils.FileUtil;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.Model;
import com.daumsoft.taSolutionManager.restFullApi.domain.Project;
import com.daumsoft.taSolutionManager.restFullApi.mapper.ProjectRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class ProjectRestService {

	@Autowired
	ProjectRestMapper projectRestMapper;
	
	@Autowired
	private HttpService httpService;

	@Value("${module.url}")
	private String moduleUrl;
	
	@Value("${module.version}")
	private String moduleVersion;
	
	@Value("${module.method.model}")
	private String moduleMethodModel;
	
	@Value("${modelFilePath}")
	private String modelFilePath;
	
	@Value("${isLocalTest}")
	private boolean isLocalTest;
	
	/**
	 * 프로젝트 조회
	 * @return
	 * @throws Exception 
	 */
	public JSONArray getProjectList(HttpSession session) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		String userAuth = session.getAttribute("userAuth")+"";
		String userId = "admin".equals(userAuth) ? null : session.getAttribute("userId")+"";
		List<Project> list = projectRestMapper.getProjectList(userId);
		
		for (Project project : list) {
			if( MakeUtil.isNotNullAndEmpty(project) )	jsonArr.add(new JSONObject().fromObject(project));
		}
		return jsonArr;
	}

	/**
	 * 프로젝트 상세조회
	 * @param projectSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getProject(Integer projectSeq) throws Exception {
		Project detail = projectRestMapper.getProject(projectSeq);
		return new JSONObject().fromObject(detail);
	}
	
	/**
	 * 프로젝트 등록
	 * @param model
	 * @return
	 */
	public JSONObject insertProject(Project project) throws Exception {
		JSONObject result = new JSONObject();
		
		// 이름 중복 체크
		int checkCnt = projectRestMapper.duplicateCheckProjectName(project.getName());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication name");
			return result;
		}
		
		projectRestMapper.insertProject(project);
		
		Project detail = projectRestMapper.getProject(project.getProjectSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("project", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}
	
	/**
	 * 프로젝트 수정
	 * @param project
	 * @return
	 */
	public JSONObject updateProject(Project project) throws Exception {
		JSONObject result = new JSONObject();
		
		projectRestMapper.updateProject(project);
		
		Project detail = projectRestMapper.getProject(project.getProjectSeq());
		if( MakeUtil.isNotNullAndEmpty(detail) )	result.put("project", new JSONObject().fromObject(detail));
		
		result.put("result", "success");
		return result;
	}

	/**
	 * 프로젝트 삭제
	 * @param projectSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteProject(Integer projectSeq) throws Exception {
		JSONObject result = new JSONObject();
		
		Project project =  new Project();
		project.setProjectSeq(projectSeq);
		project.setDeleteFlag(1);
		projectRestMapper.updateProject(project);
		
		result.put("result", "success");
		return result;
	}

	
	/**
	 * 모델 조회
	 * @return
	 * @throws Exception 
	 */
	public JSONArray getModelList(Integer projectSeq) throws Exception {
		JSONArray jsonArr = new JSONArray();
		
		Model model = new Model();
		model.setProjectSeq(projectSeq);
		List<Model> list = projectRestMapper.getModelList(model);
		
		for (Model map : list) {
			System.out.println(map);
			if( MakeUtil.isNotNullAndEmpty(map) )	jsonArr.add(new JSONObject().fromObject(map));
		}
		return jsonArr;
	}

	/**
	 * 모델 상세조회
	 * @param modelSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject getModel(Integer modelSeq) throws Exception {
		
		Model detail = projectRestMapper.getModel(modelSeq);
		if( MakeUtil.isNotNullAndEmpty(detail.getEmbeddingModel()) ) {
			Model embeddingModel = projectRestMapper.getModel(detail.getEmbeddingModel());
			detail.setEmbeddingModelName(embeddingModel.getName());
			detail.setEmbeddingProjectName(embeddingModel.getProjectName());
		}
		
		if( MakeUtil.isNotNullAndEmpty(detail.getPretrainedModel()) ) {
			Model pretrainedModel = projectRestMapper.getModel(detail.getPretrainedModel());
			detail.setPretrainedModelName(pretrainedModel.getName());
			detail.setPretrainedModelProjectName(pretrainedModel.getProjectName());	
		}
		
		if( MakeUtil.isNotNullAndEmpty(detail.getTrainStartDateTime()) && MakeUtil.isNotNullAndEmpty(detail.getTrainEndDateTime()) ) {
			String startDate = detail.getTrainStartDateTime();
			String endDate = detail.getTrainEndDateTime();
			detail.setTrainDiffDateTime(MakeUtil.diffOfDateAll(startDate, endDate));
		}
		if( MakeUtil.isNotNullAndEmpty(detail.getEvaluationStartDateTime()) && MakeUtil.isNotNullAndEmpty(detail.getEvaluationEndDateTime() )) {
			String startDate = detail.getEvaluationStartDateTime();
			String endDate = detail.getEvaluationEndDateTime();
			detail.setEvaluationDiffDateTime(MakeUtil.diffOfDateAll(startDate, endDate));
		}

		return MakeUtil.nvlJson(new JSONObject().fromObject(detail));
	}
	
	/**
	 * 모델 등록
	 * @param model
	 * @return
	 */
	public JSONObject insertModel(@RequestBody Model model) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		JSONObject params = null;
		
		// 이름 중복 체크
		int checkCnt = projectRestMapper.duplicateCheckModelName(model.getName());
		if( checkCnt > 0 ) {
			result.put("result","error");
			result.put("errorMessage","duplication name");
			return result;
		}
		
		// 모델 유효성 체크
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodModel;
		params = new JSONObject();
		params.put("name", model.getName());
		params.put("algorithm_seq", model.getAlgorithmSeq());
		params.put("parameters", model.getParameters());
		params.put("train_data", model.getTrainData());
		params.put("validation_data", model.getValidationData());
		params.put("evaluation_data", model.getEvaluationData());
		params.put("embedding_model", model.getEmbeddingModel());
		params.put("pretrained_model", model.getPretrainedModel());
		
		httpJson = httpService.httpServicePOST(httpUrl, params.toString());
		
		if( "200".equals(httpJson.get("code")) ) {
			
			httpJson = new JSONObject().fromObject(httpJson.get("data"));

			// model 등록
			model.setParameters(httpJson.get("parameters").toString());
			projectRestMapper.insertModel(model);
			
			String path = modelFilePath+"/"+"model_"+model.getModelSeq();
			if( isLocalTest )	path = "/home/tasolver/TASOLVER/files/model_files/model_"+model.getModelSeq();
			else FileUtil.mkdir(path); // 모델 파일 폴더 생성
			
			// 모델 업데이트
			Model newModel = new Model();
			newModel.setModelSeq(model.getModelSeq());
			newModel.setPath(path);
			projectRestMapper.updateModel(newModel);

			result.put("model", model);
			result.put("result", "success");
			
		}else {
			result.put("result", "validationError");
			result.put("errorMessage", httpJson.get("data"));
		}
		
		return result;
	}
	

	/**
	 * 모델 삭제
	 * @param modelSeq
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteModel(Integer modelSeq) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		
		// 모듈 호출
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodModel + "/" + modelSeq;
		httpJson = httpService.httpServiceDELETE(httpUrl);
		
		if( "200".equals(httpJson.get("code")) ) {
			
			httpJson = new JSONObject().fromObject(httpJson.get("data"));
			
			if( Boolean.parseBoolean(""+httpJson.get("delete_flag")) 
					|| "true".equals(""+httpJson.get("delete_flag")) ) {
				result.put("result", "success");
				
			}else {
				result.put("result", "error");
				result.put("errorMessage", httpJson.get("data"));
			}
			
		}else {
			result.put("result", "Error");
			result.put("errorMessage", httpJson.get("data"));
		}
		
		
		return result;
	}

	/**
	 * 학습/평가 실행/중지
	 * @param model
	 * @return
	 */
	public JSONObject modelCommand(Model model) throws Exception {
		JSONObject result = new JSONObject();
		JSONObject httpJson = null;
		
		// 모델 학습/평가/중지 체크
		String tagetMethod = "";
		if( "train".equals(model.getTarget()) && "start".equals(model.getOption()) ) {
			tagetMethod = "train";
		}else if( "train".equals(model.getTarget()) && "stop".equals(model.getOption()) ) {
			tagetMethod = "revoke-train";
		}else if( "evaluate".equals(model.getTarget()) && "start".equals(model.getOption()) ) {
			tagetMethod = "evaluate";
		}else if( "evaluate".equals(model.getTarget()) && "stop".equals(model.getOption()) ) {
			tagetMethod = "revoke-evaluate";
		}
		
		String httpUrl = moduleUrl + "/" + moduleVersion + "/" + moduleMethodModel + "/" + model.getModelSeq() + "/" + tagetMethod;		
		httpJson = httpService.httpServiceGET(httpUrl);
		
		if( "200".equals(httpJson.get("code")) ) {
			
			httpJson = new JSONObject().fromObject(httpJson.get("data"));
			
			result = getModel(model.getModelSeq());
			result.put("result", "success");
			
		}else if( "500".equals(httpJson.get("code")) ) {
			result.put("result", "Internal Server Error");
			result.put("errorMessage", httpJson);
			
		}else {
			result.put("result", "validationError");
			result.put("errorMessage", httpJson.get("data"));
		}
		
		return result;
	}

	/**
	 * 모델 검색 조회
	 * @param model
	 * @return
	 */
	public JSONObject getModelSearchList(Integer projectSeq, Model model) {
		JSONObject result = new JSONObject();
		JSONArray jsonArr = new JSONArray();
		
		model.setProjectSeq(projectSeq);
		List<Model> list = projectRestMapper.getModelList(model);
		
		for (Model m : list) {
			if( MakeUtil.isNotNullAndEmpty(m) )	jsonArr.add(new JSONObject().fromObject(m));
		}
		result.put("result", "success");
		result.put("modelList", jsonArr);
		return result;
	}

	
	
}
