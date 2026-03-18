-- ==============================================================================
-- GLOBAL EXPANSION: 190+ Countries + 200+ Vehicles
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- Clear existing seed data first
DELETE FROM fuel_prices;
DELETE FROM vehicles;

-- ==============================================================================
-- ALL COUNTRIES WITH FUEL PRICES (190+ countries)
-- Prices in local currency per liter (approximate 2024-2025 values)
-- ==============================================================================
INSERT INTO fuel_prices (country_name, country_code, currency, price_per_liter) VALUES
-- ASIA
('India', 'IN', 'INR', 104.00),
('China', 'CN', 'CNY', 8.50),
('Japan', 'JP', 'JPY', 175.00),
('South Korea', 'KR', 'KRW', 1700.00),
('Indonesia', 'ID', 'IDR', 13900.00),
('Thailand', 'TH', 'THB', 40.00),
('Vietnam', 'VN', 'VND', 25000.00),
('Philippines', 'PH', 'PHP', 65.00),
('Malaysia', 'MY', 'MYR', 2.05),
('Singapore', 'SG', 'SGD', 2.95),
('Bangladesh', 'BD', 'BDT', 114.00),
('Pakistan', 'PK', 'PKR', 290.00),
('Sri Lanka', 'LK', 'LKR', 366.00),
('Nepal', 'NP', 'NPR', 182.00),
('Myanmar', 'MM', 'MMK', 1600.00),
('Cambodia', 'KH', 'KHR', 5200.00),
('Laos', 'LA', 'LAK', 17000.00),
('Mongolia', 'MN', 'MNT', 3100.00),
('Taiwan', 'TW', 'TWD', 31.00),
('Brunei', 'BN', 'BND', 0.53),
('Maldives', 'MV', 'MVR', 16.72),
('Bhutan', 'BT', 'BTN', 100.00),
('Timor-Leste', 'TL', 'USD', 1.35),

-- MIDDLE EAST
('United Arab Emirates', 'AE', 'AED', 3.03),
('Saudi Arabia', 'SA', 'SAR', 2.18),
('Qatar', 'QA', 'QAR', 1.90),
('Kuwait', 'KW', 'KWD', 0.09),
('Bahrain', 'BH', 'BHD', 0.16),
('Oman', 'OM', 'OMR', 0.20),
('Iraq', 'IQ', 'IQD', 750.00),
('Iran', 'IR', 'IRR', 15000.00),
('Israel', 'IL', 'ILS', 7.40),
('Jordan', 'JO', 'JOD', 1.10),
('Lebanon', 'LB', 'LBP', 27.00),
('Syria', 'SY', 'SYP', 3000.00),
('Yemen', 'YE', 'YER', 600.00),
('Palestine', 'PS', 'ILS', 6.80),

