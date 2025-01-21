import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import TaskGrid from './components/TaskGrid';
import TaskDetail from './components/TaskDetail';
import RewardsModal from './components/RewardsModal';
import { Task, User } from './types';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            username: session.user.user_metadata.username,
            points: session.user.user_metadata.points || 0,
            completed_tasks: session.user.user_metadata.completed_tasks || []
          });
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              username: session.user.user_metadata.username,
              points: session.user.user_metadata.points || 0,
              completed_tasks: session.user.user_metadata.completed_tasks || []
            });
          } else {
            setUser(null);
          }
        });

        await fetchTasks();

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
        toast.error('Failed to initialize the application');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Link</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {user.username}
              </span>
              <button
                onClick={() => setShowRewards(true)}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full hover:bg-indigo-200 flex items-center space-x-2"
              >
                <span>{user.points} points</span>
                <img 
                  src="https://www.paypalobjects.com/webstatic/icon/pp32.png"
                  alt="PayPal"
                  className="w-5 h-5 ml-2"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <TaskGrid
          tasks={tasks}
          onTaskClick={(task) => setSelectedTask(task)}
        />
        
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}

        {showRewards && user && (
          <RewardsModal
            user={user}
            onClose={() => setShowRewards(false)}
          />
        )}
      </main>
    </div>
  );
}