import React, { useState, useEffect } from 'react';
import { Calculator, Landmark, Scale, TrendingUp, TrendingDown, Info, TurkishLira } from 'lucide-react';
import { calculateTax, formatCurrency, formatPercent } from './utils/taxLogic';
import { TaxResult } from './types';
import ResultCard from './components/ResultCard';
import ComparisonChart from './components/ComparisonChart';

const App: React.FC = () => {
  const [incomeInput, setIncomeInput] = useState<string>('600000');
  const [result, setResult] = useState<TaxResult | null>(null);

  useEffect(() => {
    const income = parseFloat(incomeInput.replace(/[^0-9.]/g, '')) || 0;
    setResult(calculateTax(income));
  }, [incomeInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    setIncomeInput(val);
  };

  const formattedInput = incomeInput ? new Intl.NumberFormat('tr-TR').format(parseInt(incomeInput)) : '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-blue-200" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">2026 Gelir Vergisi Hesaplama</h1>
              <p className="text-blue-100 text-sm mt-1 opacity-90">G.V.K. Madde 103 (Ücretliler) vs Kurumlar Vergisi Analizi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <label htmlFor="income" className="block text-sm font-semibold text-slate-700 mb-2">
            Yıllık Brüt Ücret Geliri (TL)
          </label>
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <TurkishLira className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              id="income"
              value={formattedInput}
              onChange={handleInputChange}
              className="block w-full pl-12 pr-4 py-4 text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-300"
              placeholder="Örn: 1.000.000"
              autoComplete="off"
            />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            * 2026 yılı için önerilen gelir vergisi dilimlerine göre hesaplama yapar.
          </p>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Gelir Vergisi (Ücretli)"
                  amount={formatCurrency(result.incomeTaxAmount)}
                  rate={`Etkin: ${formatPercent(result.effectiveIncomeTaxRate)}`}
                  icon={Landmark}
                  colorClass="bg-blue-600 text-blue-600"
                  subText="Kümülatif vergi dilimleri üzerinden hesaplanmıştır."
                />
                
                <ResultCard
                  title="Kurumlar Vergisi (%25)"
                  amount={formatCurrency(result.corporateTaxAmount)}
                  rate="Sabit: 25%"
                  icon={Scale}
                  colorClass="bg-slate-600 text-slate-600"
                  subText="Sabit oran üzerinden hesaplanmıştır."
                />
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Vergi Yükü Karşılaştırması</h3>
                <ComparisonChart data={result} />
              </div>

            </div>

            {/* Right Column: Analysis */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Verdict Card */}
              <div className={`rounded-xl shadow-sm border p-6 ${
                result.isCorporateAdvantage 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {result.isCorporateAdvantage ? (
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-emerald-700" />
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <TrendingDown className="w-6 h-6 text-amber-700" />
                    </div>
                  )}
                  <h3 className={`text-lg font-bold ${
                    result.isCorporateAdvantage ? 'text-emerald-900' : 'text-amber-900'
                  }`}>
                    {result.isCorporateAdvantage ? 'Şirketleşmek Avantajlı' : 'Şahıs Kalmak Avantajlı'}
                  </h3>
                </div>

                <p className="text-slate-700 mb-4 leading-relaxed">
                  Bu gelir seviyesinde, {result.isCorporateAdvantage ? 'Kurumlar Vergisi' : 'Gelir Vergisi'} ödemek finansal olarak daha avantajlıdır.
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200 border-opacity-50">
                    <span className="text-sm text-slate-600">Fark Tutarı</span>
                    <span className={`font-bold text-lg ${
                      result.isCorporateAdvantage ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {formatCurrency(Math.abs(result.differenceAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Vergi Avantajı</span>
                    <span className="font-bold text-slate-800">
                      {formatPercent(result.advantagePercentage)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Brackets Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-slate-400" />
                  <h3 className="font-semibold text-slate-800">2026 Ücretli Tarifesi</h3>
                </div>
                <ul className="text-xs space-y-3 text-slate-600">
                  <li className="flex justify-between">
                    <span>190.000 ₺'ye kadar</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">%15</span>
                  </li>
                  <li className="flex justify-between">
                    <span>400.000 ₺'ye kadar</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">%20</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1.500.000 ₺'ye kadar</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">%27</span>
                  </li>
                  <li className="flex justify-between">
                    <span>5.300.000 ₺'ye kadar</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">%35</span>
                  </li>
                  <li className="flex justify-between">
                    <span>5.300.000 ₺ üzeri</span>
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">%40</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Sadece bilgilendirme amaçlıdır. Resmi vergi danışmanlığı yerine geçmez.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;