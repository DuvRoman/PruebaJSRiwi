import { setupSidebarNavigation } from "../main";
import { getUser, updateUserById } from "../services/user";



export async function initManageUsers() {
    //Routes confirm for logic 
    const currentAdmin = setupSidebarNavigation();
    if (!currentAdmin) return;

    const refreshUsers = async () => {
        const users = await getUser();
        renderUsersTable(users);
    };

    //Render table
    function renderUsersTable(users) {
        const tbody = document.getElementById('admin-users-table-body');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td>${user.degree || 'N/A'} - ${user.group || 'N/A'}</td>
                <td>
                    <button class="btn-primary btn-sm btn-change-role" data-id="${user.id}" data-role="${user.role}">
                        Switch to ${user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    //Click target
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-change-role')) {
            const id = e.target.dataset.id;
            const newRole = e.target.dataset.role === 'admin' ? 'user' : 'admin';

            if(confirm(`¿Cambiar rango a ${newRole}?`)) {
                await updateUserById(id, { role: newRole });
                refreshUsers();
            }
        }
    });

    refreshUsers();
}