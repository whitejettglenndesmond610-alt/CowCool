<script setup>
defineProps({ type: { type: String, required: true } })
</script>

<template>
  <span class="capability-icon relative flex h-11 w-11 shrink-0 items-center justify-center text-[#15201d]" aria-hidden="true">
    <svg v-if="type === 'foundation'" viewBox="0 0 48 48" class="h-full w-full" fill="none">
      <rect x="7" y="8" width="14" height="14" rx="2" stroke="currentColor"/>
      <rect x="27" y="8" width="14" height="14" rx="2" stroke="currentColor"/>
      <rect x="17" y="28" width="14" height="13" rx="2" stroke="currentColor"/>
      <path class="icon-flow" d="M14 22v4h10m10-4v4H24v2" stroke="#59d6b3" stroke-linecap="round"/>
    </svg>
    <svg v-else-if="type === 'ai'" viewBox="0 0 48 48" class="h-full w-full" fill="none">
      <circle cx="24" cy="24" r="7" stroke="currentColor"/>
      <circle cx="9" cy="14" r="3" stroke="#59d6b3"/>
      <circle cx="39" cy="12" r="3" stroke="#5da9ff"/>
      <circle cx="39" cy="36" r="3" stroke="#59d6b3"/>
      <circle cx="9" cy="35" r="3" stroke="#5da9ff"/>
      <path class="icon-flow" d="M12 16l7 5m8-2l9-5m-9 15l9 5m-17-5l-7 4" stroke="currentColor" opacity=".45"/>
    </svg>
    <svg v-else viewBox="0 0 48 48" class="h-full w-full" fill="none">
      <path d="M7 13h11v10H7zm23 12h11v10H30zM7 32h11v9H7z" stroke="currentColor"/>
      <path class="icon-flow" d="M18 18h8a4 4 0 014 4v3M18 36h12" stroke="#5da9ff" stroke-linecap="round"/>
      <circle cx="30" cy="25" r="2" fill="#59d6b3"/>
    </svg>
  </span>
</template>

<style scoped>
.capability-icon .icon-flow { transition: stroke-width .25s ease, opacity .25s ease; }
.group:hover .capability-icon { transform: translateY(-2px); }
.group:hover .icon-flow { stroke-width: 2; opacity: 1; }
.capability-icon { transition: transform .3s ease; }
</style>
