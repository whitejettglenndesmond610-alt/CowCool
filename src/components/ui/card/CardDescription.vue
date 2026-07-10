<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <p :class="cn('text-sm text-neutral-500 dark:text-neutral-400', props.class)">
    <slot />
  </p>
</template>
