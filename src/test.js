import axios from 'axios';
const axios = require('axios');


const fetchUsers = async () => {
    try {
      const response = await axios("https://jsonplaceholder.typicode.com/users");
    //   const users = await response.json();
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  fetchUsers();