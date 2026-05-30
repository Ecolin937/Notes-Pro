/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Palette, Check } from 'lucide-react';
import { Note, NOTE_COLORS } from '../types';

interface NoteCreatorProps {
  onAdd: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

export default function NoteCreator({ onAdd }: NoteCreatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value.split(' ')[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (title || content) {
          handleSave();
        } else {
          setIsExpanded(false);
          setShowColorPicker(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, content]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onAdd({ title, content, color });
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0].value.split(' ')[0]);
    }
    setIsExpanded(false);
    setShowColorPicker(false);
  };

  const currentColorClass = NOTE_COLORS.find(c => c.value.includes(color))?.value || 'bg-white border-gray-200';

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4" ref={containerRef}>
      <motion.div
        layout
        className={`w-full rounded-xl border shadow-lg transition-colors p-1 ${currentColorClass}`}
      >
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="p-3 flex items-center justify-between cursor-text text-gray-500 hover:text-gray-700"
          >
            <span className="font-medium ml-2">Créer une note...</span>
            <Plus size={20} className="mr-2" />
          </div>
        ) : (
          <div className="p-3">
            <input
              autoFocus
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-semibold text-lg py-2 px-2 text-gray-900 placeholder:text-gray-400"
            />
            <textarea
              placeholder="Note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-none outline-none resize-none py-2 px-2 text-gray-800 placeholder:text-gray-400"
            />
            
            <div className="flex items-center justify-between mt-3 px-2 border-t border-black/5 pt-3">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-full hover:bg-black/5 text-gray-600 transition-colors"
                  title="Changer la couleur"
                >
                  <Palette size={18} />
                </button>
                
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-12 left-0 bg-white shadow-xl border border-gray-200 p-2 rounded-lg flex gap-1 z-10"
                    >
                      {NOTE_COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setColor(c.value.split(' ')[0]);
                            setShowColorPicker(false);
                          }}
                          className={`w-8 h-8 rounded-full border border-gray-200 transition-transform hover:scale-110 flex items-center justify-center ${c.value.split(' ')[0]}`}
                        >
                          {color === c.value.split(' ')[0] && <Check size={14} className="text-gray-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setShowColorPicker(false);
                    setTitle('');
                    setContent('');
                    setColor(NOTE_COLORS[0].value.split(' ')[0]);
                  }}
                  className="px-4 py-1.5 rounded-lg font-medium text-gray-500 hover:bg-black/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-1.5 rounded-lg font-bold bg-yellow-400 text-white hover:bg-yellow-500 transition-all shadow-sm active:scale-95"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
