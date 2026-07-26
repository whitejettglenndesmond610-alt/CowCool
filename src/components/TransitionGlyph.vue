<script setup>
defineProps({ pageId: { type: String, required: true } })
</script>

<template>
  <svg class="transition-glyph" viewBox="0 0 160 160" fill="none" aria-hidden="true">
    <g v-if="pageId === 'home'">
      <circle class="glyph-stroke" cx="80" cy="80" r="42" />
      <path class="glyph-stroke" d="M80 27C105 42 121 58 133 80c-15 25-30 42-53 53-25-14-42-31-53-53 14-24 31-41 53-53z" />
      <rect class="glyph-stroke" x="61" y="61" width="38" height="38" rx="11" transform="rotate(12 80 80)" />
      <circle class="glyph-node" cx="80" cy="27" r="5" />
      <circle class="glyph-node" cx="133" cy="80" r="5" />
      <circle class="glyph-node" cx="55" cy="117" r="5" />
    </g>
    <g v-else-if="pageId === 'about'">
      <path class="glyph-stroke" d="M80 137C77 111 87 89 79 66c-6-18-4-31 2-45" />
      <path class="glyph-stroke" d="M81 101C60 91 50 78 41 62M80 78c21-8 32-21 41-38M79 50C66 41 61 30 58 19" />
      <path class="glyph-stroke" d="M40 62c15-4 25 3 25 3s-7 14-23 9c-9-3-10-8-2-12zM121 40c-16-3-25 5-25 5s9 13 24 7c9-3 9-9 1-12zM58 19c12 0 19 7 19 7s-9 9-20 2c-7-4-6-8 1-9z" />
      <circle class="glyph-node" cx="80" cy="101" r="5" />
      <circle class="glyph-node" cx="80" cy="78" r="5" />
      <circle class="glyph-node" cx="79" cy="50" r="5" />
    </g>
    <g v-else-if="pageId === 'skills'">
      <circle class="glyph-stroke" cx="80" cy="80" r="20" />
      <circle class="glyph-stroke" cx="31" cy="43" r="13" />
      <circle class="glyph-stroke" cx="129" cy="38" r="13" />
      <circle class="glyph-stroke" cx="132" cy="122" r="13" />
      <circle class="glyph-stroke" cx="28" cy="120" r="13" />
      <path class="glyph-stroke" d="M42 51l22 17m32-2l22-19m-22 47l24 19M64 94l-25 18" />
      <circle class="glyph-node" cx="80" cy="80" r="6" />
    </g>
    <g v-else-if="pageId === 'projects'">
      <path class="glyph-stroke" d="M23 39c0-9 7-16 16-16h82c9 0 16 7 16 16v82c0 9-7 16-16 16H39c-9 0-16-7-16-16V39z" />
      <path class="glyph-stroke" d="M23 50h114M51 50v87M72 76c17-13 29 13 42 0" />
      <circle class="glyph-node" cx="37" cy="37" r="4" />
      <circle class="glyph-node" cx="49" cy="37" r="4" />
      <circle class="glyph-node" cx="72" cy="76" r="5" />
      <circle class="glyph-node" cx="114" cy="76" r="5" />
    </g>
    <g v-else-if="pageId === 'timeline'">
      <path class="glyph-stroke" d="M17 91C38 47 61 115 83 73s43 25 62-17" />
      <path class="glyph-stroke" d="M23 125c35-12 69 18 116-5" opacity=".4" />
      <circle class="glyph-node" cx="17" cy="91" r="8" />
      <circle class="glyph-node" cx="56" cy="84" r="8" />
      <circle class="glyph-node" cx="89" cy="69" r="8" />
      <circle class="glyph-node" cx="145" cy="56" r="8" />
    </g>
    <g v-else>
      <path class="glyph-stroke" d="M29 113C55 90 54 48 80 48s30 43 52 17" />
      <path class="glyph-stroke" d="M80 48c-6 31 13 43 25 65" />
      <circle class="glyph-node" cx="29" cy="113" r="13" />
      <circle class="glyph-node" cx="80" cy="48" r="13" />
      <circle class="glyph-node" cx="132" cy="65" r="13" />
      <circle class="glyph-node" cx="105" cy="113" r="8" />
    </g>
  </svg>
</template>

<style scoped>
.glyph-stroke {
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.glyph-node {
  fill: var(--transition-accent, #59d6b3);
  stroke: currentColor;
  stroke-width: 1.2;
}
</style>
