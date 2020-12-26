import Paint from "./Paint.js";

let paint = new Paint("canvas");
console.log(paint._ctx.lineWidth);

paint.setSize(innerWidth-280, innerHeight-80);
console.log(paint._ctx.lineWidth);
window.addEventListener("resize", ()=> {
    paint.setSize(innerWidth-280, innerHeight-80);
});



{
    let clearBtn = document.querySelector(".clear-item");
    
    let testBtn = document.querySelector(".test_click");

    let colorInput = document.querySelector("#bottom__panel-item-color");
    let brushInp = document.querySelector("#input__size-brush");

    let inputScale = document.querySelector("#input__canvas-scale");
    inputScale.value=1;

    inputScale.addEventListener("input", (e)=>{
        paint.setScale(inputScale.value);
    });

    brushInp.value=paint.getBrush().x;
    clearBtn.onclick = function(e){
        if(confirm("Очистить холcт ?")) {
            paint.clear();
        }
    }
    brushInp.addEventListener("input", ()=> {
        paint.setBrush({x : brushInp.value, y: brushInp.value});
    });

    colorInput.onchange = function(){
        paint.setColor(colorInput.value);
    }

    testBtn.onclick = function(){
        let link = document.createElement('a');
        link.download = '1';

        let blob = new Blob (["Hi Prev  Guy!"]);
        link.href = URL.createObjectURL(blob);

        console.log(link);

        link.click();

    }
}

//tool panel
{
    let btnSq= document.querySelector(".square-brush");
    let btnLine = document.querySelector(".line-brush");
    let eraseBtn = document.querySelector(".left__panel-erase");
    let handBtn = document.querySelector(".left__panel-hand");
    let magniferBtn = document.querySelector(".left__panel-magnifier");
    btnSq.onclick = function(e){
        paint.setTool("brush-sq");
    }
    btnLine.onclick = function(e){
        paint.setTool("brush-line");
    }

    eraseBtn.onclick = function(e){
        paint.setTool("eraser");
    }
    handBtn.onclick = function(e){
        paint.setTool("hand");
    }
    magniferBtn.onclick = function(e){
        paint.setTool("magnifier");
    }
}

{
    let saveBtn = document.querySelector(".history_save");
    let loadBtn = document.querySelector(".history_load");
    let film = document.querySelector(".bottom__panel-film");
    
    film.onclick = function(e){
        console.log("start!");
        paint.film(100);
    }

}