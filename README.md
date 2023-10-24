# D-CREEA

### Author: Rubens Silva

Frontend from D-CREEA


### Fazendo deploy:

1. Primeiro faça o deploy do backend, o link será necessário para o passo 5
2. Criar conta no [railway](https://railway.app/) 
3. Linkar conta do github com o railway
4. Criar um novo projeto no railway através do repositorio
5. alterar url_api no ``./scr/environments/environment.ts``
```ts
        export const environment = {
            production: false,
            url_api: "url_do_backend",
        };
```

Pronto, o railway fará o deploy **automaticamente** e dentre de alguns minutos terá o link liberado para acesso.

**Link Disponivel em**
> Settings -> Networking -> Public Networking
