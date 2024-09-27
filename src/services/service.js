import axios from 'axios';

const URL_API = 'http://localhost:3000/users'; 

export const service = {
  getAllTasks: () => {
    return axios.get(URL_API)
      .then(res => res.data) 
      .catch(err => {
        console.error("Error fetching tasks:", err);
        throw err; 
      });
  },

  createTask: (task) => {
    return axios.post(URL_API, task)
      .then(res => res.data) 
      .catch(err => {
        console.error("Error creating task:", err)
      });
  },

  updateTask: (updateTask) => {
    return axios.put(`${URL_API}/${updateTask.id}`, updateTask)
      .then(res => res.data) 
      .catch(err => {
        console.error("Error updating task:", err);
        throw err; 
      });
  },

  deleteTask: (id) => {
    return axios.delete(`${URL_API}/${id}`)
      .then(() => id) 
      .catch(err => {
        console.error("Error deleting task:", err);
        throw err; 
      });
  }
};
