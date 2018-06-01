const express = require('express')
const app = express()
const fs = require('fs')

const default_response = require(__dirname + "/data/default_response.js").getDefaultResponse;
const act = require(__dirname + "/act.js").act;

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/output", express.static(__dirname + "/output"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/report.html')
})

app.post('/', async (req, res) => {
  const req_type = req.body.request.type;
  let json = default_response();

  switch (req_type){
  case "LaunchRequest":
    json.response.outputSpeech.text = "Hi there!, how can I help you ?";
    break;
  case "IntentRequest":
    const response = await act(req.body.request.intent);
    json.response.outputSpeech.text = response;
    break;
  }
  
  res.send(json);
})

app.get('/capture', (req, res) => {
  res.sendFile(__dirname + '/capture.html')
})

app.post('/capture', async (req, res, next) => {
  const filepath=__dirname + '/data/data.json';
 
  await fs.readFile(filepath, 'utf-8', function onFileRead(err, data){
    let json = [];
    if(err){
      console.log(err);
    }else{
      json = [].concat.apply([], JSON.parse(data));
    }
    json.push(req.body);
    
    fs.writeFile(filepath, JSON.stringify(json), 'utf-8', (err)=>{
      if(err) next(err);
    });
  });
   
  const res_text = 'Details saved';
  res.send(res_text);
})

app.use((err, req, res, next)=>{
  res.json({ message: error.message });
})

app.listen(3040, ()=>console.log('Server started. Listening on localhost port 3040')); 
