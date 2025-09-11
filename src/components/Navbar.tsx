'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const menuItems = [
    { text: 'Início', url: '/' },
    { text: 'Sobre', url: '/about' },
    { text: 'Publicações', url: '/publications' },
    { text: 'Blog', url: '/blog' },
    { text: 'Galeria', url: '/gallery' },
    { text: 'Contato', url: '/contato' },
];

const Header: React.FC = () => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => isOpen && setIsOpen(false);
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <header className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out max-w-xl mx-auto",
            scrolled ? "py-2" : "py-4"
        )}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className={cn(
                    "relative flex items-center justify-center rounded-2xl px-6 py-3 transition-all duration-500",
                    "bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-gray-900/5",
                    scrolled && "bg-white/95 shadow-xl shadow-gray-900/10"
                )}>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 mx-auto">
                        {menuItems.map((item) => (
                            <a
                                key={item.text}
                                href={item.url}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                                    "hover:text-gray-900",
                                    pathname === item.url
                                        ? " text-gray-900 "
                                        : "text-gray-700"
                                )}
                            >
                                {item.text}
                                {pathname === item.url && (
                                    <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-gray-400 to-gray-600" />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className={cn(
                            "md:hidden absolute right-6 p-2 rounded-xl transition-all duration-200",
                            "hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-gray-200",
                            isOpen && "bg-gray-100"
                        )}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <div className="relative w-5 h-5">
                            <Menu 
                                className={cn(
                                    "absolute inset-0 transition-all duration-200",
                                    isOpen ? "scale-0 rotate-90" : "scale-100 rotate-0"
                                )} 
                            />
                            <X 
                                className={cn(
                                    "absolute inset-0 transition-all duration-200",
                                    isOpen ? "scale-100 rotate-0" : "scale-0 rotate-90"
                                )} 
                            />
                        </div>
                    </button>

                    {/* Mobile Menu Overlay */}
                    {isOpen && (
                        <div 
                            className="md:hidden fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm"
                            onClick={toggleMenu}
                        />
                    )}

                    {/* Mobile Menu */}
                    <div className={cn(
                        "md:hidden absolute top-full left-0 right-0 mt-2 transition-all duration-300 ease-out",
                        isOpen 
                            ? "opacity-100 translate-y-0 pointer-events-auto" 
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    )}>
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl shadow-gray-900/10 p-2">
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.text}
                                        href={item.url}
                                        onClick={toggleMenu}
                                        className={cn(
                                            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                            "hover:bg-gray-100/80 hover:text-gray-900",
                                            pathname === item.url
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700"
                                        )}
                                    >
                                        {item.text}
                                        {pathname === item.url && (
                                            <div className="ml-auto w-2 h-2 bg-gray-600 rounded-full" />
                                        )}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;