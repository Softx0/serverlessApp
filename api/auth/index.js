const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
//verificar si el user se encuentra autentificado

//un middleware es una funcion en node que va a recibir req y resp y next, cuando llamemos next, ejecutara este midware
module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token){
        res.send(403);
    }

    //cuando nosotros tengamos el usuario, modificamos el usuer 
    jwt.verify(token, 'mi-secreto', (err, decoded) => {
        const { _id } = decoded;
        Users.findOne({ _id }).exec()
            .then(user => {
                req.user = user;
                next()
            })
    } )
}
