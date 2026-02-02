import { setupSidebarNavigation } from "../main";
import { createTask, deleteTask, getTasksByUser, updateTask } from "../services/task";


export async function initMyTasks() {
    // 🛡️ 1. Seguridad y Componentes Compartidos
    // Asumimos que setupSidebarNavigation retorna el usuario de la sesión
    const currentUser = setupSidebarNavigation();
    if (!currentUser) return;

    // Variables de Elementos del DOM
    const modal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('task-search');
    const priorityFilter = document.getElementById('filter-priority-select');
    
    let editingTaskId = null;
    let allTasks = [];

    // --- FUNCIONES DE APOYO ---

    const closeModal = () => {
        modal.classList.remove('active');
        editingTaskId = null;
        taskForm.reset();
    };

    const refreshData = async () => {
        allTasks = await getTasksByUser(currentUser.id);
        renderTable(allTasks, currentUser.name);
        updateMiniStats(allTasks);
    };

    function updateMiniStats(tasks) {
        document.getElementById('table-total').textContent = tasks.length;
        const highPriority = tasks.filter(t => t.priority === 'high').length;
        document.getElementById('table-high-count').textContent = highPriority;
    }

    // --- DELEGACIÓN DE EVENTOS (Soluciona botones que no funcionan) ---
    // Usamos el document para escuchar clics en elementos dinámicos
    document.addEventListener('click', async (e) => {
        
        // 1. Abrir modal para NUEVA tarea
        if (e.target.closest('#btn-open-modal')) {
            editingTaskId = null;
            taskForm.reset();
            modalTitle.textContent = "Create New Task";
            modal.classList.add('active');
        }

        // 2. Cerrar modal (Botón X o Cancelar)
        if (e.target.closest('#close-modal') || e.target.closest('#btn-cancel')) {
            closeModal();
        }

        // 3. Botón ELIMINAR
        if (e.target.closest('.btn-delete')) {
            const id = e.target.closest('.btn-delete').dataset.id;
            if (confirm("Are you sure you want to delete this task?")) {
                await deleteTask(id);
                await refreshData();
            }
        }

        // 4. Botón EDITAR
       if (e.target.closest('.btn-edit')) {
            const id = e.target.closest('.btn-edit').dataset.id;
            const task = allTasks.find(t => t.id == id);
            if (task) {
                editingTaskId = id;
                document.getElementById('modal-title').textContent = "Edit Task";
                document.getElementById('task-name').value = task.title;
                document.getElementById('task-priority-modal').value = task.priority;
                document.getElementById('task-date-modal').value = task.dueDate;
        
        document.getElementById('task-status-modal').value = task.status; 
        
        modal.classList.add('active');
    }
}
    });

    // Cerrar al hacer clic fuera del modal
    window.onclick = (e) => { if (e.target === modal) closeModal(); };

    // --- BUSCADOR Y FILTROS ---
    const handleFilter = () => {
        const searchText = searchInput.value.toLowerCase();
        const priorityValue = priorityFilter.value;

        const filtered = allTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText);
            const matchesPriority = priorityValue === 'all' || task.priority === priorityValue;
            return matchesSearch && matchesPriority;
        });
        renderTable(filtered, currentUser.name);
    };

    if (searchInput) searchInput.oninput = handleFilter;
    if (priorityFilter) priorityFilter.onchange = handleFilter;

    // --- MANEJO DEL FORMULARIO ---
    taskForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const taskData = {
            userId: currentUser.id,
            title: document.getElementById('task-name').value,
            priority: document.getElementById('task-priority-modal').value,
            dueDate: document.getElementById('task-date-modal').value,
            status: document.getElementById('task-status-modal').value
        };

        if (editingTaskId) {
            await updateTask(editingTaskId, taskData);
        } else {
            await createTask(taskData);
        }

        closeModal();
        await refreshData();
    };

    // --- CARGA INICIAL ---
    document.getElementById('current-page-title').textContent = "My Assignments";
    await refreshData();
}

// Función de renderizado movida fuera o mantenida interna
function renderTable(tasks, userName) {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td><strong>${task.title}</strong></td>
            <td>${userName}</td>
            <td>
                <span class="status-${task.status}">
                    ${task.status === 'completed' ? '✓ Completed' : '... Pending'}
                </span>
            </td>
            <td>
                <span class="badge priority-${task.priority}">${task.priority}</span>
            </td>
            <td>${task.dueDate}</td>
            <td class="actions-cell">
                <button class="btn-edit" data-id="${task.id}">
                    <i class="fas fa-edit">📝</i>
                </button>
                <button class="btn-delete" data-id="${task.id}">
                    <i class="fas fa-trash">❌</i>
                </button>
            </td>
        </tr>
    `).join('');
}