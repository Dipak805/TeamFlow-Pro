package com.teammanagement.service;

import com.teammanagement.dto.FileResponse;
import com.teammanagement.dto.UserSummary;
import com.teammanagement.model.FileAttachment;
import com.teammanagement.model.Task;
import com.teammanagement.model.User;
import com.teammanagement.repository.FileAttachmentRepository;
import com.teammanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Autowired private FileAttachmentRepository fileAttachmentRepository;
    @Autowired private TaskRepository taskRepository;

    @Transactional
    public FileResponse uploadFile(Long taskId, MultipartFile file, User uploader) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileAttachment attachment = new FileAttachment();
            attachment.setFileName(uniqueFileName);
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setFilePath(targetLocation.toString());
            attachment.setTask(task);
            attachment.setUploadedBy(uploader);

            attachment = fileAttachmentRepository.save(attachment);
            return toResponse(attachment);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public Resource loadFile(Long fileId) {
        FileAttachment attachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) return resource;
            throw new RuntimeException("File not found");
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    public List<FileResponse> getTaskFiles(Long taskId) {
        return fileAttachmentRepository.findByTaskId(taskId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long fileId) {
        FileAttachment attachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        try {
            Files.deleteIfExists(Paths.get(attachment.getFilePath()).normalize());
        } catch (IOException e) { /* log */ }
        fileAttachmentRepository.delete(attachment);
    }

    public String getOriginalFileName(Long fileId) {
        return fileAttachmentRepository.findById(fileId)
                .map(FileAttachment::getOriginalFileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    private FileResponse toResponse(FileAttachment f) {
        UserSummary uploader = new UserSummary();
        uploader.setId(f.getUploadedBy().getId());
        uploader.setFullName(f.getUploadedBy().getFullName());
        uploader.setUsername(f.getUploadedBy().getUsername());

        FileResponse r = new FileResponse();
        r.setId(f.getId());
        r.setFileName(f.getFileName());
        r.setOriginalFileName(f.getOriginalFileName());
        r.setFileType(f.getFileType());
        r.setFileSize(f.getFileSize());
        r.setUploadedBy(uploader);
        r.setCreatedAt(f.getCreatedAt());
        return r;
    }
}
