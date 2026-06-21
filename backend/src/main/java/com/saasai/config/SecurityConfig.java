package com.saasai.config;

import com.saasai.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
        // Yêu cầu Spring Security bỏ qua hoàn toàn các đường dẫn của Swagger,
        // để nó không bị chặn bởi bất kỳ Security Filter nào (kể cả JWT)
        return (web) -> web.ignoring().requestMatchers(
                "/v3/api-docs",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configure(http))
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
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/api/v1/auth/refresh").permitAll()
                        .requestMatchers("/v3/api-docs", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                        .permitAll()
                        .anyRequest().authenticated() // Các API còn lại bắt buộc phải có Token
                );

        // Thêm Filter kiểm tra JWT trước bộ lọc mặc định của Spring
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}