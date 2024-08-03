import React from "react";
import Helmet from "react-helmet";

const TitleHelmet = ({ title }) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default TitleHelmet;
