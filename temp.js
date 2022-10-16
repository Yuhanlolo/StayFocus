
                    let dataToSave = {
                      id: user.uid,
                      email: user.email,
                      password: password,
                    };
                    database()
                       .ref('users/' + id)
                       .update(dataToSave)
                       .then(snapshot => {console.log('Data updated');})
                       .catch(error=>{console.error(error);});
