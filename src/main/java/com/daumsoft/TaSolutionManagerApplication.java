package com.daumsoft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaSolutionManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaSolutionManagerApplication.class, args);
	}

}
