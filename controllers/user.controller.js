const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config()

async function createUser(req, res){
  try {
    
    let {username, password} = req.body
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    
    const payload ={
      username,
      password
    }
    const result = await User.create(payload);
    
    return res.status(200).json({message: "Usuario creado", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear la recoleccion.' });
  }
};

async function login(req, res){
  try {
    const {username, password} = req.body
    
    const user = await User.findOne({
      where: {username}
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const compare = await bcrypt.compare(password, user.password)

    if (!compare) {
      return res.status(401).json({ error: 'contraseña incorrecta' });
    }
    
    const token = jwt.sign({id: user.id, username: user.username}, '@eX+9$x2hdF83!k^V$z',{ expiresIn: '5h' } )
    return res.status(200).json({message: "Token generado expira en 5 horas", token: token})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al loguearse.' });
  }
}

module.exports ={
  createUser,
  login
}