-- EUROPE
('United Kingdom', 'GB', 'GBP', 1.45),
('France', 'FR', 'EUR', 1.85),
('Germany', 'DE', 'EUR', 1.78),
('Italy', 'IT', 'EUR', 1.82),
('Spain', 'ES', 'EUR', 1.60),
('Portugal', 'PT', 'EUR', 1.68),
('Netherlands', 'NL', 'EUR', 2.05),
('Belgium', 'BE', 'EUR', 1.72),
('Austria', 'AT', 'EUR', 1.55),
('Switzerland', 'CH', 'CHF', 1.85),
('Sweden', 'SE', 'SEK', 18.50),
('Norway', 'NO', 'NOK', 20.50),
('Denmark', 'DK', 'DKK', 13.50),
('Finland', 'FI', 'EUR', 1.85),
('Ireland', 'IE', 'EUR', 1.72),
('Poland', 'PL', 'PLN', 6.60),
('Czech Republic', 'CZ', 'CZK', 38.50),
('Hungary', 'HU', 'HUF', 610.00),
('Romania', 'RO', 'RON', 7.20),
('Bulgaria', 'BG', 'BGN', 2.70),
('Croatia', 'HR', 'EUR', 1.55),
('Greece', 'GR', 'EUR', 1.85),
('Slovakia', 'SK', 'EUR', 1.60),
('Slovenia', 'SI', 'EUR', 1.52),
('Lithuania', 'LT', 'EUR', 1.50),
('Latvia', 'LV', 'EUR', 1.55),
('Estonia', 'EE', 'EUR', 1.60),
('Luxembourg', 'LU', 'EUR', 1.48),
('Malta', 'MT', 'EUR', 1.41),
('Cyprus', 'CY', 'EUR', 1.45),
('Iceland', 'IS', 'ISK', 290.00),
('Serbia', 'RS', 'RSD', 195.00),
('Bosnia and Herzegovina', 'BA', 'BAM', 2.50),
('North Macedonia', 'MK', 'MKD', 87.00),
('Albania', 'AL', 'ALL', 225.00),
('Montenegro', 'ME', 'EUR', 1.48),
('Kosovo', 'XK', 'EUR', 1.45),
('Moldova', 'MD', 'MDL', 27.00),
('Ukraine', 'UA', 'UAH', 52.00),
('Belarus', 'BY', 'BYN', 2.25),
('Russia', 'RU', 'RUB', 54.00),
('Turkey', 'TR', 'TRY', 42.00),
('Georgia', 'GE', 'GEL', 3.50),
('Armenia', 'AM', 'AMD', 520.00),
('Azerbaijan', 'AZ', 'AZN', 1.00),

-- NORTH AMERICA
('United States', 'US', 'USD', 0.95),
('Canada', 'CA', 'CAD', 1.70),
('Mexico', 'MX', 'MXN', 24.00),
('Guatemala', 'GT', 'GTQ', 9.50),
('Honduras', 'HN', 'HNL', 27.00),
('El Salvador', 'SV', 'USD', 1.05),
('Nicaragua', 'NI', 'NIO', 42.00),
('Costa Rica', 'CR', 'CRC', 810.00),
('Panama', 'PA', 'USD', 1.10),
('Belize', 'BZ', 'BZD', 2.80),
('Cuba', 'CU', 'CUP', 25.00),
('Jamaica', 'JM', 'JMD', 195.00),
('Haiti', 'HT', 'HTG', 350.00),
('Dominican Republic', 'DO', 'DOP', 62.00),
('Trinidad and Tobago', 'TT', 'TTD', 4.97),
('Bahamas', 'BS', 'BSD', 1.40),
('Barbados', 'BB', 'BBD', 3.60),

-- SOUTH AMERICA
('Brazil', 'BR', 'BRL', 5.80),
('Argentina', 'AR', 'ARS', 850.00),
('Chile', 'CL', 'CLP', 1250.00),
('Colombia', 'CO', 'COP', 9800.00),
('Peru', 'PE', 'PEN', 5.10),
('Ecuador', 'EC', 'USD', 0.52),
('Venezuela', 'VE', 'VES', 0.50),
('Bolivia', 'BO', 'BOB', 3.74),
('Paraguay', 'PY', 'PYG', 7500.00),
('Uruguay', 'UY', 'UYU', 68.00),
('Guyana', 'GY', 'GYD', 290.00),
('Suriname', 'SR', 'SRD', 12.50),

