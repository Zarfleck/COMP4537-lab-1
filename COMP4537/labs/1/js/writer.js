// Writer page JavaScript functionality
class NoteManager {
    constructor() {
        this.notes = [];
        this.editingId = null;
        this.autoSaveInterval = null;
        this.init();
    }

    init() {
        this.loadNotes();
        this.setupEventListeners();
        this.startAutoSave();
        this.updateTimestamp();
        this.renderNotes();
    }

    setupEventListeners() {
        document.getElementById('addNote').addEventListener('click', () => this.addNote());
        document.getElementById('updateNote').addEventListener('click', () => this.updateNote());
        document.getElementById('cancelEdit').addEventListener('click', () => this.cancelEdit());
        
    }

    addNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title || !content) {
            alert(window.messages?.writer?.validationError || 'Please enter both title and content for the note.');
            return;
        }

        const note = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(note); 
        this.clearForm();
        this.renderNotes();
        this.saveNotes();
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        this.editingId = id;
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        
        document.getElementById('addNote').style.display = 'none';
        document.getElementById('updateNote').style.display = 'inline-block';
        document.getElementById('cancelEdit').style.display = 'inline-block';
        
        // Focus on content
        document.getElementById('noteContent').focus();
    }

    updateNote() {
        if (!this.editingId) return;

        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title || !content) {
            alert(window.messages?.writer?.validationError || 'Please enter both title and content for the note.');
            return;
        }

        const noteIndex = this.notes.findIndex(n => n.id === this.editingId);
        if (noteIndex !== -1) {
            this.notes[noteIndex].title = title;
            this.notes[noteIndex].content = content;
            this.notes[noteIndex].updatedAt = new Date().toISOString();
        }

        this.cancelEdit();
        this.renderNotes();
        this.saveNotes();
    }

    deleteNote(id) {
        if (confirm(window.messages?.writer?.deleteConfirmation || 'Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.renderNotes();
            this.saveNotes();
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.clearForm();
        
        // Show add button, hide update/cancel buttons
        document.getElementById('addNote').style.display = 'inline-block';
        document.getElementById('updateNote').style.display = 'none';
        document.getElementById('cancelEdit').style.display = 'none';
    }

    clearForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
    }

    renderNotes() {
        const notesList = document.getElementById('notesList');
        
        if (this.notes.length === 0) {
            notesList.innerHTML = `<div class="empty-state">${window.messages?.writer?.emptyState || 'No notes yet. Create your first note above!'}</div>`;
            return;
        }

        notesList.innerHTML = this.notes.map(note => `
            <div class="note-item">
                <div class="note-header">
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-actions">
                        <button class="edit-btn" onclick="noteManager.editNote('${note.id}')">${window.messages?.writer?.edit || 'Edit'}</button>
                        <button class="delete-btn" onclick="noteManager.deleteNote('${note.id}')">${window.messages?.writer?.delete || 'Delete'}</button>
                    </div>
                </div>
                <p class="note-content">${this.escapeHtml(note.content)}</p>
                <div class="note-meta">
                    ${window.messages?.writer?.created || 'Created:'} ${this.formatDate(note.createdAt)}
                    ${note.updatedAt !== note.createdAt ? ` | ${window.messages?.writer?.updated || 'Updated:'} ${this.formatDate(note.updatedAt)}` : ''}
                </div>
            </div>
        `).join('');
    }

    saveNotes() {
        try {
            localStorage.setItem('notes', JSON.stringify(this.notes));
            this.updateTimestamp();
        } catch (error) {
            console.error(window.messages?.errors?.savingNotes || 'Error saving notes:', error);
        }
    }

    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
            }
        } catch (error) {
            console.error(window.messages?.errors?.loadingNotes || 'Error loading notes:', error);
            this.notes = [];
        }
    }

    startAutoSave() {
        // Auto-save every 2 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveNotes();
        }, 2000);
    }

    updateTimestamp() {
        const timestampElement = document.getElementById('lastSaved');
        const now = new Date();
        timestampElement.textContent = `${window.messages?.writer?.lastSavedPrefix || 'Last saved: '}${now.toLocaleTimeString()}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}

let noteManager;
document.addEventListener('DOMContentLoaded', () => {
    noteManager = new NoteManager();
});

window.addEventListener('beforeunload', () => {
    if (noteManager) {
        noteManager.destroy();
    }
});
