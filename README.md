<hr>
<br>
<p align="center">
  <img src="planificacion/images/construccion.jpg" alt="Contruccion">
</p>

<!-- ### <font color='lime'><p align="center"> Gracias por tu visita!! </p></font> -->

<hr>
<br>

## Back-end: Back inicial para proyectos, preparado para usar en conjunto con Basic-Front
## Descripción:
### BackEnd listo para iniciar proyectos, cuenta con la autenticación y CRUD completo para usuarios, JWT, PostgresSQL, Cloudinary, etc...

Tecnologías: NestJs, Typescript, TypeORM, PostgresSQL, Swagger, JWT, etc...


## Clonar y probar la aplicación.

#### Clona el repositorio.

```
git clone git@github.com:rvh2776/basic-back.git
```

#### Entra a la carpeta del proyecto.

```
cd basic-back
```

#### Instala las dependencias.

```
npm install
```

#### Renombrar el archivo: .env.example a .env.development
* En el mismo se encuentra la descripción de los datos necesarios que se deben configurar,
  para iniciar el proyecto.

#### Se debe tener corriendo un servidor PostgresSQL.
* Debe de estar creada la base de datos y declarada en el archivo de variable de entorno: .env.development
* Datos necesarios:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Nombre_base_datos
DB_USERNAME=useruario_db 
DB_PASSWORD=password_db
```

#### Iniciar la aplicación.

```
npm run build

npm run start:prod
```

<br>


## Instrucciones importantes para ejecutar en producción

### 1. **Compilar el código** 
  * Antes de iniciar la aplicación, asegúrate de compilar el código TypeScript para que se copien las plantillas necesarias al directorio `dist`:
   
  ```
   npm run build
  ```

### 2. **Iniciar el servidor** 
  * Una vez compilado el código, utiliza el siguiente comando para arrancar la aplicación en modo producción:

  ```
  npm run start:prod
  ```

### 3. **Importante:**

* No utilices npm run start en producción, ya que este comando recompila el código y sobrescribe el contenido del directorio dist, eliminando las plantillas copiadas.
* Verifica que las plantillas están en el directorio dist/modules/nodemailer/templates después de ejecutar npm run build.

<br>

---

<br>
<font color='lime'><p align="right">Rafael V.H.</p></font>