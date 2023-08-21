# Prueba_MUTA

## Pasos para Desplegar en un entorno local
  1) clonar el repositorio
  
  2) Ubicarse en la carpeta donde se encuentra el proyecto
  
  3) Una vez ubicados en la ruta de la carpeta instalar las dependencias con el comando
     "npm i"
  
  4)configurar la base de datos en el archivo "config/config.json" el ambiente "development"
     en caso de crear uno nuevo añadirlo en el archivo "models/index.js" modificando la constante "env"
     y agregando el nombre del nuevo ambiente creado
  
  5)Realizar migraciones ejecutando en la ruta del proyecto desde la consola el comando
    "npx sequelize-cli db:migrate"

  6)iniciar la aplicacion con el comando
    "npm run dev"


  ## Diagrama de base de datos

  El diagrama de base de datos se envio a traves del email
