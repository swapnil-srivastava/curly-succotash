import axios from "axios";
import toast from "react-hot-toast";
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

    toast.success(`Called the Hello World Heroku API : ${data} ${appName}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      toast.error("Axios Hello World Heroku API GET");
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      toast.error("Error HEROKU API");
      return "An unexpected error occurred";
    }
  }
}
