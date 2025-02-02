import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ReactNode } from 'react'
import { YoutubePlayer } from './youtube-player'
import { Button } from './ui/button'
import { PlayCircle } from 'lucide-react'

interface ExerciseVideoDialogProps {
  name: string
  videoUrl: string
  children?: ReactNode
}

export function ExerciseVideoDialog({ children, name, videoUrl }: ExerciseVideoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="success" size="icon">
            <PlayCircle />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm lg:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Execução <span className="text-lime-500">{name}</span></DialogTitle>
        </DialogHeader>
        <YoutubePlayer videoUrl={videoUrl} />
      </DialogContent>
    </Dialog>
  )
}
