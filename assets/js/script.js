const seuVotoPara = document.querySelector('.d-1-1 span');
const cargo = document.querySelector('.d-1-2 span');
const descricao = document.querySelector('.d-1-4');
const aviso = document.querySelector('.d-2');
const lateral = document.querySelector('.d-1--right');
const numeros = document.querySelector('.d-1-3');
const tela1 = document.querySelector('.tela-1');
const tela2 = document.querySelector('.tela-2');
const music = new Audio('assets/audios/confirm.wav');

let etapaAtual = 0;
let numero = "";
let branco = false;
let candidatoValido = false;
const votos = [];

function comecarEtapa(){
    const etapa = etapas[etapaAtual];
    let numeroHTML = "";
    numero = "";
    for(let i = 0; i < etapa.numeros; i++){
        if(i === 0){
            numeroHTML += '<div class="numero pisca"></div>';
        } else {
            numeroHTML += '<div class="numero"></div>';
        }
    }


    seuVotoPara.style.display = "none";
    cargo.innerHTML = etapa.titulo;
    numeros.style.display = "flex";
    numeros.innerHTML = numeroHTML;
    descricao.innerHTML = "";
    aviso.style.display = "none";
    lateral.innerHTML = "";
    branco = false;
    candidatoValido = false;

}


function atualizaInterface(numero){
    const etapa = etapas[etapaAtual];
    const candidato = etapa.candidatos.find((desc)=>desc.numero === numero);
    if(candidato){
        seuVotoPara.style.display = "block";
        let descricaoHtml = `Nome: ${candidato.nome}<br>Partido: ${candidato.partido}<br>`;
        if(candidato.vice){
            descricaoHtml = `${descricaoHtml}Vice: ${candidato.vice}`
        }
        descricao.innerHTML = descricaoHtml;
        for(foto of candidato.fotos){
            const div = document.createElement('div');
            div.classList.add('d-1-image');
            if(foto.small === true){
                div.classList.add('small');
            }
            const img = document.createElement('img');
            img.src = `assets/images/${foto.url}`;
            div.append(img, foto.legenda);
            lateral.append(div);
        }

        aviso.style.display = "block";
        candidatoValido = true;
        branco = false;

    } else {
        seuVotoPara.style.display = "block";
        const divNulo = document.createElement('div');
        divNulo.classList.add('aviso--grande', 'pisca');
        divNulo.append('VOTO NULO');
        descricao.append(divNulo);
        aviso.style.display = "block";
        candidatoValido = false;
        branco = false;
    }
}

document.querySelector('.teclado').addEventListener('click', (event)=>{
    const id = parseInt(event.target.getAttribute('id'));
    const etapa = etapas[etapaAtual];
    const piscaNumero = document.querySelector('.numero.pisca');
    if(id > -1 && piscaNumero !== null){
        piscaNumero.innerHTML = id;
        piscaNumero.classList.remove('pisca');
        numero = `${numero}${id}`;
        if(piscaNumero.nextElementSibling !== null){
            piscaNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface(numero);
        }
    } else if (id === -2){
        comecarEtapa();
        numero = "";
    } else if (id === -3 && (numero.length == etapa.numeros || branco == true)){
        if (candidatoValido === true){
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: numero
            });
        } else if(candidatoValido === false && branco === true){
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: 'BRANCO'
            });
        } else {
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: 'NULO'
            });
        }
        
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined){
            comecarEtapa();
        } else {
            music.play();
            tela1.classList.remove('ativo');
            tela2.classList.add('ativo');
            console.log(votos);
            
            setTimeout(()=>{
                tela2.classList.remove('ativo');
                tela1.classList.add('ativo');
                etapaAtual = 0;
                comecarEtapa();
            }, 2000);
            
        }
           
    } else if (id === -1){
        if(numero === ""){
            comecarEtapa();
            seuVotoPara.style.display = "block";
            const divNulo = document.createElement('div');
            divNulo.classList.add('aviso--grande', 'pisca');
            divNulo.append('VOTO BRANCO');
            descricao.append(divNulo);
            aviso.style.display = "block";
            branco = true;
            candidatoValido = false;
            numeros.style.display = "none";
        }  
    }
});

comecarEtapa();
