const   cardW = 100,
        cardH = 130 ;

const totalCards = 54 ;

let cardGame = function(PIXI,Width=600,Height=500){
    const cardURLs = [
        "./img/card.png",
        "./img/card2.png",
        "./img/card3.png",
        "./img/card4.png",
        "./img/card5.png"
    ] ;
    let me = this.me = new PIXI.Sprite();

    const deltaY = 1.5 ;

    const margin = 20 ;

    /**1 position */
    let place1X = cardW/2+margin,
        place1Y = totalCards*deltaY+(Height-totalCards*deltaY)/2 ;
    
    let place2X = Width - place1X;

    let cardList = [new card()] ;
    cardList = [] ;
    let topItemOnQue1 = 0 ;
    let que1 = [{x:0,y:0}];
    let que2 = [{x:0,y:0}];
    que1 = [] ;
    que2 = [] ;

    PIXI.loader
    .add(
        cardURLs
    )
    .load(setupGame);

    function setupGame()
    {
        for(let i = 0 ; i<totalCards ; i++)
        {
            let cardTexture = PIXI.loader.resources[cardURLs[Math.floor(cardURLs.length*Math.random())]].texture ;
            let cardItem = new card(PIXI,cardTexture);
            cardList.push(cardItem);
            topItemOnQue1++ ;
            me.addChild(cardItem.me);

            let x = place1X+Math.random()*2 ;
            let x2 = place2X-Math.random()*2 ;
            let y = place1Y-i*deltaY;

            que1.push({x:x,y:y});
            que2.push({x:x2,y:y});

            cardItem.setX(x);
            cardItem.setY(y);
        }
    }

    this.enterFrame = function()
    {
       for(let i = 0 ; i<cardList.length ; i++)
       {
            cardList[i].enterFrame();
       }
    }

    me.interactive = true;
    me.buttonMode = true;

    me.on('pointerdown', clicked)
    
    function clicked()
    {
        me.addChild(cardList[topItemOnQue1-1].me);
        cardList[topItemOnQue1-1].move(que2[totalCards-topItemOnQue1].x,que2[totalCards-topItemOnQue1].y);
        topItemOnQue1--;
        if(topItemOnQue1==0)
        {
            //Make the que reverse to make it float in other side to
            cardList = cardList.reverse();
            topItemOnQue1 = totalCards ;
            let cashedQue = que1 ;
            que1 = que2 ;
            que2 = cashedQue ;
        }
    }

    return this;
}

let card = function(PIXI=null,texture=null)
{

    const frames = 120 ;

    let me = null ;
    if(PIXI==null)
        return;
    me = this.me = new PIXI.Sprite(texture);
    me.width = cardW ;
    me.height = cardH ;
    me.anchor.x = .5;
    me.anchor.y = .8;
    let r0 = me.rotation = (Math.random()-.5)/10;

    let targetX = 0,
        targetY = 0 ;

    

    let xPath = [] ;
    let yPath = [] ;
    let rPath = [] ;

    let pathFrame = 0 ;


    this.setX = function(value)
    {
        targetX = me.x = value ;
    }

    this.setY = function(value)
    {
        targetY = me.y = value ;
    }

    this.move = function(x,y)
    {
        xPath = [] ;
        yPath = [] ;
        pathFrame = 0 ;

        let cX = me.x ;
        let cY = me.y ;

        targetX = x ;
        targetY = y ;


        let deltaX = targetX - cX ;
        let deltaY = targetY - cY ;

        let dx = deltaX/frames ;
        let dy = deltaY/frames ;

        for(let i = 0 ; i<frames-1 ; i++)
        {
            let smoothPrecent = (Math.cos(i/frames*Math.PI)-1)/-2;
            xPath.push(cX+dx*smoothPrecent*frames);
            yPath.push(cY+dy*smoothPrecent*frames);
            rPath.push(r0+(Math.sin(Math.PI*2*(i/frames)))/8);
        }

        xPath.push(targetX);
        yPath.push(targetY);
        rPath.push(r0);
    }

    this.enterFrame = function()
    {
        if(xPath.length>0)
        {
            me.x = xPath[pathFrame];
            me.y = yPath[pathFrame];
            me.rotation = rPath[pathFrame];
            pathFrame++;

            if(pathFrame>=xPath.length)
            {
                xPath = [];
                yPath = [] ;
                rPath = [] ;
            }
        }
    }

   return this ;
}