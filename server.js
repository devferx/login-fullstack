const express  = require('express');
const Mongodb  = require('./lib/mongodb');

const server = express();

server.use(express.json());

server.use('/login', express.static('login'));
server.use('/registro', express.static('registro'));

const mongo = new Mongodb();

server.post('/api/login',async (req,res) => {
    const {email, password} = req.body;
    const resultado = await mongo.getAll('users', {email : email})
    const [primero] = resultado;
    if(primero) {
        if(password === primero.password ){
            res.json({
                usuario: primero,
                mensaje: 'Iniciaste sesion correctamente'
            })
        }else {
                res.json({
                    mensaje: 'Datos Incorrectos vuelve a intentarlo'
                })
            }
        } else {
            res.json({
                mensaje: 'Datos Incorrectos vuelve a intentarlo'
            })
    }
})


server.post('/api/signin', async (req,res) => {
    const {email} = req.body;
    const resultado = await mongo.getAll('users', {email : email})
    const [primero] = resultado;
    if  (primero) {
        res.json({
            mensaje: 'existe el usuario',
            password: 'ninguna'
        })
    }else {
        const password = Math.round(Math.random() * 100000);
        const results = await mongo.create('users', {email, password})
        res.json({mensaje: 'Usuario creado', usuario: results, password})
    }
})

server.listen(3000, () => {
    console.log('El servidor esta listo en http://localhost:3000')
})