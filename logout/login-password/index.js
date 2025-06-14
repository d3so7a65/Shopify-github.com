const Eyecon = document.querySelectorAll('.Eyecon');
const x=document.querySelectorAll('#MyInput')
for(let i=0;1<Eyecon.length;i++){
    Eyecon[i].addEventListener('click',()=>{
        if(x[i].type==="password"){
            x[i].type="text"
            Eyecon[i].classList.add('fa-eye')
            Eyecon[i].classList.remove('fa-eye-slash')
        }
        else{
            x[i].type="password"
            Eyecon[i].classList.remove('fa-eye')
            Eyecon[i].classList.add('fa-eye')
        }
    })  
}