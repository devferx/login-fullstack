var email = document.getElementById('email')
var password = document.getElementById('password')
var boton = document.getElementById('boton')

boton.addEventListener('click', () => {
    axios.post('/api/login',
    {
    email: email.value,
    password:Number(password.value)
    }).then((resp) => {
        const {data} = resp;
        Swal.fire({title: data.mensaje})
    })
})