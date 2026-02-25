document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const taskCount = document.getElementById('task-count');
    const emptyState = document.getElementById('empty-state');
    const currentDateEl = document.getElementById('current-date');

    // Initialize date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('ko-KR', options);

    let todos = JSON.parse(localStorage.getItem('premium-todos')) || [];

    function saveAndRender() {
        localStorage.setItem('premium-todos', JSON.stringify(todos));
        render();
    }

    function render() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            emptyState.classList.add('visible');
            taskCount.textContent = '0 tasks';
        } else {
            emptyState.classList.remove('visible');
            const remaining = todos.filter(t => !t.completed).length;
            taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
        }

        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="checkbox" onclick="toggleTodo(${index})">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="todo-text" onclick="toggleTodo(${index})">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${index})" aria-label="Delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveAndRender();
        }
    }

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveAndRender();
    };

    window.deleteTodo = (index) => {
        // Add a small exit animation logic if desired, but keeping it simple for now
        todos.splice(index, 1);
        saveAndRender();
    };

    addBtn.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render();
});
