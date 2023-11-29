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

let currentIntervalId: number

localStorage.setItem("current-question-idx", "0")
localStorage.setItem("test-data", JSON.stringify(testData))

document.querySelector("section")!.style.display = "none";

const startTest = (): void => {
    startPageNode.style.display = "none";
    document.querySelector("section")!.style.display = "block";
    displayQuestion();
};

startButtonNode.addEventListener("click", startTest);

const startCounter = (): void => {
    let time: number = 0;
    currentIntervalId = setInterval(()=> {
        questionTimeNode.innerHTML = `${++time}`
    }, 1000)
}

const stopCounter = ():void => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0'
}

const displayQuestion = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[currentIdx]
    questionNode.innerHTML = currentQuestion.question;
    displayAnswers(currentQuestion.answers);
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

nextNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter()
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    localStorage.setItem("current-question-idx", `${currentIdx + 1}`)
    displayQuestion()
})

backNode.addEventListener("click", (e)=> {
    e.preventDefault();
    e.stopPropagation();
    stopCounter()
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    localStorage.setItem("current-question-idx", `${currentIdx - 1}`)
    displayQuestion()
})

cancelNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    document.querySelector("section")!.style.display = "none";
    document.getElementById("koniec")!.style.display = "block";
    document.getElementById("koniec")!.innerHTML = "Test został anulowany <br><br>";
    document.getElementById("koniec")!.append(document.getElementById("return")!);
    stopCounter();
})

returnNode.addEventListener("click", (e): void => {
    e.preventDefault();
    e.stopPropagation();

    startPageNode.style.display = "block";
    document.querySelector("section")!.style.display = "none";
    document.getElementById("koniec")!.style.display = "none";
    document.getElementById("buttons")!.append(document.getElementById("return")!);
    stopCounter();
})