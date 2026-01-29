import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, CheckCircle, Circle, MapPin, Clock, Tag, X } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { AgendaService } from '@/services/AgendaService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import DayEventsModal from '@/components/DayEventsModal';

const AgendaPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    date: '',
    time: '',
    reminder: false,
    categoryId: 'culto'
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEvents(AgendaService.getEvents());
    setCategories(AgendaService.getCategories());
  };

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    // Format date for input: YYYY-MM-DD
    const dateString = clickedDate.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: dateString }));
    setShowDayModal(true);
  };

  const handleCreateEvent = () => {
    if (!formData.name || !formData.date) {
      toast({ title: "Erro", description: "Nome e data são obrigatórios", variant: "destructive" });
      return;
    }

    AgendaService.saveEvent(formData);
    setShowModal(false);
    refreshData();
    setFormData({ name: '', theme: '', date: '', time: '', reminder: false, categoryId: 'culto' });
    toast({ title: "Sucesso", description: "Evento criado com sucesso" });
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const colors = ['bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-yellow-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    AgendaService.addCategory({ name: newCategoryName, color: randomColor });
    setNewCategoryName('');
    setShowCategoryInput(false);
    refreshData();
    toast({ title: "Categoria criada", description: "Nova categoria adicionada" });
  };

  const handleToggleComplete = (id) => {
    AgendaService.toggleComplete(id);
    refreshData();
  };

  const handleDeleteEvent = (id) => {
    AgendaService.deleteEvent(id);
    refreshData();
    toast({ title: "Deletado", description: "Evento removido" });
  };

  const getDayEvents = (date) => {
    return events.filter(e => {
      const eDate = new Date(e.date);
      const eDateStr = eDate.toISOString().split('T')[0];
      const cDateStr = date.toISOString().split('T')[0];
      return eDateStr === cDateStr;
    });
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);

    // Empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-24" />);
    }

    // Days of month
    for (let i = 1; i <= totalDays; i++) {
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === currentDate.getMonth();
      const isToday = new Date().toDateString() === dateToCheck.toDateString();
      const dayEvents = getDayEvents(dateToCheck);

      days.push(
        <div 
          key={i} 
          onClick={() => handleDateClick(i)}
          className={`h-10 md:h-24 border border-gray-100 dark:border-gray-800 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center justify-start pt-1 md:pt-2 rounded-lg ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
          <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
            {i}
          </span>
          <div className="flex gap-1 mt-1 flex-wrap justify-center px-1">
            {dayEvents.map((evt, idx) => {
              const cat = categories.find(c => c.id === evt.categoryId) || categories[0];
              return (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full ${cat.color}`} 
                  title={evt.name}
                />
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  // Filter events for list view (selected date onwards or all month?) -> Design says "chronological list below". Let's show selected date events first, then upcoming.
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));

  return (
    <>
      <Helmet><title>Agenda - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 pt-8 pb-24 px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <CalendarIcon className="w-8 h-8" /> Agenda
              </h1>
              <Button onClick={() => setShowModal(true)} className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="w-5 h-5 mr-1" /> Novo
              </Button>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-6">
            {/* Calendar Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </motion.div>

            {/* Events List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pl-1">Próximos Eventos</h3>
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum evento agendado.</p>
                ) : (
                  upcomingEvents.map(event => {
                    const category = categories.find(c => c.id === event.categoryId) || categories[0];
                    return (
                      <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${category.color}`} />
                        <button onClick={() => handleToggleComplete(event.id)} className="ml-2 text-gray-400 hover:text-green-500 transition-colors">
                          {event.completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`font-bold text-lg ${event.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                              {event.name}
                            </h4>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          {event.theme && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{event.theme}</p>}
                          <div className="flex gap-3 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time || 'Dia todo'}</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {category.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* Create Modal */}
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 bg-blue-600 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Novo Evento</h3>
                    <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Evento</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        placeholder="Ex: Culto da Vitória"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</label>
                      <input 
                        type="text" 
                        value={formData.theme}
                        onChange={e => setFormData({...formData, theme: e.target.value})}
                        className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        placeholder="Opcional"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                        <input 
                          type="date" 
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Horário</label>
                        <input 
                          type="time" 
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Categoria</label>
                      <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setFormData({...formData, categoryId: cat.id})}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                              formData.categoryId === cat.id 
                                ? `border-${cat.color.split('-')[1]}-500 bg-${cat.color.split('-')[1]}-50 text-gray-900` 
                                : 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                        <button 
                          onClick={() => setShowCategoryInput(!showCategoryInput)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
                        >
                          + Criar
                        </button>
                      </div>
                      
                      {showCategoryInput && (
                        <div className="mt-2 flex gap-2">
                          <input 
                            type="text" 
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="Nome da categoria"
                            className="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                          />
                          <Button size="sm" onClick={handleAddCategory}>OK</Button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button onClick={handleCreateEvent} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Criar Evento
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <DayEventsModal 
            isOpen={showDayModal}
            onClose={() => setShowDayModal(false)}
            date={selectedDate}
            events={getDayEvents(selectedDate)}
            categories={categories}
            onEdit={(id) => console.log('Edit', id)}
            onDelete={handleDeleteEvent}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </MainLayout>
    </>
  );
};

export default AgendaPage;
