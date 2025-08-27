// constants/data.js
export const REGIONS_DATA = {
    DE: [
      'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
      'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
      'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
    ],
    AT: [
      'Burgenland', 'Kärnten', 'Niederösterreich', 'Oberösterreich',
      'Salzburg', 'Steiermark', 'Tirol', 'Vorarlberg', 'Wien'
    ],
    CH: [
      'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft',
      'Basel-Stadt', 'Bern', 'Freiburg', 'Genf', 'Glarus', 'Graubünden',
      'Jura', 'Luzern', 'Neuenburg', 'Nidwalden', 'Obwalden', 'Sankt Gallen',
      'Schaffhausen', 'Schwyz', 'Solothurn', 'Thurgau', 'Tessin', 'Uri',
      'Waadt', 'Wallis', 'Zug', 'Zürich'
    ]
  };
  
  export const COUNTRY_DATA = {
    DE: { label: 'Deutschland', flag: '🇩🇪' },
    AT: { label: 'Österreich', flag: '🇦🇹' },
    CH: { label: 'Schweiz', flag: '🇨🇭' }
  };
  
  // utils/validation.js
  export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  export const validateRegion = (region) => {
    return region !== '';
  };