-- AFRICA
('South Africa', 'ZA', 'ZAR', 24.00),
('Nigeria', 'NG', 'NGN', 700.00),
('Egypt', 'EG', 'EGP', 12.50),
('Kenya', 'KE', 'KES', 190.00),
('Ethiopia', 'ET', 'ETB', 62.00),
('Ghana', 'GH', 'GHS', 15.50),
('Tanzania', 'TZ', 'TZS', 2750.00),
('Morocco', 'MA', 'MAD', 14.00),
('Algeria', 'DZ', 'DZD', 46.00),
('Tunisia', 'TN', 'TND', 2.15),
('Libya', 'LY', 'LYD', 0.15),
('Sudan', 'SD', 'SDG', 400.00),
('Uganda', 'UG', 'UGX', 5200.00),
('Senegal', 'SN', 'XOF', 990.00),
('Cameroon', 'CM', 'XAF', 730.00),
('Ivory Coast', 'CI', 'XOF', 735.00),
('Zimbabwe', 'ZW', 'ZWL', 1.75),
('Zambia', 'ZM', 'ZMW', 26.00),
('Mozambique', 'MZ', 'MZN', 90.00),
('Angola', 'AO', 'AOA', 300.00),
('Namibia', 'NA', 'NAD', 22.50),
('Botswana', 'BW', 'BWP', 14.00),
('Rwanda', 'RW', 'RWF', 1550.00),
('Congo (DRC)', 'CD', 'CDF', 3200.00),
('Congo (Republic)', 'CG', 'XAF', 650.00),
('Madagascar', 'MG', 'MGA', 5300.00),
('Mali', 'ML', 'XOF', 850.00),
('Burkina Faso', 'BF', 'XOF', 820.00),
('Niger', 'NE', 'XOF', 650.00),
('Chad', 'TD', 'XAF', 700.00),
('Guinea', 'GN', 'GNF', 12500.00),
('Benin', 'BJ', 'XOF', 550.00),
('Togo', 'TG', 'XOF', 600.00),
('Sierra Leone', 'SL', 'SLL', 22000.00),
('Liberia', 'LR', 'LRD', 250.00),
('Mauritania', 'MR', 'MRU', 15.00),
('Eritrea', 'ER', 'ERN', 16.00),
('Somalia', 'SO', 'SOS', 750.00),
('Djibouti', 'DJ', 'DJF', 230.00),
('Mauritius', 'MU', 'MUR', 60.00),
('Gabon', 'GA', 'XAF', 650.00),
('Equatorial Guinea', 'GQ', 'XAF', 700.00),
('Malawi', 'MW', 'MWK', 2050.00),
('Lesotho', 'LS', 'LSL', 22.00),
('Eswatini', 'SZ', 'SZL', 21.00),
('Burundi', 'BI', 'BIF', 3800.00),
('Central African Republic', 'CF', 'XAF', 750.00),
('South Sudan', 'SS', 'SSP', 850.00),
('Gambia', 'GM', 'GMD', 72.00),
('Guinea-Bissau', 'GW', 'XOF', 830.00),
('Comoros', 'KM', 'KMF', 660.00),
('Cape Verde', 'CV', 'CVE', 130.00),
('Sao Tome and Principe', 'ST', 'STN', 30.00),
('Seychelles', 'SC', 'SCR', 24.00),

-- OCEANIA
('Australia', 'AU', 'AUD', 1.95),
('New Zealand', 'NZ', 'NZD', 2.80),
('Papua New Guinea', 'PG', 'PGK', 4.35),
('Fiji', 'FJ', 'FJD', 3.10),
('Samoa', 'WS', 'WST', 3.00),
('Tonga', 'TO', 'TOP', 3.20),
('Vanuatu', 'VU', 'VUV', 180.00),
('Solomon Islands', 'SB', 'SBD', 12.00),

-- CENTRAL ASIA
('Kazakhstan', 'KZ', 'KZT', 205.00),
('Uzbekistan', 'UZ', 'UZS', 9500.00),
('Turkmenistan', 'TM', 'TMT', 1.50),
('Kyrgyzstan', 'KG', 'KGS', 58.00),
('Tajikistan', 'TJ', 'TJS', 13.00),
('Afghanistan', 'AF', 'AFN', 55.00)
ON CONFLICT (country_name) DO UPDATE SET price_per_liter = EXCLUDED.price_per_liter, currency = EXCLUDED.currency;

