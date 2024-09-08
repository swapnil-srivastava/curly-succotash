interface Choice {
    id: number;
    choiceText: string;
}
  
interface Question {
    id: number;
    questionText: string;
    choices: Choice[];
}

export const BACKEND_URL = "https://spring-hackfestival2024-df62fb596841.herokuapp.com";

export type { Question, Choice };