// Country flag utilities using free CDN images (works on Windows!)

const COUNTRY_CODES: Record<string, string> = {
  "india": "IN", "china": "CN", "japan": "JP", "south korea": "KR",
  "indonesia": "ID", "thailand": "TH", "vietnam": "VN", "philippines": "PH",
  "malaysia": "MY", "singapore": "SG", "bangladesh": "BD", "pakistan": "PK",
  "sri lanka": "LK", "nepal": "NP", "myanmar": "MM", "cambodia": "KH",
  "taiwan": "TW", "brunei": "BN", "maldives": "MV",
  "united arab emirates": "AE", "saudi arabia": "SA", "qatar": "QA",
  "kuwait": "KW", "bahrain": "BH", "oman": "OM", "iraq": "IQ", "iran": "IR",
  "israel": "IL", "jordan": "JO", "lebanon": "LB", "yemen": "YE",
  "united kingdom": "GB", "france": "FR", "germany": "DE", "italy": "IT",
  "spain": "ES", "portugal": "PT", "netherlands": "NL", "belgium": "BE",
  "austria": "AT", "switzerland": "CH", "sweden": "SE", "norway": "NO",
  "denmark": "DK", "finland": "FI", "ireland": "IE", "poland": "PL",
  "czech republic": "CZ", "hungary": "HU", "romania": "RO", "bulgaria": "BG",
  "croatia": "HR", "greece": "GR", "slovakia": "SK", "slovenia": "SI",
  "lithuania": "LT", "latvia": "LV", "estonia": "EE", "luxembourg": "LU",
  "malta": "MT", "cyprus": "CY", "iceland": "IS", "serbia": "RS",
  "albania": "AL", "ukraine": "UA", "russia": "RU", "turkey": "TR",
  "georgia": "GE",
  "united states": "US", "usa": "US", "america": "US",
  "canada": "CA", "mexico": "MX",
  "guatemala": "GT", "costa rica": "CR", "panama": "PA", "cuba": "CU",
  "jamaica": "JM", "dominican republic": "DO",
  "brazil": "BR", "argentina": "AR", "chile": "CL", "colombia": "CO",
  "peru": "PE", "ecuador": "EC", "venezuela": "VE", "bolivia": "BO",
  "paraguay": "PY", "uruguay": "UY",
  "south africa": "ZA", "nigeria": "NG", "egypt": "EG", "kenya": "KE",
  "ethiopia": "ET", "ghana": "GH", "tanzania": "TZ", "morocco": "MA",
  "algeria": "DZ", "tunisia": "TN", "libya": "LY", "uganda": "UG",
  "senegal": "SN", "cameroon": "CM", "zimbabwe": "ZW", "zambia": "ZM",
  "mozambique": "MZ", "angola": "AO", "namibia": "NA", "botswana": "BW",
  "rwanda": "RW", "madagascar": "MG", "somalia": "SO", "mauritius": "MU",
  "australia": "AU", "new zealand": "NZ", "fiji": "FJ",
  "kazakhstan": "KZ", "uzbekistan": "UZ", "afghanistan": "AF",
  // Tamil Nadu etc. map to India
  "tamil nadu": "IN", "karnataka": "IN", "kerala": "IN", "maharashtra": "IN",
  "andhra pradesh": "IN", "telangana": "IN", "west bengal": "IN",
  "rajasthan": "IN", "gujarat": "IN", "punjab": "IN", "haryana": "IN",
  "uttar pradesh": "IN", "madhya pradesh": "IN", "bihar": "IN",
  "england": "GB", "scotland": "GB", "wales": "GB",
  "california": "US", "texas": "US", "new york": "US", "florida": "US",
};

// Returns the country code from a display name
function getCountryCode(displayName: string): string | null {
  const parts = displayName.split(",").map((s) => s.trim().toLowerCase());
  
  // Check from last part backwards (country is usually last)
  for (let i = parts.length - 1; i >= 0; i--) {
    if (COUNTRY_CODES[parts[i]]) return COUNTRY_CODES[parts[i]];
  }
  
  // Fuzzy match
  const lower = displayName.toLowerCase();
  for (const [name, code] of Object.entries(COUNTRY_CODES)) {
    if (lower.includes(name)) return code;
  }
  
  return null;
}

// Returns a flag image URL from the free flagcdn.com CDN
export function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}

// Get flag URL from a Nominatim display_name
export function getFlagUrlFromDisplayName(displayName: string): string | null {
  const code = getCountryCode(displayName);
  return code ? getFlagUrl(code) : null;
}

// Get flag URL from a country name directly
export function getFlagUrlFromCountryName(countryName: string): string | null {
  const lower = countryName.toLowerCase().trim();
  if (COUNTRY_CODES[lower]) return getFlagUrl(COUNTRY_CODES[lower]);
  
  for (const [name, code] of Object.entries(COUNTRY_CODES)) {
    if (lower.includes(name) || name.includes(lower)) return getFlagUrl(code);
  }
  return null;
}

// Convenience: get country code from display name
export function getCountryCodeFromDisplayName(displayName: string): string | null {
  return getCountryCode(displayName);
}
