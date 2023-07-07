export function getParsedHistory() {
    const storedHistory = localStorage.getItem("history");

    return storedHistory ? JSON.parse(storedHistory) : [];
}