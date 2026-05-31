import { useState, useEffect } from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import { Globe, ArrowRightLeft, Import as ImportIcon, Download as DownloadIcon } from 'lucide-react'

interface GeoDistributionProps {
    data: {
        imports: any[]
        exports: any[]
    }
    dataType?: string
}

// Simple mapping for common country names to ISO A3 for the heat map
const COUNTRY_MAP: { [key: string]: string } = {
    // North America
    'UNITED STATES': 'USA', 'USA': 'USA', 'U.S.A.': 'USA', 'US': 'USA', 'UNITED STATES OF AMERICA': 'USA',
    'CANADA': 'CAN', 'CA': 'CAN', 'MEXICO': 'MEX', 'MX': 'MEX',
    // Asia
    'INDIA': 'IND', 'IN': 'IND', 'CHINA': 'CHN', 'CN': 'CHN', 'JAPAN': 'JPN', 'JP': 'JPN',
    'SOUTH KOREA': 'KOR', 'KOREA': 'KOR', 'KR': 'KOR', 'REPUBLIC OF KOREA': 'KOR',
    'VIETNAM': 'VNM', 'VIET NAM': 'VNM', 'VN': 'VNM',
    'MALAYSIA': 'MYS', 'MY': 'MYS', 'SINGAPORE': 'SGP', 'SG': 'SGP',
    'THAILAND': 'THA', 'TH': 'THA', 'INDONESIA': 'IDN', 'ID': 'IDN',
    'PAKISTAN': 'PAK', 'PK': 'PAK', 'BANGLADESH': 'BGD', 'BD': 'BGD',
    'PHILIPPINES': 'PHL', 'PH': 'PHL', 'TAIWAN': 'TWN', 'TW': 'TWN',
    'HONG KONG': 'HKG', 'HK': 'HKG', 'HONG KONG SAR': 'HKG',
    'KAZAKHSTAN': 'KAZ', 'KZ': 'KAZ', 'UZBEKISTAN': 'UZB', 'UZ': 'UZB',
    'SRI LANKA': 'LKA', 'LK': 'LKA', 'MYANMAR': 'MMR', 'MM': 'MMR', 'CAMBODIA': 'KHM', 'KH': 'KHM',
    // Middle East
    'UNITED ARAB EMIRATES': 'ARE', 'UAE': 'ARE', 'AE': 'ARE', 'SAUDI ARABIA': 'SAU', 'SA': 'SAU',
    'TURKEY': 'TUR', 'TÜRKIYE': 'TUR', 'TR': 'TUR', 'IRAN': 'IRN', 'IR': 'IRN',
    'IRAQ': 'IRQ', 'IQ': 'IRQ', 'ISRAEL': 'ISR', 'IL': 'ISR', 'QATAR': 'QAT', 'QA': 'QAT',
    'OMAN': 'OMN', 'OM': 'OMN', 'KUWAIT': 'KWT', 'KW': 'KWT', 'JORDAN': 'JOR', 'JO': 'JOR',
    'LEBANON': 'LBN', 'LB': 'LBN',
    // Europe
    'RUSSIA': 'RUS', 'RUSSIAN FEDERATION': 'RUS', 'RU': 'RUS', 'GERMANY': 'DEU', 'DE': 'DEU',
    'UNITED KINGDOM': 'GBR', 'UK': 'GBR', 'GB': 'GBR', 'FRANCE': 'FRA', 'FR': 'FRA',
    'ITALY': 'ITA', 'IT': 'ITA', 'SPAIN': 'ESP', 'ES': 'ESP', 'NETHERLANDS': 'NLD', 'NL': 'NLD',
    'BELGIUM': 'BEL', 'BE': 'BEL', 'SWITZERLAND': 'CHE', 'CH': 'CHE',
    'AUSTRIA': 'AUT', 'AT': 'AUT', 'POLAND': 'POL', 'PL': 'POL',
    'SWEDEN': 'SWE', 'SE': 'SWE', 'NORWAY': 'NOR', 'NO': 'NOR',
    'DENMARK': 'DNK', 'DK': 'DNK', 'FINLAND': 'FIN', 'FI': 'FIN',
    'IRELAND': 'IRL', 'IE': 'IRL', 'PORTUGAL': 'PRT', 'PT': 'PRT',
    'GREECE': 'GRC', 'GR': 'GRC', 'CZECHIA': 'CZE', 'CZECH REPUBLIC': 'CZE', 'CZ': 'CZE',
    'HUNGARY': 'HUN', 'HU': 'HUN', 'ROMANIA': 'ROU', 'RO': 'ROU', 'UKRAINE': 'UKR', 'UA': 'UKR',
    'LATVIA': 'LVA', 'LV': 'LVA',
    // South America
    'BRAZIL': 'BRA', 'BR': 'BRA', 'ARGENTINA': 'ARG', 'AR': 'ARG', 'CHILE': 'CHL', 'CL': 'CHL',
    'COLOMBIA': 'COL', 'CO': 'COL', 'PERU': 'PER', 'PE': 'PER', 'ECUADOR': 'ECU', 'EC': 'ECU',
    // Africa
    'SOUTH AFRICA': 'ZAF', 'ZA': 'ZAF', 'EGYPT': 'EGY', 'EG': 'EGY', 'NIGERIA': 'NGA', 'NG': 'NGA',
    // Oceania
    'AUSTRALIA': 'AUS', 'AU': 'AUS', 'NEW ZEALAND': 'NZL', 'NZ': 'NZL',
}

