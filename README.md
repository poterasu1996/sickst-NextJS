# sickst

### To start database
```
docker-compose up
```

---

### To run client application

```
cd client
npm install
npm run dev
```

---

### To run server application

```
cd cms
create .env file with these settings

HOST=0.0.0.0
PORT=1337
PUBLIC_URL = 'http://localhost:1337'
APP_KEYS=dzAbeP1GmIecRu+5484Wzw==,nSJP42Fh0iqMzRj4llffBw==,JsF/HXC6UdrMbQfy9GWWdg==,E8tTptfAkK2fpqqPMP6fRg==
API_TOKEN_SALT=kYhSzVg8s7u6zv7Luzp38Q==
ADMIN_JWT_SECRET=OCRMlWgGUzq7IyJy+mJUSg==
JWT_SECRET=aSCg9J08GKXgiYeJDQl8Sw==

npm install
npm run dev
```
