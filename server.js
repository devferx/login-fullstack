const express  = require('express');
const Mongodb  = require('./lib/mongodb');

const server = express();

let conectado = false;

server.use(express.json());

server.use('/login', express.static('login'));
server.use('/registro', express.static('registro'));
server.use('/home', express.static('home'));

const mongo = new Mongodb();


server.post('/api/login',async (req,res) => {
    const {email, password} = req.body;
    try {
        const resultado = await mongo.getAll('users', { email: email })
        const [primero] = resultado;
        if(!conectado) {
            if (primero) {
                if (password === primero.password) {
                    conectado = true;
                    res.json({
                        usuario: primero,
                        mensaje: 'Iniciaste sesion correctamente',
                        existoso: true,
                        conectado
                    })
                } else {
                    res.json({
                        mensaje: 'Datos Incorrectos vuelve a intentarlo',
                        existoso: false,
                    })
                }
            } else {
                res.json({
                    mensaje: 'Datos Incorrectos vuelve a intentarlo',
                    existoso: false
                })
            }
        }else {
            res.json({
                mensaje: 'Ya alguien esta conectado',
                existoso: false
            })
        }
    } catch (err) {
        console.log(err)
    }
})

server.get('/api/logout', (req,res) => {
    conectado  = false;
    res.json({
        existoso: true
    })
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