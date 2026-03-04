<script lang="ts">
  import { calculatePrice } from './PriceEngine';
  import type { CarsData, PricingData, ConfigState, TrunkTierId, ProtectiveMatsMode } from './types';

  type Props = {
    cars: string;
    pricing: string;
    locale: string;
    labels: {
      step1: string; step2: string; step3: string;
      make: string; model: string; year: string; seats: string;
      seats5: string; seats7: string;
      material: string; variant: string;
      carpetCoverage: string; sillCoverage: string;
      trunk: string;
      trunkNone: string; trunkFloor: string; trunkFloorBackrest: string; trunkFloorBackrestSide: string;
      protectiveWith: string; protectiveWithout: string; protectiveOnly: string;
      totalPrice: string; currency: string;
      selectMake: string; selectModel: string; selectYear: string;
    };
  };

  let { cars: carsRaw, pricing: pricingRaw, labels }: Props = $props();

  const carsData: CarsData = JSON.parse(carsRaw);
  const pricingData: PricingData = JSON.parse(pricingRaw);

  let config = $state<ConfigState>({
    make: '',
    model: '',
    year: null,
    seats: 5,
    materialId: pricingData.materials[0]?.id ?? '',
    variantId: pricingData.materials[0]?.variants[0]?.id ?? '',
    carpetCoverage: false,
    sillCoverage: false,
    trunkTierId: 'none',
    protectiveMatsMode: 'WITH_PROTECTIVE',
  });

  const selectedMake = $derived(carsData.makes.find((m) => m.name === config.make));
  const selectedModel = $derived(selectedMake?.models.find((m) => m.name === config.model));
  const selectedMaterial = $derived(pricingData.materials.find((m) => m.id === config.materialId));
  const breakdown = $derived(calculatePrice(config, pricingData));

  function onMakeChange(e: Event) {
    config.make = (e.target as HTMLSelectElement).value;
    config.model = '';
    config.year = null;
    config.seats = 5;
  }

  function onModelChange(e: Event) {
    config.model = (e.target as HTMLSelectElement).value;
    config.year = null;
    config.seats = 5;
  }

  function onMaterialChange(e: Event) {
    config.materialId = (e.target as HTMLSelectElement).value;
    const mat = pricingData.materials.find((m) => m.id === config.materialId);
    config.variantId = mat?.variants[0]?.id ?? '';
  }

  const trunkOptions: { id: TrunkTierId; label: string }[] = [
    { id: 'none', label: labels.trunkNone },
    { id: 'floor', label: labels.trunkFloor },
    { id: 'floor_backrest', label: labels.trunkFloorBackrest },
    { id: 'floor_backrest_side', label: labels.trunkFloorBackrestSide },
  ];

  const protectiveOptions: { id: ProtectiveMatsMode; label: string }[] = [
    { id: 'WITH_PROTECTIVE', label: labels.protectiveWith },
    { id: 'WITHOUT_PROTECTIVE', label: labels.protectiveWithout },
    { id: 'ONLY_PROTECTIVE', label: labels.protectiveOnly },
  ];
</script>

<div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">

  <!-- Step 1: Car selection -->
  <section>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step1}</h3>
    <div class="grid grid-cols-2 gap-3">

      <div class="col-span-2 sm:col-span-1 flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.make}</label>
        <select
          value={config.make}
          onchange={onMakeChange}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400"
        >
          <option value="">{labels.selectMake}</option>
          {#each carsData.makes as make}
            <option value={make.name}>{make.name}</option>
          {/each}
        </select>
      </div>

      <div class="col-span-2 sm:col-span-1 flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.model}</label>
        <select
          value={config.model}
          onchange={onModelChange}
          disabled={!config.make}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 disabled:opacity-40"
        >
          <option value="">{labels.selectModel}</option>
          {#each selectedMake?.models ?? [] as model}
            <option value={model.name}>{model.name}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.year}</label>
        <select
          value={config.year ?? ''}
          onchange={(e) => { config.year = Number((e.target as HTMLSelectElement).value); }}
          disabled={!config.model}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 disabled:opacity-40"
        >
          <option value="">{labels.selectYear}</option>
          {#each selectedModel?.years ?? [] as y}
            <option value={y.year}>{y.year}</option>
          {/each}
        </select>
      </div>

      {#if selectedModel?.has7seats}
        <div class="flex flex-col gap-1">
          <label class="text-xs text-gray-500">{labels.seats}</label>
          <div class="flex gap-2">
            {#each [5, 7] as s}
              <button
                type="button"
                onclick={() => { config.seats = s as 5 | 7; }}
                class={`flex-1 py-2 text-sm rounded border transition-colors ${
                  config.seats === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {s === 5 ? labels.seats5 : labels.seats7}
              </button>
            {/each}
          </div>
        </div>
      {/if}

    </div>
  </section>

  <hr class="border-gray-100" />

  <!-- Step 2: Mat options -->
  <section>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step2}</h3>
    <div class="space-y-3">

      <div class="flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.material}</label>
        <select
          value={config.materialId}
          onchange={onMaterialChange}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400"
        >
          {#each pricingData.materials as mat}
            <option value={mat.id}>{mat.label}</option>
          {/each}
        </select>
      </div>

      {#if selectedMaterial && selectedMaterial.variants.length > 1}
        <div class="flex flex-col gap-1">
          <label class="text-xs text-gray-500">{labels.variant}</label>
          <div class="flex flex-wrap gap-2">
            {#each selectedMaterial.variants as v}
              <button
                type="button"
                onclick={() => { config.variantId = v.id; }}
                class={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  config.variantId === v.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {v.label}{v.priceDelta > 0 ? ` +${v.priceDelta}` : ''}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <div class="flex flex-wrap gap-3 pt-1">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.carpetCoverage}
            onchange={(e) => { config.carpetCoverage = (e.target as HTMLInputElement).checked; }}
            class="w-4 h-4 rounded border-gray-300 accent-gray-900"
          />
          <span class="text-sm text-gray-700">{labels.carpetCoverage}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.sillCoverage}
            onchange={(e) => { config.sillCoverage = (e.target as HTMLInputElement).checked; }}
            class="w-4 h-4 rounded border-gray-300 accent-gray-900"
          />
          <span class="text-sm text-gray-700">{labels.sillCoverage}</span>
        </label>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.trunk}</label>
        <div class="flex flex-wrap gap-2">
          {#each trunkOptions as opt}
            <button
              type="button"
              onclick={() => { config.trunkTierId = opt.id; }}
              class={`px-3 py-1.5 text-sm rounded border transition-colors ${
                config.trunkTierId === opt.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          {/each}
        </div>
      </div>

    </div>
  </section>

  <hr class="border-gray-100" />

  <!-- Step 3: Protective mats -->
  <section>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step3}</h3>
    <div class="flex flex-col gap-2">
      {#each protectiveOptions as opt}
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="radio"
            name="protectiveMats"
            value={opt.id}
            checked={config.protectiveMatsMode === opt.id}
            onchange={() => { config.protectiveMatsMode = opt.id; }}
            class="w-4 h-4 accent-gray-900"
          />
          <span class="text-sm text-gray-700">{opt.label}</span>
        </label>
      {/each}
    </div>
  </section>

  <hr class="border-gray-100" />

  <!-- Price -->
  <div class="flex items-baseline justify-between">
    <span class="text-sm text-gray-500">{labels.totalPrice}</span>
    <span class="text-2xl font-bold text-gray-900">{breakdown.total} <span class="text-base font-normal text-gray-400">{labels.currency}</span></span>
  </div>

</div>
