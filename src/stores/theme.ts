import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'moon' | 'sun'>('sun')

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'moon' ? 'sun' : 'moon'
    localStorage.setItem('theme', currentTheme.value)
    applyTheme()
  }

  const applyTheme = () => {
    const cacheTheme = localStorage.getItem('theme')
    if (cacheTheme === 'sun' || cacheTheme === 'moon') {
      currentTheme.value = cacheTheme
    }
    document.documentElement.classList.toggle('moon', currentTheme.value === 'moon')
  }

  return {
    currentTheme,
    toggleTheme,
    applyTheme,
  }
})
