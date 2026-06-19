package com.saasai.storage;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class LocalStorageServiceImpl implements StorageService {
    private final Path basePath;

    public LocalStorageServiceImpl(String basePath) {
        this.basePath = Paths.get(StringUtils.hasText(basePath) ? basePath : "uploads/");
    }

    @Override
    public String storeFile(MultipartFile file, String fileName) throws IOException {
        if (!Files.exists(basePath)) {
            Files.createDirectories(basePath);
        }
        Path target = basePath.resolve(fileName);
        Files.write(target, file.getBytes());
        return target.toString();
    }

    @Override
    public byte[] loadFile(String fileName) throws IOException {
        return Files.readAllBytes(basePath.resolve(fileName));
    }

    @Override
    public boolean exists(String fileName) throws IOException {
        return Files.exists(basePath.resolve(fileName));
    }
}
