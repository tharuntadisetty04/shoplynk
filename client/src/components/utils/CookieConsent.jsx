import { useState, useEffect } from "react";

const CookieConsent = () => {
    const [consentGiven, setConsentGiven] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");

        if (consent) {
            setConsentGiven(true);
        }
    }, []);

    const handleConsent = () => {
        localStorage.setItem("cookieConsent", "true");

        const maxAge = 10 * 24 * 60 * 60;
        document.cookie = "cookieConsent=true; path=/; max-age=" + maxAge + "; SameSite=None; Secure";

        setConsentGiven(true);
    };

    if (consentGiven) {
        return null;
    }

    return (
        !consentGiven && (
            <div className="fixed bottom-0 left-0 right-0 bg-slate-200 text-gray-900 p-4 z-50">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm md:text-base">
                        We use cookies to ensure you get the best experience on our website.
                    </p>

                    <button
                        onClick={handleConsent}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                        Accept
                    </button>
                </div>
            </div>
        )
    );
};

export default CookieConsent;
