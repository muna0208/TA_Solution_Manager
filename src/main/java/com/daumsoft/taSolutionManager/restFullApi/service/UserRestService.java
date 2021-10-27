package com.daumsoft.taSolutionManager.restFullApi.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daumsoft.taSolutionManager.common.utils.EncryptionUtil;
import com.daumsoft.taSolutionManager.common.utils.MakeUtil;
import com.daumsoft.taSolutionManager.restFullApi.domain.User;
import com.daumsoft.taSolutionManager.restFullApi.mapper.UserRestMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service
@SuppressWarnings("static-access")
public class UserRestService {

	@Autowired
	UserRestMapper userRestMapper;
	
/*
 * *** Redis Session clustering ****
	@Autowired
	UserRestDao userRestDao;
*/
	@Value("${isIntegration}")
	private boolean isIntegration;
	
	@Value("${localUser}")
	private String localUser;
	
	@Value("${dataanalyticsManager.url}")
	private String dataanalyticsManagerUrl;
	
	public User getUserInfo(User user) {
		return userRestMapper.getUserInfo(user);
	}

	/**
	 * 사용자 접속 시간 저장
	 * @param userId
	 */
	public void updateLastAccessDate(Integer id) {
//		if( isIntegration ) userRestDao.updateLastAccessDate(id);
//		else				userRestMapper.updateLastAccessDate(id);
		userRestMapper.updateLastAccessDate(id);
	}

	/**
	 * 사용자 목록 조회
	 * @return
	 * @throws Exception 
	 */
	public Object getUserList() throws Exception {
		JSONArray jsonArr = new JSONArray();
		List<User> list = null;
//		if( isIntegration ) list = userRestDao.getUserList();
//		else				list = userRestMapper.getUserList();
		list = userRestMapper.getUserList();
		
		for (User user : list) {
			if( MakeUtil.isNotNullAndEmpty(user) )	jsonArr.add(new JSONObject().fromObject(user));
		}
		return jsonArr;
	}

	/**
	 * 사용자 개별 조회
	 * @param userId
	 * @return
	 */
	public JSONObject getUser(Integer id) throws Exception {
		User detail = null;
//		if( isIntegration ) detail = userRestDao.getUser(id);
//		else				detail = userRestMapper.getUser(id);
		detail = userRestMapper.getUser(id);
		return new JSONObject().fromObject(detail);
	}


	/**
	 * 사용자 등록
	 * @param user
	 * @param session
	 * @return
	 * @throws Exception 
	 */
	public JSONObject insertUser(User user, HttpSession session) throws Exception {
		JSONObject json = null;
		User detail = null;
		
		// 사용자 ID 중복체크
		int checkCnt;
//		if( isIntegration ) checkCnt = userRestDao.duplicateCheckUserId(user.getUserId());
//		else				checkCnt = userRestMapper.duplicateCheckUserId(user.getUserId());
		checkCnt = userRestMapper.duplicateCheckUserId(user.getUserId());
		
		if( checkCnt > 0 ) {
			json = new JSONObject();
			json.put("result","error");
			json.put("errorMessage","duplication userId");
			return json;	
		}
		
		// 사용자 패스워드 암호화
		user.setUserPw(EncryptionUtil.encrypt(user.getUserPw()));
		
		if( MakeUtil.isNotNullAndEmpty(session.getAttribute("userName")) ) {
			user.setRegisterer(session.getAttribute("userName")+"");
		}else {
			user.setRegisterer(user.getUserName());
		}

//		if( isIntegration ) userRestDao.insertUser(user);
//		else				userRestMapper.insertUser(user);
		userRestMapper.insertUser(user);
		
		
//		if( isIntegration ) detail = userRestDao.getUser(user.getId());
//		else				detail = userRestMapper.getUser(user.getId());
		detail = userRestMapper.getUser(user.getId());
		
		json = new JSONObject().fromObject(detail);
		return json;
	}
	
	
	/**
	 * 사용자 수정
	 * @param user
	 * @return
	 * @throws Exception 
	 */
	public JSONObject updateUser(HttpServletRequest request, HttpSession session, User user) throws Exception {
		JSONObject json = null;
		User detail = null;
		
		// 사용자 패스워드 암호화
		if( MakeUtil.isNotNullAndEmpty(user.getUserPw()) && !"wjdgusakstp".equals(user.getUserPw()) ) {
			user.setUserPw(EncryptionUtil.encrypt(user.getUserPw()));
		}
		else user.setUserPw("");
		
//		if( isIntegration ) userRestDao.updateUser(user);
//		else				userRestMapper.updateUser(user);
		userRestMapper.updateUser(user);
		
//		if( isIntegration ) detail = userRestDao.getUser(user.getId());
//		else				detail = userRestMapper.getUser(user.getId());
		detail = userRestMapper.getUser(user.getId());
		
		String userId = session.getAttribute("userId")+"";
		if( userId.equals(detail.getUserId()) )
			createSession(request, detail);

		json = new JSONObject().fromObject(detail);
		return json;
	}
	

