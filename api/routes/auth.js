const express = require('express');
const Users = require('../models/Users');
const crypto = require('crypto');
const router = express.Router();

router.get('/', (req, res) => {
    Users.find()
    .exec()
    .then(x => res.status(200).send(x));
});

router.get('/:id', (req, res) => {
    Users.findById(req.params.id)
        .exec()
        .then(x => res.status(200).send(x))
});

router.post('/register', (req, res) => {
    const {email, password} = req.body
    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64');

        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key) => {
            const encryptedPassword = key.toString('base64');
            Users.findOne({ email }).exec()
                .then(user => {
                    if (user) {
                        return res.send('El usuario yua existe');
                    }
                    Users.create({
                        email,
                        password: encryptedPassword,
                        salt: newSalt,
                    }).then(() => {
                        res.send('Usuario creado con exito!');
                    })
                })
        })
    })
});

router.post('/login', (req, res) => {
    res.send('soy login');
});

router.put('/:id', (req, res) => {
    Users.findOneAndUpdate(req.params.id, req.body)
        .then(() => res.sendStatus(204))
})

module.exports = router;