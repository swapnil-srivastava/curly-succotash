import Image from "next/image";
import { Button } from "@swapnil-srivastava/ui/button";
import styles from "./page.module.css";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
          SeasonChef
        </h1>
        <p className="mt-4 text-secondary-light dark:text-secondary-dark">
          <Button appName="web" className={styles.secondary}>
            Call Hello World Heroku API   
          </Button>
        </p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}


