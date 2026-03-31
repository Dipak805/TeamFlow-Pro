package com.teammanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_attachments")
public class FileAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public FileAttachment() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ===================== GETTERS =====================
    public Long getId() { return id; }
    public String getFileName() { return fileName; }
    public String getOriginalFileName() { return originalFileName; }
    public String getFileType() { return fileType; }
    public Long getFileSize() { return fileSize; }
    public String getFilePath() { return filePath; }
    public Task getTask() { return task; }
    public User getUploadedBy() { return uploadedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ===================== SETTERS =====================
    public void setId(Long id) { this.id = id; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setTask(Task task) { this.task = task; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
