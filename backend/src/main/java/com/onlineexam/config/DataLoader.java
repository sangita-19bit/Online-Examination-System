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

    // IDs of every exam this loader is responsible for.
    // Add a new ID here whenever you add a new exam below.
    private static final List<String> MANAGED_EXAM_IDS = List.of(
        "exam-system-design",
        "exam-numerical-methods",
        "exam-java-programming",
        "exam-cloud-computing",
        "exam-theory-of-computation",
        "exam-artificial-intelligence",
        // ── New exams ──────────────────────────────────────────────────────
        "exam-data-structures",
        "exam-dbms",
        "exam-operating-systems",
        "exam-computer-networks",
        "exam-web-development",
        "exam-python-programming",
        "exam-software-engineering",
        "exam-cybersecurity",
        "exam-discrete-mathematics",
        "exam-aptitude-reasoning"
    );

    @Bean
    CommandLineRunner initDatabase(ExamRepository examRepository) {
        return args -> {

            // ── Seed original exams (only if they don't exist by ID) ────────

            if (!examRepository.existsById("exam-system-design")) {
                Exam e = new Exam();
                e.setId("exam-system-design");
                e.setTitle("System Design");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            if (!examRepository.existsById("exam-numerical-methods")) {
                Exam e = new Exam();
                e.setId("exam-numerical-methods");
                e.setTitle("Numerical Methods");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(8);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            if (!examRepository.existsById("exam-java-programming")) {
                Exam e = new Exam();
                e.setId("exam-java-programming");
                e.setTitle("Java Programming");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(8);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            if (!examRepository.existsById("exam-cloud-computing")) {
                Exam e = new Exam();
                e.setId("exam-cloud-computing");
                e.setTitle("Cloud Computing");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            if (!examRepository.existsById("exam-theory-of-computation")) {
                Exam e = new Exam();
                e.setId("exam-theory-of-computation");
                e.setTitle("Theory of Computation");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(8);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            if (!examRepository.existsById("exam-artificial-intelligence")) {
                Exam e = new Exam();
                e.setId("exam-artificial-intelligence");
                e.setTitle("Artificial Intelligence");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
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
                examRepository.save(e);
            }

            // ═══════════════════════════════════════════════════════════════
            // NEW EXAMS
            // ═══════════════════════════════════════════════════════════════

            // ── Data Structures & Algorithms ───────────────────────────────
            if (!examRepository.existsById("exam-data-structures")) {
                Exam e = new Exam();
                e.setId("exam-data-structures");
                e.setTitle("Data Structures & Algorithms");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(12);
                e.setQuestions(List.of(
                    q("ds1", "What is the time complexity of binary search on a sorted array of n elements?",
                        List.of("O(n)", "O(log n)", "O(n log n)", "O(1)"), "O(log n)"),
                    q("ds2", "Which data structure follows the LIFO (Last In First Out) principle?",
                        List.of("Queue", "Stack", "Deque", "Linked List"), "Stack"),
                    q("ds3", "What is the worst-case time complexity of QuickSort?",
                        List.of("O(n log n)", "O(n)", "O(n²)", "O(log n)"), "O(n²)"),
                    q("ds4", "In a max-heap, which element is always at the root?",
                        List.of("Smallest element", "Largest element", "Median element", "Random element"), "Largest element"),
                    q("ds5", "Which traversal of a Binary Search Tree yields elements in sorted order?",
                        List.of("Pre-order", "Post-order", "In-order", "Level-order"), "In-order"),
                    q("ds6", "What is the space complexity of Merge Sort?",
                        List.of("O(1)", "O(log n)", "O(n)", "O(n²)"), "O(n)"),
                    q("ds7", "A graph with V vertices and no cycles has at most how many edges (as a tree)?",
                        List.of("V", "V-1", "V+1", "V²"), "V-1"),
                    q("ds8", "Which algorithm finds the shortest path in an unweighted graph?",
                        List.of("DFS", "BFS", "Dijkstra", "Bellman-Ford"), "BFS"),
                    q("ds9", "What data structure is used internally by a priority queue?",
                        List.of("Array", "Linked List", "Heap", "Hash Table"), "Heap"),
                    q("ds10", "Amortized time complexity of push and pop operations on a dynamic array is:",
                        List.of("O(n) each", "O(log n) each", "O(1) each", "O(n²) each"), "O(1) each")
                ));
                examRepository.save(e);
            }

            // ── Database Management Systems ────────────────────────────────
            if (!examRepository.existsById("exam-dbms")) {
                Exam e = new Exam();
                e.setId("exam-dbms");
                e.setTitle("Database Management Systems");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(12);
                e.setQuestions(List.of(
                    q("db1", "Which normal form eliminates transitive functional dependencies?",
                        List.of("1NF", "2NF", "3NF", "BCNF"), "3NF"),
                    q("db2", "Which SQL command is used to remove all rows from a table without logging individual row deletions?",
                        List.of("DELETE", "DROP", "TRUNCATE", "REMOVE"), "TRUNCATE"),
                    q("db3", "What does ACID stand for in database transactions?",
                        List.of("Array, Consistency, Isolation, Durability", "Atomicity, Consistency, Isolation, Durability", "Atomicity, Concurrency, Integrity, Durability", "Availability, Consistency, Isolation, Distribution"), "Atomicity, Consistency, Isolation, Durability"),
                    q("db4", "Which join returns all rows from the left table and matched rows from the right table?",
                        List.of("INNER JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "LEFT JOIN"), "LEFT JOIN"),
                    q("db5", "In an ER diagram, a diamond shape represents:",
                        List.of("Entity", "Attribute", "Relationship", "Key"), "Relationship"),
                    q("db6", "Which index type is most efficient for range queries?",
                        List.of("Hash Index", "B-Tree Index", "Bitmap Index", "Full-Text Index"), "B-Tree Index"),
                    q("db7", "What is a foreign key?",
                        List.of("A key that is unique in its table", "A key that references a primary key in another table", "A key that cannot be null", "A composite key"), "A key that references a primary key in another table"),
                    q("db8", "Which SQL clause is used to filter groups after aggregation?",
                        List.of("WHERE", "FILTER", "HAVING", "GROUP BY"), "HAVING"),
                    q("db9", "Which concurrency control protocol uses locks to manage transactions?",
                        List.of("MVCC", "Two-Phase Locking (2PL)", "Timestamp Ordering", "Optimistic Concurrency"), "Two-Phase Locking (2PL)"),
                    q("db10", "Denormalization is primarily done to improve:",
                        List.of("Data integrity", "Write performance", "Read/query performance", "Storage efficiency"), "Read/query performance")
                ));
                examRepository.save(e);
            }

            // ── Operating Systems ──────────────────────────────────────────
            if (!examRepository.existsById("exam-operating-systems")) {
                Exam e = new Exam();
                e.setId("exam-operating-systems");
                e.setTitle("Operating Systems");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
                    q("os1", "Which scheduling algorithm can lead to starvation of low-priority processes?",
                        List.of("Round Robin", "FCFS", "Priority Scheduling", "SRTF"), "Priority Scheduling"),
                    q("os2", "What is a deadlock?",
                        List.of("A process running for too long", "A situation where processes wait indefinitely for resources held by each other", "A memory overflow error", "A CPU cache miss"), "A situation where processes wait indefinitely for resources held by each other"),
                    q("os3", "Which page replacement algorithm suffers from Belady's anomaly?",
                        List.of("LRU", "Optimal", "FIFO", "LFU"), "FIFO"),
                    q("os4", "What does a TLB (Translation Lookaside Buffer) do?",
                        List.of("Stores disk blocks", "Caches virtual-to-physical address translations", "Manages process scheduling", "Handles interrupts"), "Caches virtual-to-physical address translations"),
                    q("os5", "Which of the following is NOT a condition for deadlock?",
                        List.of("Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"), "Preemption"),
                    q("os6", "In a multiprogramming system, the degree of multiprogramming refers to:",
                        List.of("Number of CPUs", "Number of processes in memory", "Number of I/O devices", "Clock speed of the CPU"), "Number of processes in memory"),
                    q("os7", "Which memory allocation strategy always allocates the smallest sufficient free block?",
                        List.of("First Fit", "Best Fit", "Worst Fit", "Next Fit"), "Best Fit"),
                    q("os8", "What is a semaphore used for?",
                        List.of("Memory management", "Process synchronization", "Disk scheduling", "File compression"), "Process synchronization"),
                    q("os9", "A process in the 'blocked' state is waiting for:",
                        List.of("CPU time", "An I/O event or resource", "Memory allocation", "Context switch"), "An I/O event or resource"),
                    q("os10", "Which file system structure uses inodes to store file metadata?",
                        List.of("FAT32", "NTFS", "ext4", "exFAT"), "ext4")
                ));
                examRepository.save(e);
            }

            // ── Computer Networks ──────────────────────────────────────────
            if (!examRepository.existsById("exam-computer-networks")) {
                Exam e = new Exam();
                e.setId("exam-computer-networks");
                e.setTitle("Computer Networks");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(12);
                e.setQuestions(List.of(
                    q("cn1", "Which layer of the OSI model is responsible for routing packets between networks?",
                        List.of("Data Link Layer", "Transport Layer", "Network Layer", "Physical Layer"), "Network Layer"),
                    q("cn2", "What does DNS stand for?",
                        List.of("Data Network System", "Domain Name System", "Dynamic Network Service", "Distributed Node Server"), "Domain Name System"),
                    q("cn3", "Which protocol provides reliable, connection-oriented communication?",
                        List.of("UDP", "ICMP", "TCP", "ARP"), "TCP"),
                    q("cn4", "What is the default port number for HTTPS?",
                        List.of("80", "21", "443", "8080"), "443"),
                    q("cn5", "Which IP address class supports the largest number of hosts per network?",
                        List.of("Class A", "Class B", "Class C", "Class D"), "Class A"),
                    q("cn6", "What does the ARP protocol resolve?",
                        List.of("Domain names to IP addresses", "IP addresses to MAC addresses", "MAC addresses to domain names", "Port numbers to services"), "IP addresses to MAC addresses"),
                    q("cn7", "Which congestion control algorithm is used by TCP?",
                        List.of("Token Bucket", "Leaky Bucket", "Slow Start / AIMD", "CSMA/CD"), "Slow Start / AIMD"),
                    q("cn8", "A subnet mask of 255.255.255.0 corresponds to which CIDR notation?",
                        List.of("/8", "/16", "/24", "/32"), "/24"),
                    q("cn9", "Which protocol is used to assign IP addresses automatically to devices?",
                        List.of("FTP", "DHCP", "SMTP", "SNMP"), "DHCP"),
                    q("cn10", "The three-way handshake in TCP consists of:",
                        List.of("SYN, FIN, ACK", "SYN, SYN-ACK, ACK", "ACK, SYN, FIN", "SYN, ACK, RST"), "SYN, SYN-ACK, ACK")
                ));
                examRepository.save(e);
            }

            // ── Web Development ────────────────────────────────────────────
            if (!examRepository.existsById("exam-web-development")) {
                Exam e = new Exam();
                e.setId("exam-web-development");
                e.setTitle("Web Development");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
                    q("wd1", "Which HTML tag is used to link an external CSS stylesheet?",
                        List.of("<script>", "<style>", "<link>", "<meta>"), "<link>"),
                    q("wd2", "What does CSS 'box model' consist of?",
                        List.of("Content, Padding, Border, Margin", "Header, Footer, Sidebar, Main", "Width, Height, Color, Font", "Grid, Flex, Block, Inline"), "Content, Padding, Border, Margin"),
                    q("wd3", "Which HTTP method is idempotent and used to fully update a resource?",
                        List.of("POST", "PATCH", "PUT", "DELETE"), "PUT"),
                    q("wd4", "What is the purpose of localStorage in browsers?",
                        List.of("Running server-side scripts", "Persisting data in the browser across sessions", "Managing HTTP requests", "Caching API responses server-side"), "Persisting data in the browser across sessions"),
                    q("wd5", "In React, what hook is used to manage component state?",
                        List.of("useEffect", "useContext", "useState", "useRef"), "useState"),
                    q("wd6", "What does CORS stand for?",
                        List.of("Client Origin Resource Sharing", "Cross-Origin Resource Sharing", "Cross-Object Rendering System", "Content Origin Response Standard"), "Cross-Origin Resource Sharing"),
                    q("wd7", "Which status code indicates a resource was successfully created?",
                        List.of("200 OK", "204 No Content", "201 Created", "301 Moved Permanently"), "201 Created"),
                    q("wd8", "What is the purpose of a JWT (JSON Web Token)?",
                        List.of("Compressing JSON data", "Encrypting database records", "Stateless authentication and authorization", "Formatting API responses"), "Stateless authentication and authorization"),
                    q("wd9", "Which CSS property is used to make a flex container wrap its children?",
                        List.of("flex-direction: wrap", "flex-wrap: wrap", "align-items: wrap", "justify-content: wrap"), "flex-wrap: wrap"),
                    q("wd10", "What does the 'defer' attribute on a <script> tag do?",
                        List.of("Executes the script immediately", "Loads the script asynchronously and executes after HTML parsing", "Blocks HTML parsing until script loads", "Prevents the script from running"), "Loads the script asynchronously and executes after HTML parsing")
                ));
                examRepository.save(e);
            }

            // ── Python Programming ─────────────────────────────────────────
            if (!examRepository.existsById("exam-python-programming")) {
                Exam e = new Exam();
                e.setId("exam-python-programming");
                e.setTitle("Python Programming");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
                    q("py1", "Which of the following is an immutable data type in Python?",
                        List.of("List", "Dictionary", "Set", "Tuple"), "Tuple"),
                    q("py2", "What does the 'yield' keyword do in Python?",
                        List.of("Returns a value and exits the function", "Pauses a function and returns a value, making it a generator", "Throws an exception", "Imports a module"), "Pauses a function and returns a value, making it a generator"),
                    q("py3", "Which built-in function returns the memory address of an object in Python?",
                        List.of("type()", "id()", "hash()", "ref()"), "id()"),
                    q("py4", "What is the output of: list(range(2, 10, 3))?",
                        List.of("[2, 5, 8]", "[2, 4, 6, 8]", "[2, 3, 4, 5, 6, 7, 8, 9]", "[2, 5, 8, 11]"), "[2, 5, 8]"),
                    q("py5", "Which Python keyword is used to handle exceptions?",
                        List.of("catch", "rescue", "except", "handle"), "except"),
                    q("py6", "What does the __init__ method in a Python class do?",
                        List.of("Deletes an instance", "Initializes a new instance of the class", "Defines a class method", "Imports the class"), "Initializes a new instance of the class"),
                    q("py7", "Which module in Python is used for regular expressions?",
                        List.of("regex", "re", "pattern", "string"), "re"),
                    q("py8", "What is the result of 3 ** 2 in Python?",
                        List.of("6", "9", "8", "5"), "9"),
                    q("py9", "Which of these creates a shallow copy of a list in Python?",
                        List.of("list.deepcopy()", "list[:]", "list.copy() or list[:]", "copy.deepcopy(list)"), "list.copy() or list[:]"),
                    q("py10", "What is the Global Interpreter Lock (GIL) in Python?",
                        List.of("A memory protection mechanism", "A mutex that prevents multiple threads from executing Python bytecode simultaneously", "A garbage collection algorithm", "A security feature for file access"), "A mutex that prevents multiple threads from executing Python bytecode simultaneously")
                ));
                examRepository.save(e);
            }

            // ── Software Engineering ───────────────────────────────────────
            if (!examRepository.existsById("exam-software-engineering")) {
                Exam e = new Exam();
                e.setId("exam-software-engineering");
                e.setTitle("Software Engineering");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(12);
                e.setQuestions(List.of(
                    q("se1", "Which SDLC model is best suited for projects with well-defined, unchanging requirements?",
                        List.of("Agile", "Spiral", "Waterfall", "Scrum"), "Waterfall"),
                    q("se2", "In Agile, a 'Sprint' typically lasts:",
                        List.of("1 day", "1 week", "1–4 weeks", "3 months"), "1–4 weeks"),
                    q("se3", "What does 'refactoring' mean in software development?",
                        List.of("Adding new features", "Fixing bugs", "Restructuring existing code without changing its external behavior", "Rewriting the application from scratch"), "Restructuring existing code without changing its external behavior"),
                    q("se4", "Which design pattern ensures only one instance of a class exists?",
                        List.of("Factory", "Observer", "Singleton", "Decorator"), "Singleton"),
                    q("se5", "What is the purpose of unit testing?",
                        List.of("Testing the entire system end-to-end", "Testing individual components or functions in isolation", "Testing user interface interactions", "Testing database performance"), "Testing individual components or functions in isolation"),
                    q("se6", "Which metric measures the number of independent paths through a program?",
                        List.of("Lines of Code", "Cyclomatic Complexity", "Function Points", "Code Coverage"), "Cyclomatic Complexity"),
                    q("se7", "What does CI/CD stand for?",
                        List.of("Code Inspection / Code Deployment", "Continuous Integration / Continuous Delivery", "Component Integration / Component Delivery", "Continuous Inspection / Continuous Design"), "Continuous Integration / Continuous Delivery"),
                    q("se8", "Which UML diagram shows the dynamic behavior of a system over time?",
                        List.of("Class Diagram", "Component Diagram", "Use Case Diagram", "Sequence Diagram"), "Sequence Diagram"),
                    q("se9", "The SOLID principle 'D' stands for:",
                        List.of("Data Abstraction", "Dependency Inversion", "Design Pattern", "Dynamic Binding"), "Dependency Inversion"),
                    q("se10", "What is 'technical debt' in software engineering?",
                        List.of("The cost of software licenses", "The implied future cost of choosing an easy/quick solution now over a better one", "Outstanding bug reports", "Server maintenance costs"), "The implied future cost of choosing an easy/quick solution now over a better one")
                ));
                examRepository.save(e);
            }

            // ── Cybersecurity ──────────────────────────────────────────────
            if (!examRepository.existsById("exam-cybersecurity")) {
                Exam e = new Exam();
                e.setId("exam-cybersecurity");
                e.setTitle("Cybersecurity Fundamentals");
                e.setCategory("Assessment");
                e.setTimeLimitMinutes(12);
                e.setQuestions(List.of(
                    q("cs1", "Which type of attack involves tricking users into revealing sensitive information by impersonating a trusted entity?",
                        List.of("SQL Injection", "DDoS", "Phishing", "Man-in-the-Middle"), "Phishing"),
                    q("cs2", "What does XSS (Cross-Site Scripting) allow an attacker to do?",
                        List.of("Inject SQL queries", "Inject malicious scripts into web pages viewed by other users", "Intercept network packets", "Brute-force passwords"), "Inject malicious scripts into web pages viewed by other users"),
                    q("cs3", "Which encryption algorithm is asymmetric?",
                        List.of("AES", "DES", "RSA", "Blowfish"), "RSA"),
                    q("cs4", "What is the purpose of a firewall?",
                        List.of("Encrypting files on disk", "Monitoring and controlling incoming and outgoing network traffic", "Scanning for viruses", "Managing user authentication"), "Monitoring and controlling incoming and outgoing network traffic"),
                    q("cs5", "Which attack exploits a vulnerability in SQL queries by injecting malicious code?",
                        List.of("XSS", "CSRF", "SQL Injection", "Buffer Overflow"), "SQL Injection"),
                    q("cs6", "What is a 'zero-day' vulnerability?",
                        List.of("A vulnerability discovered and patched on the same day", "A vulnerability unknown to the software vendor with no available patch", "A vulnerability in zero-trust architecture", "A low-severity security flaw"), "A vulnerability unknown to the software vendor with no available patch"),
                    q("cs7", "Which protocol provides secure communication over the internet by encrypting HTTP?",
                        List.of("FTP", "SMTP", "HTTPS (TLS)", "Telnet"), "HTTPS (TLS)"),
                    q("cs8", "What does the CIA triad in cybersecurity stand for?",
                        List.of("Control, Integrity, Authentication", "Confidentiality, Integrity, Availability", "Confidentiality, Inspection, Authorization", "Cryptography, Integrity, Auditing"), "Confidentiality, Integrity, Availability"),
                    q("cs9", "A rainbow table attack is used to crack:",
                        List.of("Network encryption keys", "Hashed passwords", "SSL certificates", "Firewall rules"), "Hashed passwords"),
                    q("cs10", "Which security concept involves granting users only the permissions they need?",
                        List.of("Defense in Depth", "Principle of Least Privilege", "Zero Trust", "Separation of Duties"), "Principle of Least Privilege")
                ));
                examRepository.save(e);
            }

            // ── Discrete Mathematics ───────────────────────────────────────
            if (!examRepository.existsById("exam-discrete-mathematics")) {
                Exam e = new Exam();
                e.setId("exam-discrete-mathematics");
                e.setTitle("Discrete Mathematics");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(10);
                e.setQuestions(List.of(
                    q("dm1", "How many subsets does a set with 4 elements have?",
                        List.of("8", "12", "16", "4"), "16"),
                    q("dm2", "Which of the following is a tautology?",
                        List.of("P AND NOT P", "P OR NOT P", "P AND Q", "NOT (P OR Q)"), "P OR NOT P"),
                    q("dm3", "What is the chromatic number of a complete graph K₄?",
                        List.of("2", "3", "4", "5"), "4"),
                    q("dm4", "In modular arithmetic, what is 17 mod 5?",
                        List.of("1", "2", "3", "4"), "2"),
                    q("dm5", "Which of the following relations is an equivalence relation?",
                        List.of("Greater than (>)", "Less than or equal (≤)", "Congruence modulo n", "Proper subset (⊂)"), "Congruence modulo n"),
                    q("dm6", "The number of ways to arrange n distinct objects is:",
                        List.of("n²", "2ⁿ", "n!", "nCr"), "n!"),
                    q("dm7", "A tree with n vertices has how many edges?",
                        List.of("n", "n+1", "n-1", "2n"), "n-1"),
                    q("dm8", "Which proof technique assumes the negation of the statement to be proved?",
                        List.of("Direct proof", "Proof by induction", "Proof by contrapositive", "Proof by contradiction"), "Proof by contradiction"),
                    q("dm9", "What is the Big-O notation for the recurrence T(n) = 2T(n/2) + n?",
                        List.of("O(n)", "O(n log n)", "O(n²)", "O(log n)"), "O(n log n)"),
                    q("dm10", "How many edges does a complete bipartite graph K(3,3) have?",
                        List.of("6", "9", "12", "3"), "9")
                ));
                examRepository.save(e);
            }

            // ── Aptitude & Logical Reasoning ───────────────────────────────
            if (!examRepository.existsById("exam-aptitude-reasoning")) {
                Exam e = new Exam();
                e.setId("exam-aptitude-reasoning");
                e.setTitle("Aptitude & Logical Reasoning");
                e.setCategory("Online Quiz");
                e.setTimeLimitMinutes(15);
                e.setQuestions(List.of(
                    q("ap1", "A train travels 360 km in 4 hours. What is its speed in km/h?",
                        List.of("80", "90", "100", "70"), "90"),
                    q("ap2", "If A is the brother of B, B is the sister of C, and C is the son of D, then how is A related to D?",
                        List.of("Son", "Daughter", "Nephew", "Cannot be determined"), "Son"),
                    q("ap3", "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
                        List.of("40", "42", "44", "36"), "42"),
                    q("ap4", "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?",
                        List.of("₹580", "₹600", "₹620", "₹550"), "₹600"),
                    q("ap5", "In a certain code, 'APPLE' is written as 'BQQMF'. How would 'MANGO' be written?",
                        List.of("NBOHO", "NBOHP", "MANHP", "NANHP"), "NBOHP"),
                    q("ap6", "Two pipes A and B can fill a tank in 10 hours and 15 hours respectively. How long will they take together?",
                        List.of("5 hours", "6 hours", "8 hours", "12 hours"), "6 hours"),
                    q("ap7", "If all roses are flowers and some flowers fade quickly, which conclusion is definitely true?",
                        List.of("All roses fade quickly", "Some roses fade quickly", "No roses fade quickly", "None of the above"), "None of the above"),
                    q("ap8", "A cube of side 4 cm is painted red on all faces and then cut into 1 cm cubes. How many small cubes have no face painted?",
                        List.of("4", "8", "16", "0"), "8"),
                    q("ap9", "The simple interest on ₹2000 at 5% per annum for 3 years is:",
                        List.of("₹200", "₹250", "₹300", "₹350"), "₹300"),
                    q("ap10", "Choose the odd one out: Circle, Square, Sphere, Triangle",
                        List.of("Circle", "Square", "Sphere", "Triangle"), "Sphere")
                ));
                examRepository.save(e);
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
