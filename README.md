
# Hacktiv8 Final Project 2

Pada final project kali ini kami membuat aplikasi MyGram, yang dimana pada aplikasi ini kalian dapat menyimpan foto maupun membuat comment untuk foto orang lain.


## Run Locally

Clone the project

```bash
  git clone https://github.com/teramuza/hacktiv8-final2.git
```

Go to the project directory

```bash
  cd hacktiv8-final2
```

Install dependencies

```bash
  yarn install
```

Migrate Database
```bash
  sequelize db:migrate
```
> you must create `.env` file and DB first and fill `DB_DATABASE` on your `.env` file

Start the server

```bash
  yarn start
```

Start the server as dev mode

```bash
  yarn serve
```



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Env Key | Description |
|---|---|
|`APP_PORT`| your app running port|
|`DB_HOST` | your database host running |
|`DB_DIALECT` | your database dialect (e.g: `postgres`) |
|`DB_USERNAME` | your database username |
|`DB_PASSWORD` | your database user password |
|`DB_DATABASE` | your database name |
|`JWT_SECRET_KEY` |you can generate your own `JWT_SECRET_KEY` |
|`DEV_MODE` | dev mode is useful for enabling logging and configuration for the deployment process (`true` or `false`)|



## API Reference

- You can see our collection (postman) [here](https://www.getpostman.com/collections/fc0a83578f768c157d9a)
- You can see our documentation (postman) [here](https://documenter.getpostman.com/view/14129982/UVRDEjqd)

## Deployment

- You can access our endpoints with endpoint : `https://hacktiv8-final2.herokuapp.com/api/v1/`
