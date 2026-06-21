import React from 'react';
import { companies, companiesList, companyHref, type CompanyId, withBase } from '../constants';

type HeaderProps = {
    companyId: CompanyId;
};

const Header: React.FC<HeaderProps> = ({ companyId }) => {
    const company = companies[companyId];

    const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const next = e.target.value as CompanyId;
        if (next === companyId) return;
        window.localStorage.setItem('lastCompany', next);
        window.location.assign(companyHref(next));
    };

    return (
        <header className="mb-10 border-b-2 border-gray-800 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border-2 border-gray-800 bg-gray-900 flex items-center justify-center overflow-hidden">
                        <img
                            src={withBase(company.logoFile)}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                            {company.name} <span className="text-brand-blue">Tracker</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mt-2">
                            // MASTER_THE_INTERVIEW
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-md">
                        <span className="w-2 h-2 inline-block bg-green-500 mr-2"></span>
                        <span className="text-xs font-mono text-gray-300 uppercase">System: Online</span>
                    </div>

                    <div className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-md">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mr-2">
                            Company
                        </label>
                        <select
                            value={companyId}
                            onChange={onCompanyChange}
                            className="bg-gray-900 text-xs font-mono text-gray-200 uppercase outline-none"
                        >
                            {companiesList.map((companyOption) => (
                                <option key={companyOption.id} value={companyOption.id}>
                                    {companyOption.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
