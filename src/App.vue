<script setup lang="ts">
import { NMessageProvider, NModalProvider } from 'naive-ui'
</script>

<template>
  <NModalProvider>
    <NMessageProvider>
      <div class="h-screen">
        <RouterView />
      </div>
    </NMessageProvider>
  </NModalProvider>
</template>

<style scoped></style>
