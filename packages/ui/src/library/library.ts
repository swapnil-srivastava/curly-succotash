
const getLocalStorage = (key: string, defaultValue:any) => {
    const stickyValue = localStorage.getItem(key);
    return (stickyValue !== null && stickyValue !== 'undefined')
        ? JSON.parse(stickyValue)
        : defaultValue;
}
  
const setLocalStorage = (key: string, value:any) => {
    localStorage.setItem(key, JSON.stringify(value));
}
  
const BACKEND_URL = "https://spring-hackfestival2024-df62fb596841.herokuapp.com/";
  
export { BACKEND_URL, getLocalStorage, setLocalStorage };
  