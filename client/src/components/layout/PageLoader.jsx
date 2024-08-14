import React from "react";

const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-100 -mt-8">
            <div className="flex flex-col gap-6 w-full items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent animate-spin flex items-center justify-center border-t-blue-600 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent animate-spin border-t-blue-400 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
