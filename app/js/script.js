{  
    class Paint{

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
            this._ctx = example.getContext('2d');
            this._brush={
                "x":10,
                "y":10
            }
            this._init();
        }

        // ** Inner Interface //
        _init(){
            this._paintBorder();
            this._action = this._makePaint();
            this._listeners = new Map();

            this._addListener(this._canvas, "mousedown", ()=> {
                this._addListener(this._canvas, "mousemove", this._action);
            });


            this._addListener(this._canvas, "mouseup", ()=> {
                this._removeListener(this._canvas, "mousemove", this._action);
            });

            this._addListener(this._canvas, "click", this._action);
        }

        //замыкание, что бы сохранить котекст
        _makePaint(){
            let check=this;
            return function (e){
                check._ctx.fillRect(e.offsetX- (check._brush.x / 2), e.offsetY - (check._brush.y / 2), check._brush.x  , check._brush.y );
            }
        }
        _paintBorder(){
            this._ctx.strokeRect(0, 0, this._width, this._height);
        }
        _setAction (str){
            switch(str){
                case 'brush': {

                }
                default: {

                }
            }
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


        //********Public Interface *************/
        setBrush(brush={x:10, y:10}){
            this._brush.x=brush.x || 10;
            this._brush.y=brush.y || 10;
        }
        setColor(color){
            this._ctx.fillStyle = color;
        }
        clear(){
            this._ctx.clearRect(0, 0, this._width, this._height);
            this._paintBorder();
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
