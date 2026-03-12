export type ProtectiveMatsMode = 'WITH_PROTECTIVE' | 'WITHOUT_PROTECTIVE' | 'ONLY_PROTECTIVE';

// Raw JSON types (used in Hero.astro / content loading)
export type LocaleLabel = { ro: string; ru: string; en: string };
export type Locale = 'ro' | 'ru' | 'en';

export type RawSuboption = { id: string; label: LocaleLabel; extraMeters: number };
export type RawCarOption = { label: LocaleLabel; meters: number; suboptions: RawSuboption[] };
export type RawCarModel = { name: string; yearRange: string; options: RawCarOption[] };
export type RawCarBrand = { name: string; models: RawCarModel[] };
export type CarsData = { brands: RawCarBrand[] };

export type RawMatItem = { id: string; label: LocaleLabel; pricePerMeter: number; image: string; demoImage: string };
export type RawMatClass = { id: string; label: LocaleLabel; items: RawMatItem[] };
export type MaterialsData = { classes: RawMatClass[] };

// Resolved types (locale applied) — passed into Configurator as props
export type Suboption = { id: string; label: string; extraMeters: number };
export type CarOption = { label: string; meters: number; suboptions: Suboption[] };
export type CarModel = { name: string; yearRange: string; options: CarOption[] };
export type CarBrand = { name: string; models: CarModel[] };

export type MatItem = { id: string; label: string; pricePerMeter: number; image: string; demoImage: string };
export type MatClass = { id: string; label: string; items: MatItem[] };

export type ProtectiveMatsOptions = { withDelta: number; withoutDelta: number; onlyProtectivePrice: number };
export type PricingData = { protectiveMats: ProtectiveMatsOptions };

export type ConfigState = {
  brandName: string;
  modelName: string;
  selectedOption: CarOption | null;
  activeSuboptions: Record<string, boolean>;
  matClassId: string;
  matItemId: string;
  protectiveMatsMode: ProtectiveMatsMode;
};

export type PriceBreakdown = {
  baseMeters: number;
  totalMeters: number;
  pricePerMeter: number;
  matPrice: number;
  protectiveDelta: number;
  total: number;
};
