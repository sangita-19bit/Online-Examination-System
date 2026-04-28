package com.onlineexam.config;

import com.onlineexam.model.Exam;
import com.onlineexam.model.Question;
import com.onlineexam.repository.ExamRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ExamRepository examRepository) {
        return args -> {
            if (examRepository.count() == 0) {

                // ── Helper ────────────────────────────────────────────────
                // In MongoDB, questions are embedded — no exam reference needed.

                // ── System Design ──────────────────────────────────────────
                Exam exam1 = new Exam();
                exam1.setTitle("System Design");
                exam1.setCategory("Assessment");
                exam1.setTimeLimitMinutes(10);
                exam1.setQuestions(List.of(
                    q("sd1", "Which of the following is an example of a NoSQL database?",
                        List.of("MySQL", "PostgreSQL", "MongoDB", "Oracle"), "MongoDB"),
                    q("sd2", "In CAP Theorem, what does 'A' stand for?",
                        List.of("Accuracy", "Availability", "Allocation", "Authentication"), "Availability"),
                    q("sd3", "Which pattern is commonly used to handle service failures gracefully?",
                        List.of("Singleton", "Circuit Breaker", "Observer", "Factory"), "Circuit Breaker"),
                    q("sd4", "What does CDN stand for?",
                        List.of("Content Delivery Network", "Central Data Node", "Cloud Distribution Network", "Content Data Node"), "Content Delivery Network"),
                    q("sd5", "Which consistency model offers the strongest guarantees?",
                        List.of("Eventual Consistency", "Causal Consistency", "Strong Consistency", "Monotonic Reads"), "Strong Consistency"),
                    q("sd6", "What is the primary purpose of a load balancer?",
                        List.of("Caching requests", "Encrypting traffic", "Distributing traffic across servers", "Compressing data"), "Distributing traffic across servers")
                ));
                examRepository.save(exam1);

                // ── Numerical Methods ──────────────────────────────────────
                Exam exam2 = new Exam();
                exam2.setTitle("Numerical Methods");
                exam2.setCategory("Online Quiz");
                exam2.setTimeLimitMinutes(8);
                exam2.setQuestions(List.of(
                    q("nm1", "Which method is also known as the method of chords?",
                        List.of("Newton-Raphson", "Bisection", "Secant", "Regula Falsi"), "Secant"),
                    q("nm2", "Runge-Kutta method is used for solving:",
                        List.of("Algebraic Equations", "Differential Equations", "Integration", "Interpolation"), "Differential Equations"),
                    q("nm3", "In the bisection method, the root is approximated by:",
                        List.of("Averaging two bounds", "Finding the derivative", "Gradient descent", "Newton's formula"), "Averaging two bounds"),
                    q("nm4", "Gaussian elimination is used to solve:",
                        List.of("Differential equations", "Systems of linear equations", "Polynomial fitting", "Eigenvalue problems only"), "Systems of linear equations"),
                    q("nm5", "Which integration rule applies the parabolic arc approximation?",
                        List.of("Trapezoidal Rule", "Midpoint Rule", "Simpson's 1/3 Rule", "Boole's Rule"), "Simpson's 1/3 Rule"),
                    q("nm6", "Fixed-point iteration converges when:",
                        List.of("|g'(x)| > 1", "|g'(x)| = 1", "|g'(x)| < 1", "g'(x) = 0"), "|g'(x)| < 1")
                ));
                examRepository.save(exam2);

                // ── Java Programming ───────────────────────────────────────
                Exam exam3 = new Exam();
                exam3.setTitle("Java Programming");
                exam3.setCategory("Online Quiz");
                exam3.setTimeLimitMinutes(8);
                exam3.setQuestions(List.of(
                    q("j1", "Which keyword is used to prevent a class from being subclassed in Java?",
                        List.of("static", "abstract", "final", "sealed"), "final"),
                    q("j2", "What is the default value of an int in Java?",
                        List.of("null", "1", "0", "-1"), "0"),
                    q("j3", "Which collection does NOT allow duplicate elements?",
                        List.of("ArrayList", "LinkedList", "HashSet", "Vector"), "HashSet"),
                    q("j4", "What is the time complexity of HashMap get() in the best case?",
                        List.of("O(n)", "O(log n)", "O(1)", "O(n²)"), "O(1)"),
                    q("j5", "Which interface must a class implement to support sorting with Collections.sort()?",
                        List.of("Serializable", "Comparator", "Comparable", "Iterable"), "Comparable"),
                    q("j6", "In Java, which exception is thrown when an array is accessed out of bounds?",
                        List.of("NullPointerException", "IndexOutOfBoundsException", "ArrayIndexOutOfBoundsException", "IllegalArgumentException"), "ArrayIndexOutOfBoundsException")
                ));
                examRepository.save(exam3);

                // ── Cloud Computing ────────────────────────────────────────
                Exam exam4 = new Exam();
                exam4.setTitle("Cloud Computing");
                exam4.setCategory("Assessment");
                exam4.setTimeLimitMinutes(10);
                exam4.setQuestions(List.of(
                    q("cc1", "Which cloud service model provides the most control to the user?",
                        List.of("SaaS", "PaaS", "IaaS", "FaaS"), "IaaS"),
                    q("cc2", "What does 'elasticity' mean in cloud computing?",
                        List.of("High availability", "Ability to scale resources up and down dynamically", "Data encryption at rest", "Multi-region deployment"), "Ability to scale resources up and down dynamically"),
                    q("cc3", "Which AWS service is used for serverless computing?",
                        List.of("EC2", "S3", "Lambda", "RDS"), "Lambda"),
                    q("cc4", "What is a Virtual Private Cloud (VPC) primarily used for?",
                        List.of("Storing files", "Isolating network resources", "Machine learning training", "Serverless execution"), "Isolating network resources"),
                    q("cc5", "Which cloud deployment model is exclusively used by one organization?",
                        List.of("Public Cloud", "Hybrid Cloud", "Community Cloud", "Private Cloud"), "Private Cloud"),
                    q("cc6", "What is the purpose of an API Gateway in cloud architecture?",
                        List.of("Storing objects", "Managing and routing client requests to backend services", "Running virtual machines", "Monitoring disk I/O"), "Managing and routing client requests to backend services")
                ));
                examRepository.save(exam4);

                // ── Theory of Computation ──────────────────────────────────
                Exam exam5 = new Exam();
                exam5.setTitle("Theory of Computation");
                exam5.setCategory("Online Quiz");
                exam5.setTimeLimitMinutes(8);
                exam5.setQuestions(List.of(
                    q("toc1", "Which of the following is NOT a regular language?",
                        List.of("Set of all strings over {0,1}", "a^n b^n for n≥0", "Set of all even-length strings", "Strings starting with 0"), "a^n b^n for n≥0"),
                    q("toc2", "A Turing Machine that always halts is called:",
                        List.of("Universal TM", "Non-deterministic TM", "Decider", "Enumerator"), "Decider"),
                    q("toc3", "The Halting Problem is:",
                        List.of("Decidable", "Undecidable", "In P", "NP-Complete"), "Undecidable"),
                    q("toc4", "Which automaton recognizes context-free languages?",
                        List.of("DFA", "NFA", "Pushdown Automaton", "Turing Machine"), "Pushdown Automaton"),
                    q("toc5", "Pumping Lemma is used to prove that a language is:",
                        List.of("Context-free", "Turing-recognizable", "Not regular", "Decidable"), "Not regular"),
                    q("toc6", "Which of the following problems is NP-Complete?",
                        List.of("Sorting", "Binary Search", "3-SAT", "Finding shortest path in DAG"), "3-SAT")
                ));
                examRepository.save(exam5);

                // ── Artificial Intelligence ────────────────────────────────
                Exam exam6 = new Exam();
                exam6.setTitle("Artificial Intelligence");
                exam6.setCategory("Assessment");
                exam6.setTimeLimitMinutes(10);
                exam6.setQuestions(List.of(
                    q("ai1", "Which search algorithm guarantees the optimal solution if the heuristic is admissible?",
                        List.of("DFS", "BFS", "A* Search", "Greedy Best-First Search"), "A* Search"),
                    q("ai2", "In a neural network, what does the activation function do?",
                        List.of("Initialize weights", "Introduce non-linearity", "Reduce dimensions", "Normalize inputs"), "Introduce non-linearity"),
                    q("ai3", "Which algorithm is used in decision tree learning to select the best split?",
                        List.of("Gradient Descent", "Backpropagation", "Information Gain / Gini Index", "K-means"), "Information Gain / Gini Index"),
                    q("ai4", "What type of learning does reinforcement learning fall under?",
                        List.of("Supervised Learning", "Unsupervised Learning", "Semi-supervised Learning", "Reward-based Learning"), "Reward-based Learning"),
                    q("ai5", "Which of the following is an unsupervised learning algorithm?",
                        List.of("Linear Regression", "K-Means Clustering", "Support Vector Machine", "Logistic Regression"), "K-Means Clustering"),
                    q("ai6", "What does 'overfitting' mean in machine learning?",
                        List.of("Model performs poorly on training data", "Model memorizes training data and fails on new data", "Model is too simple", "Model has too few parameters"), "Model memorizes training data and fails on new data")
                ));
                examRepository.save(exam6);
            }
        };
    }

    /** Convenience factory for creating an embedded Question. */
    private static Question q(String id, String text, List<String> options, String correctAnswer) {
        Question q = new Question();
        q.setId(id);
        q.setText(text);
        q.setOptions(options);
        q.setCorrectAnswer(correctAnswer);
        return q;
    }
}
