package com.onlineexam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

/**
 * Question is embedded inside Exam — no separate MongoDB collection.
 * It uses a plain String id so the frontend can refer to questions by id.
 */
public class Question {

    private String id;   // set manually in DataLoader (e.g. "q1", "q2")

    private String text;
    private List<String> options;

    @JsonIgnore
    private String correctAnswer;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
