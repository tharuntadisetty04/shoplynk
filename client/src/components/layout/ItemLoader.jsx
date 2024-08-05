import React from "react";

const ItemLoader = () => {
    return (
        <div className="flex items-center justify-center bg-neutral-100 w-full md:h-[45lvh] h-[40lvh]">
            <div className="w-14 h-14 border-4 animate-spin border-t-blue-500 rounded-full"></div>
        </div>
    );
};

export default ItemLoader;
