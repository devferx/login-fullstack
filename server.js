const express  = require('express');
const Mongodb  = require('./lib/mongodb');

const server = express();

let conectado = false;

server.use(express.json());

server.use('/login', express.static('login'));
server.use('/registro', express.static('registro'));
server.use('/home', express.static('home'));

const mongo = new Mongodb();


async function searchUser(email) {
    resultados = await mongo.getAll('users', { email: email })
    return resultados;
}

server.post('/api/login',async (req,res) => {
    const {email, password} = req.body;
    try {
        const resultados = await searchUser(email);
        const [primero] = resultados;
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

server.get('/api/getAllUsers', async (req,res)  => {
    const resultados =await mongo.getAll('users', {})
    res.json({
        resultados
    })
})

server.delete('/api/deleteUser/:userId', async(req,res) => {
    const {userId} = req.params;
    try {
        const resultado = await mongo.delete('users', userId);
        res.json({
            ok: true,
            resultado
        })
    } catch (error) {
        res.json({
            ok: false
        })
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
            mensaje: 'ya existe el usuario',
        })
    }else{
        const password = Math.round(Math.random() * 100000);
        const results = await mongo.create('users', {email, password})
        res.json({ mensaje: `Usuario creado, la contraseña es:  ${password}`, usuario: results, password})
    }
})

server.listen(3000, () => {
    console.log('El servidor esta listo en http://localhost:3000')
})