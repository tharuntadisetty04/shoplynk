export const extractErrorMessage = (htmlString) => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred.";

        if (preTag) {
            const errorLine = preTag.innerHTML.split("<br>")[0];

            if (errorLine.includes("Error: ")) {
                const message = errorLine.split("Error: ")[1];
                errorMessage = message ? message.trim() : errorMessage;
            }
        }

        return errorMessage;
    } catch (e) {
        console.error("Error parsing error message:", e);
        return "An error occurred while extracting the error message.";
    }
};
