emailjs.init("UehVdmGwtpmcV70Sd");

function finalizarChecklist(){

let operador = document.getElementById("operador").value;
let lider = document.getElementById("lider").value;
let turno = document.getElementById("turno").value;
let data = document.getElementById("data").value;

let itens = document.querySelectorAll(".item");

let resultados = [];
let textoResultados = "";

let promises = [];

itens.forEach((item,index)=>{

let titulo = item.querySelector(".titulo").innerText;

let radio = item.querySelector("input[type=radio]:checked");
let status = radio ? radio.value : "Não marcado";

let obs = item.querySelector(".obs").value;

let fotoInput = item.querySelector(".foto");

let promessa = new Promise((resolve)=>{

if(fotoInput.files.length > 0){

let reader = new FileReader();

reader.onload = function(e){

converterParaJPG(e.target.result,function(imagem){

resultados.push({
item:index+1,
titulo,
status,
obs,
imagem
});

/* TEXTO DO EMAIL (SEM IMAGEM) */

textoResultados += "ITEM "+(index+1)+" - "+titulo+"<br>";
textoResultados += "Status: "+status+"<br>";

if(obs){
textoResultados += "Obs: "+obs+"<br>";
}

textoResultados += "Imagem registrada no sistema<br><br>";

resolve();

});

};

reader.readAsDataURL(fotoInput.files[0]);

}else{

resultados.push({
item:index+1,
titulo,
status,
obs,
imagem:null
});

textoResultados += "ITEM "+(index+1)+" - "+titulo+"<br>";
textoResultados += "Status: "+status+"<br>";

if(obs){
textoResultados += "Obs: "+obs+"<br>";
}

textoResultados += "<br>";

resolve();

}

});

promises.push(promessa);

});

Promise.all(promises).then(()=>{

let historico = JSON.parse(localStorage.getItem("historicoChecklist")) || [];

let area = document.querySelector("h1").innerText;

historico.push({
operador,
lider,
turno,
data,
area,
resultados
});

localStorage.setItem("historicoChecklist", JSON.stringify(historico));

emailjs.send("service_u1dl3tq","template_zekwc0r",{

operador: operador,
area: area,
data: data,
resultados: textoResultados

})
.then(()=>{

alert("Checklist enviado e salvo!");

})
.catch((erro)=>{

console.log(erro);
alert("Erro ao enviar email");

});

});

}

function converterParaJPG(base64,callback){

let img = new Image();

img.onload = function(){

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img,0,0);

let jpg = canvas.toDataURL("image/jpeg",0.7);

callback(jpg);

};

img.src = base64;

}
