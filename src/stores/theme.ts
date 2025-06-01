import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = useLocalStorage<'sun' | 'moon'>('theme', 'sun')

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'moon' ? 'sun' : 'moon'
    applyTheme()
  }

  const applyTheme = () => {
    document.documentElement.classList.toggle('moon', currentTheme.value === 'moon')
  }

  return {
    currentTheme,
    toggleTheme,
    applyTheme,
  }
})
