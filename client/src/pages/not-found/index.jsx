import React from "react";

const NotFound = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full bg-black text-white overflow-hidden">
      {/* Pulsating Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-yellow-500 to-purple-700 animate-[pulse_2s_infinite_alternate] blur-3xl opacity-30"></div>

      {/* Spinning Border Circle */}
      <div className="absolute w-96 h-96 border-8 border-dashed border-cyan-400 rounded-full animate-[spin_8s_linear_infinite] blur-sm"></div>

      {/* Shaking Text */}
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-300 to-green-500 animate-[bounce_1.2s_infinite] drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
        404
      </h1>

      {/* Wavy Subtext */}
      <p className="mt-6 text-3xl font-mono animate-[pulse_2s_infinite] text-yellow-400 transition-all duration-700 transform hover:scale-125 hover:rotate-6">
        Page does not exist
      </p>

      {/* Flying Squares */}
      <div className="absolute top-10 left-10 w-10 h-10 bg-pink-600 animate-[spin_3s_linear_infinite]"></div>
      <div className="absolute bottom-16 right-10 w-8 h-8 bg-green-600 animate-[bounce_2s_infinite]"></div>
      <div className="absolute top-32 right-1/3 w-6 h-6 bg-cyan-400 animate-[ping_1.5s_infinite]"></div>

      {/* Button */}
      <button
        className="mt-10 px-8 py-3 text-lg font-bold bg-gradient-to-r from-red-600 to-yellow-400 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:rotate-12 hover:from-yellow-400 hover:to-red-600 animate-[pulse_2s_infinite]"
        onClick={() => (window.location.href = "/shop")}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
