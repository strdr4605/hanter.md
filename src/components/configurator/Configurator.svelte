<script lang="ts">
  import { calculatePrice } from './PriceEngine';
  import type {
    CarBrand, CarOption,
    MatClass, MatItem,
    PricingData, ConfigState, ProtectiveMatsMode,
  } from './types';
  import ContactForm from './ContactForm.svelte';

  type Props = {
    cars: string;
    materials: string;
    pricing: string;
    heroImageSrc: string;
    locale: string;
    labels: {
      step1: string; step2: string; step3: string;
      brand: string; model: string; subgeneration: string; option: string;
      selectBrand: string; selectModel: string;
      selectSubgeneration: string; selectOption: string;
      matClass: string; matItem: string;
      protectiveWith: string; protectiveWithout: string; protectiveOnly: string;
      totalPrice: string; currency: string;
      formTitle: string; formName: string; formPhone: string; formEmail: string;
      formSubmit: string; formSuccess: string; formError: string; formConfigSummary: string;
    };
  };

  let { cars: carsRaw, materials: materialsRaw, pricing: pricingRaw, heroImageSrc, labels }: Props = $props();

  const carsData: { brands: CarBrand[] } = JSON.parse(carsRaw);
  const materialsData: { classes: MatClass[] } = JSON.parse(materialsRaw);
  const pricingData: PricingData = JSON.parse(pricingRaw);

  const firstMatClass = materialsData.classes[0];
  const firstMatItem = firstMatClass?.items[0];

  let config = $state<ConfigState>({
    brandName: '',
    modelName: '',
    generationName: '',
    yearRange: '',
    selectedOption: null,
    activeSuboptions: {},
    matClassId: firstMatClass?.id ?? '',
    matItemId: firstMatItem?.id ?? '',
    protectiveMatsMode: 'WITH_PROTECTIVE',
  });

  // Cascading derived state
  const selectedBrand = $derived(carsData.brands.find((b) => b.name === config.brandName));

  // Flat list of "Model Generation" entries for 2nd dropdown
  type ModelGenEntry = { label: string; modelName: string; generationName: string };
  const modelGenOptions = $derived<ModelGenEntry[]>(
    (selectedBrand?.models ?? []).flatMap((model) =>
      model.generations.map((gen) => ({
        label: `${model.name} ${gen.name}`,
        modelName: model.name,
        generationName: gen.name,
      }))
    )
  );

  const selectedModel = $derived(selectedBrand?.models.find((m) => m.name === config.modelName));
  const selectedGeneration = $derived(selectedModel?.generations.find((g) => g.name === config.generationName));
  const selectedSubgeneration = $derived(selectedGeneration?.subgenerations.find((s) => s.yearRange === config.yearRange));

  const selectedMatClass = $derived(materialsData.classes.find((c) => c.id === config.matClassId));
  const selectedMatItem = $derived(selectedMatClass?.items.find((i) => i.id === config.matItemId));

  const breakdown = $derived(calculatePrice(config, materialsData, pricingData));

  const protectiveOptions: { id: ProtectiveMatsMode; label: string }[] = [
    { id: 'WITH_PROTECTIVE', label: labels.protectiveWith },
    { id: 'WITHOUT_PROTECTIVE', label: labels.protectiveWithout },
    { id: 'ONLY_PROTECTIVE', label: labels.protectiveOnly },
  ];

  function onBrandChange(e: Event) {
    config.brandName = (e.target as HTMLSelectElement).value;
    config.modelName = '';
    config.generationName = '';
    config.yearRange = '';
    config.selectedOption = null;
    config.activeSuboptions = {};
  }

  function onModelGenChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    if (!val) {
      config.modelName = '';
      config.generationName = '';
    } else {
      const [modelName, generationName] = val.split('|');
      config.modelName = modelName;
      config.generationName = generationName;
    }
    config.yearRange = '';
    config.selectedOption = null;
    config.activeSuboptions = {};
  }

  function onYearRangeChange(e: Event) {
    config.yearRange = (e.target as HTMLSelectElement).value;
    config.selectedOption = null;
    config.activeSuboptions = {};
  }

  function selectOption(opt: CarOption) {
    config.selectedOption = opt;
    config.activeSuboptions = {};
  }

  function selectMatItem(cls: MatClass, item: MatItem) {
    config.matClassId = cls.id;
    config.matItemId = item.id;
  }

  const modelGenValue = $derived(
    config.modelName && config.generationName
      ? `${config.modelName}|${config.generationName}`
      : ''
  );
</script>

<div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">

<!-- Left column: form -->
<div>

<!-- Mobile: image on top -->
<div class="lg:hidden mb-6">
  <img
    src={selectedMatItem?.demoImage ?? heroImageSrc}
    alt="Covorașe auto premium"
    class="w-full rounded-lg object-cover max-h-56"
  />
</div>

