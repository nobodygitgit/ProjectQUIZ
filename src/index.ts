import { Answer, Question } from "./data/data";
import testData from "./data/test-data.js";

const titleNode: HTMLHeadElement = document.querySelector("#test-title") as HTMLHeadElement
const questionNode: HTMLSpanElement = document.querySelector("#question")!
const answersNode: HTMLDivElement = document.querySelector("#answers")!
const backNode: HTMLButtonElement = document.querySelector("#back")!
const nextNode: HTMLButtonElement = document.querySelector("#next")!
const endNode: HTMLButtonElement = document.querySelector("#end")!
const cancelNode: HTMLButtonElement = document.querySelector("#cancel")!
const returnNode: HTMLButtonElement = document.querySelector("#return")!
const questionTimeNode: HTMLSpanElement = document.querySelector("#question-time")!
const totalTimeNode: HTMLSpanElement = document.querySelector("#total-time")!
const startPageNode: HTMLDivElement = document.querySelector("#start-page")!
const startButtonNode: HTMLButtonElement = document.querySelector("#start-button")!
const cancelInfoNode: HTMLDivElement = document.querySelector("#cancelInfo")!
const resultsNode: HTMLDivElement = document.querySelector("#results")!
const buttonsNode: HTMLDivElement = document.querySelector("#buttons")!

titleNode.innerHTML = testData.title;

let currentIntervalId: number;
let totalTime: number = 0;

localStorage.setItem("current-question-idx", "0")
localStorage.setItem("test-data", JSON.stringify(testData))

document.querySelector("section")!.style.display = "none";

const totalQuestions = JSON.parse(localStorage.getItem("test-data")!).questions.length;

const clearStorage = (): void => {

const keysToDelete = [];

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if(key && key.startsWith("question-time-")){
        keysToDelete.push(key)
    }
    else if(key && key.startsWith("answer-")){
        keysToDelete.push(key)
    }
    else {
        keysToDelete.push("total-time")
    }
}

keysToDelete.forEach(key => {
    localStorage.removeItem(key);
});

questionTimeNode.innerHTML = '0';
totalTimeNode.innerHTML = '0';
}

clearStorage()

const shuffleArray = (array : any) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const shuffleQuestions = () => {
    const testData = JSON.parse(localStorage.getItem("test-data")!);
    if (testData && testData.questions) {
        testData.questions = shuffleArray(testData.questions);
        localStorage.setItem("test-data", JSON.stringify(testData));
    }
};

const startTest = (): void => {
    startPageNode.style.display = "none";
    document.querySelector("section")!.style.display = "block";
    shuffleQuestions();
    displayQuestion();
    totalTime = 0;
    backNode.disabled = true;
    endNode.disabled = true;
};

startButtonNode.addEventListener("click", startTest);

const startCounter = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    const savedAnswer: string | null = localStorage.getItem(`answer-${currentIdx}`);
        let time: number = parseInt(localStorage.getItem(`question-time-${currentIdx}`)!) || 0;
        currentIntervalId = setInterval(()=> {
            if (!savedAnswer) {
            questionTimeNode.innerHTML = `${++time}`
            }
            totalTimeNode.innerHTML = `${++totalTime}`
            localStorage.setItem(`question-time-${currentIdx}`, `${time}`);
            localStorage.setItem("total-time", `${totalTime}`);
        }, 1000)
}

const stopCounter = ():void => {
    clearInterval(currentIntervalId);
}

const displayQuestion = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[currentIdx]
    questionNode.innerHTML = `${currentIdx+1}/${totalQuestions}: ${currentQuestion.question}`;
    displayAnswers(currentQuestion.answers);
    const savedAnswer: string | null = localStorage.getItem(`answer-${currentIdx}`);
    if (savedAnswer) {
        const radioInput: HTMLInputElement | null = document.querySelector(`input[value="${savedAnswer}"]`);
        if (radioInput) {
            radioInput.checked = true;
            const radioButtons: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="answer"]');
            radioButtons.forEach(button => (button.disabled = true));
        }
    }
    const questionTime: number = parseInt(localStorage.getItem(`question-time-${currentIdx}`)!) || 0;
    questionTimeNode.innerHTML = `${questionTime}`;
    backNode.disabled = currentIdx === 0;
    nextNode.disabled = currentIdx === totalQuestions - 1;
    startCounter();
}

