import type { ConfigState, PriceBreakdown, PricingData, MatClass } from './types';

function zeroPriceBreakdown(): PriceBreakdown {
  return { baseMeters: 0, totalMeters: 0, pricePerMeter: 0, matPrice: 0, protectiveDelta: 0, total: 0 };
}

export function calculatePrice(
  config: ConfigState,
  materials: { classes: MatClass[] },
  pricing: PricingData
): PriceBreakdown {
  if (config.protectiveMatsMode === 'ONLY_PROTECTIVE') {
    const price = pricing.protectiveMats.onlyProtectivePrice;
    return { baseMeters: 0, totalMeters: 0, pricePerMeter: 0, matPrice: price, protectiveDelta: 0, total: price };
  }

  if (!config.selectedOption) return zeroPriceBreakdown();

  const baseMeters = config.selectedOption.meters;
  const extraMeters = config.selectedOption.suboptions
    .filter((s) => config.activeSuboptions[s.id])
    .reduce((sum, s) => sum + s.extraMeters, 0);
  const totalMeters = baseMeters + extraMeters;

  const matClass = materials.classes.find((c) => c.id === config.matClassId);
  const matItem = matClass?.items.find((i) => i.id === config.matItemId);
  const pricePerMeter = matItem?.pricePerMeter ?? 0;

  const matPrice = Math.round(totalMeters * pricePerMeter);
  const protectiveDelta =
    config.protectiveMatsMode === 'WITHOUT_PROTECTIVE'
      ? pricing.protectiveMats.withoutDelta
      : pricing.protectiveMats.withDelta;

  return { baseMeters, totalMeters, pricePerMeter, matPrice, protectiveDelta, total: matPrice + protectiveDelta };
}
