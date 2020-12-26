
export default class Paint{
    /*_
        _canvas - элемент с canvas
            _width, _height - его длинна и ширина
            _ctx - контекст 
            _brush - обьект типа {
                x: 10,
                y: 10
            }
            задает кисть
            _action - текущее действие. функция
    */
    constructor(id){
        this._canvas = document.getElementById(id);
        this._width= getComputedStyle(this._canvas).width.slice(0, -2);
        this._height= getComputedStyle(this._canvas).height.slice(0, -2);
        this._ctx = this._canvas.getContext('2d');
        this._brush={
            "x":10,
            "y":10
        }
        this._ctx.lineWidth= 10;
        this._init();
    }

    // ** Inner Interface //
    _init(){
        this._listeners = new Map();
        this.setBrush({x: 10, y: 10});
        this.setTool("brush-sq");
        console.log("line with in init " + this._ctx.lineWidth);

        this._canvas.addEventListener("mousemove", (e)=> {
            let cursor = document.querySelector(".cursor");
            cursor.style.width=this._brush.x+"px";
            cursor.style.height=this._brush.y + "px";
            cursor.style.backgroundColor = this.getColor();
            cursor.style.display = "block";
            cursor.style.top = e.offsetY -this._brush.y/2 + "px";
            cursor.style.left = e.offsetX -this._brush.x/2 + "px";
        });
        this._canvas.addEventListener("mouseleave", (e)=> {
            let cursor = document.querySelector(".cursor");
            cursor.style.display = "none";
        });
    }

    //замыкание, что бы сохранить котекст
    _setAction(callback){
        return callback.bind(this);
    }

    //нужно, что бы отменять eventListeners  при выборе другого действия
    _addListener(elem, type, func){
        //Если уже существует с таким типом
        if(this._listeners.has(type)){
            let array = this._listeners.get(type);
            let check=false;
            //если уже есть такой элемент c таким обработчиком
            for (const it of array) {
                if(it.elem === elem && it.func === func){
                    check=true;
                    break;
                }
            }
            if(!check){
                array.push({
                    "elem": elem,
                    "func":func
                });
            }
        } else {
            let array = new Array();
            array.push({
                "elem": elem,
                "func": func
            });
            this._listeners.set(type, array)
        }
        console.log(this._listeners);
        elem.addEventListener(type, func);
    }
    _removeListener(elem, type, func){
        if(this._listeners.has(type)){
            let array = this._listeners.get(type);
            let check=false;
            //пробегаемся по массиву пар elem, func
            for(let i=0; i<array.length; i++){
                if(array[i].elem === elem && array[i].func === func)
                {
                    array.splice(i, 1);
                    check = true;
                    break;
                }
            }
            if(array.length==0){
                this._listeners.delete(type);
            }
            elem.removeEventListener(type, func);
            console.log(this._listeners);
        }
    }
    _removeAll(){
        for (const it of this._listeners.entries()) {
            let type = it[0];
            let array=it[1];
            for(let i=0; i < array.length; i++)
            {
                let elem = array[i].elem;
                let func = array[i].func;
                elem.removeEventListener(type, func);
            }
        }
        this._listeners.clear();
    }

    //********Public Interface *************/
    setBrush(brush){
        this._brush.x=brush.x || 10;
        this._brush.y=brush.y || 10;
        this._ctx.lineWidth = brush.x ||10;
    }
    getBrush(){
        return this._brush;
    }
    setColor(color){
        this._ctx.fillStyle = color;
        this._ctx.strokeStyle = color;
    }
    getColor(){
        return this._ctx.fillStyle;
    }
    clear(){
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    setTool(str){
        switch(str){
            case "brush-sq": {
                console.log("brush");
                this._removeAll();
                this._action = this._setAction((e)=>{
                    console.log(e.offsetX - (this._brush.x / 2));
                        this._ctx.fillRect(e.offsetX - (this._brush.x / 2), e.offsetY - (this._brush.y / 2), this._brush.x  , this._brush.y );
                    }
                );
                this._addListener(this._canvas, "mousedown", (e)=> {
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    this._removeListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "click", this._action);
                break;
            }
            case "eraser" : {
                console.log("ereaser");
                this._removeAll();

                this._action = this._setAction((e)=>{
                    this._ctx.clearRect(e.offsetX- (this._brush.x / 2), e.offsetY - (this._brush.y / 2), this._brush.x  , this._brush.y );
                });

                this._addListener(this._canvas, "mousedown", ()=> {
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    this._removeListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "click", this._action);
                break;
            }
            case "brush-line" : {

                console.log("brush-line");
                console.log("line with in setTools " + this._ctx.lineWidth);
                this.setBrush(this._brush);
                this._removeAll();


                this._action = this._setAction((e)=>{
                    this._ctx.lineTo(e.offsetX, e.offsetY);
                    this._ctx.stroke();
                });


                this._addListener(this._canvas, "mousedown", (e)=> {
                    this._ctx.beginPath();
                    this._ctx.moveTo(e.offsetX, e.offsetY);
                    
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    
                    this._ctx.closePath();
                    this._removeListener(this._canvas, "mousemove", this._action);
                });

            }
            default: {

            }
        }
    }
    setSize(width, height){
        console.log(this._height);
        console.log(this._width);
        this._height = height;
        this._width = width;
        this._canvas.height= height ;
        this._canvas.width= width ;
    }
    getCanvas(){
        return this._canvas;
    }
}