-- ==============================================================================
-- GLOBAL VEHICLES DATABASE (200+ models)
-- ==============================================================================
INSERT INTO vehicles (name, brand, type, fuel_efficiency_km_l, engine_capacity_cc) VALUES
-- TOYOTA
('Corolla', 'Toyota', 'Car', 18.0, 1800),
('Camry', 'Toyota', 'Car', 15.5, 2500),
('Yaris', 'Toyota', 'Car', 21.0, 1500),
('RAV4', 'Toyota', 'SUV', 14.5, 2500),
('Fortuner', 'Toyota', 'SUV', 12.0, 2800),
('Land Cruiser', 'Toyota', 'SUV', 8.5, 4600),
('Hilux', 'Toyota', 'Truck', 11.0, 2800),
('Prius', 'Toyota', 'Hybrid', 24.0, 1800),
('Supra', 'Toyota', 'Car', 12.0, 3000),
('Hiace', 'Toyota', 'Bus', 9.5, 2800),
('Innova', 'Toyota', 'Car', 15.0, 2400),
('Vios', 'Toyota', 'Car', 20.0, 1500),
('Rush', 'Toyota', 'SUV', 15.0, 1500),
('Avanza', 'Toyota', 'Car', 16.0, 1500),

-- HONDA
('Civic', 'Honda', 'Car', 17.5, 2000),
('Accord', 'Honda', 'Car', 15.0, 2400),
('CR-V', 'Honda', 'SUV', 14.0, 2400),
('HR-V', 'Honda', 'SUV', 16.0, 1800),
('City', 'Honda', 'Car', 19.0, 1500),
('Jazz', 'Honda', 'Car', 20.0, 1500),
('Fit', 'Honda', 'Car', 21.0, 1300),
('Pilot', 'Honda', 'SUV', 11.0, 3500),
('BR-V', 'Honda', 'SUV', 16.0, 1500),
('WR-V', 'Honda', 'SUV', 17.0, 1200),
('CBR 600RR', 'Honda', 'Bike', 22.0, 600),
('CB 500', 'Honda', 'Bike', 30.0, 500),
('Activa', 'Honda', 'Bike', 50.0, 110),
('Gold Wing', 'Honda', 'Bike', 18.0, 1800),

-- FORD
('F-150', 'Ford', 'Truck', 8.5, 3500),
('Mustang', 'Ford', 'Car', 10.0, 5000),
('Explorer', 'Ford', 'SUV', 11.0, 3000),
('Escape', 'Ford', 'SUV', 13.5, 2000),
('Ranger', 'Ford', 'Truck', 10.5, 2300),
('Focus', 'Ford', 'Car', 17.0, 2000),
('Fiesta', 'Ford', 'Car', 19.0, 1600),
('Bronco', 'Ford', 'SUV', 10.0, 2700),
('EcoSport', 'Ford', 'SUV', 15.0, 1500),
('Transit', 'Ford', 'Bus', 8.0, 3500),
('Endeavour', 'Ford', 'SUV', 11.5, 3200),

-- TESLA (EV - high km/l equivalent)
('Model 3', 'Tesla', 'EV', 99.9, 0),
('Model Y', 'Tesla', 'EV', 95.0, 0),
('Model S', 'Tesla', 'EV', 85.0, 0),
('Model X', 'Tesla', 'EV', 80.0, 0),
('Cybertruck', 'Tesla', 'EV', 70.0, 0),

-- BMW
('3 Series', 'BMW', 'Car', 16.0, 2000),
('5 Series', 'BMW', 'Car', 14.0, 3000),
('7 Series', 'BMW', 'Car', 11.0, 4400),
('X1', 'BMW', 'SUV', 15.0, 2000),
('X3', 'BMW', 'SUV', 13.5, 2000),
('X5', 'BMW', 'SUV', 10.5, 3000),
('X7', 'BMW', 'SUV', 9.0, 4400),
('i4', 'BMW', 'EV', 90.0, 0),
('iX', 'BMW', 'EV', 80.0, 0),
('S1000RR', 'BMW', 'Bike', 17.0, 1000),
('R1250GS', 'BMW', 'Bike', 20.0, 1250),
('G310R', 'BMW', 'Bike', 30.0, 310),

