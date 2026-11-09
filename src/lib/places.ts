/**
 * Lightweight place suggestions for v1 demo.
 * Replace with Google Places / Mapbox + session tokens in production.
 */

export interface PlaceSuggestion {
  placeId: string;
  label: string;
  countryCode: string;
  region: string;
  city: string;
  ianaTz: string;
}

const PLACES: PlaceSuggestion[] = [
  {
    placeId: "ar-caba",
    label: "Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina",
    countryCode: "AR",
    region: "Ciudad Autónoma de Buenos Aires",
    city: "Buenos Aires",
    ianaTz: "America/Argentina/Buenos_Aires",
  },
  {
    placeId: "ar-salta",
    label: "Salta, Salta, Argentina",
    countryCode: "AR",
    region: "Salta",
    city: "Salta",
    ianaTz: "America/Argentina/Salta",
  },
  {
    placeId: "ar-ushuaia",
    label: "Ushuaia, Tierra del Fuego, Argentina",
    countryCode: "AR",
    region: "Tierra del Fuego",
    city: "Ushuaia",
    ianaTz: "America/Argentina/Ushuaia",
  },
  {
    placeId: "cl-scl",
    label: "Santiago, Región Metropolitana, Chile",
    countryCode: "CL",
    region: "Región Metropolitana",
    city: "Santiago",
    ianaTz: "America/Santiago",
  },
  {
    placeId: "uy-mvd",
    label: "Montevideo, Montevideo, Uruguay",
    countryCode: "UY",
    region: "Montevideo",
    city: "Montevideo",
    ianaTz: "America/Montevideo",
  },
  {
    placeId: "br-sp",
    label: "São Paulo, São Paulo, Brazil",
    countryCode: "BR",
    region: "São Paulo",
    city: "São Paulo",
    ianaTz: "America/Sao_Paulo",
  },
  {
    placeId: "us-nyc",
    label: "New York, New York, United States",
    countryCode: "US",
    region: "New York",
    city: "New York",
    ianaTz: "America/New_York",
  },
  {
    placeId: "es-mad",
    label: "Madrid, Comunidad de Madrid, Spain",
    countryCode: "ES",
    region: "Comunidad de Madrid",
    city: "Madrid",
    ianaTz: "Europe/Madrid",
  },
];

export function searchPlaces(query: string): PlaceSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return PLACES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.countryCode.toLowerCase() === q
  ).slice(0, 8);
}

export function countryStats(
  countryCodes: string[]
): { countryCode: string; count: number }[] {
  const map = new Map<string, number>();
  for (const code of countryCodes) {
    map.set(code, (map.get(code) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([countryCode, count]) => ({ countryCode, count }))
    .sort((a, b) => b.count - a.count);
}
