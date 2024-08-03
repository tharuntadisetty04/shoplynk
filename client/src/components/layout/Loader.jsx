import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-100">
            <div className="flex items-center space-x-4">
                <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce delay-400"></div>
                <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce delay-800"></div>
            </div>
        </div>
    );
};

export default Loader;
