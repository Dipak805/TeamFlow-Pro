package com.teammanagement.dto;
import java.time.LocalDateTime;

public class FileResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private UserSummary uploadedBy;
    private LocalDateTime createdAt;

    public FileResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public UserSummary getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(UserSummary uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
