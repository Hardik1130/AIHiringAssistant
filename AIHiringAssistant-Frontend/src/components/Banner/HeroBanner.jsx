import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden group shadow-2xl shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40 z-10"></div>

      <img
        alt="Modern Office"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB87o5RsMxxKny2NwpO7z7dsPYywzUSPQ9iyaJsUPCpLS4HwYwesNa5HXMUHtFAvVBHnRFtEduZppu76exg2P0sio0q3I-1iAioeXMmfb_cZNPQz7qX9qKAPM-WUX96iBCj_o1bF5Xqgq6rboNnzzjph77EUcReoGL2KqbxVF1j8yqn07UpLe8rY3kgtjR_vOi_AD-QyW-I9OiogzIr-T_LKpan29VGU_dWmQ_El5l9fAIbwSqCbUTclqkmW1E11WHVRXcxuPE2nEg"
      />

      <div className="absolute inset-0 z-20 p-8 sm:p-12 flex flex-col justify-center text-white">
        <h2 className="text-2xl sm:text-4xl font-bold max-w-xl leading-tight">
          Scale your engineering team with precision AI sourcing.
        </h2>

        <p className="mt-4 text-white/80 max-w-md text-sm sm:text-base">
          Our neural matching engine analyzes 50+ data points to find your next unicorn hire in seconds.
        </p>

        <button
          onClick={() => navigate('/candidates')}
          className="mt-6 w-fit px-6 py-3 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-gray-100 transition-all active:scale-95"
        >
          Explore Talent Pool
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
