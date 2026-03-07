document.getElementById("signin-btn").addEventListener("click", function(){
    // console.log("sign in btn click");
    const userInput=document.getElementById("user-id");
    const userName = userInput.value;
    console.log(userName);
    
    const inputPass = document.getElementById("input-pass");
    const pass = inputPass.value;
    console.log(pass);

    if(userName==="admin" && pass==="admin123"){
        alert("sign in successfull");
        window.location.assign("/home.html");
    } else{
        alert("sign in failed");
        return;
    }
})