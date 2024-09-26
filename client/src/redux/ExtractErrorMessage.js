export const extractErrorMessage = (response) => {
    try {
        try {
            const jsonResponse = JSON.parse(response);
            if (jsonResponse.error) {
                return jsonResponse.error;
            }
        } catch (jsonParseError) {
            // If parsing as JSON fails, continue to handle it as HTML or plain text
        }

        if (response.includes("<html>") || response.includes("<pre>")) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, "text/html");
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
        }

        const plainTextError = response.match(/Error:\s*(.*?)(\n|$)/);

        if (plainTextError && plainTextError[1]) {
            return plainTextError[1].trim();
        }

        return "Unknown error occurred.";
    } catch (e) {
        return "Failed to parse error message.";
    }
};
