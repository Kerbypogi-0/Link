import React from 'react';
import { Task } from '../types';

interface TaskGridProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskGrid({ tasks, onTaskClick }: TaskGridProps) {
  const sections = [...new Set(tasks.map(task => task.section))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {sections.map((section) => (
        <div key={section} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks
              .filter(task => task.section === section)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
                  onClick={() => onTaskClick(task)}
                >
                  <img
                    src={task.image_url}
                    alt={task.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 font-medium">
                        {task.points} points
                      </span>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                        Start Task
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}