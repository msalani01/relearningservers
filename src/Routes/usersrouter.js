const express = require('express');
const { Router } = require('express'); // Importa el objeto Router desde express
const { userModel } = require('../../dao/models/user.model'); // Ajusta la importación usando require

const router = Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.log("cannot get users with mongoose: " + error);
    }
});

module.exports = router; // Asegúrate de exportar el objeto router, no usersrouter
