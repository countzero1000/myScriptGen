const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const mm = require('music-metadata');
const Ciseaux = require('ciseaux');

const ofs = require('fs');

const mongURI = 'mongodb+srv://Admin:iamadmin@mismatch-lla7j.azure.mongodb.net/test?retryWrites=true&w=majority';
let folderName = 'tmpScript/'
let pLT = .2;
let nchars = 2;
let nlines = 14
let pskipchar = 0.25;


let lines = [
{ name: 'George_Costanza', fileName: '1_George_Costanza.wav' },
{ name: 'Jerry_Seinfeld', fileName: '2_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '3_George_Costanza.wav' },
{ name: 'Jerry_Seinfeld', fileName: '4_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '5_George_Costanza.wav' },
{ name: 'Jerry_Seinfeld', fileName: '6_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '7_George_Costanza.wav' },
{ name: 'Jerry_Seinfeld', fileName: '8_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '9_George_Costanza.wav' },
{ name: 'Jerry_Seinfeld', fileName: '10_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '11_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '12_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '13_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '14_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '15_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '16_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '17_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '18_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '19_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '20_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '21_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '22_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '23_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '24_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '25_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '26_Jerry_Seinfeld.wav' },
{ name: 'George_Costanza', fileName: '27_George_Costanza.wav' },  { name: 'Jerry_Seinfeld', fileName: '28_Jerry_Seinfeld.wav' } ];



downloadFiles = async (lines) => {

    let mongoOptions = { 
        reconnectTries: Number.MAX_VALUE, 
        reconnectInterval: 500,
        useNewUrlParser: true,
        useMongoClient: true 
      }

      mongoose.connect(mongURI,mongoOptions);

      mongoose.connection.once("open" , ()=>{


       let gfs = Grid(mongoose.connection.db,mongoose.mongo);
      
        lines.forEach((filename) =>{

        let readStream  = gfs.createReadStream({
            filename : filename
        });

        readStream.pipe(ofs.createWriteStream(folderName+filename));
        })

    })
}


makeRandomArray = (min,max,length) => {

    var arr = [];

    for(let i = 0; i < length; i++){
        arr.push(((Math.random()*(max-1))+min));
    }


    return arr; 

}

sortLines = async (lines,nchars,nlines,pskipchar) => {

    let sorted = [[],[]];
    

    for(let i = 0; i < lines.length; i++){

        if(lines[i].name == 'George_Costanza') {

            sorted[0].push(folderName + lines[i].fileName);

        }else 

        if(lines[i].name == 'Jerry_Seinfeld'){

            
            sorted[1].push(folderName + lines[i].fileName)

        }
    }

    return sorted;
}



buildTimeLine = async (nlines,nchars,linesTime,LTtime) => {

    let totalLines = nchars * nlines;

    let maxT = 0;

    kchar = 0;
    kLT  = 0;

    let timeLine = [];

    for(let p = 1; p < totalLines; p++){

        let currentCharacter = ((p-1) % nchars) + 1;
     
        if(Math.random() > pskipchar){
            
            

            timeLine.push( await Ciseaux.from(linesTime[currentCharacter-1][kchar]));
            console.log(linesTime[currentCharacter-1][kchar]);
                
        }


        
        

        if(currentCharacter == nchars) kchar ++;


        if(Math.random() < pLT){

        
            timeLine.push(await Ciseaux.silence(Cldist())); // write CLdelay
            
            timeLine.push(await Ciseaux.from('laugh track 1_01.wav'));

            timeLine.push(await Ciseaux.silence(LCdist())); // do later

           

            kLT = kLT +1;


        } else {

            timeLine.push(await Ciseaux.silence(CCdist()));

        }

        

    }


    console.log(timeLine.length);

    let finalTape = await Ciseaux.concat(timeLine);

    fs.writeFile('finalCut.wav', new Uint8Array(await finalTape.render()));



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

//downloadFiles(lines);

main = async () => {

    let sorted = await sortLines(lines);


    buildTimeLine(nlines,nchars,sorted,pLT);

}

main();




