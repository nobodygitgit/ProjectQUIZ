import { Test } from "./data";

export default {
    title: "Test wiedzy ogólnej",
    questions: [{
        question: "Który pierwiastek chemiczny jest oznaczany symbolem 'O'?",
        correctAnswer: "Tlen",
        answers: [{
            content: "Węgiel",
            id: "first"
        },
        {
            content: "Tlen",
            id: "second"
        },
        {
            content: "Wodór",
            id: "third"
        },
        {
            content: "Azot",
            id: "fourth"
        }]
    },
    {
        question: "Które państwo jest największe pod względem powierzchni na świecie?",
        correctAnswer: "Rosja",
        answers: [{
            content: "Chiny",
            id: "first"
        },
        {
            content: "Stany Zjednoczone",
            id: "second"
        },
        {
            content: "Rosja",
            id: "third"
        },
        {
            content: "Polska",
            id: "fourth"
        }]
    }
    ,{
        question: "Kto wygrał worldsy 2023 w LoL?",
        correctAnswer: "SKT T1",
        answers: [{
            content: "SKT T1",
            id: "first"
        },
        {
            content: "GenG",
            id: "second"
        },
        {
            content: "JDG",
            id: "third"
        },
        {
            content: "Weibo",
            id: "fourth"
        }]
    }
    ,{
        question: "Ile planet krąży wokół Słońca w naszym Układzie Słonecznym?",
        correctAnswer: "8",
        answers: [{
            content: "8",
            id: "first"
        },
        {
            content: "9",
            id: "second"
        },
        {
            content: "10",
            id: "third"
        },
        {
            content: "7",
            id: "fourth"
        }]
    }
    ,{
        question: "Jaki jest najwyższy szczyt na świecie?",
        correctAnswer: "Mount Everest",
        answers: [{
            content: "Mont Blanc",
            id: "first"
        },
        {
            content: "K2",
            id: "second"
        },
        {
            content: "Mount Everest",
            id: "third"
        },
        {
            content: "Śnieżka",
            id: "fourth"
        }]
    }
    ,{
        question: "W którym roku odbyła się pierwsza podróż człowieka w kosmos?",
        correctAnswer: "1961",
        answers: [{
            content: "1957",
            id: "first"
        },
        {
            content: "1958",
            id: "second"
        },
        {
            content: "1960",
            id: "third"
        },
        {
            content: "1961",
            id: "fourth"
        }]
    }]
} as Test