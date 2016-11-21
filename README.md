# hello-graphql

- An example project that integrates Exponent with [Apollo
Client](https://github.com/apollostack/apollo-client) to interact with a
[Reindex](https://www.reindex.io/) backend.

- Try it here: https://getexponent.com/@community/hello-graphql


## Running it locally

Clone this repo and `npm install` and open it with XDE or exp.

If you want to use your own Reindex account, first sign up on
[Reindex.io](https://www.reindex.io/), then create a database and
install `reindex-cli` and login using the cli. Next, swap out the
`networkInterface` `uri` in `main.js` with the uri of your fancy
new database ([find your uri on the Reindex account
page](https://accounts.reindex.io/)).
