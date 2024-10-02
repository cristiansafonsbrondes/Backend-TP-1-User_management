# Backend-TP-1-User_management

## MANEJO DE USUARIOS

## Descripción
Este proyecto es una aplicación para la gestión de usuarios, que permite registrar y autenticar usuarios de manera segura
utilizando `bcrypt` para el hashing de contraseñas, `dotenv` para gestionar variables de entorno, y `randomUUID` para generar
identificadores únicos. 
Los datos de los usuarios se almacenan en un archivo JSON utilizando las funciones `existsSync`, `readFileSync` y `writeFileSync`
del módulo `fs`.
