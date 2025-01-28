import { Route, Routes } from "react-router";

import { ProtectedRoute } from "./components/protected-route";
import { Home } from "./pages/home";
import { SignIn } from "./pages/sign-in";
import { WorkoutPlan } from "./pages/workout-plan";
import { Profile } from "./pages/profile";


export function App() {
  return (
    <div className="flex flex-col min-h-dvh bg-slate-100">
      <Routes>
        <Route path="entrar" element={<SignIn />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route 
          path="perfil" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="planilhas/:id" 
          element={
            <ProtectedRoute>
              <WorkoutPlan />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}