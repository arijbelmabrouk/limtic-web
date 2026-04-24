package tn.limtic.limtic_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tn.limtic.limtic_backend.filter.RateLimitFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(JwtFilter jwtFilter, RateLimitFilter rateLimitFilter) {
        this.jwtFilter = jwtFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // JWT = stateless, CSRF inutile
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("GET",  "/api/masteriens/**").permitAll()
                .requestMatchers("GET",  "/api/chercheurs/**").permitAll()
                .requestMatchers("GET",  "/api/publications/**").permitAll()
                .requestMatchers("GET",  "/api/evenements/**").permitAll()
                .requestMatchers("GET",  "/api/outils/**").permitAll()
                .requestMatchers("GET",  "/api/axes/**").permitAll()
                .requestMatchers("GET",  "/api/doctorants/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("POST", "/api/contact").permitAll()
                .anyRequest().authenticated()
            )
            // Rate limiter passe EN PREMIER, avant JWT
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtFilter,       UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // En prod, remplace par ton vrai domaine
        config.setAllowedOrigins(List.of("http://localhost:4200"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Plus restrictif que "*" : liste explicite des headers acceptés
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "X-Requested-With"
        ));

        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // cache preflight 1h

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}