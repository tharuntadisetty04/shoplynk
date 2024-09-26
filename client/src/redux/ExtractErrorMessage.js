export const extractErrorMessage = (htmlString) => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const preTag = doc.querySelector("pre");

        let errorMessage = "Unknown error occurred";

        if (preTag) {
            const preContent = preTag.innerHTML.split("<br>")[0];

            if (preContent) {
                const message = preContent.trim();
                errorMessage = message || errorMessage;
            }
        }

        return errorMessage;
    } catch (e) {
        return "Internal server error";
    }
};
