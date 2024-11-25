// Importar módulos necesarios
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const app = express();

// Configuración básica
const port = 4000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json()); // Para manejar datos en formato JSON en las solicitudes

// Conectar a MongoDB Atlas
const uri = "mongodb+srv://kenGr:asdf-13579@ken.zmmwe.mongodb.net/?retryWrites=true&w=majority&appName=Ken";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true }
});

const dbName = "tuBaseDeDatos";
const collectionName = "usuarios";

async function connectToDatabase() {
  if (!client.isConnected) await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { name, email, password, photo } = req.body;
  
  try {
    const collection = await connectToDatabase();
    
    // Verificar si el usuario ya existe
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, photo };

    // Insertar nuevo usuario
    await collection.insertOne(newUser);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const collection = await connectToDatabase();
    
    // Buscar el usuario por email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Usamos memoria para almacenar la imagen como un buffer

// Ruta para actualizar la foto de perfil
app.post('/updateProfilePic', upload.single('photo'), async (req, res) => {
    const { email } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64') : null;

    if (!photo) {
        return res.status(400).json({ success: false, message: 'No se ha enviado una foto válida.' });
    }

    try {
        const collection = await connectToDatabase();
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        // Actualizamos la foto en la base de datos
        await collection.updateOne(
            { email },
            { $set: { photo } }
        );

        res.status(200).json({ success: true, message: 'Foto de perfil actualizada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar la foto.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

