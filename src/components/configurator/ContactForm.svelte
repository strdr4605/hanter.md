<script lang="ts">
  import type { ConfigState } from './types';

  type Props = {
    config: ConfigState;
    breakdown: { total: number };
    labels: {
      title: string; name: string; phone: string; email: string;
      submit: string; success: string; error: string; configSummary: string;
      currency: string;
    };
  };

  let { config, breakdown, labels }: Props = $props();

  let name = $state('');
  let phone = $state('');
  let email = $state('');
  let status = $state<'idle' | 'success'>('idle');

  const RECIPIENT = 'strainu.tudor@gmail.com';

  function submit(e: SubmitEvent) {
    e.preventDefault();

    const summary = [
      `Mașină: ${config.make} ${config.model} ${config.year ?? ''} (${config.seats} locuri)`,
      `Material: ${config.materialId} / ${config.variantId}`,
      `Mochetă: ${config.carpetCoverage ? 'Da' : 'Nu'}`,
      `Praguri: ${config.sillCoverage ? 'Da' : 'Nu'}`,
      `Portbagaj: ${config.trunkTierId}`,
      `Protecție: ${config.protectiveMatsMode}`,
      `Total: ${breakdown.total} ${labels.currency}`,
    ].join('\n');

    const subject = encodeURIComponent(
      `Comandă nouă — ${config.make} ${config.model} ${config.year ?? ''} — ${breakdown.total} ${labels.currency}`
    );
    const body = encodeURIComponent(
      `Nume: ${name}\nTelefon: ${phone}\nEmail: ${email}\n\n${labels.configSummary}:\n${summary}`
    );

    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
    status = 'success';
  }
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
        class="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded hover:bg-gray-700 transition-colors"
      >
        {labels.submit}
      </button>
    </form>
  {/if}
</div>
