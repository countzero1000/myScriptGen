let nchars = 2 ;
let nlines = 10;
let pskipchar = 0.25;
let pLT = .2;





makeRandomArray = (min,max,length) => {

    var arr = [];

    for(let i = 0; i < length; i++){
        arr.push(((Math.random()*(max-1))+min));
    }


    return arr; 

}

getLinesMetadata = (nchars,nlines,pskipchar) => {

    let linesTime = [];

    for(let i = 0; i < nchars; i++){

        let linestemp = makeRandomArray(1,6,nlines);

        linestemp.map((num) => {

            if(pskipchar > Math.random()){
                return 0;
                } else return num;
            })

        

        linesTime.push(linestemp);
    }

    console.log(JSON.stringify(linesTime));

    return linesTime;
}



buildTimeLine = (nlines,nchars,linesTime,LTtime,pLT) => {

    let totalLines = nchars * nlines;

    let maxT = 0;

    kchar = 0;
    kLT  = 0;

    let timeLine = [];

    for(let p = 1; p < totalLines; p++){

        let currentCharacter = ((p-1) % nchars) + 1;
        

        let eventEndTime = maxT + linesTime[currentCharacter-1][kchar]

        let event = {
            type : 'characterLine',
            character : currentCharacter,
            startTime : maxT,
            endTime : eventEndTime,
            lineNum : kchar
        }


        //console.log(linesTime[currentCharacter-1,kchar]);
        
        timeLine.push(event);

        maxT = eventEndTime;
        


        if(currentCharacter == nchars) kchar ++;

        if(Math.random()<pLT){

            let CLdelay = Cldist() + maxT; // write CLdelay

            let event = {
                type : 'laughTrack',

                startTime : CLdelay,
                endTime : CLdelay + LTtime[Math.floor((Math.random())*(LTtime.length-1))], // will change later
                lineNum : kLT
            }

            console.log(LTtime.length)

            maxT = event.endTime + LCdist(); // do later

            timeLine.push(event)

            kLT = kLT +1;


        } else {

            maxT = maxT + CCdist();

        }

        

    }

    return timeLine;



}


CCdist = () =>{

    return .2;

}

Cldist =() =>{

    return .3;
}

LCdist =() =>{
    return .4;

}






linesTime = getLinesMetadata(nchars,nlines,pskipchar);


let LTtime = makeRandomArray(1,3,30);

let timeline = buildTimeLine(nlines,nchars,linesTime,LTtime,pLT);

console.log(timeline.length)

timeline.forEach((obj)=>{

    //console.log("|",obj.startTime," ",obj.endTime,"|"," ",obj.type,"|");
    console.log(obj);
})




