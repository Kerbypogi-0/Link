import React from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface RewardsModalProps {
  user: User;
  onClose: () => void;
}

const REWARDS = [
  { amount: 5, points: 5000 },
  { amount: 10, points: 9500 },
  { amount: 20, points: 18000 },
  { amount: 50, points: 42500 }
];

export default function RewardsModal({ user, onClose }: RewardsModalProps) {
  const handleCashout = async (amount: number, requiredPoints: number) => {
    if (user.points < requiredPoints) {
      toast.error('Not enough points for this reward');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          points: user.points - requiredPoints
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Cashout request for $${amount} submitted successfully!`);
      onClose();
    } catch (error) {
      toast.error('Failed to process cashout');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src="https://www.paypalobjects.com/webstatic/icon/pp64.png"
                alt="PayPal"
                className="w-8 h-8"
              />
              <h2 className="text-xl font-bold text-gray-900">Cash Out with PayPal</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">Your current points: <span className="font-bold">{user.points}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {REWARDS.map(({ amount, points }) => (
              <div
                key={amount}
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-bold text-[#0070BA]">${amount}</div>
                <div className="text-sm text-gray-600 mb-2">{points} points</div>
                <button
                  onClick={() => handleCashout(amount, points)}
                  disabled={user.points < points}
                  className={`w-full px-4 py-2 rounded-md ${
                    user.points >= points
                      ? 'bg-[#0070BA] text-white hover:bg-[#003087]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Cash Out
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>* Rewards will be sent to your PayPal account within 24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}