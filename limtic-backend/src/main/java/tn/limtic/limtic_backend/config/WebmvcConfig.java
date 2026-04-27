package tn.limtic.limtic_backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sert les fichiers uploadés (photos, PDFs…) comme ressources statiques.
 * URL d'accès : /uploads/publications/xxx.pdf, /uploads/evenements/xxx.jpg, etc.
 */
@Configuration
public class WebmvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Anchored to the JVM working directory so it matches where the controller writes files
        Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir)
                               .toAbsolutePath()
                               .normalize();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}