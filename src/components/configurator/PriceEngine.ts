import type { ConfigState, PriceBreakdown, PricingData } from './types';

export function calculatePrice(config: ConfigState, pricing: PricingData): PriceBreakdown {
  const { options } = pricing;

  // ONLY_PROTECTIVE mode: flat price, ignore everything else
  if (config.protectiveMatsMode === 'ONLY_PROTECTIVE') {
    const price = options.protectiveMats.onlyProtectivePrice;
    return {
      base: price,
      variantDelta: 0,
      carpetDelta: 0,
      sillDelta: 0,
      trunkDelta: 0,
      protectiveDelta: 0,
      total: price,
    };
  }

  const material = pricing.materials.find((m) => m.id === config.materialId);
  if (!material) {
    return { base: 0, variantDelta: 0, carpetDelta: 0, sillDelta: 0, trunkDelta: 0, protectiveDelta: 0, total: 0 };
  }

  const variant = material.variants.find((v) => v.id === config.variantId);
  const variantDelta = variant?.priceDelta ?? 0;

  const base = material.basePrice;
  const carpetDelta = config.carpetCoverage ? options.carpetCoverageDelta : 0;

  // Sill coverage uses a different formula: multiplier on base price
  // sillCoverageFormula is a multiplier (e.g. 1.15 = +15% of base)
  // TBD: exact formula to be confirmed by client
  const sillDelta = config.sillCoverage ? Math.round(base * (options.sillCoverageFormula - 1)) : 0;

  const trunkTier = options.trunkTiers.find((t) => t.id === config.trunkTierId);
  const trunkDelta = trunkTier?.priceDelta ?? 0;

  const protectiveDelta =
    config.protectiveMatsMode === 'WITHOUT_PROTECTIVE'
      ? options.protectiveMats.withoutSetDelta
      : options.protectiveMats.withSetDelta;

  const total = base + variantDelta + carpetDelta + sillDelta + trunkDelta + protectiveDelta;

  return { base, variantDelta, carpetDelta, sillDelta, trunkDelta, protectiveDelta, total };
}
