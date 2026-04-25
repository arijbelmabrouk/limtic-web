package tn.limtic.limtic_backend.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tn.limtic.limtic_backend.filter.RateLimitFilter;

import java.util.List;

/**
 * Configuration de sécurité Spring Security.
 *
 * CORRECTIONS apportées :
 * 1. Swagger UI (/swagger-ui/**, /api-docs/**) protégé → accessible uniquement aux ADMIN
 * 2. Routes /api/admin/** → ADMIN seulement
 * 3. /api/admin/parametres/public → public (sans auth)
 * 4. Upload de fichiers → authentifié
 * 5. @EnableMethodSecurity activé pour @PreAuthorize sur les controllers
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // ← Active @PreAuthorize sur les méthodes de controllers
public class SecurityConfig {

    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(RateLimitFilter rateLimitFilter) {
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                .ignoringRequestMatchers("/api/auth/login")
                .ignoringRequestMatchers("/api/auth/signup")
                .ignoringRequestMatchers("/api/auth/forgot-password")
                .ignoringRequestMatchers("/api/auth/reset-password")
                // Multipart upload nécessite l'ignorance CSRF car FormData ne peut pas
                // inclure le header X-XSRF-TOKEN facilement depuis Angular
                .ignoringRequestMatchers("/api/evenements/*/photos")
                .ignoringRequestMatchers("/api/admin/chercheurs/import-csv")
            )

            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .sessionFixation().migrateSession()
                .maximumSessions(1)
            )

            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, e) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Non authentifié\"}");
                })
                .accessDeniedHandler((request, response, e) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Accès refusé\"}");
                })
            )

            .authorizeHttpRequests(auth -> auth

                // ── §SÉCURITÉ : Swagger protégé par rôle ADMIN ──────────────
                // Avant : permitAll() — corrigé pour ne pas exposer l'API publiquement
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html")
                    .hasRole("ADMIN")

                // ── Paramètres publics (nom labo, logo, contact) ─────────────
                .requestMatchers("GET", "/api/admin/parametres/public").permitAll()

                // ── Routes publiques en lecture ──────────────────────────────
                .requestMatchers("GET", "/api/masteriens/**").permitAll()
                .requestMatchers("GET", "/api/chercheurs/**").permitAll()
                .requestMatchers("GET", "/api/publications/**").permitAll()
                .requestMatchers("GET", "/api/evenements/**").permitAll()
                .requestMatchers("GET", "/api/outils/**").permitAll()
                .requestMatchers("GET", "/api/axes/**").permitAll()
                .requestMatchers("GET", "/api/doctorants/**").permitAll()

                // Servir les fichiers uploadés publiquement
                .requestMatchers("/uploads/**").permitAll()

                // ── Authentification ─────────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("POST", "/api/contact").permitAll()

                // ── Administration (ADMIN seulement) ─────────────────────────
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ── Tout le reste nécessite une authentification ─────────────
                .anyRequest().authenticated()
            )

            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200", "https://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of(
            "Content-Type",
            "Accept",
            "X-Requested-With",
            "X-XSRF-TOKEN"
        ));
        config.setExposedHeaders(List.of("X-XSRF-TOKEN", "Content-Disposition"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
