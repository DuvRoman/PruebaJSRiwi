import { initDashboardAdmin } from "./logicPage/initDashboardAdmin";
import { initDashboardUser } from "./logicPage/initDashboardUser";
import { initManageTasks } from "./logicPage/initManageTasks";
import { initManageUsers } from "./logicPage/initManageUsers";
import { initMyTasks } from "./logicPage/initMyTask";
import { initProfile } from "./logicPage/initPerfil";
import { createUser, getUserByEmail } from "./services/user";


const routes = {
  "/register" : "./public/views/register.html",
  "/login" : "./public/views/login.html",
  "/dashboardUser" : "./src/private/dashboardUser.html",
  "/mytask" : "./src/private/myTask.html",
  "/profile" : "./src/private/profile.html",
  "/dashboardAdmin" : "./src/private/dashboardAdmin.html",
  "/manageTasks" : "./src/private/manageTasks.html",
  "/manageUsers" : "./src/private/manageUsers.html"
  
}

const publicRoutes = ["/login","/register"]

window.addEventListener('storage', () => {
  if (!localStorage.getItem('userData')) {
    navigate('/login'); 
  }
});

window.addEventListener('DOMContentLoaded', ()=>{
  navigate(window.location.pathname);
});

window.addEventListener('popstate', () => {
  navigate(window.location.pathname);
});

function userAuthenticate(){
  const userData = localStorage.getItem('dataSession');
  return userData && JSON.parse(userData).isActive;
}

function userRol(){
  const userData = localStorage.getItem('dataSession')
  return userData && JSON.parse(userData).role; 
}

function checkSecurity(path) {
  const isLogged = userAuthenticate();
  const role = userRol();

  if (isLogged && publicRoutes.includes(path)) {
    return role === 'admin' ? '/dashboardAdmin' : '/dashboardUser';
  }

 
  if (!isLogged && !publicRoutes.includes(path)) {
    return '/login';
  }


  if (path === '/') 
    return isLogged ? (role === 'admin' ? '/dashboardAdmin' : '/dashboardUser') : '/login';

  return path; 
}



export async function navigate(route) {

  const path = checkSecurity(route || window.location.pathname);

  const link = routes[path];

  if (!link) {
    console.error("Ruta no encontrada:", path);
    return;
  }

  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }

  const resp = await fetch(link);
  const html = await resp.text();
  document.querySelector('#app').innerHTML = html;

  const viewHandlers = {
    "/register": initRegister,
    "/login": initLogin,
    "/dashboardUser": initDashboardUser,
    "/mytask" : initMyTasks,
    "/profile" : initProfile,
    "/dashboardAdmin" : initDashboardAdmin,
    "/manageTasks" : initManageTasks,
    "/manageUsers" : initManageUsers
  };

  if (viewHandlers[path]) {
    viewHandlers[path]();
  }
}

async function initRegister(){
  const btnRegister = document.getElementById('btn-register');
  const btnToLogin = document.getElementById('btn-to-login');

  btnToLogin.addEventListener('click', (e)=>{
    e.preventDefault();
    navigate('/login')

  })


  btnRegister.addEventListener('click', async (e)=>{
    const name = document.getElementById('reg-name')?.value;
    const email = document.getElementById('reg-email')?.value;
    const password = document.getElementById('reg-password')?.value;

    const newUser = {
      name : name,
      email : email,
      password : password,
      role : "user",
      isActive : true
  }

  try {
      e.preventDefault()
      const respuesta = await createUser(newUser);
      console.log(respuesta)
      navigate('/login');
  } catch (error) {
      console.error("Error al crear:", error);
  }

  })
  
}


async function initLogin(){
  const btnToRegister = document.getElementById('btn-to-register');
  const btnLogin = document.getElementById('btn-in');


  btnToRegister.addEventListener('click', (e)=>{
    e.preventDefault();
    navigate('/register')
  })

  btnLogin.addEventListener('click', async (e)=>{
    e.preventDefault()
    const email = document.getElementById('email')?.value;
    const userData = await getUserByEmail(email);
    if(userData){
     
      if(userData.email === email){
        localStorage.setItem('dataSession', JSON.stringify(userData))
        userData.role === "admin" ? navigate('/dashboardAdmin') : navigate('/dashboardUser');
      }
    }else{
      console.log("Email no encontrado, debe el usuario no tiene cuenta")
    }
  })

} 
export function setupSidebarNavigation() {
    const userData = localStorage.getItem('dataSession');
    const sidebar = document.querySelector('.sidebar-nav');
    if (!userData) return null;

    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            // Buscamos el botón más cercano que tenga la clase nav-item
            const btn = e.target.closest('.nav-item');
            
            if (!btn) return;

            // 1. Obtener la ruta del atributo data-path
            const path = btn.getAttribute('data-path');

            // 2. Cambiar la clase active visualmente
            sidebar.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 3. Navegar
            if (path) {
                navigate(path);
            }
        });
    }
    
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.clear();
            navigate('/login');
        };
    }

   

    // Configurar la "Casita" (Home)
    const btnHome = document.getElementById('go-menu');
    if (btnHome) {
        btnHome.onclick = () => navigate('/dashboardUser');
    }

     return JSON.parse(userData);
}

