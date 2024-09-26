export const extractErrorMessage = (htmlString) => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred.";

        if (preTag) {
            const preContent = preTag.innerHTML.split("<br>")[0];
            if (preContent.includes("Error: ")) {
                const message = preContent.split("Error: ")[1].trim();
                errorMessage = message || errorMessage;
            }
        }

        return errorMessage;
    } catch (e) {
        return "Failed to parse error message.";
    }
};
