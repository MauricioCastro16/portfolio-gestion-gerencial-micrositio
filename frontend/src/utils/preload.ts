export function preloadImages(urls: string[], timeoutMs = 15000): Promise<void> {
  const timeout = new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutMs)
  })
  const loads = Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        }),
    ),
  ).then(() => undefined)
  return Promise.race([loads, timeout])
}
