export const extractErrorMessage = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const preTag = doc.querySelector("pre");

    let errorMessage = "Unknown error occurred.";
    if (preTag) {
        const message = preTag.innerHTML.split("<br>")[0].split("Error: ")[1];
        errorMessage = message.trim();
    }

    return errorMessage;
};
