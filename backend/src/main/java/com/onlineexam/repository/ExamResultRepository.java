package com.onlineexam.repository;

import com.onlineexam.model.ExamResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExamResultRepository extends MongoRepository<ExamResult, String> {
    List<ExamResult> findByUsernameOrderByCompletedAtDesc(String username);
}
