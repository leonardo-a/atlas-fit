import { useParams } from "react-router"


export function Exercise() {
  const {id} = useParams()

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <h1 className="text-red-500 text-3xl">Exercise {id}</h1>
    </div>
  )
}