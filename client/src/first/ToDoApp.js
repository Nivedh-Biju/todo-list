import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [theme, setTheme] = useState('light'); // State to manage theme
  const [fontSize, setFontSize] = useState(16); // State to manage font size
  const [language, setLanguage] = useState('en-US'); // State to manage language

  // Translations object
  const translations = {
    'en-US': {
      title: 'To-Do List',
      switchTheme: 'Switch between dark mode and light mode',
      switchToDark: 'Switch to Dark Mode',
      switchToLight: 'Switch to Light Mode',
      increaseFontSize: 'Increase font size',
      decreaseFontSize: 'Decrease font size',
      languageLabel: 'Language: ',
      addTask: 'Add new task',
      newTaskPlaceholder: 'New Task',
      completeTask: 'Mark task as complete',
      incompleteTask: 'Mark task as incomplete',
      deleteTask: 'Delete task',
    },
    'es-ES': {
      title: 'Lista de Tareas',
      switchTheme: 'Cambiar entre modo oscuro y modo claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchToLight: 'Cambiar a modo claro',
      increaseFontSize: 'Aumentar el tamaño de la fuente',
      decreaseFontSize: 'Disminuir el tamaño de la fuente',
      languageLabel: 'Idioma: ',
      addTask: 'Agregar nueva tarea',
      newTaskPlaceholder: 'Nueva tarea',
      completeTask: 'Marcar la tarea como completa',
      incompleteTask: 'Marcar la tarea como incompleta',
      deleteTask: 'Eliminar tarea',
    },
    'fr-FR': {
      title: 'Liste de Tâches',
      switchTheme: 'Basculer entre mode sombre et mode clair',
      switchToDark: 'Passer en mode sombre',
      switchToLight: 'Passer en mode clair',
      increaseFontSize: 'Augmenter la taille de la police',
      decreaseFontSize: 'Diminuer la taille de la police',
      languageLabel: 'Langue: ',
      addTask: 'Ajouter une nouvelle tâche',
      newTaskPlaceholder: 'Nouvelle tâche',
      completeTask: 'Marquer la tâche comme terminée',
      incompleteTask: 'Marquer la tâche comme incomplète',
      deleteTask: 'Supprimer la tâche',
    },
    // Add more translations here
  };

  // Fetch tasks from the server
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTask.trim()) {
      axios.post('http://localhost:5000/tasks', { title: newTask })
        .then(res => setTasks([...tasks, res.data]))
        .catch(err => console.error(err));
      setNewTask('');
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (task) => {
    axios.put(`http://localhost:5000/tasks/${task._id}`, { completed: !task.completed })
      .then(res => {
        const updatedTasks = tasks.map(t => t._id === res.data._id ? res.data : t);
        setTasks(updatedTasks);
      })
      .catch(err => console.error(err));
  };

  // Delete a task
  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/tasks/${taskId}`)
      .then(() => setTasks(tasks.filter(task => task._id !== taskId)))
      .catch(err => console.error(err));
  };

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Increase font size
  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24)); // Max font size: 24px
  };

  // Decrease font size
  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12)); // Min font size: 12px
  };

  // Function to handle speech synthesis with language support
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language; // Set the selected language
    window.speechSynthesis.speak(speech);
  };

  // Stop speaking when hover ends
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const t = translations[language]; // Get current language translations

  return (
    <div className={`container ${theme}`} style={{ fontSize: `${fontSize}px` }}>
      <h1 className='text_heading'>{t.title}</h1>

      <div className='controls'>
        <button 
          onClick={toggleTheme} 
          className='theme_toggle'
          onMouseEnter={() => speak(t.switchTheme)}  // Speak description on hover
          onMouseLeave={stopSpeaking}  // Stop speaking when hover ends
        >
          {theme === 'light' ? t.switchToDark : t.switchToLight}
        </button>

        <button 
          onClick={increaseFontSize} 
          className='font_button'
          onMouseEnter={() => speak(t.increaseFontSize)}  // Speak description on hover
          onMouseLeave={stopSpeaking}
        >
          A+
        </button>
        <button 
          onClick={decreaseFontSize} 
          className='font_button'
          onMouseEnter={() => speak(t.decreaseFontSize)}  // Speak description on hover
          onMouseLeave={stopSpeaking}
        >
          A-
        </button>

        <div className='language_select'>
          <label htmlFor="language" onMouseEnter={() => speak(t.languageLabel)} onMouseLeave={stopSpeaking}>{t.languageLabel}</label>
          <select 
            id="language" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            onMouseEnter={() => speak(t.languageLabel)} 
            onMouseLeave={stopSpeaking}
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español (ES)</option>
            <option value="fr-FR">Français (FR)</option>
            {/* Add more languages here */}
          </select>
        </div>
      </div>

      <div className='input_space'>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t.newTaskPlaceholder}
          className='text_input'
          onMouseEnter={() => speak(t.newTaskPlaceholder)}  // Speak description on hover
          onMouseLeave={stopSpeaking}
        />
        <button 
          onClick={addTask} 
          className='input_button'
          onMouseEnter={() => speak(t.addTask)}  // Speak description on hover
          onMouseLeave={stopSpeaking}
        >
          +
        </button>
      </div>

      <ul className='tasks_list'>
        {tasks.map(task => (
          <li 
            key={task._id} 
            style={{ textDecoration: task.completed ? 'line-through' : '' }} 
            className='task_element'
            onMouseEnter={() => speak(task.title)}  // Start speaking task on hover
            onMouseLeave={stopSpeaking}  // Stop speaking when hover ends
          >
            <p className='task_title' style={{ fontSize: `${fontSize}px` }}>
              {task.title}
            </p>

            <button 
              onClick={() => toggleTaskCompletion(task)} 
              className='task_button1'
              onMouseEnter={() => speak(task.completed ? t.incompleteTask : t.completeTask)}  // Speak description on hover
              onMouseLeave={stopSpeaking}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button 
              onClick={() => deleteTask(task._id)} 
              className='task_button2'
              onMouseEnter={() => speak(t.deleteTask)}  // Speak description on hover
              onMouseLeave={stopSpeaking}
            >
              {t.deleteTask}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp
