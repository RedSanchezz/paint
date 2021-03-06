
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
        this._scale =1;
        this._ctx.lineWidth= 10;
        this._historyArray = new Array();
        this._init();
    }

    // ** Inner Interface //
    _init(){
        this._listeners = new Map();
        this.setBrush({x: 10, y: 10});
        this.setTool("brush-line");
        this._currentHistoryNumber = 0;
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
    _removeAllListeners(){
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
    //сохранить картинку в историю    
    _save(){
        //Получаем обьект ImageDate  с хослта
        let imgDate = this._ctx.getImageData(0, 0, this._width, this._height);
        this._historyArray.push(imgDate);


        //Создаем элемент


        this._currentHistoryNumber = this._historyArray.length-1;

        if(this._saveCallback){
            this._saveCallback();
        }
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
    createNewImage(){
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._historyArray = new Array();
        let historyItems = document.querySelectorAll(".right__panel-item");
        historyItems.forEach(function(elem, key){
            elem.remove();
        });

    }
    clear(){
        this._ctx.clearRect(0, 0, this._width, this._height);
    }
    setTool(str){
        switch(str){
            case "brush-sq": {
                console.log("brush");
                this._removeAllListeners();
                this._canvas.style.cursor = "default";
                this._action = this._setAction((e)=>{
                    console.log(e.offsetX - (this._brush.x / 2));
                        this._ctx.fillRect(e.offsetX - (this._brush.x / 2), e.offsetY - (this._brush.y / 2), this._brush.x  , this._brush.y );
                    }
                );
                this._addListener(this._canvas, "mousedown", (e)=> {
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    this._save();
                    this._removeListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "click", this._action);
                break;
            }
            case "eraser" : {
                console.log("ereaser");
                this._removeAllListeners();
                this._canvas.style.cursor = "default";

                this._action = this._setAction((e)=>{
                    this._ctx.clearRect(e.offsetX- (this._brush.x / 2), e.offsetY - (this._brush.y / 2), this._brush.x  , this._brush.y );
                });

                this._addListener(this._canvas, "mousedown", ()=> {
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    this._save();
                    this._removeListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "click", this._action);
                break;
            }
            case "brush-line" : {
                console.log("brush-line");
                this._canvas.style.cursor = "default";
                this.setBrush(this._brush);
                this._removeAllListeners();


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
                    this._save();
                    this._removeListener(this._canvas, "mousemove", this._action);
                });
                break;

            }
            case "hand" : {
                console.log("hand");
                let x, y;
                this.setBrush(this._brush);
                this._removeAllListeners();
                this._canvas.style.cursor = "move";

                this._action = this._setAction((e)=>{
                    let offsetX = x - e.clientX;
                    let offsetY = y - e.clientY;
                    console.log(offsetX+  "   " + offsetY);
                    x=e.clientX;
                    y=e.clientY;

                    this._canvas.style.left= +this._canvas.style.left.slice(0, -2) - offsetX + "px";
                    this._canvas.style.top= +this._canvas.style.top.slice(0, -2) - offsetY + "px";

                });

                this._addListener(this._canvas, "mousedown", (e)=> {
                    x=e.clientX;
                    y=e.clientY;
                    console.log(x + "  " + y);
                    this._addListener(this._canvas, "mousemove", this._action);
                });

                this._addListener(this._canvas, "mouseup", ()=> {
                    this._removeListener(this._canvas, "mousemove", this._action);
                });
                break;
            }
            case "magnifier" : {
                console.log("magnifier");
                this.setBrush(this._brush);
                this._removeAllListeners();

                this._canvas.style.cursor = "default";

                this._addListener(this._canvas, "click", (e)=>{
                        this._scale=+this._scale+0.2;
                        this._canvas.style.transform = "scale("+this._scale+")";
                        e.preventDefault();
                });
                this._addListener(this._canvas, "contextmenu", (e)=>{
                        this._scale=+this._scale-0.2;
                        if(this._scale<0.1) this._scale=0.1;
                        this._canvas.style.transform = "scale("+this._scale+")";
                        e.preventDefault();
                });
                this._addListener(this._canvas, "dbclick", (e)=>{
                    e.preventDefault();
                });
                break;
            }
            default: {

            }
        }
    }
    //при изменении размеров слетает кисть
    setSize(width, height){
        let savedBrush = this.getBrush();
        let color = this.getColor();
        console.log(this._height);
        console.log(this._width);
        this._height = height;
        this._width = width;
        this._canvas.height = height ;
        this._canvas.width = width ;
        this.setBrush(savedBrush);
        this.setColor(color);
        if(this._historyArray.length!=0) this.load(this._historyArray.length-1);
    }
    getSize(){
        return {
            "width": this._width,
            "height": this._height
        }
    }
    getPosition(){
        return {
            "left": this._canvas.style.left,
            "top": this._canvas.style.top
        }
    }
    setPosition(top, left){
        
        this._canvas.style.left = left;
        this._canvas.style.top = top;
        

    }
    setScale(scale){
        this._scale = +scale;
        this._canvas.style.transform = "scale("+this._scale +")";
    }
    getScale(){
        return +this._scale;
    }

    getCanvas(){
        return this._canvas;
    }
    addToHistory(){
        this._save();
    }

    //загрузить вывести картинку на холст из истории
    load(num){
        if(num>=0 && num<this._historyArray.length)
        {
            this._ctx.putImageData(this._historyArray[num], 0, 0);
            this._currentHistoryNumber = +num;
            if(this._loadCallback)
            {
                this._loadCallback();
            }
        }
    }
    getHistoryCurrentNumber(){
        return this._currentHistoryNumber;
    }

    film(ms){
        let savedThis = this;
        let it=0;
        let func = ()=>{
            if(it<savedThis._historyArray.length)
            {
                savedThis.load(it);
                console.log(it);
                it++;
                setTimeout(func, ms)
            }
        }
        setTimeout(func, ms);
    }

    getHistory(){
        return this._historyArray;
    }
    deleteHistoryItem(num){
        this._historyArray.splice(num, 1);
        this.load(this.getHistoryCurrentNumber()-1);
        console.log("delete history ");
    }
    //сохраняем текущий canvas в виде картинки 
    downloadImage(){
        let link = document.createElement("a");

        link.href = this._canvas.toDataURL();

        link.setAttribute("download", "image.png");
        
        link.click();
    }
    getContext(){
        return this._ctx;
    }
    downloadGif(delay, repeat=0){
        let encoder = new GIFEncoder(); 
        encoder.start();
        encoder.setRepeat(repeat);
        encoder.setDelay(delay);

        // encoder.setSize(this._width, this._height);
        if(this._width == 500 && this._height == 500){
            alert("Извините, по непонятным причинам размер холста не может быть 500х500");
            if(!confirm("Ширина хоста будет увеличена до 501px")){
                return;
            }
            this.setSize(501, 500);
        }

        console.log(this._width + " " + this._height);
        
        // let array = this.getHistory();

        let array = Array.from(this.getHistory());
        console.log();

        for(let i=0; i<array.length; i++) {
            this._ctx.putImageData(array[i], 0, 0);
            encoder.addFrame(this._ctx);
        }
        encoder.finish();
        encoder.download("download.gif");
    }
    //Установить callback, который будет вызываться при  сохранении в историю
    setSaveCallback(func){
        this._saveCallback = func;
    }
    //Установить callback, который будет вызываться при  переходе к кадру истории
    setLoadCallback(func){
        this._loadCallback = func;
    }

}