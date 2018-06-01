const jobs = require(__dirname + "/data/data.json");

exports.act = async function(intent){
    const job_name = (intent.slots.hasOwnProperty('job_name')
            && intent.slots.job_name.hasOwnProperty('value')) 
            ? intent.slots.job_name.value.toUpperCase() : '';
    const job = jobDetail(job_name);

    let job_rec = getJobRec(intent.slots);
  
    switch(intent.name){
      case "JobDetailsIntent":
      return job.job_desc;

      case "JobStatusIntent":
      if(ifJobFailed(job_name, job_rec)){
          return "The job " + job_name + " failed";
      }else{
          return "The job is successful";
      }
    
      case "WhyJobFailedIntent":
      const why_job_failed = whyJobFailed(job_name, job_rec);
      return (why_job_failed ? "The job failed because " + why_job_failed : "I don't know");
  
      case "CommonErrorsIntent":
      return job.common_errors;
  
      default:
      throw new Error("Unhandled Intent " + intent.name);
    }
}
  
function jobDetail(job_name){
    for(let job of jobs){
        if(job_name.toUpperCase() == job.job_name.toUpperCase()){
            return job;
        }
    }
  
    throw new Error("Unknown job!");
}

function getJobRec(slots){
    if(slots.hasOwnProperty('job_rec') && slots.job_rec.hasOwnProperty('value')){
        return slots.job_rec.value.toUpperCase();
    }

    //console.log(slots);

    return '';
}

const exec = require('child_process').exec;
async function whyJobFailed(job_name, job_rec){
    const job_failed = await ifJobFailed(job_name, job_rec);
    if(!job_failed){
        return "This job hasn't failed";
    }
    console.log("In why job failed " + job_failed);

    const log_path = getLogPath();
    const log_prefix = getLogPrefix(log_path, job_name, job_rec);
    const latest_log = await getLatestLogName(log_prefix);

    console.log(log_prefix);
    console.log(latest_log);

    const job = jobDetail(job_name);
    const common_errors = job.common_errors.split(',');
    const responses = await Promise.all(common_errors.map(async (common_error)=>{
        const command = 'grep';
        const params = ['-i', common_error, latest_log];
        const command_with_params = buildCommand(command, params);
        let output = [];
        const response = await exec(command_with_params, (error, stdout, stderror)=>{
            if(error || stderror){
                console.log(error);
                console.log(stderror);
            }else{
                output.push(response);
            }
        })
    }))
    
    return (responses.length>0 ? responses[0] : undefined);
}

async function ifJobFailed(job_name, job_rec){
    const log_path = getLogPath();
    const log_prefix = getLogPrefix(log_path, job_name, job_rec);
    const latest_log = await getLatestLogName(log_prefix);

    const command = 'grep';
    const params = ['-i', 'operational job ended with failure', latest_log];
    const command_with_params = buildCommand(command, params);

    let output = '';
    await exec(command_with_params, (error, stdout, stderror)=>{
        output = (error || stderror) ? false : true;
    })

    console.log(output);
    return output;
}

function getLogPath(){
    return __dirname + '/logs';
}

function getLogPrefix(log_path, job_name, job_rec){
    return log_path + '/' + job_name + '_' + job_rec + '*';
}

async function getLatestLogName(log_prefix){
    const command = 'ls';
    const params = ['-1t', log_prefix, '| head -1'];
    const command_with_params = buildCommand(command, params);
    //console.log(command_with_params);

    const output = await execCommand(command_with_params);

    console.log(output);
    return output;
}

const execCommand = (command)=>{
    return new Promise((resolve, reject)=>{
        exec(command, (error, stdout, stderror)=>{
            output = (error || stderror) ? undefined : stdout;
        })
    })
}

function buildCommand(command, params){
    return command + ' ' + params.reduce((a, b)=> a + ' ' + b);
}

