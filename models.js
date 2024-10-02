import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
// Averiguar que importar de NODE para realizar el hash del pass
// Averiguar como "activar" la lectura de las variables de entorno del archivo .env (dotenv)
import { handleError } from "./utils/handleError.js";
import { emailValidated, validatedName, validatedLastname, validatedPassword } from "./utils/userControl.js";
import { Console, error } from "node:console";
import { CLIENT_RENEG_LIMIT } from "node:tls";
//--------------------------------------------------------------

// 1° recuperar variables de entorno
//--------------------------------------------------------------
// Entrar en escucha de las variables de entorno definidas en el archivo .env
dotenv.config();

const PATH_FILE_USER = process.env.PATH_FILE_USER;
const PATH_FILE_ERROR = process.env.PATH_FILE_ERROR;

// 2° Declarar los metodos

// METODO 1-------------------------------------------------------------
const getUsers = (PATH_FILE_USER) => {
  const dataUserExits = existsSync(PATH_FILE_USER);
  try {
    if (!dataUserExits) {
      throw new Error("Access denied");
    }

    const dataUsers = JSON.parse(readFileSync(PATH_FILE_USER));
    return dataUsers;
  }
  catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);// const objError = handleError()
    console.log(objError);
    return objError;

  }
};
// PRUEBA DE FUNCION getUsers
// console.log(getUsers(PATH_FILE_USER));

//METODO 2 ---------------------------------------------------------------
const getUserById = (id) => {
  try {
    if (!id) {
      throw new Error("ID is missing");
    }
    const usersData = getUsers(PATH_FILE_USER);

    const user = usersData.find((userData) => userData.id === id);

    if (!user) {
      throw new Error("User not found");
    };
    return user;

  } catch (error) {
    handleError(error, PATH_FILE_ERROR);
  };
};
// PRUEBA DE FUNCION getUserById
// getUserById("35206206-9fe3-4211-a41a-bf897ec7934b");

// METODO 3 ----------------------------------------------------------------
// addUser recibe un objeto con toda la data para el nuevo usuario
// valida que esten los datos míminos para añadir un nuevo usuario
// valida que el nombre sea un string
// valida que el apellido sea un string
// valida que el email sea un string y que no se repita
// hashea la contraseña antes de registrar al usuario

const addUser = async (name, lastname, email, password) => {

  try {
    const validFirstName = validatedName(name);
    const validLastname = validatedLastname(lastname);
    const validEmail = emailValidated(email);
    const validPassword = validatedPassword(password);

    const allvalid = [validatedName(name), validatedLastname(lastname), emailValidated(email), validatedPassword(password)].every(valid => valid);

    if (allvalid) {
      return ("Los datos suministrados no cumplen con lo solicitado")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: randomUUID(),
      name,
      lastname,
      email,
      password,
      passwordhash: hashPassword,
      isLoggedIn: false,
      createdUser: new Date().toISOString(),
      updatedUser: false,
    };

    const usersData = getUsers(PATH_FILE_USER);

    usersData.push(newUser);

    writeFileSync(PATH_FILE_USER, JSON.stringify(usersData, null, 2));

  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};
// PRUEBA DE FUNCION addUser
// console.log(addUser("Jani", "ort", "carlos1@lopez.com", "Password123"));

// METODO 4 ---------------------------------------------------------------
// todos los datos del usuario seleccionado se podrían modificar menos el ID
// si se modifica la pass debería ser nuevamente hasheada
// si se modifica el email, validar que este no exista
const updateUser = async (id, name, lastname, email, password) => {
  try {
    //me devuelve el usuario (en el caso de algun error salta la funcion y no se ejecuta el resto)
    const userById = getUserById(id);

    if (name) {
      const validFirstName = validatedName(name); //teniendo en cuenta que no es vacio, valida parametros
      if (validFirstName) { userById.name = name };
    };
    if (lastname) {
      const validLastname = validatedLastname(lastname);//teniendo en cuenta que no es vacio, valida parametros
      if (validLastname) { userById.lastname = lastname };
    };
    if (email) {
      const validEmail = emailValidated(email);//teniendo en cuenta que no es vacio, valida parametros
      if (validEmail) { userById.email = email };
    };
    if (password) {
      const validPassword = validatedPassword(password);//teniendo en cuenta que no es vacio, valida parametros
      if (validPassword) {
        userById.passwordhash = await bcrypt.hash(password, 10);
        userById.password = password;
      };
    };

    userById.updatedUser = new Date().toISOString();

    const usersData = getUsers(PATH_FILE_USER);
    const newUsersData = usersData.filter((userData) => userData.id !== id);

    newUsersData.push(userById);

    writeFileSync(PATH_FILE_USER, JSON.stringify(newUsersData, null, 2));
  }
  catch (error) {
    handleError(error, PATH_FILE_ERROR);
  };
};

// console.log(updateUser("ce0db2c1-5988-462f-8ad9-f9436ad70721", "", "SBone", "","Password4321"));

// METODO 5 ---------------------------------------------------------------
const deleteUser = (id) => {
  const userToDelete = getUserById(id);
  if (userToDelete) {

    const usersData = getUsers(PATH_FILE_USER);

    const newDbUsersData = usersData.filter((userData) => userData.id !== id);
    writeFileSync(PATH_FILE_USER, JSON.stringify(newDbUsersData));
    console.log(`Usuario borrado: ${JSON.stringify(userToDelete, null, 2)}`);
    return "The requested user was deleted";
  };
};
// PRUEBA DE FUNCION deleteUser
// deleteUser("d634e8e9-c35b-487e-927a-71d3acda9b6f");

// ---------------------------------------------------------------
export { getUsers, getUserById, addUser, updateUser, deleteUser };
