import { Route, Routes } from 'react-router'

import { ProtectedRoute } from './components/protected-route'
import { Home } from './pages/home'
import { Profile } from './pages/profile'
import { SignIn } from './pages/sign-in'
import { SignUp } from './pages/sign-up'
import { WorkoutPlan } from './pages/workout-plan'
import { WorkoutPlans } from './pages/workout-plans'
import { Students } from './pages/students'
import { Exercises } from './pages/exercises'

export function App() {
  return (
    <div className="flex flex-col min-h-dvh bg-slate-100">
      <Routes>
        <Route path="/entrar" element={<SignIn />} />
        <Route path="/cadastro" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercicios"
          element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planilhas"
          element={
            <ProtectedRoute>
              <WorkoutPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planilhas/:id"
          element={
            <ProtectedRoute>
              <WorkoutPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
