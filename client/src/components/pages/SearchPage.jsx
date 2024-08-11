import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            navigate(`/products/search/${keyword}`);
        } else {
            navigate("/products");
        }
    };

    return (
        <div className="search-box w-full lg:h-[27.8rem] md:h-[70svh] h-[42svh]">
            <form
                onSubmit={handleFormSubmit}
                className="w-full h-full flex items-center justify-center gap-4 lg:px-0 md:px-16 px-8 py-10"
            >
                <input
                    type="text"
                    placeholder="Search for Products"
                    className="outline-none duration-100 lg:w-1/3 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <input
                    type="submit"
                    value="Search"
                    className="rounded cursor-pointer bg-blue-600 px-3.5 py-[0.65rem] text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                />
            </form>
        </div>
    );
};

export default SearchPage;
