<script lang="ts">
  import type { ConfigState, PriceBreakdown, MatClass } from './types';

  type Props = {
    config: ConfigState;
    breakdown: PriceBreakdown;
    materialsData: { classes: MatClass[] };
    labels: {
      title: string; name: string; phone: string; email: string;
      submit: string; success: string; error: string; configSummary: string;
      currency: string;
      protectiveWith: string; protectiveWithout: string; protectiveOnly: string;
    };
  };

  let { config, breakdown, materialsData, labels }: Props = $props();

  let name = $state('');
  let phone = $state('');
  let email = $state('');
  let status = $state<'idle' | 'success'>('idle');

  const RECIPIENT = 'strainu.tudor@gmail.com';

  function submit(e: SubmitEvent) {
    e.preventDefault();

    const matClass = materialsData.classes.find((c) => c.id === config.matClassId);
    const matItem = matClass?.items.find((i) => i.id === config.matItemId);

    const protectiveLabels: Record<string, string> = {
      WITH_PROTECTIVE: labels.protectiveWith,
      WITHOUT_PROTECTIVE: labels.protectiveWithout,
      ONLY_PROTECTIVE: labels.protectiveOnly,
    };

    const activeSuboptionLabels = config.selectedOption
      ? config.selectedOption.suboptions
          .filter((s) => config.activeSuboptions[s.id])
          .map((s) => s.label)
          .join(', ')
      : '';

    const summary = [
      `Mașină: ${config.brandName} ${config.modelName} ${config.generationName} ${config.yearRange}`,
      config.selectedOption ? `Configurație: ${config.selectedOption.label}` : '',
      activeSuboptionLabels ? `Opțiuni: ${activeSuboptionLabels}` : '',
      `Material: ${matClass?.label ?? config.matClassId} / ${matItem?.label ?? config.matItemId}`,
      `Protecție: ${protectiveLabels[config.protectiveMatsMode] ?? config.protectiveMatsMode}`,
      `Total: ${breakdown.total} ${labels.currency}`,
    ].filter(Boolean).join('\n');

    const subject = encodeURIComponent(
      `Comandă nouă — ${config.brandName} ${config.modelName} ${config.generationName} — ${breakdown.total} ${labels.currency}`
    );
    const body = encodeURIComponent(
      `Nume: ${name}\nTelefon: ${phone}\nEmail: ${email}\n\n${labels.configSummary}:\n${summary}`
    );

    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
    status = 'success';
  }

  const isCarSelected = $derived(!!config.selectedOption);
</script>

<div id="contact" class="bg-white border border-gray-200 rounded-lg p-6 mt-4">
  <h3 class="text-sm font-semibold text-gray-800 mb-4">{labels.title}</h3>

  {#if status === 'success'}
    <p class="text-sm text-green-600">{labels.success}</p>
  {:else}
    <form onsubmit={submit} class="space-y-3">
      <input
        type="text"
        placeholder={labels.name}
        bind:value={name}
        required
        class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        type="tel"
        placeholder={labels.phone}
        bind:value={phone}
        required
        class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        type="email"
        placeholder={labels.email}
        bind:value={email}
        class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <button
        type="submit"
        disabled={!isCarSelected}
        class="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {labels.submit}
      </button>
    </form>
  {/if}
</div>
