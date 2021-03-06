const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const { verifyGoogleSignIn } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);


        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const googleSignIn = async (req, res = response) => {

    const tokenGoogle = req.body.token

    try {
        const { name, email, picture } = await verifyGoogleSignIn(tokenGoogle);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario

        if (!usuarioDB) {
            // Si no existe
            usuario = new Usuario({ nombre: name, email, password: '@@@', img: picture, google: true });
        }
        else {
            usuario = usuarioDB;
            usuario.password = '@@@';
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            msg: 'Google Sign In',
            token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token de Google no valido'

        })
    }
}

const renewJWT = async (req,res=response) =>{

    const uid = req.uid;

    const token = await generarJWT(uid);

    res.json({
        ok:true,
        token
    })
}


module.exports = {
    login,
    googleSignIn,
    renewJWT
}