	/**
	 * 사용자 삭제
	 * @param id
	 * @param object
	 * @return
	 * @throws Exception 
	 */
	public JSONObject deleteUser(Integer id) throws Exception {
		JSONObject resultJson = new JSONObject();
//		if( isIntegration ) userRestDao.deleteUser(id);
//		else				userRestMapper.deleteUser(id);
		userRestMapper.deleteUser(id);
		
		resultJson.put("result","success");
		return resultJson;
	}
	
	/**
	 * 사용자 정보 세션에 담기
	 * @param request
	 * @param user
	 */
	public void createSession(HttpServletRequest request, User user) {
		HttpSession session = request.getSession();
		session.setAttribute("id", user.getId());
		session.setAttribute("userId", user.getUserId());
		session.setAttribute("userAuth", user.getUserAuth());
		session.setAttribute("userName", user.getUserName());
		session.setAttribute("userEmail", user.getEmail());
		session.setAttribute("dataanalyticsManagerUrl", dataanalyticsManagerUrl);
	}

	/**
	 * 사용자 찾기
	 * @param user
	 * @return
	 * @throws Exception 
	 */
	public JSONObject findUser(User user) throws Exception {
		JSONObject resultJson = new JSONObject();
		User findUser = null;
		
		/*사용자 ID 찾기*/
		if( "findUserId".equals(user.getOption()) ) {
//			if( isIntegration ) findUser = userRestDao.findUserId(user);
//			else				findUser = userRestMapper.findUserId(user);
			findUser = userRestMapper.findUserId(user);
			
			if( MakeUtil.isNotNullAndEmpty(findUser) ) {
				resultJson.put("result","success");
				resultJson.put("user",findUser);
			}else {
				resultJson.put("result","error");
				resultJson.put("errorMessage","Not Found user");
			}
		/* 사용자 PW 재발급 */
		}else if( "findUserPw".equals(user.getOption()) ) {
//			if( isIntegration ) findUser = userRestDao.findUserId(user);
//			else				findUser = userRestMapper.findUserId(user);
			findUser = userRestMapper.findUserId(user);
			
			if( MakeUtil.isNotNullAndEmpty(findUser) ) {
				String tempPw = MakeUtil.getRandomString(10);
				findUser.setUserPw(EncryptionUtil.encrypt(tempPw));
//				if( isIntegration ) userRestDao.updateUser(findUser);
//				else				userRestMapper.updateUser(findUser);
				userRestMapper.updateUser(findUser);
				
				resultJson.put("result","success");
				resultJson.put("tempPw",tempPw);
			}else {
				resultJson.put("result","error");
				resultJson.put("errorMessage","Not Found user");
			}
		}
		return resultJson;
	}

	public void setLocalUser(HttpServletRequest request) {
		try {
			User user = new User();
			user.setUserId(localUser);
			user.setUserPw(EncryptionUtil.encrypt(localUser));
			user = getUserInfo(user);
			user.setUserPw(null);
			
			// 유저정보 세션에 저장
	        createSession(request, user);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
}
