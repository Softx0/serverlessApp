const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
//verificar si el user se encuentra autentificado

//un middleware es una funcion en node que va a recibir req y resp y next, cuando llamemos next, ejecutara este midware
const isAuthenticated = (req, res, next) => {
    let token = req.headers.authorization;
    // window.localStorage.setItem('token', token);
    if (!token) {
        res.send(403);
    }

    //cuando nosotros tengamos el usuario, modificamos el usuer 
    jwt.verify(token, 'mi-secreto', (err, decoded) => {
        const { _id } = decoded;
        Users.findOne({ _id }).exec()
            .then(user => {
                req.user = user;
                next()
            });
    });
}

const hasRoles = roles => (req, res, next) => {
    //significa que esta dentro del arreglo
    if (roles.indexOf(req.user.role > -1)) {
        return next()
    }
    res.sendStatus(403);
}

module.exports = {
    isAuthenticated,
    hasRoles,
}