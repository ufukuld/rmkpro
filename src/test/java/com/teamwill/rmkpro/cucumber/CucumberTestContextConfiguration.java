package com.teamwill.rmkpro.cucumber;

import com.teamwill.rmkpro.RmkproApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = RmkproApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
