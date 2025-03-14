import User from "../models/User";
import jwt from 'jsonwebtoken'
import config from "../config";
import Role from "../models/Role";




export const signUp = async(req, res) => {

    const {username, password, roles} = req.body;
    

    const newUser = new User({
        username,
        password: await User.encryptPassword(password)
    })

    if(roles){
        const foundRoles = await Role.find({name: {$in:roles}})
        newUser.roles = foundRoles.map(role => role._id)
    }else{
        const role = await Role.findOne({name:"user"})
        newUser.roles = [role._id]
    }

    const savedUser = await newUser.save();
   

    const token = jwt.sign({id:savedUser._id}, config.SECRET, {
        expiresIn:86400 //24 horas//
    })

    res.status(200).json({token})



}


export const signIn = async (req, res) => {
    try {
        // Buscar usuario por nombre de usuario
        const userFound = await User.findOne({ username: req.body.username }).populate("roles");

        if (!userFound) {
            return res.status(404).json({ message: "User not found" }); // Cambié el código 400 a 404 (No encontrado)
        }

        // Comparar contraseñas
        const matchPassword = await User.comparePassword(req.body.password, userFound.password);
        if (!matchPassword) {
            return res.status(401).json({ token: null, message: 'Invalid password' });
        }

        // Crear token JWT
        const token = jwt.sign({ id: userFound._id }, config.SECRET, {
            expiresIn: 86400 // 24 horas
        });

        // Respuesta exitosa con el token
        return res.status(200).json({ token });

    } catch (error) {
        console.error(error); // Log del error para depuración
        return res.status(500).json({ message: "Internal server error" }); // Responder con un error genérico
    }
};