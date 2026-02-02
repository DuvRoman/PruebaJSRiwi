import { setupSidebarNavigation } from "../main";
import { getTasks } from "../services/task";
import { getUser } from "../services/user";


export async function initDashboardAdmin() {
    //Routes confirm for logic 
    const currentAdmin = setupSidebarNavigation();
    if (!currentAdmin) return;

    const loadMetrics = async () => {
        try {
            // service used
            const tasks = await getTasks();
            const users = await getUser();

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'completed').length;
            const pendingTasks = totalTasks - completedTasks;
            const activeUsers = users.length;

            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            // Metric show
            document.getElementById('stat-total-tasks').textContent = totalTasks;
            document.getElementById('stat-pending-tasks').textContent = pendingTasks;
            document.getElementById('stat-completed-tasks').textContent = completedTasks;
            document.getElementById('stat-active-users').textContent = activeUsers;
            
            document.getElementById('completion-bar').style.width = `${completionRate}%`;
            document.getElementById('completion-percent').textContent = `${completionRate}%`;

        } catch (error) {
            console.error("Error en métricas:", error);
        }
    };

    loadMetrics();
}