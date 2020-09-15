const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();


        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }



}

const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        let hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) { return res.status(404).json({ ok: false, msg: 'No se encuenta el hospital seleccionado' }) }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        let hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { useFindAndModify: false, new: true });


        res.json({
            ok: true,
            hospital: hospitalActualizado
        })
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error actualizando el hospital'
        })
    }
}

const borrarHospital = async (req, res = response) => {
    
    const id = req.params.id;

    try {

        let hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) { return res.status(404).json({ ok: false, msg: 'No se encuenta el hospital seleccionado' }) }


        await Hospital.findByIdAndDelete(id);


        res.json({
            ok: true,
            msg:'Se eliminó correctamente el hospital'
        })
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error eliminando el hospital'
        })
    }
}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}