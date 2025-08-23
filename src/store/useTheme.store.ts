import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStoreInterface {
  theme: string
  supportedThemes: { name: string; label: string }[]
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeStoreInterface>()(
  persist(
    (set) => ({
      theme: 'light',
      supportedThemes: [
        { name: 'light', label: 'light 🌞' },
        { name: 'dark', label: 'dark 🌙' },
      ],
      setTheme: (theme: string) => set({ theme })
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
)