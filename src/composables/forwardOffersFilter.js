export function splitByComma(val) {
  if (!val) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function defaultForwardCriteria() {
  return {
    priceMin: null,
    priceMax: null,
    vintageMin: null,
    vintageMax: null,
    countries: [],
    registryStages: [],
  };
}

export function hasActiveForwardFilters(criteria) {
  const d = defaultForwardCriteria();
  const f = criteria || d;
  if (f.priceMin != null || f.priceMax != null) return true;
  if (f.vintageMin != null || f.vintageMax != null) return true;
  if (f.countries?.length || f.registryStages?.length) return true;
  return false;
}

export function getUniqueForwardCountries(offers) {
  if (!offers || !Array.isArray(offers)) return [];
  const set = new Set();
  offers.forEach((o) => {
    if (o.country) splitByComma(o.country).forEach((c) => set.add(c));
  });
  return [...set].sort();
}

export function getUniqueRegistryStages(offers) {
  if (!offers || !Array.isArray(offers)) return [];
  const set = new Set();
  offers.forEach((o) => {
    if (o.registryStage) set.add(String(o.registryStage).trim());
  });
  return [...set].sort();
}

function parseRange(str) {
  if (!str) return null;
  const parts = String(str).split("-").map(s => Number(s.trim())).filter(n => Number.isFinite(n));
  if (parts.length === 0) return null;
  if (parts.length === 1) return { min: parts[0], max: parts[0] };
  return { min: parts[0], max: parts[1] };
}

function rangeOverlap(r1, r2) {
  if (!r1 || !r2) return false;
  return r1.min <= r2.max && r1.max >= r2.min;
}

export function filterForwardOffers(offers, criteria) {
  if (!offers || !offers.length) return offers;
  const f = criteria;

  return offers.filter((offer) => {
    // Price filter
    if (f.priceMin != null || f.priceMax != null) {
      const offerPriceRange = parseRange(offer.pricePerCredit);
      if (!offerPriceRange) return false;
      const filterPriceRange = {
        min: f.priceMin != null ? f.priceMin : 0,
        max: f.priceMax != null ? f.priceMax : Infinity
      };
      if (!rangeOverlap(offerPriceRange, filterPriceRange)) return false;
    }

    // Vintage filter
    if (f.vintageMin != null || f.vintageMax != null) {
      const offerVintageRange = parseRange(offer.vintages);
      if (!offerVintageRange) return false;
      const filterVintageRange = {
        min: f.vintageMin != null ? f.vintageMin : 0,
        max: f.vintageMax != null ? f.vintageMax : Infinity
      };
      if (!rangeOverlap(offerVintageRange, filterVintageRange)) return false;
    }

    // Country filter
    if (f.countries?.length) {
      if (!offer.country) return false;
      const offerCountries = splitByComma(offer.country);
      if (!f.countries.some((c) => offerCountries.includes(c))) return false;
    }

    // Registry Stage filter
    if (f.registryStages?.length) {
      if (!offer.registryStage) return false;
      if (!f.registryStages.includes(String(offer.registryStage).trim())) return false;
    }

    return true;
  });
}
