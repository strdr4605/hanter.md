export type ProtectiveMatsMode = 'WITH_PROTECTIVE' | 'WITHOUT_PROTECTIVE' | 'ONLY_PROTECTIVE';
export type TrunkTierId = 'none' | 'floor' | 'floor_backrest' | 'floor_backrest_side';

export type ConfigState = {
  make: string;
  model: string;
  year: number | null;
  seats: 5 | 7;
  materialId: string;
  variantId: string;
  carpetCoverage: boolean;
  sillCoverage: boolean;
  trunkTierId: TrunkTierId;
  protectiveMatsMode: ProtectiveMatsMode;
};

export type PriceBreakdown = {
  base: number;
  variantDelta: number;
  carpetDelta: number;
  sillDelta: number;
  trunkDelta: number;
  protectiveDelta: number;
  total: number;
};

export type MaterialVariant = {
  id: string;
  label: string;
  priceDelta: number;
};

export type Material = {
  id: string;
  label: string;
  basePrice: number;
  variants: MaterialVariant[];
};

export type TrunkTier = {
  id: string;
  label: string;
  priceDelta: number;
};

export type ProtectiveMatsOptions = {
  withSetDelta: number;
  withoutSetDelta: number;
  onlyProtectivePrice: number;
};

export type PricingOptions = {
  carpetCoverageDelta: number;
  sillCoverageDelta: number;
  sillCoverageFormula: number;
  trunkTiers: TrunkTier[];
  protectiveMats: ProtectiveMatsOptions;
};

export type PricingData = {
  materials: Material[];
  options: PricingOptions;
};

export type CarYear = {
  year: number;
};

export type CarModel = {
  name: string;
  has7seats: boolean;
  years: CarYear[];
};

export type CarMake = {
  name: string;
  models: CarModel[];
};

export type CarsData = {
  makes: CarMake[];
};
