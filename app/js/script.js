import Paint from "./Paint.js";

let paint = new Paint("canvas");

paint.setSize(innerWidth-280, innerHeight-80);

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
    saveBtn.onclick = function(){
        paint.downloadImage();
    };

    brushInp.value=paint.getBrush().x;

    clearBtn.onclick = function(e){
        if(confirm("Очистить холcт ?")) {
            paint.createNewImage();
            
        }
    }
    brushInp.addEventListener("input", ()=> {
        paint.setBrush({x : brushInp.value, y: brushInp.value});
    });

    colorInput.onchange = function(){
        paint.setColor(colorInput.value);
    }

    testBtn.onclick = function(){
        paint.downloadImage();
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
    
    let inputScale = document.querySelector("#input__canvas-scale");
    inputScale.value=1;

    inputScale.addEventListener("input", (e)=>{
        paint.setScale(inputScale.value);
    });

    film.onclick = function(e){
        console.log("start!");
        paint.film(100);
    }

}