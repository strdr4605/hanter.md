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
  let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  const FORM_ID = 'xpwzrgkd'; // replace with real Formspree form ID

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    status = 'sending';

    const summary = [
      `${config.make} ${config.model} ${config.year ?? ''} (${config.seats} locuri)`,
      `Material: ${config.materialId} / ${config.variantId}`,
      `Mochetă: ${config.carpetCoverage ? 'Da' : 'Nu'}`,
      `Praguri: ${config.sillCoverage ? 'Da' : 'Nu'}`,
      `Portbagaj: ${config.trunkTierId}`,
      `Protecție: ${config.protectiveMatsMode}`,
      `Total: ${breakdown.total} ${labels.currency}`,
    ].join('\n');

    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone, email, [labels.configSummary]: summary }),
      });
      status = res.ok ? 'success' : 'error';
    } catch {
      status = 'error';
    }
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
      {#if status === 'error'}
        <p class="text-xs text-red-500">{labels.error}</p>
      {/if}
      <button
        type="submit"
        disabled={status === 'sending'}
        class="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? '...' : labels.submit}
      </button>
    </form>
  {/if}
</div>
