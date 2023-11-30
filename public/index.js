import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const cancelNode = document.querySelector("#cancel");
const returnNode = document.querySelector("#return");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
const startPageNode = document.querySelector("#start-page");
const startButtonNode = document.querySelector("#start-button");
titleNode.innerHTML = testData.title;
let currentIntervalId;
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));
document.querySelector("section").style.display = "none";
const totalQuestions = JSON.parse(localStorage.getItem("test-data")).questions.length;
const clearStorage = () => {
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("question-time-")) {
            keysToDelete.push(key);
        }
        else if (key && key.startsWith("answer-")) {
            keysToDelete.push(key);
        }
        else {
            keysToDelete.push("total-time");
        }
    }
    keysToDelete.forEach(key => {
        localStorage.removeItem(key);
    });
    questionTimeNode.innerHTML = '0';
    totalTimeNode.innerHTML = '0';
};
clearStorage();
const startTest = () => {
    startPageNode.style.display = "none";
    document.querySelector("section").style.display = "block";
    displayQuestion();
    totalTime = 0;
};
startButtonNode.addEventListener("click", startTest);
let totalTime = 0;
const startCounter = () => {
    let time = 0;
    currentIntervalId = setInterval(() => {
        questionTimeNode.innerHTML = `${++time}`;
        totalTimeNode.innerHTML = `${++totalTime}`;
        const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
        localStorage.setItem(`question-time-${currentIdx}`, `${time}`);
        localStorage.setItem("total-time", `${totalTime}`);
    }, 1000);
};
const stopCounter = () => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0';
};
const displayQuestion = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    questionNode.innerHTML = `${currentIdx + 1}/${totalQuestions}: ${currentQuestion.question}`;
    displayAnswers(currentQuestion.answers);
    const savedAnswer = localStorage.getItem(`answer-${currentIdx}`);
    if (savedAnswer) {
        const radioInput = document.querySelector(`input[value="${savedAnswer}"]`);
        if (radioInput) {
            radioInput.checked = true;
            const radioButtons = document.querySelectorAll('input[name="answer"]');
            radioButtons.forEach(button => (button.disabled = true));
        }
    }
    const questionTime = parseInt(localStorage.getItem(`question-time-${currentIdx}`)) || 0;
    questionTimeNode.innerHTML = `${questionTime}`;
    startCounter();
};
const displayAnswers = (answers) => {
    const answersRadio = answers.map(answer => {
        return `<div>
        <input type="radio" name="answer" id="${answer.id}" value="${answer.content}" />
        <label  for="${answer.id}">${answer.content}</label>
    </div>`;
    });
    answersNode.innerHTML = answersRadio.join("");
};
const saveAnswer = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        localStorage.setItem(`answer-${currentIdx}`, selectedAnswer.value);
    }
};
nextNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    saveAnswer();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
    if (currentIdx < totalQuestions - 1) {
        localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
        displayQuestion();
    }
    else {
        alert("To jest ostatnie pytanie.");
    }
});
backNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    saveAnswer();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    if (currentIdx > 0) {
        localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
        displayQuestion();
    }
    else {
        alert("To jest pierwsze pytanie.");
    }
});
cancelNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("section").style.display = "none";
    document.getElementById("koniec").style.display = "block";
    document.getElementById("koniec").innerHTML = "Test został anulowany <br><br>";
    document.getElementById("koniec").append(document.getElementById("return"));
    localStorage.setItem('current-question-idx', '0');
    clearStorage();
    stopCounter();
});
returnNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    startPageNode.style.display = "block";
    document.querySelector("section").style.display = "none";
    document.getElementById("koniec").style.display = "none";
    document.getElementById("buttons").append(document.getElementById("return"));
    localStorage.setItem('current-question-idx', '0');
    clearStorage();
    stopCounter();
});
