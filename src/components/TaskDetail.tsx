import React, { useState } from 'react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetail({ task, onClose }: TaskDetailProps) {
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationSteps, setVerificationSteps] = useState<string[]>([]);

  const verifyTask = async () => {
    setVerifying(true);
    setProgress(0);
    setVerificationSteps([]);

    try {
      // Simulate verification steps
      const steps = [
        'Checking task URL accessibility...',
        'Verifying task completion conditions...',
        'Validating user interaction...',
        'Confirming requirements...',
        'Processing points reward...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setVerificationSteps(prev => [...prev, steps[i]]);
        setProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          points: supabase.sql`points + ${task.points}`,
          completed_tasks: supabase.sql`array_append(completed_tasks, ${task.id})`
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Task completed! Points awarded.');
      onClose();
    } catch (error) {
      toast.error('Failed to verify task completion');
    } finally {
      setVerifying(false);
      setProgress(0);
      setVerificationSteps([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <img
            src={task.image_url}
            alt={task.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Task Description</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-gray-600">
              {task.conditions.map((condition, index) => (
                <li key={index} className="mb-1">{condition}</li>
              ))}
            </ul>
          </div>

          {verifying && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-2">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mb-2"
            >
              Go to Task
            </a>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Tasks
            </button>
            <button
              onClick={verifyTask}
              disabled={verifying}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify Completion'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}