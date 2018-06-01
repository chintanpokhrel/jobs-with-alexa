async function testIfJobFailed(){
    const mock_request = require(__dirname+ '/mock_request.json')
    const act = require(__dirname + '/act.js').act;
    const response = await act(mock_request.request.intent);
    if(response){
        console.log("The requested job failed");
    }else{
        console.log("The requested job succeeded");
    }
    
}

testIfJobFailed();