package com.jobconnect.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(FileStorageConfig.class);

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path profiles = root.resolve("profiles");
            Path resumes = root.resolve("resumes");
            Path employerDocs = root.resolve("employer-documents");
            Path complaints = root.resolve("complaints");

            Files.createDirectories(profiles);
            Files.createDirectories(resumes);
            Files.createDirectories(employerDocs);
            Files.createDirectories(complaints);

            log.info("Storage directories initialized at: {}", root);
        } catch (Exception ex) {
            log.error("Could not create storage directories", ex);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String uploadUri = uploadPath.toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadUri.endsWith("/") ? uploadUri : uploadUri + "/");
    }
}
