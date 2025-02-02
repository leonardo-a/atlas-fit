import YouTube from 'react-youtube'

import { getYouTubeVideoIdFromUrl } from '@/utils/get-youtube-video-id-from-url'

interface YoutubePlayerProps {
  videoUrl: string
}

export function YoutubePlayer({ videoUrl }: YoutubePlayerProps) {
  const videoId = getYouTubeVideoIdFromUrl(videoUrl)

  if (!videoId) {
    return <p>Url Inválida</p>
  }

  const options = {
    width: '100%',
    height: '420',
    playerVars: {
      autoplay: 1, // 1 para autoplay, 0 para manual
      loop: 1,
      playlist: videoId,
    },
  }

  return (
    <div className="w-full h-[420px]">
      <YouTube videoId={videoId} opts={options} />
    </div>
  )
}
