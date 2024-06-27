const express = require('express')

const cors = require('cors')

const redisClient = require('./redisClient')

const app = express();
app.use(express.json());

app.use(cors());

//Refactor the Get Shoes Endpoint to Handle Errors & Return Result to Client
app.get('/shoes', async (request, response) => {
    try {
        console.log(await redisClient.keys('shoe:*'))
        const shoeIds = await redisClient.keys('shoe:*')
        const shoes = await Promise.all(shoeIds.map(async(id)=>{
           const item = await redisClient.get(id)
            return JSON.parse(item)
        }))
        response.send(shoes);
    }catch(err) {
        console.error(err);
        response.status(500).send('Server Error');
    }
});

app.get('/shoes/:id', async (request, response) => {
    try{
        const id = `shoe:${request.params.id}`;
        const item = await redisClient.get(id)
        if (!item){
            throw new Error('shoe not found')
        }
        response.send(JSON.parse(item))
    }catch(err){
        console.error(err);
        response.status(500).send(err.message);
    }
})


app.post('/shoes/:id', async (request, response) => {
    const key = `shoe:${request.params.id}`;
    const {shoeId, model, color, size} = request.body;
    const Shoe = {
        shoeId,
        color,
        model,
        size
    }

    try {
        const setResult = await redisClient.set(key, JSON.stringify(Shoe));
        console.log(`Redis set result: ${setResult}`);
        console.log(Shoe);
        response.send('Shoe added successfully');
    } catch(err) {
        console.log(`Caught an error: ${err}`);
        console.error(err);
        response.status(500).send(err.message);
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

