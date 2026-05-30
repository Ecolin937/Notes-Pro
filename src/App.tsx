/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StickyNote, Search, Trash2, X } from 'lucide-react';
import { Note } from './types';
import NoteCard from './components/NoteCard';
import NoteCreator from './components/NoteCreator';
import NoteModal from './components/NoteModal';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('simple-notes-data');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('simple-notes-data', JSON.stringify(notes));
    // Afficher brièvement "Sauvegardé"
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 2000);
    return () => clearTimeout(timer);
  }, [notes]);

  const addNote = (newNoteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...newNoteData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const deleteSelectedNotes = () => {
    setNotes(notes.filter(note => !selectedIds.has(note.id)));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelectionMode = selectedIds.size > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Selection Toolbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between min-h-[64px]">
        <AnimatePresence mode="wait">
          {!isSelectionMode ? (
            <motion.div 
              key="header-default"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 rounded-lg shadow-sm">
                  <StickyNote className="text-white" size={24} />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold tracking-tight text-gray-800 leading-none">Notes</h1>
                  <AnimatePresence>
                    {isSaving && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1"
                      >
                        Sauvegardé
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher dans vos notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 hover:bg-gray-200/50 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 py-2.5 pl-11 pr-4 rounded-xl outline-none transition-all border border-transparent focus:border-yellow-400"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="header-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedIds(new Set())}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
                <span className="font-bold text-lg text-gray-800">
                  {selectedIds.size} sélectionnée{selectedIds.size > 1 ? 's' : ''}
                </span>
              </div>

              <button 
                onClick={deleteSelectedNotes}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
              >
                <Trash2 size={20} />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Creator Section */}
        {!isSelectionMode && <NoteCreator onAdd={addNote} />}

        {/* Mobile Search - Only visible on small screens */}
        {!isSelectionMode && (
          <div className="sm:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 py-2.5 pl-11 pr-4 rounded-xl outline-none border border-transparent focus:border-yellow-400"
              />
            </div>
          </div>
        )}

        {/* Notes Display */}
        {filteredNotes.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  isSelected={selectedIds.has(note.id)}
                  isSelectionMode={isSelectionMode}
                  onSelect={toggleSelect}
                  onClick={setActiveNote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <StickyNote size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">
              {searchQuery ? "Aucune note correspondante" : "Vos notes apparaîtront ici"}
            </p>
          </div>
        )}
      </main>

      <NoteModal 
        note={activeNote}
        onClose={() => setActiveNote(null)}
        onDelete={deleteNote}
      />

      {/* Footer Branding */}
      <footer className="py-8 text-center text-gray-400 text-xs font-medium uppercase tracking-widest pointer-events-none">
        Simplicité avant tout
      </footer>
    </div>
  );
}