export function GeoDistribution({ data, dataType }: GeoDistributionProps) {
    const [scenario, setScenario] = useState<'imports' | 'exports'>('imports')
    const [countries, setCountries] = useState<any>(null)

    useEffect(() => {
        console.debug('[GeoDistribution] mount, dataType=', dataType)
        // Fetch local world topology for Nivo
        fetch('/world_countries.json')
            .then(res => res.json())
            .then(d => {
                console.debug('[GeoDistribution] loaded world topo, features=', d?.features?.length)
                setCountries(d)
            })
            .catch(err => console.error('Failed to load map data', err))
    }, [dataType])

    if (!data) return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[500px] flex items-center justify-center">
            <div className="text-slate-400">No geo data available</div>
        </div>
    )

    const currentData = data[scenario] || []

    // Transform data for Nivo Choropleth
    const chartData = currentData.map(item => {
        // Normalize: uppercase, remove dots, strip parentheses content, trim extra spaces
        const rawName = String(item.name || '').toUpperCase();
        const countryName = rawName
            .replace(/\(.*\)/g, '') // Remove "(REPUBLIC OF)", "(UK)", etc.
            .replace(/\./g, '')     // Remove dots
            .replace(/\s+/g, ' ')   // Normalize whitespace
            .trim();

        const id = COUNTRY_MAP[countryName] || countryName; // Use mapping or raw name if it's already an ID
        return {
            id,
            value: item.volume_mt || 0
        }
    })

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Geographic Distribution
                </h3>

                {/* Scenario Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setScenario('imports')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scenario === 'imports'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <ImportIcon className="h-3.5 w-3.5" />
                        {dataType === 'global' ? 'ORIGINS' : 'IMPORTING'}
                    </button>
                    <button
                        onClick={() => setScenario('exports')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scenario === 'exports'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <DownloadIcon className="h-3.5 w-3.5" />
                        {dataType === 'global' ? 'DESTINATIONS' : 'EXPORTING'}
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-slate-50 rounded-xl overflow-hidden relative">
                {!countries ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading World Map...</span>
                        </div>
                    </div>
                ) : (
                    <ResponsiveChoropleth
                        data={chartData}
                        features={countries.features}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        colors="nivo"
                        domain={[0, chartData.length > 0 ? Math.max(...chartData.map(d => d.value), 1) : 1]}
                        unknownColor="#e2e8f0"
                        label="properties.name"
                        valueFormat=".2f"
                        projectionScale={100}
                        projectionTranslation={[0.5, 0.5]}
                        projectionRotation={[0, 0, 0]}
                        enableGraticule={false}
                        borderWidth={0.5}
                        borderColor="#ffffff"
                        tooltip={(props: any) => (
                            <div className="bg-white px-3 py-2 border border-slate-200 shadow-lg rounded-lg text-xs">
                                <span className="font-bold text-slate-900">{props.feature.properties.name || props.feature.id}:</span>
                                <span className="ml-2 text-blue-600 font-bold">{props.feature.value ? `${props.feature.value.toLocaleString()} MT` : 'No Data'}</span>
                            </div>
                        )}
                    />
                )}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Total Countries: {chartData.length}</span>
                <span>Scenario: {scenario === 'imports' ? 'Origin Analysis' : 'Destination Analysis'}</span>
            </div>
        </div>
    )
}
