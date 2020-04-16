var email = document.getElementById('email')
var boton = document.getElementById('boton')

boton.addEventListener('click', () => {
    axios.post('/api/signin',
    {
    email: email.value
    }).then((resp) => {
        const {mensaje, password} = resp.data;
        Swal.fire({title:`${mensaje} y tu contraseña es ${password}`})
    })
})