import { Button } from "@swapnil-srivastava/ui/button";
import styles from "./page.module.css";
import { ThemeToggle } from "../components/ThemeToggle";
import QuestionForm from "../components/QuestionForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto p-4">
        <div className="w-full h-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              SeasonChef
            </h1>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
        <div>
          <QuestionForm />
        </div>
      </div>
    </main>
  );
}


