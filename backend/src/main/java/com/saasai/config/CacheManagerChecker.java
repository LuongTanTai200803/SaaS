package com.saasai.config;

import jakarta.annotation.PostConstruct;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class CacheManagerChecker {

    private final CacheManager cacheManager;

    public CacheManagerChecker(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @PostConstruct
    public void printCacheManager() {
        System.out.println(
                "ACTIVE CACHE MANAGER: "
                        + cacheManager.getClass().getName()
        );
    }

    
}