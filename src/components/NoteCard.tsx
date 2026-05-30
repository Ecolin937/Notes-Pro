/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import { Note, NOTE_COLORS } from '../types';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (id: string) => void;
  onClick: (note: Note) => void;
}

export default function NoteCard({ note, isSelected, isSelectionMode, onSelect, onClick }: NoteCardProps) {
  const colorClass = NOTE_COLORS.find(c => c.value.includes(note.color))?.value || 'bg-white border-gray-200';
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onSelect(note.id);
      
      // Vibrating feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // If it was a long press that triggered selection, don't perform click action
    if (isLongPressRef.current) return;

    if (isSelectionMode) {
      onSelect(note.id);
    } else {
      onClick(note);
    }
  };

  return (
    <motion.div
      layoutId={`note-${note.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 0.95 : 1,
        borderColor: isSelected ? '#eab308' : undefined
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: isSelectionMode ? 0 : -4 }}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onClick={handleInteraction}
      className={`relative group p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm cursor-pointer select-none h-32 flex items-center justify-center text-center ${colorClass} ${isSelected ? 'ring-4 ring-yellow-400/20 border-yellow-400' : 'border-transparent'}`}
    >
      <div className="flex flex-col items-center">
        <h3 className={`font-bold text-gray-900 leading-tight transition-all ${isSelected ? 'text-yellow-700' : ''}`}>
          {note.title || (
            <span className="italic font-normal text-gray-400">Sans titre</span>
          )}
        </h3>
        {isSelected && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 text-yellow-500"
          >
            <CheckCircle2 size={20} fill="currentColor" className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
