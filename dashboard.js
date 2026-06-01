// =====================================
// Combine Class Databases
// =====================================

const chapterDatabase = {
    "Class 11": class11Data,
    "Class 12": class12Data
};

// =====================================
// DOM References
// =====================================

const classSelect = document.getElementById("classSelect");
const chapterList = document.getElementById("chapterList");
const chapterSearch = document.getElementById("chapterSearch");
const topicsContainer = document.getElementById("topicsContainer");
const outputArea = document.getElementById("outputArea");

// =====================================
// Load Chapters
// =====================================

function loadChapters() {

    const selectedClass = classSelect.value;

    chapterList.innerHTML = "";

    const chapters = Object.keys(
        chapterDatabase[selectedClass]
    );

    chapters.forEach(chapter => {

        const option = document.createElement("option");

        option.value = chapter;

        chapterList.appendChild(option);

    });

}

// =====================================
// Load Topics
// =====================================

function loadTopics() {

    const selectedClass = classSelect.value;

    const selectedChapter = chapterSearch.value;

    topicsContainer.innerHTML = "";

    const topics =
        chapterDatabase[selectedClass]?.[selectedChapter];

    if (!topics) {

        topicsContainer.innerHTML =
            "Select a valid chapter.";

        return;

    }

    topics.forEach(topic => {

        const label =
            document.createElement("label");

        label.innerHTML = `
            <input
                type="checkbox"
                class="topicCheckbox"
                value="${topic}">
            ${topic}
        `;

        topicsContainer.appendChild(label);

        topicsContainer.appendChild(
            document.createElement("br")
        );

    });

}

// =====================================
// Generate Prompt
// =====================================

