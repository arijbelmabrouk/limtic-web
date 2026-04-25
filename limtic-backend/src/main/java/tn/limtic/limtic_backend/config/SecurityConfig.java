package tn.limtic.limtic_backend.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RateLimitFilter rateLimitFilter;

    // On supprime JwtFilter — on n'en a plus besoin
    public SecurityConfig(RateLimitFilter rateLimitFilter) {
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ── CSRF ──────────────────────────────────────────────
            // CookieCsrfTokenRepository : Spring envoie un cookie XSRF-TOKEN
            // Angular lit ce cookie et le met dans le header X-XSRF-TOKEN
            // Spring vérifie que les deux correspondent
            // withHttpOnlyFalse() = Angular (JS) peut lire le cookie XSRF-TOKEN
            // (ce n'est pas un problème car ce cookie n'est pas secret)
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                // Exempter les routes auth du CSRF
                // car l'utilisateur n'est pas encore connecté
                // donc pas de cookie XSRF-TOKEN disponible
                .ignoringRequestMatchers("/api/auth/login")
                .ignoringRequestMatchers("/api/auth/signup")
                .ignoringRequestMatchers("/api/auth/forgot-password")
                .ignoringRequestMatchers("/api/auth/reset-password")
            )

            // ── Session ───────────────────────────────────────────
            // IF_REQUIRED = Spring crée une session uniquement si nécessaire
            // (au login) — plus de stateless JWT
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                // Empêche la fixation de session : Spring crée un nouvel ID
                // de session après le login → sécurité renforcée
                .sessionFixation().migrateSession()
                // Maximum 1 session par utilisateur
                .maximumSessions(1)
            )

            // ── Gestion des erreurs d'auth ────────────────────────
            // Sans ça, Spring redirige vers /login (page HTML)
            // On veut du JSON à la place
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

            // ── Autorisations ─────────────────────────────────────
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("GET", "/api/masteriens/**").permitAll()
                .requestMatchers("GET", "/api/chercheurs/**").permitAll()
                .requestMatchers("GET", "/api/publications/**").permitAll()
                .requestMatchers("GET", "/api/evenements/**").permitAll()
                .requestMatchers("GET", "/api/outils/**").permitAll()
                .requestMatchers("GET", "/api/axes/**").permitAll()
                .requestMatchers("GET", "/api/doctorants/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("POST", "/api/contact").permitAll()
                .anyRequest().authenticated()
            )

            // Rate limiter reste — juste avant le traitement
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Dev frontend peut tourner en HTTP ou HTTPS
        config.setAllowedOrigins(List.of("http://localhost:4200", "https://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of(
            "Content-Type",
            "Accept",
            "X-Requested-With",
            "X-XSRF-TOKEN"  // ← header CSRF qu'Angular va envoyer
        ));
        config.setExposedHeaders(List.of("X-XSRF-TOKEN"));
        // OBLIGATOIRE pour que les cookies soient envoyés cross-origin
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}