-- MERCEDES-BENZ
('C-Class', 'Mercedes-Benz', 'Car', 15.5, 2000),
('E-Class', 'Mercedes-Benz', 'Car', 13.0, 3000),
('S-Class', 'Mercedes-Benz', 'Car', 10.5, 4000),
('A-Class', 'Mercedes-Benz', 'Car', 17.0, 1600),
('GLA', 'Mercedes-Benz', 'SUV', 15.0, 2000),
('GLC', 'Mercedes-Benz', 'SUV', 13.0, 2000),
('GLE', 'Mercedes-Benz', 'SUV', 10.5, 3000),
('GLS', 'Mercedes-Benz', 'SUV', 9.0, 4000),
('EQS', 'Mercedes-Benz', 'EV', 85.0, 0),
('EQA', 'Mercedes-Benz', 'EV', 90.0, 0),
('Sprinter', 'Mercedes-Benz', 'Bus', 7.5, 3000),

-- VOLKSWAGEN
('Golf', 'Volkswagen', 'Car', 18.0, 1400),
('Polo', 'Volkswagen', 'Car', 20.0, 1200),
('Passat', 'Volkswagen', 'Car', 15.0, 2000),
('Tiguan', 'Volkswagen', 'SUV', 14.0, 2000),
('Touareg', 'Volkswagen', 'SUV', 10.0, 3000),
('T-Roc', 'Volkswagen', 'SUV', 16.0, 1500),
('ID.4', 'Volkswagen', 'EV', 88.0, 0),
('ID.3', 'Volkswagen', 'EV', 92.0, 0),
('Transporter', 'Volkswagen', 'Bus', 9.0, 2000),
('Jetta', 'Volkswagen', 'Car', 17.0, 1400),
('Virtus', 'Volkswagen', 'Car', 18.0, 1000),
('Taigun', 'Volkswagen', 'SUV', 17.0, 1000),

-- HYUNDAI
('i20', 'Hyundai', 'Car', 20.0, 1200),
('i10', 'Hyundai', 'Car', 23.0, 1100),
('Creta', 'Hyundai', 'SUV', 16.5, 1500),
('Tucson', 'Hyundai', 'SUV', 14.0, 2000),
('Santa Fe', 'Hyundai', 'SUV', 12.0, 2500),
('Venue', 'Hyundai', 'SUV', 18.0, 1200),
('Verna', 'Hyundai', 'Car', 19.0, 1500),
('Elantra', 'Hyundai', 'Car', 16.5, 2000),
('Sonata', 'Hyundai', 'Car', 14.5, 2500),
('Ioniq 5', 'Hyundai', 'EV', 85.0, 0),
('Kona Electric', 'Hyundai', 'EV', 90.0, 0),

-- KIA
('Seltos', 'Kia', 'SUV', 16.5, 1500),
('Sonet', 'Kia', 'SUV', 18.0, 1200),
('Sportage', 'Kia', 'SUV', 14.0, 2000),
('Carnival', 'Kia', 'Bus', 11.0, 2200),
('Rio', 'Kia', 'Car', 19.0, 1400),
('Forte', 'Kia', 'Car', 17.0, 2000),
('EV6', 'Kia', 'EV', 88.0, 0),

