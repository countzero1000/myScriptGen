const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const mm = require('music-metadata');
const Ciseaux = require('ciseaux');
const axios = require('axios');
const Line = require('./line');
const ofs = require('fs');
const norm = require('gaussian');
const express = require('express');


process.setMaxListeners(0);


let mongoOptions = {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    useNewUrlParser: true
}

const mongURI = 'mongodb+srv://Admin:iamadmin@mismatch-lla7j.azure.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongURI, mongoOptions);

app = express();


let folderName = 'tmpScript/'
let pLT = .2;
let nchars = 2;
let nlines = 18;
let pskipchar = 0.25;
const speechCloud = "https://speech-synth.herokuapp.com";
let speechLocal = 'http://localhost:3000';
let speechRoute = '/tts/payload';

let laughs = ['a_laugh track 1_01.wav',
    'a_laugh track 1_02.wav',
    'a_laugh track 1_03.wav',
    'a_laugh track 1_04.wav',
    'a_laugh track 1_05.wav',
    'a_laugh track 1_06.wav',
    'a_laugh track 1_07.wav',
    'a_laugh track 1_08.wav',
    'a_laugh track 1_09.wav',
    'a_laugh track 1_10.wav',
    'a_laugh track 1_11.wav',
    'a_laugh track 1_12.wav',
    'a_laugh track 1_13 (3 part).wav',
    'a_laugh track 1_14.wav',
    'a_laugh track 1_15.wav',
    'a_laugh track 1_16.wav',
    'a_laugh track 1_17.wav',
    'a_laugh track 1_18.wav',
    'a_laugh track 1_19 (off color).wav',
    'a_laugh track 1_20.wav',
    'a_laugh track 1_21.wav',
    'a_laugh track 1_23.wav',
    'a_laugh track 1_24 (small).wav',
    'a_laugh track 1_25 (ooooh!).wav',
    'a_laugh track 1_26.wav',
    'a_laugh track 1_27.wav',
    'a_laugh track 1_28.wav',
    'a_laugh track 1_29.wav',
    'a_laugh track 1_30.wav',
    'a_laugh track 1_31.wav',
    'a_laugh track 1_32.wav',
    'a_laugh track 1_33.wav',
    'a_laugh track 1_34.wav',
    'a_laugh track 1_35 (extended chuckle).wav',
    'a_laugh track 1_36 (oooh!).wav']






makeRequestForNewLineFiles = async (lines) => {

    return new Promise( async(resolve, reject) => {

      

    


            //get Jerry's lines

            for (let i = 0; i < nlines; i++) {

                let index = Math.floor(Math.random() * (64))

                await Line.find({
                    index: index,
                    character: "George"
                }).then(async (line) => {
                    let reqline = {
                        character: "George_Costanza",
                        text: line[0].text
                    }

                    lines.push(reqline);

                })

                await Line.find({
                    index: index,
                    character: "Jerry"
                }).then(async (line) => {
                    let reqline = {
                        character: "Jerry_Seinfeld",
                        text: line[0].text
                    }

                    lines.push(reqline);

                })
            }

    
            resolve();
      


    })

}



downloadAll = (files) =>{
    return Promise.all(files.map(downloadFile));
}



downloadFile = async (file) => {

    return new Promise( async(resolve, reject) => {



            let gfs = Grid(mongoose.connection.db, mongoose.mongo);
            let fName = file.fileName;

            while (!(await gfs.exist({ filename: fName }))) {
                console.log('waiting on ', fName);
            }

            console.log(fName, " found");

            let readStream = gfs.createReadStream({

                filename: fName

            });

            readStream.pipe(ofs.createWriteStream(folderName + fName));
            readStream.on("end",()=>{
                console.log("finished ", fName);
                resolve();
            })
      

    })


}

makeRandomArray = (min, max, length) => {

    var arr = [];

    for (let i = 0; i < length; i++) {
        arr.push(((Math.random() * (max - 1)) + min));
    }


    return arr;

}

sortLines = async (lines, nchars, nlines, pskipchar) => {

    let sorted = [[], []];


    for (let i = 0; i < lines.length; i++) {

        if (lines[i].name == 'George_Costanza') {

            sorted[0].push(folderName + lines[i].fileName);

        } else

            if (lines[i].name == 'Jerry_Seinfeld') {


                sorted[1].push(folderName + lines[i].fileName)

            }
    }

    return sorted;
}



buildTimeLine = async (nlines, nchars, linesTime) => {

    let totalLines = nchars * nlines;

    let totalTime = 0;

    kchar = 0;
    kLT = 0;

    let timeLine = [];

    for (let p = 1; p < totalLines; p++) {

        let currentCharacter = ((p - 1) % nchars) + 1;

        if (Math.random() > pskipchar) {

            let data = await mm.parseFile(linesTime[currentCharacter - 1][kchar]);

            timeLine.push(Ciseaux.concat(Ciseaux.silence(totalTime), await Ciseaux.from(linesTime[currentCharacter - 1][kchar])));

            totalTime += data.format.duration;


        }





        if (currentCharacter == nchars) kchar++;


        if (Math.random() < pLT) {

            totalTime += Cldist();

            let laugh = "laughs/" + laughs[Math.floor(Math.random() * (laughs.length - 1))]

            timeLine.push(Ciseaux.concat(Ciseaux.silence(totalTime), await Ciseaux.from(laugh)));

            let data = await mm.parseFile(laugh);

            totalTime += data.format.duration;

            totalTime += LCdist();

            kLT = kLT + 1;


        } else {

            totalTime += CCdist();

        }



    }


    console.log(timeLine.length, " ", totalTime);

    let finalTape = await Ciseaux.mix(timeLine);

    fs.writeFile('finalCut.wav', new Uint8Array(await finalTape.render()));



}




CCdist = () => {

    return norm(.1, .1).ppf(Math.random())

}

Cldist = () => {

    return norm(.4, .2).ppf(Math.random())
}

LCdist = () => {

    return norm(.5, .7).ppf(Math.random());
}




main = async () => {


    return new Promise(async (resolve, reject) => {


        let lines = [];

        await makeRequestForNewLineFiles(lines);


        await axios.post(speechCloud + speechRoute,

            { scriptData: lines }).then(async (res) => {


                let files = await res.data;
             


                    downloadAll(files).then(async()=>{
                        let sorted = await sortLines(files);
                        await buildTimeLine(nlines, nchars, sorted, pLT);
                        resolve();
                    })
                    
                

            })

    })


}


app.get('/generateNew', (req, res) => {

    main()
        .then(() => {
            

            res.writeHead(200,{
               
                'Content-Type' : 'audio/wav',
                'Connection' : 'keep-alive',
                'Transfer-Encoding': 'chunked',
                'Accept-Encoding':'gzip,deflate'
            })

            let stream = ofs.createReadStream('finalCut.wav');
            stream.on('end', ()=> res.end());
            stream.pipe(res);

        });


})







var port = process.env.PORT || 8080;


app.get('/', function (req, res) {

    res.send( 'You are at the root');

});

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});


