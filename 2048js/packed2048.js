let brd;
let plsStop=false;
let yRUDoingThis=false;

function check(x, y, arr){
    return arr[x][y]===0;
}

function pusharr(pushArr, n, x, y){
    pushArr[x][y]=n;
}

function ifNear(first, next){
    return first===next && first!==0;
}

function getRandomInt(max){  //cor
    return Math.floor(Math.random()*Math.floor(max));
}

function compare(a, b){
    for(let i=0;i<=3;i++){
        for(let j=0;j<=3;j++){
            if(a[j][i]!==b[j][i]){
                return true;
            }
        }
    }
    return false;
}

function setup(){  //cor
    createCanvas(400, 400);
    brd = initialize();
    /*brd=[
        [4, 2, 16, 4],
        [2, 8, 2, 128],
        [4, 64, 16, 8],
        [0, 2, 4, 64]
    ]*/
    randomPush(2);
    console.table(brd);
}

function initialize(){
    return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
}

function randomPush(times){  //cor
    let n, x, y;
    var count=0;
    while (count<times) {
        x=getRandomInt(4);
        y=getRandomInt(4);
        n=random(1);
        if(check(x, y, brd)){
            n<0.5 ? pusharr(brd, 2, x, y) : pusharr(brd, 4, x, y);
            count++;
        }
    }
    
}

function mvRl(RlArr){
    let save=0;
    let savearr=initialize();
    for(let i=0;i<=3;i++){
        for(let j=0;j<=3;j++){
            if(!check(j,i,RlArr)){
                pusharr(savearr,brd[j][i],save, i);
                save++;
            }
        }
        save=0;
    }
    return savearr;
}

function combineRl(comArr){
    for(let i=0;i<=3;i++){
        for(let j=0;j<3;j++){
            if(ifNear(comArr[j+1][i], comArr[j][i])){
                comArr[j][i]=comArr[j+1][i]+comArr[j][i];
                comArr[j+1][i]=0;
            }
        }
    }
    return comArr;
}

function mvCombineRl(){  //mv combine array
    brd=mvRl(brd);
    brd=combineRl(brd);
    brd=mvRl(brd);
}

function updateArray(fArr, sArr){  //copy firstarr to secondarr so sArr=fArr
    for(let i=0;i<=3;i++){
        for(let j=0;j<=3;j++){
            sArr[j][i]=fArr[j][i];
        }
    }
    return sArr;
}

function rotateClockwise(rotateArr, rTimes){  //rotate times
    let rSave=0;
    let rSaveArr=initialize();
    for(let k=0;k<rTimes;k++){
        for(let i=0;i<=3;i++){
            for(let j=3;j>=0;j--){
                rSaveArr[rSave][i]=rotateArr[i][j];
                rSave++;
            }
            rSave=0;
        }
        rotateArr=updateArray(rSaveArr, rotateArr);
        rSaveArr=initialize();
    }
    return rotateArr;
}

function slide(direction){
    brd=rotateClockwise(brd, direction);
    mvCombineRl();
    brd= direction%2===1 ? rotateClockwise(brd, direction+2) : rotateClockwise(brd, direction+4);
}

function endgame(){
    for(let i=0;i<=3;i++){
        for(let j=0;j<=3;j++){
            if((check(j, i, brd))){
                return false;
            } else
            if(j!==3 && brd[j][i]===brd[j+1][i]){
                return false;
            } else
            if(i!==3 && brd[j][i]===brd[j][i+1]){
                return false;
            }
            /*console.log("below is check if there is 0");
            console.log(check(j, i,brd));
            console.log("below is check if j can combine");
            console.log(j!==3 && brd[j][i]===brd[j+1][i]);
            console.log("below is check if i can combine");
            console.log(i!==3 && brd[j][i]===brd[j][i+1]); */
        }
    }
    return true;
}

function keyPressed(){
    let slided=true;
    let ranPushed=false;
    let laststep=initialize();
    if(key=='a' || keyCode ===  LEFT_ARROW){
        laststep=(updateArray(brd, laststep));
        slide(0);
    } else
    if(key=='s' || keyCode ===  DOWN_ARROW){
        laststep=(updateArray(brd, laststep));
        slide(1);
    } else
    if(key=='d' || keyCode ===  RIGHT_ARROW){
        laststep=(updateArray(brd, laststep));
        slide(2);
    } else
    if(key=='w' || keyCode ===  UP_ARROW){
        laststep=(updateArray(brd, laststep));
        slide(3);
    } else {
        slided=false;
    }
    if(slided){
        if((compare(brd, laststep))){
            randomPush(1);
            ranPushed=true;
            console.table(brd);
        }
        //endgame();
        //console.log(endgame());
    }
    /*if(ranPushed){
        if(endgame()){
            console.log("gameover, press F5 to restart.");
        }
    }*/
}

function drawBrd(){  //cor
    let w=100;
    for(let i=0;i<=3;i++){
        for(let j=0;j<=3;j++){
            noFill();
            strokeWeight(2);
            stroke("#34be5b");
            rect(j*w, i*w, w, w);
            let val = brd[j][i];
            if(!check(j, i, brd)){
                textAlign(CENTER, CENTER);
                textSize(64);
                fill(0);
                noStroke();
                //text(j + ',' + i, j*w+w/2, i*w+w/2);
                text(val, j*w+w/2, i*w+w/2);
            }
        }
    }
}

function draw(){  //cor
    background(255);
    drawBrd();
    if(endgame() && !plsStop){
        plsStop=true;
    } else
    if(plsStop && !yRUDoingThis){
        yRUDoingThis=true;
        alert("gameover, press F5 to restart")
    }
}