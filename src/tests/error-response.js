const axios = require('axios');

async function axiosErrorTest() {
  try {
    const response = await axios.post("http://localhost:3001/auth/refresh-token", {
      refreshToken: "foo",
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

axiosErrorTest();
