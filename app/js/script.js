import Paint from "./Paint.js";
//Ищем порядковый номер элемента
function getNum(elem){
    let items = document.querySelectorAll(".right__panel-item");
    for(let i=0; i< items.length; i++){
        if(Object.is(elem, items[i])) return i;
    }
    return 0;
}
let paint = new Paint("canvas");
//INIT
{
    function setUnactiveAll(){
        let items = document.querySelectorAll(".right__panel-item");
        for (const it of items) {
            it.classList.remove("left__panel-active");
        }
    }
    paint.setSaveCallback(() => {
        setUnactiveAll();
        let panel = document.querySelector(".right__panel");
        let item = document.createElement("div");
        item.classList.add("right__panel-item");
        item.classList.add("left__panel-active");

        item.addEventListener("click", (e)=> {
            paint.load(getNum(item));
        });
        item.innerHTML = paint.getHistory().length-1;


        let img = document.createElement("img");

        img.classList.add("right__panel-img");

        img.src = paint.getCanvas().toDataURL("image/png");
        img.onload = () => {
            item.append(img);
        }


        let close = document.createElement("div");
        close.addEventListener("click",(e) => {
                e.stopPropagation();
                if(confirm("Удалить из истории ? "))
                {
                    let pos=getNum(item);
                    item.remove();
                    paint.deleteHistoryItem(pos);
                }
        });

        close.classList.add("right__item-close");
        item.append(close);

        panel.append(item);
    })
    paint.setLoadCallback(() => {
        setUnactiveAll();
        let items = document.querySelectorAll(".right__panel-item");
        console.log(paint.getHistoryCurrentNumber());
        items[paint.getHistoryCurrentNumber()].classList.add("left__panel-active");
    })

    paint.setSize(innerWidth-280, innerHeight-80);
    paint.addToHistory();

}

// paint.setColor("red");

//global
{
    //при изменении размера окна сбрасывается кисть, пропадает картинка
    window.addEventListener("resize", ()=>{
        let settingCanvas = document.querySelector(".setting-canvas");
        let headerItem = document.querySelector(".header__panel-item");
    })
}

// header panel
{
    let clearBtn = document.querySelector(".clear-item");

    let settingCanvas = document.querySelector(".setting-canvas");

    let saveBtn = document.querySelector(".save-item");
    let testBtn = document.querySelector(".test_click");

    let colorInput = document.querySelector("#bottom__panel-item-color");
    let brushInp = document.querySelector("#input__size-brush");


    //настройка холста
    let inpWidth = document.querySelector("#setting-canvas__width");
    let inpHeight = document.querySelector("#setting-canvas__height");
    let inpScale = document.querySelector("#setting-canvas__scale");

    let inpTop = document.querySelector("#setting-canvas__top");
    let inpLeft = document.querySelector("#setting-canvas__left");
    let modal = document.querySelector(".modal__setting-canvas");
    settingCanvas.addEventListener("click", ()=>{

        inpTop.value = paint.getPosition().top.slice(0, -2);

        inpLeft.value = paint.getPosition().left.slice(0, -2);

        inpWidth.value = paint.getSize().width;
        inpHeight.value = paint.getSize().height;

        inpScale.value=paint.getScale();
        if(!modal.classList.contains("active")){
            modal.classList.add("active");
        }
        else{
            modal.classList.remove("active");
        }

    });

    let settingBtn = document.querySelector("#modal__setting-button");
    settingBtn.addEventListener("click", ()=>{
        modal.classList.remove("active");
        paint.setPosition(inpTop.value+"px", inpLeft.value + "px");
        paint.setSize(inpWidth.value, inpHeight.value);
        paint.setScale(inpScale.value);
    });
    //скачать
    saveBtn.onclick = async function(){
            paint.downloadImage();
    };

    brushInp.value=paint.getBrush().x;

    clearBtn.onclick = function(e){
        if(confirm("Очистить холcт ?")) {
            paint.createNewImage();
            paint.addToHistory();
        }
    }
    brushInp.addEventListener("input", ()=> {
        paint.setBrush({x : brushInp.value, y: brushInp.value});
    });

    colorInput.onchange = function(){
        paint.setColor(colorInput.value);
    }

    testBtn.onclick = function(){

        paint.downloadGif(100, 0);

    }
}

//tool panel
{
    let btnSq= document.querySelector(".square-brush");
    let btnLine = document.querySelector(".line-brush");
    let eraseBtn = document.querySelector(".left__panel-erase");
    let handBtn = document.querySelector(".left__panel-hand");
    let magniferBtn = document.querySelector(".left__panel-magnifier");

    let menuBrush = document.querySelector(".left__panel-item");

    function setUnactiveAll(){
        menuBrush.classList.remove("left__panel-active");
        eraseBtn.classList.remove("left__panel-active");
        handBtn.classList.remove("left__panel-active");
        magniferBtn.classList.remove("left__panel-active");
    }
    btnSq.onclick = function(e){
        paint.setTool("brush-sq");
        setUnactiveAll();
        menuBrush.classList.add("left__panel-active");
    }
    btnLine.onclick = function(e){
        paint.setTool("brush-line");
        setUnactiveAll();
        menuBrush.classList.add("left__panel-active");
    }
    btnLine.click();

    eraseBtn.onclick = function(e){
        paint.setTool("eraser");
        setUnactiveAll();
        eraseBtn.classList.add("left__panel-active");
    }
    handBtn.onclick = function(e){
        paint.setTool("hand");
        setUnactiveAll();
        handBtn.classList.add("left__panel-active");
    }
    magniferBtn.onclick = function(e){
        paint.setTool("magnifier");
        setUnactiveAll();
        magniferBtn.classList.add("left__panel-active");
    }
}
//bottom panel
{
    let film = document.querySelector(".bottom__panel-film");
    
    let saveFilm = document.querySelector(".bottom__panel-save-gif");
    let inputScale = document.querySelector("#input__canvas-scale");
    inputScale.value=1;

    inputScale.addEventListener("input", (e)=>{
        paint.setScale(inputScale.value);
    });

    film.onclick = function(e){
        console.log("start!");
        paint.film(100);
    }
    
    saveFilm.onclick = async (e) => {
        await paint.downloadGif(300, 0);
    }
}

//right panel
{
    let nextBtn = document.querySelector("#history-next-btn");
    let prevBtn = document.querySelector("#history-prev-btn");

    nextBtn.onclick = function(e){
        let num = paint.getHistoryCurrentNumber();
        paint.load(++num);
        console.log("curentNumber" + num);

    }

    prevBtn.onclick = function(e){
        let num = paint.getHistoryCurrentNumber();
        paint.load(--num);
        console.log(num);

    }
    window.addEventListener("keydown", (e) => {
        if(e.code == 'KeyZ' && (e.ctrlKey || e.metaKey)) prevBtn.click();
    });
}