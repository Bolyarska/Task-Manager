import { useState } from "react";

// The UI will have:

//     Header: "Task Manager"
//     Input: Text box to add a new task and a button labeled "Add Task."
//     Task List: A scrollable list of tasks with each task having:
//         Title
//         A button to mark as complete/incomplete.
//         Completed tasks appear crossed out.
//     Filters: Buttons at the bottom to filter tasks:
//         All
//         Completed
//         Incomplete

const initialTasks = [
  {
    id: 1,
    title: "Buy groceries",
    completed: false,
  },
  {
    id: 2,
    title: "Call Mom",
    completed: true,
  },
  {
    id: 3,
    title: "Finish project report",
    completed: false,
  },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [filter, setFilter] = useState("all"); // New filter state

  function handleShowTaskForm() {
    setOpenTaskForm((open) => !open);
  }

  function AddTask(newTask) {
    setTasks((tasks) => [...tasks, newTask]);
    setOpenTaskForm(false);
  }

  function handleComplete(taskId) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleRemove(taskId) {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  function handleClearAll() {
    setTasks([]);
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className={`container ${openTaskForm ? "shift" : ""}`}>
      <div className="app">
        <h1 style={{ textAlign: "center" }}>Task Manager</h1>

        <div style={{ textAlign: "right" }}>
          <Button onClick={handleShowTaskForm}>Add New Task</Button>
        </div>

        <TaskList
          tasks={filteredTasks} // Use filtered tasks
          onComplete={handleComplete}
          onRemove={handleRemove}
        />
        <div className="buttons">
          <Button onClick={() => handleFilterChange("completed")}>
            Complete
          </Button>
          <Button onClick={() => handleFilterChange("incomplete")}>
            Incomplete
          </Button>
          <Button onClick={() => handleFilterChange("all")}>See All</Button>
          <button className="clear-all-button" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>

      {<AddTaskForm onAddTask={AddTask} show={openTaskForm} />}
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function StatusButton({ onClick, children }) {
  return (
    <button type="button" className="status-button" onClick={onClick}>
      {children}
    </button>
  );
}

function TaskList({ tasks, onComplete, onRemove }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <Task
          task={task}
          onComplete={onComplete}
          onRemove={onRemove}
          key={task.id}
        />
      ))}
    </ul>
  );
}

function Task({ onComplete, onRemove, task }) {
  return (
    <li className="task-item">
      <h3 className={`${task.completed ? "completed" : ""}`}>{task.title}</h3>
      <span className="buttons">
        <StatusButton onClick={() => onComplete(task.id)}>
          {task.completed ? "✅" : "⬜"}
        </StatusButton>
        <StatusButton onClick={() => onRemove(task.id)}>❌</StatusButton>
      </span>
    </li>
  );
}

function AddTaskForm({ onAddTask, show }) {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  function handleAddAsComplete() {
    setCompleted((completed) => !completed);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title) return;

    const id = crypto.randomUUID();
    const newTask = { title, completed, id };

    onAddTask(newTask);

    setTitle("");
    setCompleted(false);
  }

  return (
    <form className={show ? "show" : ""} onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>

      <StatusButton onClick={handleAddAsComplete}>
        {completed ? "✅" : "⬜"}
      </StatusButton>

      <Button type="submit">Add</Button>
    </form>
  );
}
