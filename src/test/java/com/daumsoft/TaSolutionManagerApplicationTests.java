package com.daumsoft;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import net.sf.json.JSONObject;

@SpringBootTest
class TaSolutionManagerApplicationTests {

	@Test
	void contextLoads() {
		try {
			System.out.println("######################################################## \n");
			String text = "{\"code\":\"200\",\"message\":\"OK\",\"data\":{\"preprocessed_data_seq\":2,\"name\":\"kor_news\",\"file_name\":\"kor_news.TFRecord\",\"extension\":\"TFRecord\",\"path\":\"/home/tasolver/preprocessedData_file/admin\",\"parameters\":\"{\\\"max_vocab_size\\\":50000,\\\"optional_tags\\\":[\\\"ADCO\\\",\\\"ADSE\\\",\\\"AJMA\\\",\\\"AN\\\",\\\"AX\\\",\\\"CM\\\",\\\"CJ\\\",\\\"CO\\\",\\\"ENCM\\\",\\\"ENCO1\\\",\\\"ENCO2\\\",\\\"ENCO3\\\",\\\"ENTE\\\",\\\"ENTR1\\\",\\\"ENTR2\\\",\\\"EX\\\",\\\"FW\\\",\\\"LQ\\\",\\\"NNDE1\\\",\\\"NNDE2\\\",\\\"NNIN1\\\",\\\"NNIN2\\\",\\\"NU\\\",\\\"PE\\\",\\\"PN\\\",\\\"PPAD\\\",\\\"PPAU\\\",\\\"PPCA1\\\",\\\"PPCA2\\\",\\\"PPCA3\\\",\\\"PPCA4\\\",\\\"PPCJ\\\",\\\"PPCO\\\",\\\"SF\\\",\\\"RQ\\\",\\\"SC\\\",\\\"SF\\\",\\\"SY\\\",\\\"VBMA\\\"],\\\"is_tagging\\\":true,\\\"do_whole_word_mask\\\":false,\\\"max_seq_length\\\":128,\\\"max_predictions_per_seq\\\":20,\\\"random_seed\\\":12345,\\\"dupe_factor\\\":10,\\\"masked_lm_prob\\\":0.15,\\\"short_seq_prob\\\":0.1}\",\"columns\":null,\"label_info\":null,\"amount\":null,\"sample\":null,\"delete_flag\":false,\"state\":\"REQUEST\",\"start_datetime\":null,\"end_datetime\":null,\"celery_task_id\":null,\"create_datetime\":\"2020-05-29T19:08:52+09:00\",\"user_id\":\"admin\",\"description\":\"kor_news.txt 사용\",\"original_data_seq\":2,\"preprocessor_seq\":1}}";
			
			@SuppressWarnings("static-access")
			JSONObject json = new JSONObject().fromObject(text);
			System.out.println(json.toString());
			System.out.println(" \n ########################################################");			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
