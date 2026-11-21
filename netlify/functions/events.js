// Read-only proxy. The upstream Apps Script already publishes only Approved + Ready events.
exports.handler = async (event) => {
 const headers={'content-type':'application/json','cache-control':'no-store'};
 const debug=event.queryStringParameters?.debug==='1';
 const respond=(statusCode,data)=>({statusCode,headers,body:JSON.stringify(data)});
 const url=process.env.EVENT_FEED_URL || process.env.EVENTS_FEED_URL;
 if(!url)return respond(503,{error:'Feed not configured',...(debug?{diagnostic:{variablePresent:false}}:{})});
 try {
  const u=new URL(url); if(u.protocol!=='https:')throw new Error('Invalid URL protocol');
  const response=await fetch(u,{headers:{accept:'application/json'},redirect:'follow',signal:AbortSignal.timeout(15000)});
  if(!response.ok)return respond(502,{error:'Unable to load event feed',...(debug?{diagnostic:{variablePresent:true,upstreamStatus:response.status}}:{})});
  const payload=await response.json();
  const input=Array.isArray(payload)?payload:(Array.isArray(payload.events)?payload.events:[]);
  const regions=['Lancaster County','Susquehanna Valley & Beyond'];
  const hasFields=e=>e&&e.id&&e.name&&e.venue&&e.startDate&&e.region&&e.url&&regions.includes(e.region);
  const complete=input.filter(hasFields);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const future=complete.filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.endDate||e.startDate)&&(e.endDate||e.startDate)>=today);
  const events=future.map(({id,name,category,description,startDate,startTime,endDate,endTime,venue,city,admission,cost,url,image,region})=>({id,name,category,description,startDate,startTime,endDate,endTime,venue,city,admission,cost,url,image,region}));
  return respond(200,{events,...(debug?{diagnostic:{variablePresent:true,upstreamStatus:response.status,upstreamCount:input.length,completeCount:complete.length,unexpiredCount:future.length,upstreamError:Boolean(payload.error),todayEastern:today}}:{})});
 }catch(err){console.error('Events feed failure:',err?.name,err?.message);return respond(502,{error:'Unable to load event feed',...(debug?{diagnostic:{variablePresent:true,errorType:err?.name||'Unknown'}}:{})});}
};
