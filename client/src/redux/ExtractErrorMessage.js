export const extractErrorMessage = (htmlString) => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred.";

        if (preTag) {
            const errorHtml = preTag.innerHTML;

            const messageLine = errorHtml.split("<br>")[0];
            const match = messageLine.match(/Error: (.+)/);

            if (match) {
                errorMessage = match[1].trim();
            } else {
                errorMessage = messageLine.trim();
            }
        }

        return errorMessage;
    } catch (e) {
        return "An error occurred while extracting the error message.";
    }
};