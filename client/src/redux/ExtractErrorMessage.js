export const extractErrorMessage = (htmlString) => {
    try {
        console.log(htmlString);

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred.";

        if (preTag) {
            const errorHtml = preTag.innerHTML;

            const messageLine = errorHtml.split("<br>")[0];

            if (messageLine.startsWith("Error: ")) {
                errorMessage = messageLine.split("Error: ")[1].trim();
            } else {
                errorMessage = messageLine.trim();
            }
        }

        return errorMessage;
    } catch (e) {
        console.error("Error parsing error message:", e);
        return "An error occurred while extracting the error message.";
    }
};
