const {Collection} = require('../models');
const {Material} = require('../models');
const Sequelize = require('sequelize');
const Joi = require('joi');

async function createCollection(req, res){
  try {
    let payload = req.body

    const collectionSchema = Joi.object({
      materialId: Joi.number().integer().min(1).required(),
      quantityCollected: Joi.number().integer().min(1).required()
    });

    const { error, value } = collectionSchema.validate(payload);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "Datos ingresados invalidos"})
    } 

    payload = {
      ...payload,
      collectionDate: new Date()
    }
    
    const material = await Material.findByPk(payload.materialId)
    
    if (!material) {
      return res.status(401).json({ error: 'Id de material ingresado no fue encontrado' });
    }

    await Collection.create(payload);    
    return res.status(200).json({message: "Recoleccion creada", payload})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear la recoleccion.' });
  }

};

async function getAllCollections(req, res){
  try {
   const result = await Collection.findAll()
   return res.status(200).json({message: "Recolecciones existentes", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al encontrar todos las recolecciones' });
  }
};

async function getCollectionById(req, res){
  try {
    const {id} = req.params
    
    const collectionSchema = Joi.number().integer().min(1).required()

    const { error, value } = collectionSchema.validate(id);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "id ingresado es invalido"})
    } 
    
    const result = await Collection.findOne({
      where:{id: id},
      attributes: ["quantityCollected","collectionDate","materialId"],
      include: [{
        model: Material,
        as: "Material", 
        attributes: ["name","weight","price"]
      }]
    })

    if (!result) {
      return res.status(401).json({ error: 'Id de recoleccion ingresado no fue encontrado' });
    }

    return res.status(200).json({message: "Recoleccion encontrada por id", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al encontrar recoleccion por id' });
  }
};

async function updateCollection(req, res){
  try {
    const {id} = req.params
    const payload = req.body
    
    const idSchema = Joi.number().integer().min(1).required()

    const collectionSchema = Joi.object({
      materialId: Joi.number().integer().min(1).required(),
      quantityCollected: Joi.number().integer().min(1).required()
    });
    
    const idValidation = idSchema.validate(id);
    
    if (idValidation.error) {
      return res.status(401).json({ error: 'Id de recoleccion ingresado es invalido' });
    }

    const payloadValidation = collectionSchema.validate(payload);
    
    if (payloadValidation.error) {
      return res.status(401).json({ error: 'Datos ingresados son invalido' });
    }

    let collection = await Collection.findByPk(id)

    if (!collection) {
      return res.status(404).json({ error: 'Id de recoleccion ingresado no fue encontrado' });
    }

    let material = await Material.findByPk(payload.materialId)

    if (!material) {
      return res.status(404).json({ error: 'MaterialId ingresado no fue encontrado, debe crearse primero' });
    }
    let result = await collection.update(payload)
    
    result = {
      id: result.id,
      materialId: result.materialId,
      quantityCollected: result.quantityCollected,
      collectionDate: result.collectionDate
    }
    return res.status(200).json({message: "Recoleccion actualizada", result})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al actualizar recoleccion' });
  }
};

async function deleteCollection(req, res){
  try {
    const {id} = req.params

    const collectionSchema = Joi.number().integer().min(1).required()

    const { error, value } = collectionSchema.validate(id);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "id ingresado es invalido"})
      throw new Error("id ingresado es invalido")
    } 

    await Collection.destroy({ where: { id: id } })
    return res.status(204)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al eliminar recoleccion' });
  }
};

async function optimalRoute (req, res){
  try {
    const validMaterials = ["plástico", "cartón", "vidrio", "metales"]
    const data = req.body
    
    const routeSchema = Joi.object({
      materiales: Joi.array().items(
        Joi.object({
          nombre: Joi.string().required(),
          peso: Joi.number().positive().required(),
          valor: Joi.number().positive().required()
        })
      ).required(),
      limitePeso: Joi.number().positive().required()
    });

    const { error, value } = routeSchema.validate(data);
    
    if (error) {
      console.error('Validation error:', error.details);
      return res.status(400).json({Message_Error: "Datos ingresados son invalido"})
    } 

    const listMaterial = data.materiales.filter(material => validMaterials.includes(material.nombre)).sort((a, b) => b.valor - a.valor);
    let weightLimit = data.limitePeso, i = 0, total = 0, result = [];
    while(i < listMaterial.length && weightLimit > 0){
      if (listMaterial[i].peso<=weightLimit) {
        result.push({ 
          nombre: listMaterial[i].nombre,
          peso: listMaterial[i].peso + "Kg"
        })
        weightLimit = weightLimit - listMaterial[i].peso
        total = total + listMaterial[i].valor
      }
      i++
    }
    return res.status(200).json({message: "Ruta óptima de reciclaje ", Ruta: result, total_obtenido: total})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al calcular ruta' });
  }
};


function total(materials, weightLimit) {
  const dp = new Array(weightLimit + 1).fill(0);
  const chosenMaterials = new Array(weightLimit + 1).fill(null);

  for (let w = 1; w <= weightLimit; w++) {
    for (let i = 0; i < materials.length; i++) {
      if (materials[i].peso <= w) {
        const operator = dp[w - materials[i].peso] + materials[i].valor;
        if (operator > dp[w]) {
          dp[w] = operator;
          chosenMaterials[w] = { material: materials[i].nombre, weight: materials[i].peso };
        }
      }
    }
  }

  const optimalPath = [];
  let remainingWeight = weightLimit;
  while (remainingWeight > 0) {
      const chosenMaterial = chosenMaterials[remainingWeight];
      if (chosenMaterial) {
        optimalPath.push({ material: chosenMaterial.material, weight: chosenMaterial.weight });
        remainingWeight -= chosenMaterial.weight;
      } else {
        break;
      }
  }
  return { optimalPath, valor_total: dp[weightLimit] };
}


module.exports ={
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  optimalRoute
};