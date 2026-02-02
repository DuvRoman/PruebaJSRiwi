
export const createUser = async (user)=>{
    try {
        const data = await fetch("http://localhost:3001/users",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(user)
    })
    const response = await data.json();
    return response;
        
    } catch (error) {
        console.log("Tipo de error: ", error)
    }
    
}

export const getUser = async ()=>{
    try {
        const data = await fetch("http://localhost:3001/users");
        const response = await data.json();
        return response
    } catch (error) {
        console.log("Tipo de error: ", error) 
    }
};


export const promoteUserToAdmin = async (userId) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
    });
    return await res.json();
};

export const getUserByEmail = async (email) => {
    try {
        const data = await fetch(`http://localhost:3001/users?email=${email}`);

        if (!data.ok) {
            if (data.status === 404) {
                console.warn("Usuario no encontrado (404)");
                return null; 
            }
            throw new Error(`Error en el servidor: ${data.status}`);
        }
        const response = await data.json();
        return response.length > 0 ? response[0] : null;

    } catch (error) {
     
        console.error("Tipo de Error: ", error.message);
        return null; 
    }
};

export async function updateUserById(id, data) {
    try {
        const url = await fetch(`http://localhost:3001/users/${id}`,{
            method : "PATCH",
            headers :{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        });
        const response = await url.json();
        return response
        
    } catch (error) {
        console.log("Tipo de error : ", error)
    }
    
}

export const deleteUserById = async (userId) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE'
    });
    return true;
};