// Asumiendo que así se llama tu archivo de servicios

import { setupSidebarNavigation } from "../main";
import { updateUserById } from "../services/user";

export async function initProfile() {
   
    const currentUser = setupSidebarNavigation();
    if (!currentUser) return;

    const profileForm = document.getElementById('profile-form');

    // 1. Llenar los campos con lo que ya existe en el objeto currentUser
    const profName = document.getElementById('prof-name');
    const profAddress = document.getElementById('prof-address');
    const profDegree = document.getElementById('prof-degree');
    const profGroup = document.getElementById('prof-group');

    profName.value = currentUser.name || "";
    profAddress.value = currentUser.address || "";
    profDegree.value = currentUser.degree || "";
    profGroup.value = currentUser.group || "";

    // Actualizar encabezados visuales
    document.getElementById('display-full-name').textContent = currentUser.name;
    document.getElementById('display-email').textContent = currentUser.email;

    // 2. Manejo del Envío
    profileForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            name: profName.value,
            address: profAddress.value,
            degree: profDegree.value,
            group: profGroup.value
        };

        try {
            // Llamada al servicio con el ID y el objeto nuevo
            const result = await updateUserById(currentUser.id, updatedData);

            if (result) {
                // Actualizamos el LocalStorage para que el Header refleje el cambio de nombre
                const newData = { ...currentUser, ...result };
                localStorage.setItem('dataSession', JSON.stringify(newData));

                alert("Profile updated successfully! ✨");
                
                // Redirigimos o refrescamos para que el Header se actualice
                window.location.reload();
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar el perfil. Revisa la consola.");
        }
    };
}
