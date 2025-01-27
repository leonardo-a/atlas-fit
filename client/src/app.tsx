import { Route, Routes } from "react-router";

import { Exercises } from "./pages/exercises";
import { Exercise } from "./pages/exercises/exercise";
import { Home } from "./pages/home";
import { WorkoutPlan } from "./pages/workout-plan";


export function App() {
  return (
    <div className="flex flex-col min-h-dvh bg-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="planilhas/:id" element={<WorkoutPlan />} />
        <Route path="exercises">
          <Route index element={<Exercises />} />
          <Route path=":id" element={<Exercise />} />
        </Route>
      </Routes>
    </div>
  )
}