-- NISSAN
('Altima', 'Nissan', 'Car', 15.5, 2500),
('Sentra', 'Nissan', 'Car', 17.5, 2000),
('Kicks', 'Nissan', 'SUV', 16.0, 1600),
('X-Trail', 'Nissan', 'SUV', 14.0, 2500),
('Patrol', 'Nissan', 'SUV', 8.0, 5600),
('Magnite', 'Nissan', 'SUV', 18.5, 1000),
('Qashqai', 'Nissan', 'SUV', 15.5, 1300),
('Leaf', 'Nissan', 'EV', 92.0, 0),
('GT-R', 'Nissan', 'Car', 8.5, 3800),
('Navara', 'Nissan', 'Truck', 11.0, 2300),

-- SUZUKI
('Swift', 'Suzuki', 'Car', 22.0, 1200),
('Baleno', 'Suzuki', 'Car', 21.0, 1200),
('Alto', 'Suzuki', 'Car', 28.0, 800),
('Brezza', 'Suzuki', 'SUV', 17.5, 1500),
('Jimny', 'Suzuki', 'SUV', 15.0, 1500),
('Vitara', 'Suzuki', 'SUV', 16.0, 1600),
('Ertiga', 'Suzuki', 'Car', 18.0, 1500),
('Wagon R', 'Suzuki', 'Car', 24.0, 1000),
('Hayabusa', 'Suzuki', 'Bike', 15.0, 1340),
('GSX-R1000', 'Suzuki', 'Bike', 16.0, 1000),
('Access 125', 'Suzuki', 'Bike', 50.0, 125),

-- KAWASAKI
('Ninja 400', 'Kawasaki', 'Bike', 25.0, 400),
('Ninja ZX-10R', 'Kawasaki', 'Bike', 14.0, 1000),
('Z900', 'Kawasaki', 'Bike', 18.0, 900),
('Versys 650', 'Kawasaki', 'Bike', 22.0, 650),
('Ninja 300', 'Kawasaki', 'Bike', 28.0, 300),
('KLR 650', 'Kawasaki', 'Bike', 24.0, 650),

-- YAMAHA
('YZF-R1', 'Yamaha', 'Bike', 13.0, 1000),
('YZF-R3', 'Yamaha', 'Bike', 28.0, 321),
('MT-15', 'Yamaha', 'Bike', 40.0, 155),
('FZ-S', 'Yamaha', 'Bike', 42.0, 150),
('Ray ZR', 'Yamaha', 'Bike', 55.0, 125),
('Aerox', 'Yamaha', 'Bike', 40.0, 155),
('Tenere 700', 'Yamaha', 'Bike', 21.0, 700),
('MT-07', 'Yamaha', 'Bike', 23.0, 689),
('MT-09', 'Yamaha', 'Bike', 18.0, 890),

-- DUCATI
('Panigale V4', 'Ducati', 'Bike', 12.0, 1103),
('Monster', 'Ducati', 'Bike', 18.0, 937),
('Multistrada V4', 'Ducati', 'Bike', 17.0, 1158),
('Scrambler', 'Ducati', 'Bike', 22.0, 803),

-- HARLEY-DAVIDSON
('Iron 883', 'Harley-Davidson', 'Bike', 20.0, 883),
('Street 750', 'Harley-Davidson', 'Bike', 23.0, 750),
('Fat Boy', 'Harley-Davidson', 'Bike', 16.0, 1868),
('Road King', 'Harley-Davidson', 'Bike', 17.0, 1868),
('Sportster S', 'Harley-Davidson', 'Bike', 18.0, 1252),

-- KTM
('Duke 200', 'KTM', 'Bike', 35.0, 200),
('Duke 390', 'KTM', 'Bike', 28.0, 390),
('RC 390', 'KTM', 'Bike', 26.0, 390),
('Adventure 390', 'KTM', 'Bike', 27.0, 390),
('1290 Super Duke', 'KTM', 'Bike', 14.0, 1290),

-- ROYAL ENFIELD
('Classic 350', 'Royal Enfield', 'Bike', 35.0, 349),
('Bullet 350', 'Royal Enfield', 'Bike', 33.0, 346),
('Meteor 350', 'Royal Enfield', 'Bike', 34.0, 349),
('Himalayan', 'Royal Enfield', 'Bike', 30.0, 411),
('Continental GT', 'Royal Enfield', 'Bike', 28.0, 648),
('Interceptor 650', 'Royal Enfield', 'Bike', 25.0, 648),

