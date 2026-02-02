import { setupSidebarNavigation } from "../main";
import { deleteTask, getTasks, updateTask } from "../services/task";
import { getUser } from "../services/user";



export async function initManageTasks() {
    const currentAdmin = setupSidebarNavigation();
    if (!currentAdmin) return;

    let allTasks = [];
    let allUsers = [];

    const refreshGlobalTasks = async () => {
        [allTasks, allUsers] = await Promise.all([getTasks(), getUser()]);
        renderAdminTable(allTasks);
    };

    function renderAdminTable(tasks) {
        const tbody = document.getElementById('admin-tasks-table-body');
        tbody.innerHTML = tasks.map(task => {
            const owner = allUsers.find(u => u.id == task.userId);
            return `
                <tr>
                    <td><strong>${task.title}</strong></td>
                    <td><span class="user-pill">${owner ? owner.name : 'Unknown'}</span></td>
                    <td><button class="status-badge ${task.status}" data-id="${task.id}">${task.status}</button></td>
                    <td><span class="badge priority-${task.priority}">${task.priority}</span></td>
                    <td>${task.dueDate}</td>
                    <td class="actions-cell">
                        <button class="btn-delete" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }


    document.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        
        if (e.target.classList.contains('status-badge')) {
            const task = allTasks.find(t => t.id == id);
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await updateTask(id, { status: newStatus });
            refreshGlobalTasks();
        }

        if (e.target.closest('.btn-delete')) {
            if(confirm("¿Eliminar tarea permanentemente?")) {
                await deleteTask(e.target.closest('.btn-delete').dataset.id);
                refreshGlobalTasks();
            }
        }
    });

    refreshGlobalTasks();
}