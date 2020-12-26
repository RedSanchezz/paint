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
        paint.getCanvas().style.transform = "scale(1.5)";
    }
}
//tool panel
{
    let btnSq= document.querySelector(".square-brush");
    let btnLine = document.querySelector(".line-brush");
    let eraseBtn = document.querySelector(".left__panel-erase");

    btnSq.onclick = function(e){
        paint.setTool("brush-sq");
    }
    btnLine.onclick = function(e){
        paint.setTool("brush-line");
    }

    eraseBtn.onclick = function(e){
        paint.setTool("eraser");
    }
}