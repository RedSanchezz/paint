{  
    class Paint{
        constructor(id){
            this._canvas = document.getElementById(id);
            this._width= getComputedStyle(this._canvas).width.slice(0, -2);
            this._height= getComputedStyle(this._canvas).height.slice(0, -2);
            this._ctx = example.getContext('2d');
            this._brush={
                "x":10,
                "y":10
            }
            this._setBorder();
            this._init();
        }
        _init(){
            this._paintFunc= this._makePaint();

            this._canvas.addEventListener("mousedown", ()=> {
                this._canvas.addEventListener("mousemove", this._paintFunc);
            });
            this._canvas.addEventListener("mouseup", ()=>{
                this._canvas.removeEventListener("mousemove", this._paintFunc);
            });
            this._canvas.addEventListener("click", this._paintFunc);
        }
        
        //замыкание, что бы сохранить котекст
        _makePaint(){
            let check=this;
            return function (e){
                check._ctx.fillRect(e.offsetX- (check._brush.x / 2), e.offsetY - (check._brush.y / 2), check._brush.x  , check._brush.y );
            }
        }
        _setBorder(){
            this._ctx.strokeRect(0, 0, this._width, this._height);
        }
        setBrush(brush={x:10, y:10}){
            this._brush.x=brush.x || 10;
            this._brush.y=brush.y || 10;
        }
        setColor(color){
            this._ctx.fillStyle = color;
        }
        clear(){
            this._ctx.clearRect(0, 0, this._width, this._height);
            this._setBorder();
        }

    }

    let paint= new Paint("example");
    paint.setColor("red");
    paint.setBrush({x:15, y:15});

    let colors=document.querySelectorAll(".color");
    let clear = document.querySelector(".clear");

    for (const it of colors) {
        it.addEventListener("click", (e)=> {
            console.log(getComputedStyle(e.target).backgroundColor);
            paint.setColor(getComputedStyle(e.target).backgroundColor);
        });
    }
    clear.addEventListener("click", ()=> {
        paint.clear();
    });

}