function generatePrompt() {

    const selectedTopics =
        [...document.querySelectorAll(".topicCheckbox:checked")]
        .map(cb => cb.value);

    const worksheetType =
        document.getElementById("worksheetType").value;

    const difficulty =
        document.getElementById("difficulty").value;

    const outputMode =
        document.querySelector(
            'input[name="outputMode"]:checked'
        ).value;

    const mcq =
        document.getElementById("mcqCount").value || 0;

    const assertion =
        document.getElementById("assertionCount").value || 0;

    const vsa =
        document.getElementById("vsaCount").value || 0;

    const sa =
        document.getElementById("saCount").value || 0;

    const la =
        document.getElementById("laCount").value || 0;

    const numerical =
        document.getElementById("numericalCount").value || 0;

    const caseStudy =
        document.getElementById("caseStudyCount").value || 0;

    let prompt = "";

    prompt += "Act as an expert Physics educator and assessment designer.\n\n";

    prompt += `Class: ${classSelect.value}\n`;

    prompt += `Chapter: ${chapterSearch.value}\n`;

    prompt += `Worksheet Type: ${worksheetType}\n`;

    prompt += `Difficulty Level: ${difficulty}\n`;

    prompt += `Output Mode: ${outputMode}\n\n`;
    prompt += "OUTPUT FORMAT (MANDATORY):\n";
prompt += "Generate website-ready HTML.\n";
prompt += "Do NOT use Markdown.\n";
prompt += "Do NOT use LaTeX.\n";
prompt += "Use HTML tags only.\n\n";

 prompt += "Selected Topics (STRICTLY ENFORCED):\n\n";

prompt += "Generate questions ONLY from the selected topics listed below.\n";

prompt += "Do NOT generate questions from any unselected topic.\n";

prompt += "Every question must directly map to at least one selected topic.\n\n";

if (selectedTopics.length === 0) {

    prompt += "Use all chapter topics.\n";

} else {

    selectedTopics.forEach(topic => {

        prompt += `- ${topic}\n`;

    });

}

prompt += "\n";

    prompt += "Question Distribution:\n";

    if (mcq > 0)
        prompt += `- MCQ: ${mcq}\n`;

    if (assertion > 0)
        prompt += `- Assertion Reason: ${assertion}\n`;

    if (vsa > 0)
        prompt += `- Very Short Answer: ${vsa}\n`;

    if (sa > 0)
        prompt += `- Short Answer: ${sa}\n`;

    if (la > 0)
        prompt += `- Long Answer: ${la}\n`;

    if (numerical > 0)
        prompt += `- Numericals: ${numerical}\n`;

    if (caseStudy > 0)
        prompt += `- Case Study: ${caseStudy}\n`;

    prompt += "\n";
    prompt += "Topic Coverage Rules:\n";

    prompt += "• Use ONLY selected topics\n";

    prompt += "• Do NOT use unselected chapter topics\n";

    prompt += "• Do NOT introduce concepts from future chapters\n";

    prompt += "• If more questions are required, vary difficulty instead of introducing new topics\n";

    prompt += "• Every question must be traceable to a selected topic\n\n";
    
    prompt += "Mandatory CinePhysics Physics Standards:\n";
    prompt += "\nWebsite Publishing Requirements:\n";

prompt += "• Output must be HTML-ready\n";
prompt += "• Use HTML superscripts: <sup></sup>\n";
prompt += "• Use HTML subscripts: <sub></sub>\n";
prompt += "• Use m s<sup>-1</sup> not m/s\n";
prompt += "• Use m s<sup>-2</sup> not m/s²\n";
prompt += "• Use v<sub>0</sub> for initial velocity\n";
prompt += "• Use Δx for displacement\n";
prompt += "• Use θ for angles\n";
prompt += "• Use λ for wavelength\n";
prompt += "• Use μ for coefficient of friction\n";
prompt += "• Use ordered lists for questions\n";
prompt += "• Use proper SI unit formatting\n";
prompt += "• Preserve Greek symbols\n";
prompt += "• Do not use Markdown\n";
prompt += "• Do not use LaTeX\n";
prompt += "• Generate clean HTML only\n";
prompt += "• Ready for direct paste into worksheet HTML file\n";
    prompt += "• Use proper SI Units\n";
    prompt += "• Use proper superscripts and subscripts\n";
    prompt += "• Use correct dimensional formulae\n";
    prompt += "• Use correct vector notation\n";
    prompt += "• Use scientifically accurate equations\n";
    prompt += "• Validate numerical answers\n";
    prompt += "• Avoid duplicate questions\n";
    prompt += "• Follow CBSE and NCERT terminology\n";
    prompt += "• Ensure physical realism\n";
    prompt += "• Use plausible MCQ distractors\n";
    prompt += "• Ensure mathematically correct expressions\n";

    prompt += "\n";

    prompt += "Optional Enhancements:\n";

    if(document.getElementById("enhanceLearningOutcomes")?.checked)
        prompt += "- Include Learning Outcomes\n";

    if(document.getElementById("enhanceNcertAlignment")?.checked)
        prompt += "- Include NCERT Alignment\n";

    if(document.getElementById("enhanceCbseCompetencies")?.checked)
        prompt += "- Include CBSE Competencies\n";

    if(document.getElementById("enhanceTopicSummary")?.checked)
        prompt += "- Include Topic Coverage Summary\n";

    if(document.getElementById("enhanceEstTime")?.checked)
        prompt += "- Include Estimated Completion Time\n";

    if(document.getElementById("enhanceHots")?.checked)
        prompt += "- Include HOTS Questions\n";

    if(document.getElementById("enhanceCompetencyBased")?.checked)
        prompt += "- Include Competency Based Questions\n";

    if(document.getElementById("enhanceRealLife")?.checked)
        prompt += "- Include Real Life Applications\n";

    if(document.getElementById("enhanceExperimental")?.checked)
        prompt += "- Include Experimental Skills Questions\n";
prompt += "\nWORKSHEET STRUCTURE:\n";

prompt += "<h1>Worksheet Title</h1>\n";
prompt += "<p>Class and Chapter Information</p>\n";
prompt += "<h2>Learning Outcomes</h2>\n";
prompt += "<h2>Instructions</h2>\n";
prompt += "<h2>Section A</h2>\n";
prompt += "<h2>Section B</h2>\n";
prompt += "<h2>Section C</h2>\n";

if(outputMode !== "student"){
    prompt += "<h2>Answer Key</h2>\n";
}
    // =====================================
// STRICT HTML OUTPUT RULES
// =====================================

prompt += "\nSTRICT HTML OUTPUT RULES (MANDATORY):\n";

prompt += "The worksheet will be pasted directly into a website.\n";

prompt += "The output is INVALID if:\n";

prompt += "1. Any question uses bullet points.\n";
prompt += "2. Any section uses <ul> for question numbering.\n";
prompt += "3. MCQ options are not automatically lettered.\n";
prompt += "4. Questions are not automatically numbered.\n";
prompt += "5. Section headings are missing.\n";
prompt += "6. Question counts do not match requested distribution.\n\n";

prompt += "Use ONLY ordered lists.\n";

prompt += "Never use:\n";
prompt += "<ul>\n";
prompt += "<li> for question numbering\n\n";

prompt += "Use ONLY:\n";
prompt += "<ol>\n";
prompt += "<li>\n\n";

// =====================================
// SECTION ENFORCEMENT
// =====================================

prompt += "\nSECTION GENERATION RULES:\n";

if(mcq > 0)
    prompt += `Section A must contain EXACTLY ${mcq} MCQs.\n`;

if(assertion > 0)
    prompt += `Section B must contain EXACTLY ${assertion} Assertion-Reason questions.\n`;

if(vsa > 0)
    prompt += `Section C must contain EXACTLY ${vsa} Very Short Answer questions.\n`;

if(sa > 0)
    prompt += `Section D must contain EXACTLY ${sa} Short Answer questions.\n`;

if(la > 0)
    prompt += `Section E must contain EXACTLY ${la} Long Answer questions.\n`;

if(numerical > 0)
    prompt += `Section F must contain EXACTLY ${numerical} Numerical questions.\n`;

if(caseStudy > 0)
    prompt += `Section G must contain EXACTLY ${caseStudy} Case Study questions.\n`;

// =====================================
// REQUIRED HTML TEMPLATE
// =====================================

prompt += "\nFOLLOW THIS HTML TEMPLATE EXACTLY:\n";

prompt += `
<h2>Section A: Multiple Choice Questions</h2>

<ol>

<li>

Question Text

<ol type="a">
<li>Option</li>
<li>Option</li>
<li>Option</li>
<li>Option</li>
</ol>

</li>

</ol>

<h2>Section B: Assertion Reason</h2>

<ol>
<li>Question</li>
<li>Question</li>
</ol>

<h2>Section C: Very Short Answer</h2>

<ol>
<li>Question</li>
<li>Question</li>
</ol>

<h2>Section D: Short Answer</h2>

<ol>
<li>Question</li>
<li>Question</li>
</ol>

<h2>Section E: Numericals</h2>

<ol>
<li>Question</li>
<li>Question</li>
</ol>
`;

prompt += "\nFINAL INSTRUCTION:\n";

prompt += "Follow the HTML template exactly.\n";
prompt += "Do not invent your own layout.\n";
prompt += "Do not replace ordered lists with unordered lists.\n";
prompt += "Do not use bullets anywhere in the worksheet.\n";
prompt += "All questions must be automatically numbered.\n";
prompt += "All MCQ options must be automatically lettered a,b,c,d using <ol type='a'>.\n";
prompt += "Return ONLY HTML.\n";
prompt += "Do not include explanations before or after the HTML.\n";

    outputArea.value = prompt;

}
// =====================================
// Copy Output
// =====================================

