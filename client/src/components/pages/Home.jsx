import React from 'react'
import heroImg from '../../assets/hero-img2.png';
import { Link } from 'react-router-dom';
import { GiAmpleDress } from "react-icons/gi";
import { MdOutlineSportsEsports } from "react-icons/md";
import { MdOutlineFoodBank } from "react-icons/md";
import { BsHeartPulse } from "react-icons/bs";
import { FaBowlFood } from "react-icons/fa6";
import { MdElectricalServices } from "react-icons/md";

const Home = () => {
    return (
        <div className="home w-full h-full">
            <div className="hero-banner w-full h-fit md:flex md:items-center md:justify-between px-8 md:px-16">
                <div className='left-section flex-col flex gap-4'>
                    <h1 className='md:text-5xl text-2xl font-bold md:flex-col md:flex md:gap-1'>
                        <span>Shop your favorite</span>
                        <span>products from one place.</span>
                    </h1>

                    <p className='font-medium md:flex-col md:flex md:my-2'>
                        <span>Browse our wide selection of high-quality products</span>
                        <span>from verified sellers and find the perfect items for your needs.</span>
                    </p>

                    <div className='flex gap-4'>
                        <Link
                            to="/products"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            Shop Now
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            Become a Seller
                        </Link>
                    </div>
                </div>

                <div className='right-section mt-4 md:mt-0 w-fit'>
                    <img src={heroImg} alt="Shopping image" width={700} loading='lazy' />
                </div>
            </div>

            <div className="categories w-full h-fit py-2 px-8 md:px-16">
                <h1 className='text-2xl font-bold mb-6'>Browse by Category</h1>

                <div className='gap-4 grid place-items-center md:grid-cols-6 grid-cols-2'>
                    <Link to="/products" className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><GiAmpleDress /></p>
                        <p className='font-medium md:text-lg'>Fashion</p>
                    </Link>

                    <div className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><MdElectricalServices /></p>
                        <p className='font-medium md:text-lg'>Electronics</p>
                    </div>

                    <div className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><BsHeartPulse /></p>
                        <p className='font-medium md:text-lg'>Personal Care</p>
                    </div>

                    <div className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><MdOutlineFoodBank /></p>
                        <p className='font-medium md:text-lg'>Home & Kitchen</p>
                    </div>

                    <div className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><MdOutlineSportsEsports /></p>
                        <p className='font-medium md:text-lg'>Sports & Games</p>
                    </div>

                    <div className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2">
                        <p className='font-medium md:text-5xl text-4xl'><FaBowlFood /></p>
                        <p className='font-medium md:text-lg'>Groceries</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home