-- BAJAJ
('Pulsar NS200', 'Bajaj', 'Bike', 40.0, 200),
('Pulsar 150', 'Bajaj', 'Bike', 50.0, 149),
('Dominar 400', 'Bajaj', 'Bike', 28.0, 373),
('Platina', 'Bajaj', 'Bike', 65.0, 102),
('CT 100', 'Bajaj', 'Bike', 70.0, 99),
('Chetak', 'Bajaj', 'EV', 99.0, 0),

-- HERO
('Splendor', 'Hero', 'Bike', 70.0, 100),
('HF Deluxe', 'Hero', 'Bike', 68.0, 100),
('Passion Pro', 'Hero', 'Bike', 55.0, 110),
('Glamour', 'Hero', 'Bike', 55.0, 125),
('Xpulse 200', 'Hero', 'Bike', 35.0, 200),
('Xtreme 160R', 'Hero', 'Bike', 42.0, 163),

-- AUDI
('A3', 'Audi', 'Car', 17.0, 1400),
('A4', 'Audi', 'Car', 15.0, 2000),
('A6', 'Audi', 'Car', 13.0, 3000),
('Q3', 'Audi', 'SUV', 14.5, 2000),
('Q5', 'Audi', 'SUV', 12.5, 2000),
('Q7', 'Audi', 'SUV', 9.5, 3000),
('e-tron', 'Audi', 'EV', 82.0, 0),
('Q8 e-tron', 'Audi', 'EV', 78.0, 0),

-- LEXUS
('IS', 'Lexus', 'Car', 14.5, 2500),
('ES', 'Lexus', 'Car', 16.0, 2500),
('RX', 'Lexus', 'SUV', 12.0, 3500),
('NX', 'Lexus', 'SUV', 14.0, 2500),
('LX', 'Lexus', 'SUV', 8.0, 5700),

-- CHEVROLET
('Silverado', 'Chevrolet', 'Truck', 8.0, 5300),
('Equinox', 'Chevrolet', 'SUV', 13.0, 1500),
('Tahoe', 'Chevrolet', 'SUV', 8.5, 5300),
('Bolt EV', 'Chevrolet', 'EV', 95.0, 0),
('Malibu', 'Chevrolet', 'Car', 14.5, 2000),
('Suburban', 'Chevrolet', 'SUV', 7.5, 5300),

-- RAM / DODGE
('Ram 1500', 'Ram', 'Truck', 8.0, 5700),
('Ram 2500', 'Ram', 'Truck', 6.5, 6700),
('Charger', 'Dodge', 'Car', 9.0, 5700),
('Challenger', 'Dodge', 'Car', 8.5, 5700),

-- JEEP
('Wrangler', 'Jeep', 'SUV', 10.0, 3600),
('Grand Cherokee', 'Jeep', 'SUV', 11.0, 3600),
('Compass', 'Jeep', 'SUV', 14.0, 2400),
('Renegade', 'Jeep', 'SUV', 15.0, 1300),

-- SUBARU
('Outback', 'Subaru', 'SUV', 13.5, 2500),
('Forester', 'Subaru', 'SUV', 14.0, 2500),
('WRX', 'Subaru', 'Car', 12.0, 2400),
('Crosstrek', 'Subaru', 'SUV', 14.5, 2000),
('Impreza', 'Subaru', 'Car', 16.0, 2000),

-- MAZDA
('CX-5', 'Mazda', 'SUV', 14.5, 2500),
('Mazda3', 'Mazda', 'Car', 17.0, 2000),
('CX-30', 'Mazda', 'SUV', 15.5, 2000),
('MX-5', 'Mazda', 'Car', 14.0, 2000),