async function copyOutput() {

    try {
        await navigator.clipboard.writeText(
            outputArea.value
        );

        alert("Output copied.");
    }

    catch(err) {
        alert("Copy failed.");
    }

}

// =====================================
// Generate HTML Template
// =====================================

function generateHTMLTemplate() {

    outputArea.value =
`<h1>Worksheet Title</h1>

<p><strong>Class:</strong> ${classSelect.value}</p>

<p><strong>Chapter:</strong> ${chapterSearch.value}</p>

<h2>Learning Outcomes</h2>

<ul>
<li></li>
</ul>

<h2>Instructions</h2>

<ol>
<li></li>
</ol>

<h2>Section A</h2>

<h2>Section B</h2>

<h2>Section C</h2>

<h2>Answer Key</h2>`;

}



// =====================================
// Event Listeners
// =====================================

classSelect.addEventListener(
    "change",
    loadChapters
);

chapterSearch.addEventListener(
    "change",
    loadTopics
);

document
.getElementById("btnGeneratePrompt")
.addEventListener(
    "click",
    generatePrompt
);

document
.getElementById("btnCopyOutput")
.addEventListener(
    "click",
    copyOutput
);

document
.getElementById("btnGenerateHTML")
.addEventListener(
    "click",
    generateHTMLTemplate
);

// =====================================
// Initial Load
// =====================================

loadChapters();
    
