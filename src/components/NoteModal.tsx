/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { Note, NOTE_COLORS } from '../types';

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function NoteModal({ note, onClose, onDelete }: NoteModalProps) {
  if (!note) return null;

  const colorClass = NOTE_COLORS.find(c => c.value.includes(note.color))?.value || 'bg-white border-gray-200';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          layoutId={`note-${note.id}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${colorClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-black/5">
            <h2 className="font-bold text-xl text-gray-900 truncate pr-8">
              {note.title || 'Note sans titre'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 h-[60vh] overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
              {note.content || <span className="italic text-gray-400">Aucun contenu</span>}
            </p>
          </div>

          <div className="p-4 bg-black/5 flex justify-end gap-3">
            <button
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
              Supprimer
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
