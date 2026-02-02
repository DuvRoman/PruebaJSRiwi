
import { setupSidebarNavigation } from "../main";
import { updateUserById } from "../services/user";

export async function initProfile() {
   
    const currentUser = setupSidebarNavigation();
    if (!currentUser) return;

    const profileForm = document.getElementById('profile-form');

   
    const profName = document.getElementById('prof-name');
    const profAddress = document.getElementById('prof-address');
    const profDegree = document.getElementById('prof-degree');
    const profGroup = document.getElementById('prof-group');

    profName.value = currentUser.name || "";
    profAddress.value = currentUser.address || "";
    profDegree.value = currentUser.degree || "";
    profGroup.value = currentUser.group || "";

  
    document.getElementById('display-full-name').textContent = currentUser.name;
    document.getElementById('display-email').textContent = currentUser.email;

   
    profileForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            name: profName.value,
            address: profAddress.value,
            degree: profDegree.value,
            group: profGroup.value
        };

        try {
           
            const result = await updateUserById(currentUser.id, updatedData);

            if (result) {
              
                const newData = { ...currentUser, ...result };
                localStorage.setItem('dataSession', JSON.stringify(newData));

                alert("Profile updated successfully! ✨");
                
               
                window.location.reload();
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar el perfil. Revisa la consola.");
        }
    };
}
