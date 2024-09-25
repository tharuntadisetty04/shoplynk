import { Link, useLocation, useParams } from "react-router-dom";

const ProductNotFound = ({ clearFilters }) => {
    const { pathname } = useLocation();
    const { keyword } = useParams();

    return (
        <div className="grid w-full h-svh place-items-center px-6 lg:px-8 -mt-14">
            <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Product not found
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, we couldn't find the product(s) you're looking for.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    {pathname === `/products/search/${keyword}` ? (
                        <Link
                            to="/products"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            View All Products
                        </Link>
                    ) : (
                        <Link
                            to="/products"
                            onClick={clearFilters}
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            View All Products
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductNotFound;
