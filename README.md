# AttApi
Api del Sistema de Conciliaciones

## Portabilidad_gral

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_gral

## Portabilidad_origen_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_origen_out

## Portabilidad_lineal_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_lineal_origen_out

## Portabilidad_operador_out

apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_operador_out

## Portabilidad_operador_in
apiattsmc.eastus.cloudapp.azure.com:3000/portabilidad_operador_in

## Registro
apiattsmc.eastus.cloudapp.azure.com:3000/resgistro

| Key      |   Value     |
|----------|-------------|
| name     |   John      |
| lastName |    Doe      |
| email    | jdoe@dummy.com  |
| user     |  jdoe97     |
| password | 12345678    |


## Autenticar Usuarios
apiattsmc.eastus.cloudapp.azure.com:3000/autenticar
| Key      |   Value     |
|----------|-------------|
| user     |   jdoe97    |
| password |   12345678  |

```javascript
{
    "mensaje": "Autenticación correcta",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNTg5ODQ3ODA3LCJleHAiOjE1ODk4NDkyNDd9.RAMfrTBFKc-PaJwBShcWNm0ghHu6RYOsVzsSCdQPGpM"
}
```



