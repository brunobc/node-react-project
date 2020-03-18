import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get(`/api/users`);
    return res.data || [];
  },
  add: async (name, lastName) => {
    let res = await axios.post(`/api/user/`, { name, lastName })
    return res.data || {};
  },
  edit: async (name, lastName, id) => {
    let res = await axios.put(`/api/user/`, { name, lastName, id })
    return res.data || {};
  },
  delete: async (id) => {
    let res = await axios.delete(`/api/user/${id}`);
    return res.data || [];   
  }
}