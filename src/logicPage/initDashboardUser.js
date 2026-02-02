import { setupSidebarNavigation } from "../main";
import { getTasksByUser } from "../services/task";


export async function initDashboardUser() {
    const userRaw = localStorage.getItem('dataSession');
    if (!userRaw) return navigate('/login');
    
    const currentUser = JSON.parse(userRaw);

    // 1. Activar los clics del Sidebar y Header
    setupSidebarNavigation();

    // 2. Pintar datos del usuario en el Header
    document.getElementById('user-name').textContent = currentUser.name;
    const avatar = document.getElementById('header-avatar');
    if (currentUser.avatar) avatar.src = currentUser.avatar;

    // 3. Obtener y calcular estadísticas
    try {
        const tasks = await getTasksByUser(currentUser.id);
        
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const completed = tasks.filter(t => t.status === 'completed').length;

        // 4. Inyectar en los contadores del Dashboard
        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-pending').textContent = pending;
        document.getElementById('stat-completed').textContent = completed;

        // Cambiar el título de la página en el header
        document.getElementById('current-page-title').textContent = "Dashboard Overview";

    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    }
}