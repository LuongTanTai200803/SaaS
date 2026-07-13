package com.saasai.config;

import com.saasai.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
                "/v3/api-docs",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html");
    }

    // 🎯 BỔ SUNG: Cấu hình CORS chi tiết cho môi trường Production (Vercel) và Local
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Cấp quyền cho Local và chính xác Domain Vercel của bạn thông quan
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173", 
                "https://saa-s-zeta-six.vercel.app"
        ));
        
        // Hỗ trợ đầy đủ các phương thức, đặc biệt phải có OPTIONS
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Cho phép các Headers cần thiết, bao gồm Authorization và ngrok-skip-browser-warning để né bẫy ngrok
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", 
                "Content-Type", 
                "Accept", 
                "X-Requested-With", 
                "ngrok-skip-browser-warning"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Trình duyệt cache cấu hình CORS trong 1 tiếng

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho toàn bộ API
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // 🎯 ĐÃ CẬP NHẬT: Trỏ cấu hình CORS về corsConfigurationSource() vừa viết ở trên
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                                Object authErrorObj = request.getAttribute(JwtAuthenticationFilter.AUTH_ERROR_ATTR);
                                String authError = authErrorObj != null ? authErrorObj.toString() : "";

                                String message;
                                if (JwtAuthenticationFilter.AUTH_ERROR_TOKEN_EXPIRED.equals(authError)) {
                                    message = "Access token đã hết hạn, vui lòng đăng nhập lại.";
                                } else if (JwtAuthenticationFilter.AUTH_ERROR_TOKEN_BLACKLISTED.equals(authError)) {
                                    message = "Phiên đăng nhập đã bị thu hồi, vui lòng đăng nhập lại.";
                                } else if (JwtAuthenticationFilter.AUTH_ERROR_TOKEN_INVALID.equals(authError)) {
                                    message = "Access token không hợp lệ.";
                                } else {
                                    message = "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.";
                                }

                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.setContentType("application/json;charset=UTF-8");
                                response.getWriter().write(
                                        "{\"success\":false,\"message\":\"" + message + "\",\"statusCode\":401}"
                                );
                            }))
                .authorizeHttpRequests(auth -> auth
                        // 🚀 CHÍ MẠNG: Cho phép tất cả các request OPTIONS (Preflight) đi qua không cần kiểm tra Token
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/refresh", "/api/v1/auth/google").permitAll()
                        .requestMatchers("/v3/api-docs", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}