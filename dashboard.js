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

    prompt += "Topics:\n";

    if (selectedTopics.length === 0) {

        prompt += "- All Chapter Topics\n";

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

    prompt += "Mandatory CinePhysics Physics Standards:\n";

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

    outputArea.value = prompt;

}

    // =========================
    // Question Counts
    // =========================

    const mcq =
        document.getElementById("mcqCount").value;

    const assertion =
        document.getElementById("assertionCount").value;

    const vsa =
        document.getElementById("vsaCount").value;

    const sa =
        document.getElementById("saCount").value;

    const la =
        document.getElementById("laCount").value;

    const numerical =
        document.getElementById("numericalCount").value;

    const caseStudy =
        document.getElementById("caseStudyCount").value;

    // =========================
    //
