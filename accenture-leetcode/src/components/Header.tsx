import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-10 border-b-2 border-gray-800 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                        Accenture <span className="text-brand-blue">Tracker</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm mt-2">
                        // MASTER_THE_INTERVIEW
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-md">
                        <span className="w-2 h-2 inline-block bg-green-500 mr-2"></span>
                        <span className="text-xs font-mono text-gray-300 uppercase">System: Online</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;