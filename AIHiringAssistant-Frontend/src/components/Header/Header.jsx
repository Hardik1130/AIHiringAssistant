import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <header className="w-full bg-gray-100 border-b border-gray-100 px-8 py-3 fixed top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <svg className="size-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" />
            </svg>
            <span className="text-2xl font-black tracking-tight text-slate-900">Devstringx Presents-HireAI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-500 font-medium">Already have an account?</span>
            <button 
             onClick={() => navigate('/login')}
            className="text-sm font-bold text-primary hover:text-primary-dark transition-colors text-[#ec5b13]" 
            >signIn</button>
          </div>
        </div>
      </header>
    );
};
 

export default Header;