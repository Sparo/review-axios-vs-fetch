const express = require('express')
const app = express()
const port = 3000

app.use('/vanila-fetch', express.static('tests/vanila-fetch/dist'));
app.use('/vanila-axios', express.static('tests/vanila-axios/dist'));
app.use('/svelte-fetch', express.static('tests/svelte-fetch/public'));
app.use('/svelte-axios', express.static('tests/svelte-axios/public'));
app.use('/vue-fetch', express.static('tests/vue-fetch/dist'));
app.use('/vue-axios', express.static('tests/vue-axios/dist'));


app.use('/', express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})