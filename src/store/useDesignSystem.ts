import { create } from 'zustand'
import type { DesignSystem } from '../types'
import { defaultSystem } from '../engine/defaults'

const STORAGE_KEY = 'ds-studio:config:v2'

/** One-level-deep merge of saved config over defaults, so newly added token
 *  slices (and nested keys) are always present even for older saved configs. */
function mergeDefaults(saved: Partial<DesignSystem>): DesignSystem {
  const out = { ...defaultSystem } as Record<string, unknown>
  for (const key of Object.keys(defaultSystem) as (keyof DesignSystem)[]) {
    const d = defaultSystem[key]
    const s = saved[key]
    if (s !== undefined && d && typeof d === 'object' && !Array.isArray(d)) {
      out[key] = { ...(d as object), ...(s as object) }
    } else if (s !== undefined) {
      out[key] = s
    }
  }
  return out as unknown as DesignSystem
}

function load(): DesignSystem {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return mergeDefaults(JSON.parse(raw))
  } catch {
    /* ignore */
  }
  return defaultSystem
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

interface Store {
  ds: DesignSystem
  /** shallow-merge a top-level slice (e.g. patch('color', {...})) */
  patch: <K extends keyof DesignSystem>(key: K, value: Partial<DesignSystem[K]>) => void
  setColorHex: (key: string, hex: string) => void
  reset: () => void
  replace: (ds: DesignSystem) => void
  exportJson: () => string
  importJson: (json: string) => boolean
}

export const useDesignSystem = create<Store>((set, get) => ({
  ds: load(),
  patch: (key, value) =>
    set((s) => {
      const next = { ...s.ds, [key]: { ...(s.ds[key] as object), ...value } }
      persist(next)
      return { ds: next }
    }),
  setColorHex: (key, hex) =>
    set((s) => {
      const brand = s.ds.color.brand.map((b) => (b.key === key ? { ...b, hex } : b))
      const next = { ...s.ds, color: { ...s.ds.color, brand } }
      persist(next)
      return { ds: next }
    }),
  reset: () => {
    persist(defaultSystem)
    set({ ds: defaultSystem })
  },
  replace: (ds) => {
    persist(ds)
    set({ ds })
  },
  exportJson: () => JSON.stringify(get().ds, null, 2),
  importJson: (json) => {
    try {
      const parsed = JSON.parse(json) as DesignSystem
      if (!parsed.color || !parsed.typography) return false
      const merged = mergeDefaults(parsed)
      persist(merged)
      set({ ds: merged })
      return true
    } catch {
      return false
    }
  },
}))

function persist(ds: DesignSystem) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ds))
  } catch {
    /* ignore quota */
  }
}

export type { DeepPartial }
