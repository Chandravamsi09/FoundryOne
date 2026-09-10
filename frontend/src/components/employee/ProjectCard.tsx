import React from 'react';
import { Project } from '../../types/employee';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

export default function ProjectCard({ project, onClick, className = '' }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{project.name}</h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize flex-shrink-0">{project.status.replace('_', ' ')}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-700">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map((member) => (
            <div key={member.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
              {member.name.charAt(0)}
            </div>
          ))}
        </div>
        <span className="text-xs text-slate-500">Due {new Date(project.endDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
