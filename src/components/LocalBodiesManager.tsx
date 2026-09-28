import React, { useState } from 'react';
import { 
  Building2, MapPin, Users, Globe2, ShieldCheck, Home, 
  Search, CheckCircle2, CircleDollarSign, FolderKanban, ChevronRight,
  Activity, Award
} from 'lucide-react';
import { AP_DISTRICTS } from '../data/governanceData';
import { PanchayatHealthIndexWidget } from './PanchayatHealthIndexWidget';

export const LocalBodiesManager: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'health_index' | 'panchayats' | 'municipalities'>('health_index');
  const [selectedDistrict, setSelectedDistrict] = useState(AP_DISTRICTS[14].name); // Guntur
  const [searchQuery, setSearchQuery] = useState('');

  const currentDistObj = AP_DISTRICTS.find(d => d.name === selectedDistrict) || AP_DISTRICTS[0];

  const samplePanchayats = [
    { name: 'Pedaparimi Gram Panchayat', mandal: 'Thullur', sarpanch: 'K. Venkat Rao', population: '6,420', fundsReceivedLakhs: 85, projectsCount: 12, drinkingWaterStatus: '100% Tap Connectivity' },
    { name: 'Mandadam Gram Panchayat', mandal: 'Thullur', sarpanch: 'M. Padmavathi', population: '5,890', fundsReceivedLakhs: 72, projectsCount: 9, drinkingWaterStatus: 'Operational' },
    { name: 'Inavolu Gram Panchayat', mandal: 'Thullur', sarpanch: 'B. Srinivas', population: '4,120', fundsReceivedLakhs: 64, projectsCount: 8, drinkingWaterStatus: 'Operational' },
    { name: 'Velagapudi Gram Panchayat', mandal: 'Thullur', sarpanch: 'P. Rajeshwari', population: '7,300', fundsReceivedLakhs: 110, projectsCount: 15, drinkingWaterStatus: 'Smart RO Grid' },
    { name: 'Undavalli Gram Panchayat', mandal: 'Tadepalli', sarpanch: 'T. Subba Rao', population: '8,950', fundsReceivedLakhs: 125, projectsCount: 14, drinkingWaterStatus: 'Operational' },
    { name: 'Kollipara Gram Panchayat', mandal: 'Kollipara', sarpanch: 'V. Sambasiva', population: '9,400', fundsReceivedLakhs: 95, projectsCount: 11, drinkingWaterStatus: 'Operational' }
  ];

  const sampleMunicipalities = [
    { name: 'Guntur Municipal Corporation (GMC)', type: 'Municipal Corporation', head: 'Mayor / Commissioner', population: '8.4 Lakhs', budgetCr: 620, wardsCount: 57 },
    { name: 'Mangalagiri-Tadepalli Municipal Corp', type: 'Municipal Corporation', head: 'Mayor / Commissioner', population: '3.2 Lakhs', budgetCr: 280, wardsCount: 50 },
    { name: 'Tenali Municipality', type: 'Special Selection Grade', head: 'Municipal Chairperson', population: '1.9 Lakhs', budgetCr: 115, wardsCount: 40 },
    { name: 'Ponnur Municipality', type: '1st Grade Municipality', head: 'Municipal Chairperson', population: '65,000', budgetCr: 42, wardsCount: 31 }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#072445] via-[#093259] to-[#06203a] border border-[#1b4b6c] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700/50">
                  Grassroots Administration
                </span>
                <span className="text-xs text-gray-400">• Village Panchayats & Urban Local Bodies</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Local Bodies & Panchayat Raj Directory
              </h2>
            </div>
          </div>

          {/* Type Selector */}
          <div className="flex flex-wrap bg-[#04172a] p-1 rounded-xl border border-[#173e63]">
            <button
              onClick={() => setSelectedType('health_index')}
              className={`text-xs px-3 py-1.5 font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                selectedType === 'health_index' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Activity size={14} /> Health Index (PHI)
            </button>
            <button
              onClick={() => setSelectedType('panchayats')}
              className={`text-xs px-3 py-1.5 font-medium rounded-lg transition-all ${
                selectedType === 'panchayats' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Gram Panchayats (12,769)
            </button>
            <button
              onClick={() => setSelectedType('municipalities')}
              className={`text-xs px-3 py-1.5 font-medium rounded-lg transition-all ${
                selectedType === 'municipalities' ? 'bg-cyan-500 text-[#03152b] font-bold shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              Urban Bodies (119)
            </button>
          </div>
        </div>

        {/* District selection & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#173e63]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 flex-none">Filter by District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#04172c] border border-[#1b486d] text-xs text-cyan-200 px-3 py-2 rounded-xl outline-none"
            >
              {AP_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.panchayatsCount} Panchayats)</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search local body, village, ward..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#04172c] border border-[#1b486d] text-xs text-white pl-8 pr-3 py-2 rounded-xl outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* PANCHAYAT HEALTH INDEX TAB */}
      {selectedType === 'health_index' && (
        <div className="space-y-6">
          <PanchayatHealthIndexWidget />
        </div>
      )}

      {/* GRAM PANCHAYATS TAB */}
      {selectedType === 'panchayats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-300 px-1">
            <span>Displaying Gram Panchayats in <b>{selectedDistrict} District</b></span>
            <span className="text-cyan-300">Total in District: {currentDistObj.panchayatsCount} Panchayats</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {samplePanchayats.map(pan => (
              <div 
                key={pan.name}
                className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                      {pan.mandal} Mandal
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> {pan.drinkingWaterStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {pan.name}
                  </h3>
                  <p className="text-xs text-cyan-200">Sarpanch: <b>{pan.sarpanch}</b></p>

                  <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-[#04182c] p-2.5 rounded-xl border border-[#163f64]">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Population</span>
                      <b className="text-white">{pan.population}</b>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">15th FC Grants</span>
                      <b className="text-emerald-400">₹ {pan.fundsReceivedLakhs} Lakhs</b>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#133758] flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">
                    Active Works: <b className="text-cyan-300">{pan.projectsCount}</b>
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedType('health_index');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    View Health Index <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MUNICIPALITIES TAB */}
      {selectedType === 'municipalities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleMunicipalities.map(muni => (
              <div 
                key={muni.name}
                className="bg-[#071f3a] border border-[#1b4b6c] rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                      {muni.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Annual Budget: ₹ {muni.budgetCr} Cr
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {muni.name}
                  </h3>
                  <p className="text-xs text-cyan-200">Leadership: <b>{muni.head}</b></p>

                  <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-[#04182c] p-3 rounded-xl border border-[#163f64]">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Urban Population</span>
                      <b className="text-white">{muni.population}</b>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Electoral Wards</span>
                      <b className="text-cyan-300">{muni.wardsCount} Wards</b>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#133758] flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={13} /> Solid Waste Management Compliant
                  </span>
                  <button 
                    onClick={() => alert(`Opening ${muni.name} civic transparency portal: Town planning, property tax, water bills and tenders.`)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    Municipal Dashboard <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
