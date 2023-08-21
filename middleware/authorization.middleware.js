const jwt = require('jsonwebtoken');
require('dotenv').config()

async function auth(req, res, next){
  
  try {
    
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
    token = token.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_KEY); 
        
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('El token JWT es inválido');
    } else if (error.name === 'TokenExpiredError') {
      console.log('El token JWT ha expirado');
    }
    return res.status(401).json({ error: 'Token no válido', errorType: error.name });
  }
}

module.exports = {
  auth
}