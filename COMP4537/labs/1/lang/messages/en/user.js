// User-facing messages for the application
const messages = {
    // Common messages
    backToHome: 'Back to Home',
    goToWriter: 'Go to Writer',
    
    // Writer page messages
    writer: {
        title: 'Writer',
        addNote: 'Add Note',
        updateNote: 'Update Note',
        cancelEdit: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        noteTitlePlaceholder: 'Note title...',
        noteContentPlaceholder: 'Write your note here...',
        validationError: 'Please enter both title and content for the note.',
        deleteConfirmation: 'Are you sure you want to delete this note?',
        emptyState: 'No notes yet. Create your first note above!',
        lastSaved: 'Last saved: Never',
        lastSavedPrefix: 'Last saved: ',
        created: 'Created: ',
        updated: 'Updated: '
    },
    
    // Reader page messages
    reader: {
        title: 'Reader',
        description: 'View all notes created in the Writer page',
        lastRetrieved: 'Last retrieved: Never',
        lastRetrievedPrefix: 'Last retrieved: ',
        refreshingNotes: 'Refreshing notes...',
        emptyState: {
            icon: '📝',
            title: 'No Notes Found',
            message: 'No notes have been created yet. Go to the Writer page to create your first note!'
        },
        noteBadge: 'Note #',
        noteId: 'ID: ',
        created: 'Created:',
        updated: 'Updated:',
        timeAgo: {
            seconds: 'seconds ago',
            second: 'second ago',
            minutes: 'minutes ago',
            minute: 'minute ago',
            hours: 'hours ago',
            hour: 'hour ago'
        }
    },
    
    // Index page messages
    index: {
        title: 'Home',
        welcome: 'Welcome',
        reader: 'Reader',
        writer: 'Writer'
    },
    
    // Error messages
    errors: {
        savingNotes: 'Error saving notes:',
        loadingNotes: 'Error loading notes:',
        retrievingNotes: 'Error retrieving notes:'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = messages;
} else {
    window.messages = messages;
}
