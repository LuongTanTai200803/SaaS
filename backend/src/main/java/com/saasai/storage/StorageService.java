package com.saasai.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    String storeFile(MultipartFile file, String fileName) throws IOException;
    byte[] loadFile(String fileName) throws IOException;
    boolean exists(String fileName) throws IOException;
}
