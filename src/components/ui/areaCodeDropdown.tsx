'use client'
import React, { useState, useRef, useEffect } from 'react';

const AreaCodeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative w-24" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 flex items-center justify-between"
            >
                <span>+1</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-slate-900" viewBox="0 0 24 24">
                    <path fillRule="evenodd"
                        d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                        clipRule="evenodd" data-original="#000000" />
                </svg>
            </button>

            {isOpen && (
                <ul className="absolute left-0 top-full mt-1 shadow-lg bg-white py-2 px-2 z-50 w-64 rounded max-h-96 overflow-auto">
                    <li className="mb-2">
                        <input placeholder="Search..."
                            className="px-4 py-2.5 w-full rounded text-slate-900 text-sm border border-slate-100 outline-0 bg-slate-50 focus:bg-transparent focus:border-slate-900" />
                    </li>
                    <li className="dropdown-item py-2.5 px-4 hover:bg-slate-50 rounded text-black text-sm cursor-pointer">
                        <div className="flex items-center">
                            <img src="https://readymadeui.com/usa_flag.webp" className="w-6 mr-3" />
                            USA
                        </div>
                    </li>
                    <li className="dropdown-item py-2.5 px-4 hover:bg-slate-50 rounded text-black text-sm cursor-pointer">
                        <div className="flex items-center">
                            <img src="https://readymadeui.com/uk_flag.webp" className="w-6 mr-3" />
                            England
                        </div>
                    </li>
                    <li className="dropdown-item py-2.5 px-4 hover:bg-slate-50 rounded text-black text-sm cursor-pointer">
                        <div className="flex items-center">
                            <img src="https://readymadeui.com/india_flag.webp" className="w-6 mr-3" />
                            India
                        </div>
                    </li>
                    <li className="dropdown-item py-2.5 px-4 hover:bg-slate-50 rounded text-black text-sm cursor-pointer">
                        <div className="flex items-center">
                            <img src="https://readymadeui.com/singapore_flag.webp" className="w-6 mr-3" />
                            Singapore
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
}

export default AreaCodeDropdown;
