# Hacktiv8 Final Project 4 - Testing

Pada final project kali ini kami melakukan testing terhadap aplikasi [MyGram](https://github.com/teramuza/hacktiv8-final2)

## Run Locally

Clone the project

```bash
  git clone https://github.com/teramuza/hacktiv8-final2.git
```

Go to the project directory

```bash
  cd hacktiv8-final4
```

Install dependencies

```bash
  yarn install
```

Migrate Database

```bash
  npx sequelize db:migrate
```

> if you want to run and start the server, you must create `.env` file and DB first and fill `DB_DATABASE` on your `.env` file

Start the testing (per file)

```bash
  npx jest <file name>.test.js
```

## API Reference

-   You can see our collection (postman) [here](https://www.getpostman.com/collections/fc0a83578f768c157d9a)
-   You can see our documentation (postman) [here](https://documenter.getpostman.com/view/14129982/UVRDEjqd)

## Testing result

-   User authentication testing : ![successfully implement supertest testing on user URL](/images/userTesting.png "MarineGEO logo")
-   Photo CRUD testing : ![successfully implement supertest testing on user URL](/images/photoTesting.png "MarineGEO logo")
Comment authentication testing : ![successfully implement supertest testing on user URL](/images/comment.jpeg "MarineGEO logo")
Sosmed authentication testing : ![successfully implement supertest testing on user URL](/images/sosmed.jpeg "MarineGEO logo")
