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

titleNode.innerHTML = testData.title;

let currentIntervalId: number;

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

const startTest = (): void => {
    startPageNode.style.display = "none";
    document.querySelector("section")!.style.display = "block";
    displayQuestion();
    totalTime = 0;
};

startButtonNode.addEventListener("click", startTest);

let totalTime: number = 0;

const startCounter = (): void => {
    let time: number = 0;
    currentIntervalId = setInterval(()=> {
        questionTimeNode.innerHTML = `${++time}`
        totalTimeNode.innerHTML = `${++totalTime}`
        const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
        localStorage.setItem(`question-time-${currentIdx}`, `${time}`);
        localStorage.setItem("total-time", `${totalTime}`);
    }, 1000)
}

const stopCounter = ():void => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0'
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
    startCounter()
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

nextNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter()
    saveAnswer()
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    localStorage.setItem("current-question-idx", `${currentIdx + 1}`)
    if (currentIdx < totalQuestions - 1) {
        localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
        displayQuestion();
    } else {
        alert("To jest ostatnie pytanie.");
    }
})

backNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter()
    saveAnswer()
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    if (currentIdx > 0) {
        localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
        displayQuestion();
    } else {
        alert("To jest pierwsze pytanie.");
    }
})

cancelNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    document.querySelector("section")!.style.display = "none";
    document.getElementById("koniec")!.style.display = "block";
    document.getElementById("koniec")!.innerHTML = "Test został anulowany <br><br>";
    document.getElementById("koniec")!.append(document.getElementById("return")!);
    localStorage.setItem('current-question-idx','0')
    clearStorage();
    stopCounter();
})

returnNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    startPageNode.style.display = "block";
    document.querySelector("section")!.style.display = "none";
    document.getElementById("koniec")!.style.display = "none";
    document.getElementById("buttons")!.append(document.getElementById("return")!);
    localStorage.setItem('current-question-idx','0')
    clearStorage();
    stopCounter();
})