const displayAnswers = (answers: Answer[]): void => {
  const answersRadio = answers.map(answer => {
    return `<div>
        <input type="radio" name="answer" id="${answer.id}" value="${answer.content}" />
        <label  for="${answer.id}">${answer.content}</label>
    </div>`
  })

  answersNode.innerHTML = answersRadio.join("")

}

const saveAnswer = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
    const selectedAnswer: HTMLInputElement | null = document.querySelector('input[name="answer"]:checked');

    if (selectedAnswer) {
        localStorage.setItem(`answer-${currentIdx}`, selectedAnswer.value);
    }
};

const isAllQuestionsAnswered = (): boolean => {
    for (let i = 0; i < totalQuestions; i++) {
        if (!localStorage.getItem(`answer-${i}`)) {
            return false;
        }
    }
    return true;
};

const updateEndButtonState = (): void => {
    endNode.disabled = !isAllQuestionsAnswered();
};

const handleAnswerClick = (): void => {
    saveAnswer();
    updateEndButtonState();
};

answersNode.addEventListener("click", () => {
    handleAnswerClick();
});

nextNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    handleAnswerClick();
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    if (currentIdx < totalQuestions - 1) {
        localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
        displayQuestion();
    }
})

backNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    handleAnswerClick();
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    if (currentIdx > 0) {
        localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
        displayQuestion();
    }
})

endNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    saveAnswer();

    const totalQuestions: number = JSON.parse(localStorage.getItem("test-data")!).questions.length;
    let correctAnswers = 0;

    const questionResults = [];

    for (let i = 0; i < totalQuestions; i++) {
        if (!localStorage.getItem(`answer-${i}`)) {
            break;
        }
        const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[i];
        const savedAnswer: string | null = localStorage.getItem(`answer-${i}`);
        const qTime: string | null = localStorage.getItem(`question-time-${i}`);

        questionResults.push({
            question: currentQuestion.question,
            userAnswer: savedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            questionTime: qTime
        });
        
        if (savedAnswer === currentQuestion.correctAnswer) {
            correctAnswers++;
        }
    }

    if (isAllQuestionsAnswered()) {
        const accuracy = (correctAnswers / totalQuestions) * 100;
        document.querySelector("section")!.style.display = "none";
        resultsNode.innerHTML = `<h2>Wyniki:</h2> Ilość pytań: ${totalQuestions} <br>Poprawne odpowiedzi: ${correctAnswers} <br>Błędne odpowiedzi: ${totalQuestions-correctAnswers} <br>Dokładność: ${accuracy.toFixed(2)}%<br>`;
        resultsNode.innerHTML +=("Czas spędzony nad testem: " + `${totalTime} sekund <br>`);
        for (let i = 0; i < totalQuestions; i++) {
            const result = questionResults[i];
            resultsNode.innerHTML += `<br>Pytanie ${i + 1}: <br> ${result.question} <br>Twoja odpowiedź: ${result.userAnswer} <br>Poprawna odpowiedź: ${result.correctAnswer} <br>Czas spędzony nad pytaniem: ${result.questionTime} sekund<br>`;
        }
    }
})

cancelNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    document.querySelector("section")!.style.display = "none";
    cancelInfoNode.style.display = "block";
    cancelInfoNode.innerHTML = "Test został anulowany <br><br>";
    cancelInfoNode.append(document.getElementById("return")!);
    localStorage.setItem('current-question-idx','0')
    clearStorage();
    stopCounter();
})

returnNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    startPageNode.style.display = "block";
    document.querySelector("section")!.style.display = "none";
    cancelInfoNode.style.display = "none";
    buttonsNode.append(document.getElementById("return")!);
    localStorage.setItem('current-question-idx','0')
    clearStorage();
    stopCounter();
})