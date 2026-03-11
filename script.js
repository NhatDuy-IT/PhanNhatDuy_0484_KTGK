const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTaskCount() {
  taskCount.textContent = `${todos.length} công việc`;
}

function updateClearCompletedButton() {
  const hasCompletedTodo = todos.some(todo => todo.completed);
  clearCompletedBtn.disabled = !hasCompletedTodo;
}

function getFilteredTodos() {
  if (currentFilter === 'active') {
    return todos.filter(todo => !todo.completed);
  }
  if (currentFilter === 'completed') {
    return todos.filter(todo => todo.completed);
  }
  return todos;
}

function renderTodos() {
  const filteredTodos = getFilteredTodos();
  list.innerHTML = '';

  if (filteredTodos.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filteredTodos.forEach(todo => {
    const item = document.createElement('li');
    item.className = 'todo-item';

    item.innerHTML = `
      <div class="todo-main">
        <button class="status-btn" data-id="${todo.id}">${todo.completed ? 'Hoàn tác' : 'Xong'}</button>
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
      </div>
      <button class="delete-btn" data-id="${todo.id}">Xóa</button>
    `;

    list.appendChild(item);
  });

  updateTaskCount();
  updateClearCompletedButton();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    alert('Vui lòng nhập công việc.');
    return;
  }

  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  form.reset();
  input.focus();
});

list.addEventListener('click', event => {
  const target = event.target;
  const id = Number(target.dataset.id);

  if (target.classList.contains('status-btn')) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  if (target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id !== id);
  }

  saveTodos();
  renderTodos();
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

renderTodos();