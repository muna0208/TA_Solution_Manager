package com.daumsoft.taSolutionManager.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import com.daumsoft.taSolutionManager.common.utils.MakeUtil;


@Controller
public class MainController {
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("${localUser}")
	private String localUser;
	
	@Value("${checklinuxCommand}")
	private String checklinuxCommand;
	
	@Value("${trendmap.serverIp}")
	private String trendmapServerIp;
	
	@Value("${trendmap.maPort}")
	private String trendmapMaPort;
	
	@Value("${trendmap.tmPort}")
	private String trendmapTmPort;
	
	@Value("${isLocalTest}")
	private boolean isLocalTest;
	
	/**
	 * 통합모듈에서 로그인 후 code, state값 받음(interceptor에서 처리)
	 * @param code
	 * @param state
	 * @param response
	 * @param request
	 */
	@RequestMapping("/")
	public RedirectView rootPath(HttpServletRequest request, HttpSession session){
		logger.info("스프링 버전: "+org.springframework.core.SpringVersion.getVersion());
		logger.info("userId = {}",session.getAttribute("userId"));
		return new RedirectView("/preprocessorManage");	
	}
	
	
	/**
	 * 로그인 페이지
	 * @param model
	 * @param error
	 * @return
	 */
	@GetMapping("/login")
	public String login(Model model, @RequestParam(value="error",required = false) String error, HttpServletRequest request, HttpSession session) {
		session = request.getSession();
		session.invalidate();
		model.addAttribute("isLocalTest", isLocalTest);
		if( MakeUtil.isNotNullAndEmpty(error)) model.addAttribute("error", error);
		return "login";
	}
	
	/**
	 * 로그아웃
	 * @param request
	 * @param response
	 * @param session
	 * @return
	 */
	@GetMapping("/logout")
	public RedirectView  logout(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
		logger.info("logout");
		return new RedirectView("/login");
	}
	
	/**
	 * 전처리기 조회
	 * @return
	 */
	@GetMapping("/preprocessorManage")
	public String preprocessorManage(){
		return "user/preprocessorManage";
	}
	

	/**
	 * 알고리즘 조회
	 * @param request
	 * @return
	 */
	@GetMapping("/algorithmManage")
	public String algorithm(){
		return "user/algorithmManage";	
	}
	
	

	
	/**
	 * 데이터 관리 > 원본 데이터 관리
	 * @return
	 */
	@GetMapping("/originalDataManage")
	public String originalDataManage(){
		return "user/dataManage/originalDataManage";	
	}
	
	/**
	 * 데이터 관리 > 전처리 데이터 관리
	 * @return
	 */
	@GetMapping("/preprocessedDataManage")
	public String preprocessedDataManage(){
		return "user/dataManage/preprocessedDataManage";
	}
	
	/**
	 * 데이터 관리 > 전처리 데이터 상세페이지
	 * @param preprocessedDataSeq
	 * @param model
	 * @return
	 */
	@PostMapping("/preprocessedDataDetail")
	public String preprocessDataDetail(@RequestParam(value="preprocessedDataSeq") String preprocessedDataSeq, Model model) {
		model.addAttribute("preprocessedDataSeq", preprocessedDataSeq);
		return "user/dataManage/preprocessedDataDetail";
	}

	
	/**
	 * 프로젝트 관리
	 * @return
	 */
	@GetMapping("/projectManage")
	public String projectManage() {
		return "user/project/projectManage";	
	}
	
	/**
	 * 프로젝트 상세페이지
	 * @param projectSeq
	 * @param model
	 * @return
	 */
	@PostMapping("/projectDetail")
	public String projectDetail(@RequestParam(value="projectSeq") Integer projectSeq, Model model) {
		model.addAttribute("projectSeq", projectSeq);
		return "user/project/projectDetail";
	}
	
	/**
	 * 데몬 관리
	 * @return
	 */
	@GetMapping("/demonManage")
	public String demonManage() {
		return "user/demonManage";
	}
	
	/**
	 * 데몬 상세페이지 
	 * @return
	 */
	@PostMapping("/demonDetail")
	public String demonDetail(@RequestParam(value="demonServiceSeq") Integer demonServiceSeq, Model model) {
		model.addAttribute("demonServiceSeq", demonServiceSeq);
		return "user/demonDetail";
	}
	
	/**
	 * 배치 관리
	 * @return
	 */
	@GetMapping("/batchManage")
	public String batchManage() {
		return "user/batchManage";
	}
	
	/**
	 * 형태소 사전 관리 > 신조어 사전
	 * @return
	 */
	@GetMapping("/morphNMDicManage")
	public String morphNMDicManage(){
		return "user/morphDic/morphNMDicManage";	
	}
	
	/**
	 * 형태소 사전 관리 > 복합 명사 사전
	 * @return
	 */
	@GetMapping("/morphCompDicManage")
	public String morphCompDicManage(){
		return "user/morphDic/morphCompDicManage";	
	}
	
	/**
	 * 형태소 사전 관리 > 기분석 사전
	 * @return
	 */
	@GetMapping("/morphEoj49DicManage")
	public String morphEoj49DicManage(){
		return "user/morphDic/morphEoj49DicManage";	
	}
	
	/**
	 * 형태소 사전 관리 > 후처리 사전
	 * @return
	 */
	@GetMapping("/morphCollocDicManage")
	public String morphCollocDicManage(){
		return "user/morphDic/morphCollocDicManage";	
	}
	
	/**
	 * 형태소 사전 관리 > 불용어 사전
	 * @return
	 */
	@GetMapping("/morphStopWordDicManage")
	public String morphStopWordDicManage(){
		return "user/morphDic/morphStopWordDicManage";	
	}

	/**
	 * 모니터링 > 지식 적용 현황
	 * @return
	 */
	@GetMapping("/applyDic")
	public String applyDic() {
		return "user/applyDic";
	}
	
	/**
	 * 모니터링 > 서버 구동 현황
	 * @return
	 */
	@GetMapping("/serverState")
	public String serverState(Model model) {
		model.addAttribute("checklinuxCommand", checklinuxCommand);
		return "user/serverState";
	}
	
	
	/**
	 * 분석 테스트
	 * @return
	 */
	@GetMapping("/analyzeTest")
	public String analyzeTest(Model model) {
		model.addAttribute("trendmapServerIp", trendmapServerIp);
		model.addAttribute("trendmapMaPort", trendmapMaPort);
		model.addAttribute("trendmapTmPort", trendmapTmPort);
		return "user/analyzeTest";	
	}
	
	/**
	 * 사용자 관리
	 * @return
	 */
	@GetMapping("/userManage")
	public String user() {
		return "user/userManage";
	}
}
