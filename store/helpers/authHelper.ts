
export const authHeader = async() => {
  const token = await localStorage.getItem('token');
  const csrfToken = await localStorage.getItem('csrftoken');
  console.log(csrfToken);
  
  if(token != null){
    return { 
      'Authorization': 'Bearer ' +token, 
      'X-API-Key': token,
      'X-CSRFTOKEN': csrfToken 
    };
  } else {
    return {};
  }
};