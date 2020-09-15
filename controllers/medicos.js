const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')


    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) { return res.status(404).json({ ok: false, msg: 'No se encuenta el medico seleccionado' }) }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        let medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true, useFindAndModify: false });


        res.json({
            ok: true,
            msg: 'Se actualizó correctamente el medico',
            medico: medicoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id

    try {

        let medicoDB = await Medico.findById(id);

        if (!medicoDB) { return res.status(404).json({ ok: false, msg: 'No se encuenta el medico seleccionado' }) }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Se eliminó correctamente el medico'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}