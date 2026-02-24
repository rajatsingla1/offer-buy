export function splitByComma(val) {
  if (!val) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function defaultCriteria() {
  return {
    priceMin: null,
    priceMax: null,
    totalMin: null,
    totalMax: null,
    indicative: true,
    firm: true,
    countries: [],
    sectors: [],
    raters: [],
    avoidance: true,
    removal: true,
    ccpEligible: false,
    corsiaEligible: false,
    complianceEligible: false,
  };
}

export function hasActiveFilters(criteria) {
  const d = defaultCriteria();
  const f = criteria || d;
  if (f.priceMin != null || f.priceMax != null || f.totalMin != null || f.totalMax != null) return true;
  if (f.countries?.length || f.sectors?.length || f.raters?.length) return true;
  if (!f.indicative || !f.firm) return true;
  if (!f.avoidance || !f.removal) return true;
  if (f.ccpEligible || f.corsiaEligible || f.complianceEligible) return true;
  return false;
}

export function getUniqueCountries(offers) {
  if (!offers || !Array.isArray(offers)) return [];
  const set = new Set();
  offers.forEach((o) => splitByComma(o.countries).forEach((c) => set.add(c)));
  return [...set].sort();
}

export function getUniqueSectors(offers) {
  if (!offers || !Array.isArray(offers)) return [];
  const set = new Set();
  offers.forEach((o) => splitByComma(o.sectors).forEach((s) => set.add(s)));
  return [...set].sort();
}

export function getUniqueRaters(offers) {
  if (!offers || !Array.isArray(offers)) return [];
  const set = new Set();
  offers.forEach((o) => splitByComma(o.raters).forEach((r) => set.add(r)));
  return [...set].sort();
}

export function filterOffers(offers, criteria) {
  if (!offers || !offers.length) return offers;
  const f = criteria;
  const getNumeric = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };
  const total = (offer) =>
    getNumeric(offer.creditsToOffer) * getNumeric(offer.pricePerCredit);
  const isAvoidance = (offer) => {
    const t = (offer.project_offset_type || "").toLowerCase();
    return t.includes("avoidance") || t.includes("reduction");
  };
  const isRemoval = (offer) =>
    (offer.project_offset_type || "").toLowerCase().includes("removal");
  const offerType = (offer) =>
    (offer.offerType || offer.type || "").toString().toLowerCase() || "indicative";

  return offers.filter((offer) => {
    const price = getNumeric(offer.pricePerCredit);
    const totalVal = total(offer);

    if (f.priceMin != null && price < Number(f.priceMin)) return false;
    if (f.priceMax != null && price > Number(f.priceMax)) return false;
    if (f.totalMin != null && totalVal < Number(f.totalMin)) return false;
    if (f.totalMax != null && totalVal > Number(f.totalMax)) return false;

    // Only filter by offer type when not both selected (both = show all)
    if (f.indicative !== f.firm) {
      const type = offerType(offer);
      if (f.indicative && type !== "indicative") return false;
      if (f.firm && type !== "firm") return false;
    }

    if (f.countries?.length) {
      const offerCountries = splitByComma(offer.countries);
      if (!f.countries.some((c) => offerCountries.includes(c))) return false;
    }
    if (f.sectors?.length) {
      const offerSectors = splitByComma(offer.sectors);
      if (!f.sectors.some((s) => offerSectors.includes(s))) return false;
    }
    if (f.raters?.length) {
      const offerRaters = splitByComma(offer.raters);
      if (!f.raters.some((r) => offerRaters.includes(r))) return false;
    }

    // Only filter by offset type when not both selected (both = show all)
    if (f.avoidance !== f.removal) {
      if (f.avoidance && !isAvoidance(offer)) return false;
      if (f.removal && !isRemoval(offer)) return false;
    }

    // Only apply eligible filters when at least one is selected
    const anyEligible = f.ccpEligible || f.corsiaEligible || f.complianceEligible;
    if (anyEligible) {
      if (f.ccpEligible && !offer.ccp) return false;
      if (f.corsiaEligible) {
        const c = offer.corsia_phase_eligibility;
        if (!c || String(c).toLowerCase() === "no") return false;
      }
      if (f.complianceEligible && !offer.compliance) return false;
    }
    return true;
  });
}
