const express = require('express');
const Users = require('../models/Users');
const crypto = require('crypto');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../auth/');

const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365,
    })
};

router.get('/me', isAuthenticated, (req, res) => {
    res.send(req.user);
});

router.get('/:id', (req, res) => {
    Users.findById(req.params.id)
        .exec()
        .then(x => res.status(200).send(x))
});

router.post('/register', (req, res) => {
    const { email, password } = req.body
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
    const { email, password } = req.body;
    Users.findOne({ email }).exec()
        .then(user => {
            if (!user) {
                return res.send('Usuario y/o contraseña incorrecta');
            }
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const encryptedPassword = key.toString('base64');

                if (user.password === encryptedPassword) {
                    const token = signToken(user._id);

                    return res.send({ token }) 
                }
                return res.send('Usuario y/o contraseña incorrectos');
            })
        })
});

router.put('/:id', (req, res) => {
    Users.findOneAndUpdate(req.params.id, req.body)
        .then(() => res.sendStatus(204))
})

module.exports = router;