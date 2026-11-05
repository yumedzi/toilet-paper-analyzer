export const haptic = (ms: number | number[] = 8) => {
  try {
    // browsers block vibrate until the user has interacted with the page
    if ((navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive === false) return
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
