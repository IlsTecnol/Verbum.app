import { StorageService } from './StorageService';

const AGENDA_KEY = 'agenda_events';
const CATEGORIES_KEY = 'agenda_categories';

const DEFAULT_CATEGORIES = [
  { id: 'culto', name: 'Culto', color: 'bg-blue-500' },
  { id: 'vigilia', name: 'Vigília', color: 'bg-purple-500' },
  { id: 'congresso', name: 'Congresso', color: 'bg-orange-500' },
  { id: 'ensino', name: 'Ensino', color: 'bg-green-500' }
];

export const AgendaService = {
  getEvents: () => {
    return StorageService.get(AGENDA_KEY, []);
  },

  saveEvent: (event) => {
    const events = AgendaService.getEvents();
    let updatedEvents;
    
    if (event.id) {
      updatedEvents = events.map(e => e.id === event.id ? { ...event, updatedAt: new Date().toISOString() } : e);
    } else {
      const newEvent = {
        ...event,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false
      };
      updatedEvents = [...events, newEvent];
    }
    
    StorageService.set(AGENDA_KEY, updatedEvents);
    return updatedEvents;
  },

  deleteEvent: (eventId) => {
    const events = AgendaService.getEvents();
    const updatedEvents = events.filter(e => e.id !== eventId);
    StorageService.set(AGENDA_KEY, updatedEvents);
    return updatedEvents;
  },

  toggleComplete: (eventId) => {
    const events = AgendaService.getEvents();
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, completed: !e.completed } : e
    );
    StorageService.set(AGENDA_KEY, updatedEvents);
    return updatedEvents;
  },

  getCategories: () => {
    return StorageService.get(CATEGORIES_KEY, DEFAULT_CATEGORIES);
  },

  addCategory: (category) => {
    const categories = AgendaService.getCategories();
    const newCategory = {
      ...category,
      id: Date.now().toString() // simple ID generation
    };
    const updatedCategories = [...categories, newCategory];
    StorageService.set(CATEGORIES_KEY, updatedCategories);
    return updatedCategories;
  }
};
