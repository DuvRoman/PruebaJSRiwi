

export const getTasksByUser = async (userId)=>{
    try {
        const data = await fetch(`http://localhost:3001/task?userId=${userId}`)
        const response = await data.json();
        return response
    } catch (error) {
        console.log("Tipo de error: " , error)
        
    }
}

export const createTask = async (newTask) =>{
try {
    const data = await fetch("http://localhost:3001/task",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(newTask)
    });
    const response = await data.json()
    return response
    
} catch (error) {
    console.log ("Tipo de error : ", error)
    
}

}

export async function updateTask(id, data) {
    try {
        const url = await fetch(`http://localhost:3001/task/${id}`,{
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

export const deleteTask = async (id) => {

    try {
        const res = await fetch(`http://localhost:3001/task/${id}`, {
        method: 'DELETE'
    });
    return await res.json();
         
    } catch (error) {
        console.log("Tipo de error :", error)
    }
   
};