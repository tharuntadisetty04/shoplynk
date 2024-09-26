export const extractErrorMessage = (htmlString) => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred.";

        if (preTag) {
            const parsedResponse = JSON.parse(preTag.innerHTML);
            if (parsedResponse.message) {
                errorMessage = parsedResponse.message;
            }
        }

        return errorMessage;
    } catch (e) {
        console.error("Error parsing error message:", e);
        return "An error occurred while extracting the error message.";
    }
};
