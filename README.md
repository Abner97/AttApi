# AttApi
Api del Sistema de Conciliaciones

## Registro
apiattsmc.eastus.cloudapp.azure.com:3000/registro

### En el Body de la peticion se debe poner:
| Key      |   Value     |
|----------|-------------|
| name     |   John      |
| lastName |    Doe      |
| email    | jdoe@dummy.com  |
| user     |  jdoe97     |
| password | 12345678    |

### Si el registro fue exitoso devuelve:
```javascript
{
    "mensaje": "Registro Exitoso!"
}
```

### Si el usuario ya existe devuelve:
```javascript
{
    "user": "Exist"
}
```

### Si el correo ya existe devuelve:
```javascript
{
    "email": "Exist"
}
```


## Autenticar Usuarios 
apiattsmc.eastus.cloudapp.azure.com:3000/autenticar

### En el Body de la petición se debe poner:
| Key      |   Value     |
|----------|-------------|
| user     |   jdoe97    |
| password |   12345678  |

### Si la autenticación es correcta devuelve :

```javascript
{
    "mensaje": "Autenticación correcta",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNTg5ODQ3ODA3LCJleHAiOjE1ODk4NDkyNDd9.RAMfrTBFKc-PaJwBShcWNm0ghHu6RYOsVzsSCdQPGpM"
}
```
## Si no es correcta:


```javascript
{
    "mensaje": "Usuario o contraseña incorrectos"
}
```

# Endpoints para consultar la BD.

## Para acceder se debe poner en el Header de la petición:

| Key      |   Value     |
|----------|-------------|
| access-token     |  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNTg5ODQ3ODA3LCJleHAiOjE1ODk4NDkyNDd9.RAMfrTBFKc-PaJwBShcWNm0ghHu6RYOsVzsSCdQPGpM     |

## Si se intenta acceder a uno de estos endpoints sin el token, los endpoints devuelven:
```json
{
    "mensaje": "Token no proveída."
}
```


## Portabilidad_gral

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_gral

### Body
| Key      |   Value     |
|----------|-------------|
| sysdate  |     120     |



## Portabilidad_origen_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_origen_out

## Portabilidad_lineal_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_lineal_origen_out

### Body
| Key      |   Value     |
|----------|-------------|
| sysdate  |     120     |  

## Portabilidad_operador_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_operador_out

## Portabilidad_operador_in
apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_operador_in


