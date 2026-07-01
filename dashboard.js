/**
 * CinePhysicsHQ AI Teacher Dashboard
 * Refactored Architecture v2.0
 */

const App = {
    mode: 'worksheet', // 'worksheet' or 'exam'
    
    init() {
        this.Curriculum.init();
        this.UI.init();
    },

    // ---------------------------------------------------------
    // 1. UI & Utilities
    // ---------------------------------------------------------
    UI: {
        init() {
            this.renderEnhancements();
            // Sync Class dropdowns
            document.getElementById('exClass').addEventListener('change', (e) => {
                document.getElementById('exClassDisp').value = e.target.value;
            });
            document.getElementById('exClassDisp').value = document.getElementById('exClass').value;
        },

        setMode(newMode) {
            App.mode = newMode;
            
            // Update buttons
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.mode-btn[data-mode="${newMode}"]`).classList.add('active');
            
            // Toggle views
            if (newMode === 'worksheet') {
                document.getElementById('worksheetView').classList.remove('hidden');
                document.getElementById('examView').classList.add('hidden');
                document.getElementById('qdTitle').innerText = '3. Question Distribution';
            } else {
                document.getElementById('worksheetView').classList.add('hidden');
                document.getElementById('examView').classList.remove('hidden');
                document.getElementById('qdTitle').innerText = '5. Question Distribution';
            }
            this.clearErrors();
        },

        handleCustomInput(selectElem, targetInputId) {
            const inputElem = document.getElementById(targetInputId);
            if (selectElem.value === 'Custom') {
                inputElem.classList.remove('hidden');
            } else {
                inputElem.classList.add('hidden');
            }
        },

        toggleAllCheckboxes(containerId, isChecked) {
            const container = document.getElementById(containerId);
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = isChecked);
        },

        showError(msg) {
            const errDiv = document.getElementById('globalError');
            errDiv.innerText = msg;
            errDiv.style.display = 'block';
            window.scrollTo({ top: errDiv.offsetTop - 100, behavior: 'smooth' });
        },

        clearErrors() {
            document.getElementById('globalError').style.display = 'none';
        },

        renderEnhancements() {
            const enhancements = [
                { id: 'enhNCERT', label: 'NCERT Alignment', default: true },
                { id: 'enhLearning', label: 'Learning Outcomes' },
                { id: 'enhBloom', label: "Bloom's Taxonomy", default: true },
                { id: 'enhRealLife', label: 'Real Life Applications' },
                { id: 'enhHOTS', label: 'HOTS' },
                { id: 'enhDiagram', label: 'Diagram Based' },
                { id: 'enhExperiment', label: 'Experimental Questions' },
                { id: 'enhPrevYear', label: 'Previous Year Pattern' },
                { id: 'enhSummary', label: 'Topic Coverage Summary' },
                { id: 'enhDiffAnalysis', label: 'Difficulty Analysis' },
                { id: 'enhDetailedSol', label: 'Detailed Solutions' },
                { id: 'enhPrintLayout', label: 'Printable Layout', default: true },
                { id: 'enhRandQ', label: 'Randomize Questions' },
                { id: 'enhRandMCQ', label: 'Randomize MCQs' },
                { id: 'enhFormulaSheet', label: 'Formula Sheet' },
                { id: 'enhImportantFormula', label: 'Important Formula Box' },
                { id: 'enhMistakes', label: 'Common Mistakes' },
                { id: 'enhTeacherNotes', label: 'Teacher Notes' },
                { id: 'enhRevisionTips', label: 'Revision Tips' }
            ];

            const grid = document.getElementById('enhancementsGrid');
            enhancements.forEach(enh => {
                grid.innerHTML += `<label class="checkbox-label"><input type="checkbox" id="${enh.id}" ${enh.default ? 'checked' : ''}> ${enh.label}</label>`;
            });
        }
    },

    // ---------------------------------------------------------
    // 2. Curriculum Loaders
    // ---------------------------------------------------------
    Curriculum: {
        database: {},
        
        init() {
            this.database = {
                "Class 11": typeof class11Data !== 'undefined' ? class11Data : {},
                "Class 12": typeof class12Data !== 'undefined' ? class12Data : {}
            };
            this.loadWorksheetChapters();
            this.loadExamChapters();
        },

        // Worksheet Loaders
        loadWorksheetChapters() {
            const list = document.getElementById("wsChapterList");
            list.innerHTML = "";
            const currentClass = document.getElementById("wsClass").value;
            Object.keys(this.database[currentClass] || {}).forEach(ch => {
                list.appendChild(new Option(ch, ch));
            });
            document.getElementById("wsTopicsContainer").innerHTML = "Select a chapter first.";
        },
        
        loadWorksheetTopics() {
            const container = document.getElementById("wsTopicsContainer");
            const currentClass = document.getElementById("wsClass").value;
            const chapter = document.getElementById("wsChapter").value;
            const topics = this.database[currentClass][chapter];
            
            container.innerHTML = "";
            if(!topics) { container.innerHTML = "Select a valid chapter."; return; }
            topics.forEach(t => {
                container.innerHTML += `<label class="checkbox-label"><input type="checkbox" class="ws-topic-cb" value="${t}" checked> ${t}</label>`;
            });
        },

        // Exam Loaders (Multi-Select)
        loadExamChapters() {
            const container = document.getElementById("exChaptersContainer");
            const currentClass = document.getElementById("exClass").value;
            container.innerHTML = "";
            
            Object.keys(this.database[currentClass] || {}).forEach(ch => {
                container.innerHTML += `<label class="checkbox-label"><input type="checkbox" class="ex-chapter-cb" value="${ch}" onchange="App.Curriculum.loadExamTopics()"> ${ch}</label>`;
            });
            document.getElementById("exTopicsContainer").innerHTML = "Select chapters first.";
        },

        loadExamTopics() {
            const container = document.getElementById("exTopicsContainer");
            const currentClass = document.getElementById("exClass").value;
            const selectedChapters = Array.from(document.querySelectorAll('.ex-chapter-cb:checked')).map(cb => cb.value);
            
            container.innerHTML = "";
            if (selectedChapters.length === 0) {
                container.innerHTML = "Select chapters first.";
                return;
            }

            selectedChapters.forEach(chapter => {
                const topics = this.database[currentClass][chapter];
                if (topics) {
                    container.innerHTML += `<strong style="display:block; margin-top:10px; color:var(--gold-accent);">${chapter}</strong>`;
                    topics.forEach(t => {
                        container.innerHTML += `<label class="checkbox-label" style="margin-left:10px;"><input type="checkbox" class="ex-topic-cb" value="${t}" checked> ${t}</label>`;
                    });
                }
            });
        }
    },

    // ---------------------------------------------------------
    // 3. Validation
    // ---------------------------------------------------------
    Validators: {
        validate() {
            App.UI.clearErrors();
            let isValid = true;
            let msg = "";

            // Question Count Validation
            const totalQuestions = ['distMcq', 'distAr', 'distVsa', 'distSa', 'distLa']
                .reduce((sum, id) => sum + (parseInt(document.getElementById(id).value) || 0), 0);
            
            if (totalQuestions <= 0) {
                msg = "Minimum one question must be requested in Question Distribution.";
                isValid = false;
            }

            if (App.mode === 'worksheet') {
                const chapter = document.getElementById('wsChapter').value;
                const topics = document.querySelectorAll('.ws-topic-cb:checked');
                const title = document.getElementById('wsTitle').value;
                
                if (!chapter) { msg = "Worksheet: Please select a chapter."; isValid = false; }
                else if (topics.length === 0) { msg = "Worksheet: Please select at least one topic."; isValid = false; }
                else if (!title) { msg = "Worksheet: Please enter a Worksheet Title."; isValid = false; }

            } else {
                const schoolName = document.getElementById('exSchoolName').value;
                const examName = document.getElementById('exExamName').value;
                const paperTitle = document.getElementById('exPaperTitle').value;
                const chapters = document.querySelectorAll('.ex-chapter-cb:checked');
                const topics = document.querySelectorAll('.ex-topic-cb:checked');

                if (!schoolName) { msg = "Exam: School Name is required."; isValid = false; }
                else if (!examName) { msg = "Exam: Examination Name is required."; isValid = false; }
                else if (!paperTitle) { msg = "Exam: Paper Title is required."; isValid = false; }
                else if (chapters.length === 0) { msg = "Exam: Select at least one chapter."; isValid = false; }
                else if (topics.length === 0) { msg = "Exam: Select at least one topic."; isValid = false; }
                
                const customMarks = document.getElementById('exMaxMarks').value === 'Custom' ? document.getElementById('exCustomMarks').value : true;
                if (!customMarks) { msg = "Exam: Please enter valid Custom Maximum Marks."; isValid = false; }
            }

            if (!isValid) App.UI.showError(msg);
            return isValid;
        }
    },

    // ---------------------------------------------------------
    // 4. Prompt Builder (Modular)
    // ---------------------------------------------------------
    PromptBuilder: {
        build(payloadObj) {
            let prompt = "Act as an expert Physics educator. Create questions based on the following parameters:\n\n";
            
            if (App.mode === 'worksheet') prompt += this.buildWorksheetContext(payloadObj.worksheet);
            else prompt += this.buildExamContext(payloadObj.exam);
            
            prompt += this.buildDistribution(payloadObj.distribution);
            prompt += this.buildEnhancements(payloadObj.enhancements, payloadObj.exam);
            prompt += this.buildFormattingRules();

            return prompt;
        },

        buildWorksheetContext(ws) {
            return `--- WORKSHEET CONTEXT ---
Worksheet Title: ${ws.title}
Class: ${ws.className}
Chapter: ${ws.chapter}
Topics: ${ws.topics.join(", ")}
Output Mode: ${ws.mode}
Difficulty: ${ws.difficulty}
Time Allowed: ${ws.time}
`;
        },

        buildExamContext(ex) {
            let ctx = `--- EXAM PAPER CONTEXT ---
Paper Title: ${ex.paperTitle}
Paper Type: ${ex.paperType}
Class: ${ex.className}
Board Standard: ${ex.boardStandard}
Maximum Marks: ${ex.maximumMarks}
Time Allowed: ${ex.time}
Difficulty: ${ex.difficulty}
Output Mode: ${ex.outputMode}
Selected Chapters: ${ex.selectedChapters.join(", ")}
Selected Topics: ${ex.selectedTopics.join(", ")}

--- CBSE PAPER DESIGN ---
Follow Latest CBSE Blueprint: ${ex.cbseBlueprint}
Competency Based: ${ex.cbseCompetency}
Case Study Questions: ${ex.cbseCaseStudy}
Internal Choices: ${ex.cbseInternalChoice}
Section Wise Instructions: ${ex.cbseInstructions}
`;
            if (ex.paperSet === "Set A & Set B") {
                ctx += `\nCRITICAL INSTRUCTION: Generate TWO complete papers (SET A and SET B).
- Both sets must have equal difficulty, marks, Bloom's distribution, and competency distribution.
- Use different wording, different numerical values, different MCQ option ordering, and different case studies.
- No duplicated questions between Set A and Set B.
- Generate separate answer keys for each set at the end.\n`;
            }
            return ctx;
        },

        buildDistribution(dist) {
            return `\n--- QUESTION DISTRIBUTION ---
- ${dist.mcq} Multiple Choice Questions
- ${dist.assertionReason} Assertion-Reason Questions
- ${dist.vsa} Very Short Answer (2 Marks)
- ${dist.sa} Short Answer (3 Marks)
- ${dist.la} Long Answer (5 Marks)
Numerical Weightage Target: ${dist.numericalWeightage}% (Distribute numericals intelligently across VSA, SA, and LA sections. Do not create a separate 'Numericals' section).
`;
        },

        buildEnhancements(enh, examData) {
            let str = "\n--- ADDITIONAL ENHANCEMENTS ---\n";
            if (enh.enhNCERT) str += "- Ensure strict NCERT curriculum alignment.\n";
            if (enh.enhHOTS) str += "- Include Higher Order Thinking Skills (HOTS) questions.\n";
            if (enh.enhRealLife) str += "- Integrate real-life applications into questions.\n";
            
            // Bloom's Taxonomy handling
            if (enh.enhBloom) {
                str += `- BLOOM'S TAXONOMY DISTRIBUTION (MANDATORY):
  * Remembering + Understanding: ~38%
  * Applying: ~32%
  * Analysing + Evaluating + Creating: ~30%\n`;
            }

            if (examData && examData.outputMode === "Teacher Copy") {
                str += "- At the end of the document, generate a detailed Answer Key & Marking Scheme.\n";
            }
            return str;
        },

        buildFormattingRules() {
            return `
\n--- LAYOUT & HTML FORMATTING RULES (STRICTLY MANDATORY) ---
1. Never use <br> or multiple blank lines for spacing.
2. Every question must use exactly this structure:
<div class="question">
    <span class="q-number">1.</span>
    <div class="q-content">
        <p>Question text...</p>
        <ol class="options" type="a">
            <li>Option 1</li>
            <li>Option 2</li>
        </ol>
    </div>
</div>
3. Question number and question text must appear on the same horizontal line.
4. Use only <p> tags inside .q-content. Do not insert empty paragraphs or divs.
5. Section Titles must be wrapped in <h3 class="section-title">Section Name</h3>.
6. Start directly with the first section header (Do NOT output the paper title, max marks, time, or header. The system will handle the header rendering).

--- MATHEMATICAL FORMATTING RULES (STRICTLY MANDATORY) ---
1. Return ONLY valid HTML. 
2. NEVER use LaTeX notation (No $, $$, \\frac, \\Delta, \\theta, \\alpha, etc.).
3. NEVER use Markdown math or wrap equations in code blocks.
4. Use HTML tags and entities ONLY:
   - Superscripts: x<sup>2</sup>, 10<sup>-3</sup>
   - Subscripts: v<sub>0</sub>, F<sub>net</sub>
   - Greek Symbols: &Delta;, &theta;, &alpha;
   - Vectors: <strong>F</strong>, <strong>v</strong>
   - Units: m s<sup>-1</sup>, kg m<sup>2</sup> s<sup>-2</sup> (No slashes for units)
   - Fractions: (1/2)mv<sup>2</sup>, (Fd)/t
   - Scientific Notation: 6.63 &times; 10<sup>-34</sup>

All mathematical expressions, equations, and symbols MUST be valid HTML and render correctly without MathJax.`;
        }
    },

    // ---------------------------------------------------------
    // 5. Payload Builder
    // ---------------------------------------------------------
    PayloadBuilder: {
        build() {
            const numWSelect = document.getElementById('distNumWeight').value;
            const numericalWeightage = numWSelect === 'Custom' ? document.getElementById('distCustomNum').value : numWSelect;
            
            const distribution = {
                mcq: parseInt(document.getElementById('distMcq').value) || 0,
                assertionReason: parseInt(document.getElementById('distAr').value) || 0,
                vsa: parseInt(document.getElementById('distVsa').value) || 0,
                sa: parseInt(document.getElementById('distSa').value) || 0,
                la: parseInt(document.getElementById('distLa').value) || 0,
                numericalWeightage: parseInt(numericalWeightage) || 0
            };

            const enhancements = {};
            document.querySelectorAll('#enhancementsGrid input[type="checkbox"]').forEach(cb => {
                enhancements[cb.id] = cb.checked;
            });

            const payload = {
                mode: App.mode,
                distribution,
                enhancements
            };

            if (App.mode === 'worksheet') {
                payload.worksheet = {
                    title: document.getElementById('wsTitle').value,
                    className: document.getElementById('wsClass').value,
                    chapter: document.getElementById('wsChapter').value,
                    topics: Array.from(document.querySelectorAll('.ws-topic-cb:checked')).map(cb => cb.value),
                    mode: document.getElementById('wsOutputMode').value,
                    difficulty: document.getElementById('distDifficulty').value,
                    time: document.getElementById('distTime').value
                };
            } else {
                const mmSelect = document.getElementById('exMaxMarks').value;
                payload.exam = {
                    paperTitle: document.getElementById('exPaperTitle').value,
                    paperType: document.getElementById('exPaperType').value,
                    className: document.getElementById('exClass').value,
                    boardStandard: document.getElementById('exBoardStandard').value,
                    maximumMarks: mmSelect === 'Custom' ? document.getElementById('exCustomMarks').value : mmSelect,
                    time: document.getElementById('distTime').value,
                    difficulty: document.getElementById('distDifficulty').value,
                    outputMode: document.getElementById('exOutputMode').value,
                    paperSet: document.getElementById('exPaperSet').value,
                    selectedChapters: Array.from(document.querySelectorAll('.ex-chapter-cb:checked')).map(cb => cb.value),
                    selectedTopics: Array.from(document.querySelectorAll('.ex-topic-cb:checked')).map(cb => cb.value),
                    cbseBlueprint: document.getElementById('cbseBlueprint').checked,
                    cbseCompetency: document.getElementById('cbseCompetency').checked,
                    cbseCaseStudy: document.getElementById('cbseCaseStudy').checked,
                    cbseInternalChoice: document.getElementById('cbseInternalChoice').checked,
                    cbseInstructions: document.getElementById('cbseInstructions').checked
                };

                payload.school = {
                    schoolName: document.getElementById('exSchoolName').value,
                    academicSession: document.getElementById('exSession').value,
                    examName: document.getElementById('exExamName').value,
                    subject: document.getElementById('exSubject').value,
                    className: document.getElementById('exClassDisp').value,
                    section: document.getElementById('exSection').value,
                    examDate: document.getElementById('exDate').value,
                    schoolMotto: document.getElementById('exMotto').value,
                    flags: {
                        studentName: document.getElementById('exStudentName').checked,
                        rollNo: document.getElementById('exRollNo').checked,
                        invigilator: document.getElementById('exInvigilator').checked,
                        principal: document.getElementById('exPrincipal').checked
                    }
                };
            }

            // Generate modular prompt string and inject into root for Backend API
            payload.prompt = App.PromptBuilder.build(payload);
            
            // Root properties for backward compatibility with your existing backend
            payload.title = App.mode === 'worksheet' ? payload.worksheet.title : payload.exam.paperTitle;
            payload.className = App.mode === 'worksheet' ? payload.worksheet.className : payload.exam.className;
            payload.difficulty = document.getElementById('distDifficulty').value;
            
            return payload;
        }
    },

    // ---------------------------------------------------------
    // 6. Core Application Logic (Generation)
    // ---------------------------------------------------------
    Core: {
        async startGeneration() {
            if (!App.Validators.validate()) return;

            const overlay = document.getElementById("loadingOverlay");
            overlay.style.display = "flex";

            const BACKEND_URL = "https://cinephysics-api.vercel.app/api/generate";
            const payload = App.PayloadBuilder.build();

            try {
                console.log("Sending highly detailed payload to AI...", payload);

                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload) // Sent precisely structured as required
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Backend Error");
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    let htmlContent = data.candidates[0].content.parts[0].text;
                    htmlContent = htmlContent.replace(/```html/g, "").replace(/```/g, "").trim();

                    // --- STORAGE MANAGER: Save Metadata for PDF Exporter ---
                    localStorage.setItem("cp_ai_html", htmlContent);
                    localStorage.setItem("cp_ai_topic", payload.title);
                    localStorage.setItem("cp_ai_time", document.getElementById("distTime").value);
                    
                    // Marks calculation backward compatibility fallback if not explicit
                    let marks = App.mode === 'exam' ? payload.exam.maximumMarks : 
                        ((payload.distribution.mcq * 1) + (payload.distribution.assertionReason * 1) + 
                         (payload.distribution.vsa * 2) + (payload.distribution.sa * 3) + (payload.distribution.la * 5));
                    localStorage.setItem("cp_ai_marks", marks);

                    // Save School Metadata so the PDF Exporter builds the header beautifully
                    if (App.mode === 'exam') {
                        localStorage.setItem("cp_school_info", JSON.stringify(payload.school));
                    } else {
                        localStorage.removeItem("cp_school_info"); // Clear if switching back to simple worksheet
                    }

                    // Navigate to PDF Exporter
                    window.location.href = "./worksheets/import.html";
                } else {
                    throw new Error("The AI response was empty or malformed.");
                }

            } catch (error) {
                console.error("AI Fetch Error:", error);
                App.UI.showError("AI Error: " + error.message);
                overlay.style.display = "none";
            }
        }
    }
};

// Initialize Dashboard on load
window.onload = () => App.init();
