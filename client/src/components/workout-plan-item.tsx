import { WorkoutPlanSummary } from "@/types/workout-plan";
import { ChevronRight, Dumbbell, User } from "lucide-react";
import { Link } from "react-router";

type WorkoutPlanItemProps = WorkoutPlanSummary

export function WorkoutPlanItem({id, author, exercises, title}: WorkoutPlanItemProps) {
  return (
    <Link to={`/planilhas/${id}`}>
      <div className="bg-lime-200 border-2 border-lime-300 hover:bg-lime-300 transition-colors duration-100 rounded-md px-3 h-24 flex items-center justify-between">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">{title}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1 leading-none">
              <Dumbbell size={16} />
              <span>{exercises} exercícios</span>
            </div>
            <div className="flex items-center space-x-1 leading-none">
              <User size={16} />
              <span className="text-sm">{author.split(' ')[0]}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>
    </Link>
  )
}


