export const haptic = (ms: number | number[] = 8) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* not supported */
  }
}

export const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const store = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode */
  }
}
