// Reader page JavaScript functionality
class NoteReader {
    constructor() {
        this.notes = [];
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.retrieveNotes();
        this.startAutoRefresh();
        this.updateTimestamp();
        this.renderNotes();
    }

    retrieveNotes() {
        try {
            const savedNotes = localStorage.getItem('notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
            } else {
                this.notes = [];
            }
            this.updateTimestamp();
        } catch (error) {
            console.error(window.messages?.errors?.retrievingNotes || 'Error retrieving notes:', error);
            this.notes = [];
        }
    }

    startAutoRefresh() {
        // Retrieve notes every 2 seconds
        this.refreshInterval = setInterval(() => {
            this.retrieveNotes();
            this.renderNotes();
        }, 2000);
    }


    updateTimestamp() {
        const timestampElement = document.getElementById('lastRetrieved');
        const now = new Date();
        timestampElement.textContent = `${window.messages?.reader?.lastRetrievedPrefix || 'Last retrieved: '}${now.toLocaleTimeString()}`;
    }

    renderNotes() {
        const notesDisplay = document.getElementById('notesDisplay');
        
        if (this.notes.length === 0) {
            notesDisplay.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${window.messages?.reader?.emptyState?.icon || '📝'}</div>
                    <h3>${window.messages?.reader?.emptyState?.title || 'No Notes Found'}</h3>
                    <p>${window.messages?.reader?.emptyState?.message || 'No notes have been created yet. Go to the Writer page to create your first note!'}</p>
                </div>
            `;
            return;
        }

        // Sort notes by most recently created
        const sortedNotes = [...this.notes].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        notesDisplay.innerHTML = sortedNotes.map(note => `
            <div class="note-card">
                <div class="note-header">
                    <h2 class="note-title">${this.escapeHtml(note.title)}</h2>
                    <span class="note-badge">${window.messages?.reader?.noteBadge || 'Note #'}${this.getNoteNumber(note.id)}</span>
                </div>
                <p class="note-content">${this.escapeHtml(note.content)}</p>
                <div class="note-meta">
                    <div class="note-dates">
                        <div><strong>${window.messages?.reader?.created || 'Created:'}</strong> ${this.formatDate(note.createdAt)}</div>
                        ${note.updatedAt !== note.createdAt ? 
                            `<div><strong>${window.messages?.reader?.updated || 'Updated:'}</strong> ${this.formatDate(note.updatedAt)}</div>` : 
                            ''
                        }
                    </div>
                    <div class="note-id">${window.messages?.reader?.noteId || 'ID: '}${note.id}</div>
                </div>
            </div>
        `).join('');
    }

    getNoteNumber(noteId) {
        const index = this.notes.findIndex(note => note.id === noteId);
        return index + 1;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        // Show relative time for new notes
        if (diffInSeconds < 60) {
            return `${diffInSeconds} ${diffInSeconds === 1 ? (window.messages?.reader?.timeAgo?.second || 'second ago') : (window.messages?.reader?.timeAgo?.seconds || 'seconds ago')}`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? (window.messages?.reader?.timeAgo?.minute || 'minute ago') : (window.messages?.reader?.timeAgo?.minutes || 'minutes ago')}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? (window.messages?.reader?.timeAgo?.hour || 'hour ago') : (window.messages?.reader?.timeAgo?.hours || 'hours ago')}`;
        } else {
            // Show full date for old notes
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    manualRefresh() {
        this.retrieveNotes();
        this.renderNotes();
    }

    // Get note statistics
    getStats() {
        const totalNotes = this.notes.length;
        const today = new Date().toDateString();
        const todayNotes = this.notes.filter(note => 
            new Date(note.createdAt).toDateString() === today
        ).length;
        
        return {
            total: totalNotes,
            today: todayNotes,
            lastUpdated: this.notes.length > 0 ? 
                Math.max(...this.notes.map(note => new Date(note.updatedAt).getTime())) : 
                null
        };
    }

    // Cleanup method
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize the note reader when the page loads
let noteReader;
document.addEventListener('DOMContentLoaded', () => {
    noteReader = new NoteReader();
    
    // Add manual refresh on page focus (optional enhancement)
    window.addEventListener('focus', () => {
        if (noteReader) {
            noteReader.manualRefresh();
        }
    });
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (noteReader) {
        noteReader.destroy();
    }
});

// Expose noteReader globally for debugging/console access
window.noteReader = noteReader;
