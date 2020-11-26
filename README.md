# CryptoPrices

Crypto Price Table

Open [http://hnswave.co/crypto-prices/](http://hnswave.co/crypto-prices/) to view it in the browser.

## Frontend Instructions

[$]> `cd react-crypto-prices`

### Install Dependencies

[$]> `nvm use`

[$]> `npm i`

### Run Development Server

[$]> `npm start` => `react-scripts start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Run Testing Scripts

[$]> `npm test` => `react-scripts test`

### Run Linters

[$]> `npm lint` => `eslint src/**/*.js`

[$]> `npm lint:fix` => `eslint src/**/*.js --fix`

### Build Production Deployment

[$]> `npm run build` => `PUBLIC_URL=http://hnswave.co/crypto-prices/ npm run build`

[$]> `npm run deploy` => `rsync -r -a -v -e ssh --delete build/ droplet:/root/www/crypto-prices`