-- VOLVO
('XC40', 'Volvo', 'SUV', 14.0, 2000),
('XC60', 'Volvo', 'SUV', 12.0, 2000),
('XC90', 'Volvo', 'SUV', 10.0, 2000),
('S60', 'Volvo', 'Car', 15.0, 2000),
('EX30', 'Volvo', 'EV', 92.0, 0),

-- PORSCHE
('911', 'Porsche', 'Car', 9.5, 3000),
('Cayenne', 'Porsche', 'SUV', 9.0, 3000),
('Macan', 'Porsche', 'SUV', 11.0, 2000),
('Taycan', 'Porsche', 'EV', 75.0, 0),

-- LAND ROVER
('Defender', 'Land Rover', 'SUV', 9.0, 3000),
('Range Rover', 'Land Rover', 'SUV', 8.0, 4400),
('Discovery', 'Land Rover', 'SUV', 9.5, 3000),
('Range Rover Sport', 'Land Rover', 'SUV', 8.5, 3000),
('Evoque', 'Land Rover', 'SUV', 12.5, 2000),

-- MAHINDRA (India)
('Thar', 'Mahindra', 'SUV', 14.0, 2200),
('Scorpio N', 'Mahindra', 'SUV', 13.0, 2200),
('XUV700', 'Mahindra', 'SUV', 14.0, 2200),
('Bolero', 'Mahindra', 'SUV', 13.5, 1500),

-- TATA (India)
('Nexon', 'Tata', 'SUV', 17.0, 1200),
('Punch', 'Tata', 'SUV', 18.5, 1200),
('Harrier', 'Tata', 'SUV', 14.0, 2000),
('Safari', 'Tata', 'SUV', 13.5, 2000),
('Nexon EV', 'Tata', 'EV', 85.0, 0),
('Tiago EV', 'Tata', 'EV', 95.0, 0),
('Ace', 'Tata', 'Truck', 16.0, 700),

-- PEUGEOT
('208', 'Peugeot', 'Car', 20.0, 1200),
('308', 'Peugeot', 'Car', 17.0, 1600),
('3008', 'Peugeot', 'SUV', 15.0, 1600),
('5008', 'Peugeot', 'SUV', 14.0, 2000),
('e-208', 'Peugeot', 'EV', 91.0, 0),

-- RENAULT
('Kwid', 'Renault', 'Car', 24.0, 1000),
('Duster', 'Renault', 'SUV', 14.5, 1500),
('Clio', 'Renault', 'Car', 19.0, 1300),
('Megane E-Tech', 'Renault', 'EV', 88.0, 0),
('Triber', 'Renault', 'Car', 18.0, 1000),
('Kiger', 'Renault', 'SUV', 17.5, 1000),

-- BYD (Chinese EV)
('Atto 3', 'BYD', 'EV', 88.0, 0),
('Seal', 'BYD', 'EV', 85.0, 0),
('Dolphin', 'BYD', 'EV', 95.0, 0),
('Han', 'BYD', 'EV', 82.0, 0),

-- RIVIAN
('R1T', 'Rivian', 'EV', 70.0, 0),
('R1S', 'Rivian', 'EV', 68.0, 0),

-- LUCID
('Air', 'Lucid', 'EV', 90.0, 0),

-- BUSES / COMMERCIAL
('Coaster', 'Toyota', 'Bus', 7.0, 4200),
('Rosa', 'Mitsubishi', 'Bus', 8.0, 3900),
('Canter', 'Mitsubishi', 'Truck', 10.0, 3000),
('Dyna', 'Toyota', 'Truck', 9.5, 4000),
('Eicher Pro', 'Eicher', 'Truck', 8.0, 5000),
('Ashok Leyland Dost', 'Ashok Leyland', 'Truck', 14.0, 1500),
('Tata Ultra', 'Tata', 'Truck', 8.5, 5000);
