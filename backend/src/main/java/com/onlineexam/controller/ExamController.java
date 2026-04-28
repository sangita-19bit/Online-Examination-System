package com.onlineexam.controller;

import com.onlineexam.model.Exam;
import com.onlineexam.model.ExamResult;
import com.onlineexam.model.Question;
import com.onlineexam.repository.ExamRepository;
import com.onlineexam.repository.ExamResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
// CORS is handled globally by WebConfig
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @GetMapping("/exams")
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable String id) {
        return examRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/exams/{id}/submit")
    public ResponseEntity<?> submitExam(@PathVariable String id, @RequestBody SubmitExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElse(null);
        if (exam == null) {
            return ResponseEntity.notFound().build();
        }

        int score = 0;
        int total = exam.getQuestions().size();

        for (Question q : exam.getQuestions()) {
            String userAnswer = request.getAnswers().get(q.getId());
            if (userAnswer != null && userAnswer.equals(q.getCorrectAnswer())) {
                score++;
            }
        }

        ExamResult result = new ExamResult();
        result.setUsername(request.getUsername());
        result.setExamId(exam.getId());
        result.setExamTitle(exam.getTitle());
        result.setScore(score);
        result.setTotalQuestions(total);
        result.setCompletedAt(LocalDateTime.now());
        result.setUserAnswers(request.getAnswers());

        return ResponseEntity.ok(examResultRepository.save(result));
    }

    @GetMapping("/results/{username}")
    public List<ExamResultResponse> getResultsByUser(@PathVariable String username) {
        List<ExamResult> results = examResultRepository.findByUsernameOrderByCompletedAtDesc(username);

        return results.stream().map(r -> {
            ExamResultResponse res = new ExamResultResponse();
            res.setId(r.getId());
            res.setExamTitle(r.getExamTitle());
            res.setScore(r.getScore());
            res.setTotalQuestions(r.getTotalQuestions());
            res.setCompletedAt(r.getCompletedAt());

            // Fetch the exam to build per-question details
            List<AnswerDetail> details = new ArrayList<>();
            examRepository.findById(r.getExamId()).ifPresent(exam -> {
                details.addAll(exam.getQuestions().stream().map(q -> {
                    AnswerDetail ad = new AnswerDetail();
                    ad.setQuestionText(q.getText());
                    ad.setCorrectAnswer(q.getCorrectAnswer());
                    ad.setUserAnswer(r.getUserAnswers() != null ? r.getUserAnswers().get(q.getId()) : null);
                    return ad;
                }).collect(Collectors.toList()));
            });

            res.setDetails(details);
            return res;
        }).collect(Collectors.toList());
    }
}

class SubmitExamRequest {
    private String username;
    private Map<String, String> answers; // questionId (String) → answer

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
}

class ExamResultResponse {
    private String id;
    private String examTitle;
    private int score;
    private int totalQuestions;
    private java.time.LocalDateTime completedAt;
    private List<AnswerDetail> details;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public java.time.LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(java.time.LocalDateTime completedAt) { this.completedAt = completedAt; }

    public List<AnswerDetail> getDetails() { return details; }
    public void setDetails(List<AnswerDetail> details) { this.details = details; }
}

class AnswerDetail {
    private String questionText;
    private String correctAnswer;
    private String userAnswer;

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
}
