'use client'

import React from 'react'
import { useState } from "react";
import Link from 'next/link'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
   const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }
                `}
            </style>
            <nav className="bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex items-center justify-between relative">
                <div className="flex items-center gap-20">
                    <a href="https://educrush.in">
                        <span className="text-3xl font-bold text-zinc-900">Educrush</span>
                    </a>
                    <div className="hidden md:flex items-center gap-8">

                        <a href="/notes" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">Notes</a>
                        <a href="/projects" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">Projects</a>
                        <a href="/ai" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">EduCrush Ai</a>
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-sm text-zinc-800 cursor-pointer bg-transparent border-0 py-2 font-bold">
                                All Tools
                                <svg className="transition-transform group-hover:rotate-180" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <a href="#" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Landing Pages</a>
                                <a href="#" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">About Pages</a>
                                <a href="/contact" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Contact Pages</a>
                                <a href="#" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Blog Pages</a>
                            </div>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-sm text-zinc-800 cursor-pointer bg-transparent border-0 py-2 font-bold">
                                All Pages
                                <svg className="transition-transform group-hover:rotate-180" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <a href="#" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">About Pages</a>
                                <a href="/contact" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Contact Pages</a>

                                <a href="#" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Blog Pages</a>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="relative w-full max-w-[22rem] lg:max-w-[26rem]">
                        <input
                            type="search"
                            placeholder="Search resources"
                            className="w-full h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 pr-28 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                        />
                        <button
                            type="button"
                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950 text-zinc-50 px-4 py-2 text-sm font-medium hover:bg-zinc-800"
                        >
                            Search
                        </button>
                    </div>
                    <Link href="/notes" className="hidden md:flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0">
                        Get All Resources
                        <span className="size-7 rounded-full bg-white flex items-center justify-center">
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                    </Link>
                </div>

                <button
                    type="button"
                    aria-label="Toggle mobile menu"
                    onClick={(event) => {
                        event.stopPropagation()
                        setMenuOpen((open) => !open)
                    }}
                    className="md:hidden z-50 flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
                >
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex flex-col p-5 gap-3 md:hidden z-50">
                        <div className="relative w-full">
                            <input
                                type="search"
                                placeholder="Search resources"
                                className="w-full h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 pr-28 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950 text-zinc-50 px-4 py-2 text-sm font-medium hover:bg-zinc-800"
                            >
                                Search
                            </button>
                        </div>
                        <a href="/notes" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Notes</a>
                        <a href="/projects" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Projects</a>
                        <a href="/ai" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">EduCrush Ai</a>
                        <button onClick={() => setDropdownOpen1(!dropdownOpen1)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-zinc-800 hover:bg-zinc-50 bg-transparent border-0 cursor-pointer font-bold">
                            All Tools
                            <svg className={`transition-transform ${dropdownOpen1 ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {dropdownOpen1 && (
                            <div className="flex flex-col pl-4">
                                <a href="/landing-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Landing Pages</a>
                                <a href="/about-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">About Pages</a>
                                <a href="/contact" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Contact Pages</a>
                                <a href="/blog-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Blog Pages</a>
                            </div>
                        )}
                        <button onClick={() => setDropdownOpen2(!dropdownOpen2)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-zinc-800 hover:bg-zinc-50 bg-transparent border-0 cursor-pointer font-bold">
                            All Tools
                            <svg className={`transition-transform ${dropdownOpen2 ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {dropdownOpen2 && (
                            <div className="flex flex-col pl-4">
                                <a href="/landing-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Landing Pages</a>
                                <a href="/about-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">About Pages</a>
                                <a href="/contact" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Contact Pages</a>
                                <a href="/blog-pages" className="px-4 font-bold py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Blog Pages</a>
                            </div>
                        )}

                        <Link href="/notes" className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer border-0 mt-3 w-fit">
                            Get All Resources
                            <span className="size-7 rounded-full bg-white flex items-center justify-center">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </span>
                        </Link>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar