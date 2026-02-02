import { setupSidebarNavigation } from "../main";
import { getTasksByUser } from "../services/task";


export async function initDashboardUser() {
    const userRaw = localStorage.getItem('dataSession');
    if (!userRaw) return navigate('/login');
    
    const currentUser = JSON.parse(userRaw);

    //Confirm the routes and add the sidebar and header.
    setupSidebarNavigation();

    // Display user data in the Header
    document.getElementById('user-name').textContent = currentUser.name;
    const avatar = document.getElementById('header-avatar');
    if (currentUser.avatar) avatar.src = currentUser.avatar;

    //  Obtain and calculate statistics
    try {
        const tasks = await getTasksByUser(currentUser.id);
        
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const completed = tasks.filter(t => t.status === 'completed').length;

        // Inject into the Dashboard counters
        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-pending').textContent = pending;
        document.getElementById('stat-completed').textContent = completed;

        // Change the page title in the header
        document.getElementById('current-page-title').textContent = "Dashboard Overview";

    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    }
}