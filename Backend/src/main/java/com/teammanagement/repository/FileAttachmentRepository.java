package com.teammanagement.repository;

import com.teammanagement.model.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    List<FileAttachment> findByTaskId(Long taskId);
    List<FileAttachment> findByUploadedById(Long userId);
}