<div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">

  <!-- Step 1: Car selection -->
  <section>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step1}</h3>
    <div class="grid grid-cols-2 gap-3">

      <!-- Brand -->
      <div class="col-span-2 sm:col-span-1 flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.brand}</label>
        <select
          value={config.brandName}
          onchange={onBrandChange}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400"
        >
          <option value="">{labels.selectBrand}</option>
          {#each carsData.brands as brand}
            <option value={brand.name}>{brand.name}</option>
          {/each}
        </select>
      </div>

      <!-- Model + Generation (combined) -->
      <div class="col-span-2 sm:col-span-1 flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.model}</label>
        <select
          value={modelGenValue}
          onchange={onModelGenChange}
          disabled={!config.brandName}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 disabled:opacity-40"
        >
          <option value="">{labels.selectModel}</option>
          {#each modelGenOptions as entry}
            <option value={`${entry.modelName}|${entry.generationName}`}>{entry.label}</option>
          {/each}
        </select>
      </div>

      <!-- Year range -->
      <div class="col-span-2 sm:col-span-1 flex flex-col gap-1">
        <label class="text-xs text-gray-500">{labels.subgeneration}</label>
        <select
          value={config.yearRange}
          onchange={onYearRangeChange}
          disabled={!config.generationName}
          class="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 disabled:opacity-40"
        >
          <option value="">{labels.selectSubgeneration}</option>
          {#each selectedGeneration?.subgenerations ?? [] as subgen}
            <option value={subgen.yearRange}>{subgen.yearRange}</option>
          {/each}
        </select>
      </div>

      <!-- Option (seat config) -->
      {#if selectedSubgeneration && selectedSubgeneration.options.length > 0}
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-xs text-gray-500">{labels.option}</label>
          <div class="flex flex-wrap gap-2">
            {#each selectedSubgeneration.options as opt}
              <button
                type="button"
                onclick={() => selectOption(opt)}
                class={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  config.selectedOption?.label === opt.label
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            {/each}
          </div>
        </div>
      {/if}

    </div>
  </section>

  <!-- Suboptions -->
  {#if config.selectedOption && config.selectedOption.suboptions.length > 0}
    <hr class="border-gray-100" />
    <section>
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step2}</h3>
      <div class="flex flex-wrap gap-2">
        {#each config.selectedOption.suboptions as sub}
          <button
            type="button"
            onclick={() => {
              const active = config.activeSuboptions[sub.id] ?? false;
              config.activeSuboptions = active ? {} : { [sub.id]: true };
            }}
            class={`px-3 py-1.5 text-sm rounded border transition-colors ${
              config.activeSuboptions[sub.id]
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {sub.label}
          </button>
        {/each}
      </div>
    </section>
  {/if}

  <hr class="border-gray-100" />

  <!-- Mat class & item selection -->
  <section>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{labels.step2}</h3>
    <div class="space-y-4">
      {#each materialsData.classes as cls}
        <fieldset>
          <legend class="text-xs font-medium text-gray-500 mb-2">{cls.label}</legend>
          <div class="flex flex-wrap gap-2">
            {#each cls.items as item}
              <label class="cursor-pointer">
                <input
                  type="radio"
                  name="matItem"
                  value={item.id}
                  checked={config.matItemId === item.id && config.matClassId === cls.id}
                  onchange={() => selectMatItem(cls, item)}
                  class="sr-only"
                />
                <div
                  title={item.label}
                  class={`w-10 h-10 rounded border-2 overflow-hidden transition-all ${
                    config.matItemId === item.id && config.matClassId === cls.id
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    class="w-full h-full object-cover"
                  />
                </div>
              </label>
            {/each}
          </div>
        </fieldset>
      {/each}

      <!-- Demo image shown after selection (mobile only) -->
      {#if selectedMatItem}
        <div class="lg:hidden mt-3">
          <img
            src={selectedMatItem.demoImage}
            alt={selectedMatItem.label}
            class="w-full max-h-48 object-cover rounded-lg"
          />
          <p class="text-xs text-gray-500 mt-1">{selectedMatItem.label}</p>
        </div>
      {/if}
    </div>
  </section>

  <hr class="border-gray-100" />

  <!-- Protective mats -->
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

</div> <!-- end form card -->

<ContactForm
  {config}
  {breakdown}
  materialsData={materialsData}
  labels={{
    title: labels.formTitle,
    name: labels.formName,
    phone: labels.formPhone,
    email: labels.formEmail,
    submit: labels.formSubmit,
    success: labels.formSuccess,
    error: labels.formError,
    configSummary: labels.formConfigSummary,
    currency: labels.currency,
    protectiveWith: labels.protectiveWith,
    protectiveWithout: labels.protectiveWithout,
    protectiveOnly: labels.protectiveOnly,
  }}
/>

</div> <!-- end left column -->

<!-- Right column: image (desktop only) -->
<div class="hidden lg:block sticky top-20">
  <img
    src={selectedMatItem?.demoImage ?? heroImageSrc}
    alt="Covorașe auto premium"
    class="w-full rounded-lg object-cover aspect-[4/3]"
  />
  <p class="mt-3 text-xs text-gray-400 text-center">Covorașe confecționate la comandă</p>
</div>

</div> <!-- end grid -->
