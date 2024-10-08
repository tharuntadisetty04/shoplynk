import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="grid w-full h-svh place-items-center px-6 lg:px-8 -mt-12">
            <div className="text-center">
                <p className="text-base font-semibold text-blue-600">404</p>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Page not found
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, we couldn't find the page you're looking for.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        aria-label="Go back home"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
