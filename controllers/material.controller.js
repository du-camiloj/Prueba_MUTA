const {Material} = require('../models');
const Sequelize = require('sequelize');
const Joi = require('joi');

async function createMaterial(req, res){
  try {
    const payload = req.body
    const materialSchema = Joi.object({
      name: Joi.string().required(),
      weight: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    });
    
    const { error, value } = materialSchema.validate(payload);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "datos ingresados son invalidos"})
    }
    
    const result = await Material.create(payload);
    return res.status(200).json({message: "Material creado", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear los materiales.' });
  }

};

async function getAllMaterials(req, res){
  try {
   const result = await Material.findAll()
   return res.status(200).json({message: "Materiales existentes", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al encontrar todos los materiales' });
  }
};

async function getMaterialById(req, res){
  try {
    const {id} = req.params
    console.log(id)
    const idSchema = Joi.number().integer().min(1).required()

    const { error, value } = idSchema.validate(id);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "id ingresado es invalido"})
    } 

    const result = await Material.findByPk(id)
    
    if (!result) {
      return res.status(401).json({ error: 'Id de material ingresado no fue encontrado' });
    }
    return res.status(200).json({message: "Material encontrado por id", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al encontrar material por id' });
  }
};

async function updateMaterial(req, res){
  try {
    const {id} = req.params
    const payload = req.body

    const idSchema =  Joi.number().integer().min(1).required()
    
    const materialSchema = Joi.object({
      name: Joi.string().required(),
      weight: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    });
    
    const idValidation = idSchema.validate(id);
    
    if (idValidation.error) {
      return res.status(401).json({ error: 'Id de material ingresado es invalido' });
    }

    const payloadValidation = materialSchema.validate(payload);
    
    if (payloadValidation.error) {
      return res.status(401).json({ error: 'Datos ingresados son invalido' });
    }

    let material = await Material.findByPk(id)

    if (!material) {
      return res.status(404).json({ error: 'Id de material ingresado no fue encontrado' });
    }

    const result = await material.update(payload)
    return res.status(200).json({message: "Material actualizado", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al actualizar material' });
  }
};

async function deleteMaterial(req, res){
  try {
    const {id} = req.params
    const idSchema = Joi.number().integer().min(1).required()

    const { error, value } = idSchema.validate(id);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "id ingresado es invalido"})
    } 

    await Material.destroy({ where: { id: id } })
    return res.status(204).json({message: "Material eliminado"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al eliminar material' });
  }
};


module.exports ={
    createMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
};