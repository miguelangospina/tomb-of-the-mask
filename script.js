/*Contrato: (number) -> Inicio del juego
Propósito: esta función muestra la interfaz de inicio del juego.
Prototipo: function iniciar J(n)*/

function iniciarJ(n){
  //Se ejecuta todo eso cuando se pulsa Play.
  if (n == 1&&!final){
    play=true 
    document.getElementById('game-status').style.display = 'flex';
    document.getElementById('vidas').style.display = 'flex';
    document.getElementById('historia').style.display='none';
    document.getElementById('instrucciones').style.display = 'none';
    document.getElementById('mensaje').style.display='none'
    document.getElementById('tiempo').style.display='none'
    document.getElementById('dev').style.display='flex';
    document.getElementById('cargaJ').style.display='none'
    document.getElementById('loaderT').style.display='none'
  }else if(n==1){
    document.getElementById('instrucciones').style.display = 'none';
    document.getElementById('historia').style.display='none';
  }
  //Esto se ejecuta cuando se pulsa Restart.
  else if (n == 2&&!final){
    play=false
    document.getElementById('cargaJ').style.display='flex'
    document.getElementById('loaderT').style.display='flex'
  }
  //Muestra el mensaje "Presione play" mientras el juego aún no se ejecuta.
  else if (n == 3){
    document.getElementById('mensaje').style.display='flex'
    document.getElementById('tiempo').style.display='none'
  }
  //Se ejecuta cuando Tomb choca con un muro por primera vez. 
  else if (n == 4 && adver == 1){
    document.getElementById('advertencia').style.display = 'flex';
    
  }
  //Aquí se inicia un contador, gracias a este se ejecuta el anterior else if.
  
  //Con este se oculta la advertencia. 
    else if (n == 5){
      document.getElementById('advertencia').style.display = 'none';
    }
}

/*Contrato: () -> instrucciones ocultas
Propósito: esta función hace que las instrucciones estén ocultas.
Prototipo: function ocultar()*/ 

function ocultar(){
  document.getElementById('instrucciones').style.display = 'none';
  document.getElementById('dev').style.display='flex';
  if (!play){
    document.getElementById('historia').style.display='block'
  }
}

/*Contrato: () -> Instrucciones
Propósito: esta función muestra las instrucciones al pulsar el botón "Instructions".
Prototipo: function mostrar()*/ 

function mostrar(){
  play=false;
  document.getElementById('instrucciones').style.display = 'block';
  document.getElementById('historia').style.display='none'
  document.getElementById('dev').style.display='none'
  document.getElementById('cargaJ').style.display='flex'
  document.getElementById('loaderT').style.display='flex'
}
var reinicio = false;

/*Contrato: () -> Reinicio del juego
Propósito: esta función reinicia el juego.
Prototipo: function reiniciar()*/ 

function reiniciar(){
  reinicio = true;
  window.clearInterval(Intervalo);
  Intervalo  = setInterval(temporizador, 1000);
  times=2*60;  
}

let startTime=2;
let times = startTime*60; 
let Intervalo  = setInterval(temporizador, 1000); 

/*Contrato: () -> tiempo
Propósito: esta función indica cuánto tiempo le queda al jugador para pasar el juego. 
Prototipo: function temporizador()*/

function temporizador(){
  if (play && puntaje < 72&&!final){
    let minutes = Math.floor(times/60);
    let seconds = times % 60; 
    if (minutes!= 0 || seconds != 0){
      if (minutes < 10){
        minutes = "0" + minutes.toString();
      }
      if (seconds < 10){
        seconds = "0" + seconds.toString();
      }
      const rel= document.getElementById('relog');
      rel.innerHTML = minutes + ":" + seconds;
      times=times-1;
    }else {
      final=true;
      document.getElementById('loserTime').style.display='flex';
      
    }
  }
}

window.addEventListener("load",function(){
 document.getElementById("loaderC").classList.toggle("loaderC2")
})

/*Contrato: () -> Loser
Propósito: esta función muestra una alerta que dice "loser" cuuando el jugador pierde todas sus vidas. 
Prototipo: function final()*/
