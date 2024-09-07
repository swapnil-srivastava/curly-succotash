import axios from "axios";
import { BACKEND_URL } from "../library/library";

export async function callHerokuHelloWorld(appName: string) {
  try {
    const { data, status } = await axios.get(`${BACKEND_URL}/helloWorldModels`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Called the Hello World Heroku API : ${data} status : ${status} - appName :  ${appName}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}
