# Bazar AppWrite backend

## Initial setup
The first step is to manually create a `Project` using the 
project id from the `appwrite.json` file,
an `Api Key` also needs to be manually generated, 
for local development is easier to give it all scopes,
the `Endpoint` comes with the project.
Set `BAZAR_PROJECT_ID` (obvious), `BAZAR_MANAGEMENT_API_KEY` (the `Api Key`) 
and `BAZAR_ENDPOINT` (the `Endpoint`) as environmental variables (globally on your machine). 
The other IDs you will take from the `appwrite.json`,
in the end you need to have all these variables set.

```shell
export BAZAR_PROJECT_ID="..."
export BAZAR_MANAGEMENT_API_KEY="..."
export BAZAR_ENDPOINT="..."
export BAZAR_COLLECTION_CATEGORIES="..."
export BAZAR_COLLECTION_SUB_CATEGORIES="..."
export BAZAR_COLLECTION_PRODUCTS="..."
export BAZAR_COLLECTION_CARTS="..."
export BAZAR_COLLECTION_CART_ITEMS="..."
export BAZAR_COLLECTION_ORDERS="..."
export BAZAR_COLLECTION_ORDER_ITEMS="..."
export BAZAR_COLLECTION_PAYMENTS="..."
export BAZAR_COLLECTION_STORES="..."
export BAZAR_COLLECTION_USER_DETAILS="..."
```

### Build the DB structure
Next, you need to install the dependencies for this project and run

```shell
npm run build
```
This command call the `build-db-structure.js` script which creates 
all the DB structure based on the `appwrite.json` 

### Updating the DB structure
Currently, the appwrite-cli does not correctly support migrations, 
so if you have a DB structure in place,
and you want to update it you'll have to delete the docker volumes 
and basically build the DB from scratch.

### Migrations
We might come up with a migration approach in the future, 
but there are a couple of bugs affecting the server-sdk (attributes get stuck when deleted),
for now they can be made through the admin dashboard.
