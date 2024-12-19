import { defineNuxtPlugin, useRequestHeader, useState } from '#imports'
import { useSSRWidth } from '@vueuse/core'

function detectSSRWidth(fallbackWidth = 500) {
  let detectedSize = fallbackWidth
  if (import.meta.server) {
    detectedSize = Number.parseInt(useRequestHeader('sec-ch-viewport-width') ?? useRequestHeader('width'))
    // Sanity check
    if (Number.isNaN(detectedSize) || detectedSize < 0) {
      detectedSize = fallbackWidth
    }
  }
  // Share the state with the frontend to avoid hydration mismatch
  const state = useState('@vueuse/SSR', () => ({ width: detectedSize }))

  return state.width
}

export default defineNuxtPlugin(() => {
  useSSRWidth(detectSSRWidth())
})
