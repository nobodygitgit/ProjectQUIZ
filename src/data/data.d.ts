export interface Test {
    title: string,
    questions: Question[]
}

export interface Question {
    question: string,
    answers: Answer[],
    correctAnswer: string
}

export interface Answer {
    content: string,
    id: string
}