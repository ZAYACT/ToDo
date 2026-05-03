import { useState, useEffect } from 'react'
import Todo from './components/Todo'
import FilterButton from './components/FilterButton'
import Form from './components/Form'
import './App.css'

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP)

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todoApp_tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('todoApp_tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (name) => {
    const newTask = {
      id: Date.now(),
      name: name,
      completed: false
    }
    setTasks([...tasks, newTask])
  }

  const toggleTaskCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const editTask = (id, newName) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, name: newName } : task
    ))
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ))

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const headingText = `${taskList.length} ${tasksNoun} remaining`

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  )
}

export default App