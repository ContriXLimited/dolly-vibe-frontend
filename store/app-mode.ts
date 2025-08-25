import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppMode = 'b2c' | 'b2b'

interface AppModeStore {
  mode: AppMode
  setMode: (mode: AppMode) => void
  toggleMode: () => void
  isB2B: boolean
  isB2C: boolean
}

export const useAppModeStore = create<AppModeStore>()(
  persist(
    (set, get) => ({
      mode: 'b2c', // default to B2C mode
      
      setMode: (mode: AppMode) => {
        set({ mode })
      },
      
      toggleMode: () => {
        const currentMode = get().mode
        const newMode: AppMode = currentMode === 'b2c' ? 'b2b' : 'b2c'
        set({ mode: newMode })
      },
      
      get isB2B() {
        return get().mode === 'b2b'
      },
      
      get isB2C() {
        return get().mode === 'b2c'
      }
    }),
    {
      name: 'app-mode-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)