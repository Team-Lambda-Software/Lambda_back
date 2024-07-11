# Bienvenidos al Backend de Gymnastic Lambda


<p align="center">
  <img src="./imgs/logo.svg" width="200" alt="Descripción de la imagen" />
</p>


Repositorio del Backend de la aplicación Gymnastic Center del Equipo Lambda, aplicación que basa su contenido en video tutoriales y blogs sobre yoga, ejercicio y semejantes.

# Arquitectura

Nuestra aplicación utiliza varios patrones de diseño y arquitecturas para garantizar un código limpio, mantenible y eficiente, centrándonos en la capacidad de poder mantener la integridad de los datos y mejorar la velocidad de las peticiones:

- **Arquitectura Hexagonal**: Esta arquitectura nos permite separar la lógica de negocio de los detalles técnicos, lo que facilita el mantenimiento y las pruebas de la aplicación.

- **Principio Command–query separation**: Utilizamos este principio para separar las consultas de las modificaciones a la base de datos. Esto nos permite mantener la integridad de la base de datos de escritura mientras mejoramos la eficiencia y velocidad de las consultas a la base de datos. Para ello, hemos creado 2 bases de datos:

      Una NoSQL, empleando mongodb, enfocada a las lecturas

      Una SQL, empleando postgres, enfocada a las escrituras.
  
- **Arquitectura Orientada a Eventos**: Utilizamos esta arquitectura para manejar acciones asíncronas y operaciones en tiempo real, como el envío de notificaciones y, más importante, la sincronización de la base de datos de escritura con la de lectura.

- **Programación Orientada a Aspectos (AOP) con Decoradores**: Los decoradores nos permiten añadir funcionalidades adicionales a nuestras clases y métodos de una manera limpia y reutilizable.

- **Diseño Guiado por el Dominio (DDD)**: Este enfoque nos ayuda a modelar la lógica del negocio buscando reflejar el dominio del problema.

## Instalacion

```bash
$ npm install
```

## Requisitos
- Copiar las variables de entorno del .env.template
- Es necesario dos bases de datos: una noSQL y una SQL
- Tener una cuenta de mailjet, firebase y azure storage

## Correr la aplicacion

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test
```

## Documentación

### Diagrama del Modelo de Dominio
![App Screenshot](./imgs/Lambda_back_Diagrams%20-%20Domain.svg)


### Diagrama de Arquitectura Hexagonal
![App Screenshot](./imgs/Lambda_back_Diagrams%20-%20Hexagonal.svg)

## Aportes de cada desarrollador

### Samuel Alonso

- Capa de Dominio:
  
    Creacion de todas las interfaces iniciales de DDD, realización del modelo de dominio de la aplicación, implementación de los aggregates de curso (junto con su entidad de sección y comentario), blog (junto con su entidad de comentario) y categoría

- Capa de Aplicación: 

    Todos los servicios de commands de los modulos curso, blog y categoría. Implementación de la interfaz de servicio base y realización del decorador base, asi como los decoradores para los aspectos de logging, auditoría, manejo de excepciones y performance.

- Capa de Infraestructura:

    Adaptadores para la subida de archivos a azure blob storage y para obtener archivos de allá también, entidades de odm y orm de los modulos curso, blog, categoría y las entidades odm de los modulos user y trainer. Synchronizadores de las base de datos para los modulos de curso, trainer y blog, asi como los servicios de queries de estos mismos módulos y del módulo de categoría. Realización del event bus con RabbitMQ

- Tests:

    Tests unitarios de los servicios y synchronizadores de los módulos de curso, blog y trainer

- Despliegue:
    
    Encargado de la realización del github actions para el despliegue automático del backend, dockerización del backend, despliegue de las bases de datos en la nube, despliegue en azure del backend. Despliegue del servicio de RabbitMQ para el manejo de colas

### Hualong Chiang

- Capa de Aplicación: 

    Servicio de registro del usuario. Implementación del decorador de seguridad.

- Capa de Infraestructura:

    Relacionado a la auténticación y autorización de usuarios: implementación del manejo y generación de códigos de seguridad (JWT, Hash, RandomCodes)

    Relacionado a notificaciones del sistema: implementación de la persistencia y el envío de la mismas

    Sin relación a un contexto concreto: implementación de los contratos de envío de correos

- Tests:

    Tests unitarios del módulo de Authentication

### Luigi Bastidas

- Capa de Dominio

    Implementacion del agreggate User, junto con sus values objects, eventos de dominio y excepciones de dominio correspondientes.

- Capa de Aplicación: 

    Servicio de aplicacion para actualizar el perfil del usuario. Creacion de DTO's para el servicio de aplicacion

- Capa de Infraestructura:

    Controlador de User, aporte en la implementacion de los repositorios para las bases de datos de MongoDB y PostgresSQL. Synchronizadores de las base de datos para el modulo de user y la creacion de los servicios queries "findUserById" y "findUserByEmail". Creacion del servicio de infraestructura para cambiar la contraseña o imagen de perfil. Aporte en la entidad orm del modelo User y mappers. 

- Tests:

    Tests unitarios del módulo de User

### "colocar aqui los demas"

## Autores
| <img src="https://avatars.githubusercontent.com/u/114821565?s=400&u=ff1e744b3abd5e4315b008d3ad96168b508319ab&v=4" width=115><br><sub>Samuel Alonso</sub> |  
| :---: | 
