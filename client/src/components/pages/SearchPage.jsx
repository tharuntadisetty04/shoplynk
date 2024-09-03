import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophoneLines, FaMicrophoneLinesSlash } from "react-icons/fa6";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const SearchPage = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognition = new SpeechRecognition();

    useEffect(() => {
        recognition.interimResults = true;

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");

            setKeyword(transcript);

            if (event.results[0].isFinal) {
                navigate(`/products/search/${transcript.trim()}`);
            }
        };

        recognition.onerror = (event) => {
            toast.error("Speech recognition error: ", event.error);
        };

        return () => {
            recognition.stop();
        };
    }, [isListening, navigate]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            navigate(`/products/search/${keyword}`);
        } else {
            navigate("/products");
        }
    };

    return (
        <div className="search-box w-full lg:h-[27rem] md:h-[70svh] h-[45svh]">
            <TitleHelmet title={"Search | ShopLynk"} />

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition:Slide
            />

            <form
                onSubmit={handleFormSubmit}
                className="w-full h-full flex md:flex-row flex-col items-center justify-center gap-4 lg:px-0 md:px-16 px-8 py-10"
            >
                <input
                    type="text"
                    placeholder="Search for Products"
                    className="outline-none duration-100 lg:w-1/3 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                />

                <div className="flex items-center gap-3 md:w-fit w-full">
                    <button
                        type="button"
                        className="rounded cursor-pointer bg-blue-600 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 w-1/4 md:w-fit flex items-center justify-center"
                        onClick={() => setIsListening((prevState) => !prevState)}
                    >
                        {isListening ? (
                            <span className="text-xl px-[0.7rem] py-[0.68rem]">
                                <FaMicrophoneLinesSlash />
                            </span>
                        ) : (
                            <span className="text-lg px-3 py-[0.76rem]">
                                <FaMicrophoneLines />
                            </span>
                        )}
                    </button>
                    <input
                        type="submit"
                        value="Search"
                        className="rounded cursor-pointer bg-blue-600 px-3.5 py-[0.65rem] text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 w-3/4 md:w-fit"
                    />
                </div>
            </form>
        </div>
    );
};

export default SearchPage;
