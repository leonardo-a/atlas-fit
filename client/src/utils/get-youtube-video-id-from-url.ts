export function getYouTubeVideoIdFromUrl(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/)([^"&?/\s]{11})/,
  )

  return match
    ? match[1]
    : null
}
