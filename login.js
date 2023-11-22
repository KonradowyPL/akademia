function login(token) {
  return new Promise((resolve, reject) => {
    if (token != null) {
      var isOk = true;

      addMessage("Sending data");

      fetch(`https://konradowy.pythonanywhere.com?userId=${token}`)
        .then((response) => {
          text = response.json();
          if (!response.ok) {
            isOk = false;
          }
          return text;
        })

        .then((data) => {
          if (!isOk) {
            addMessage(data.message);
            if (data.clear) {
              localStorage.clear();
              sessionStorage.clear();
            }
          } else {
            const version = data.version;
            const url = data.url;
            const userName = data.userName;

            addMessage("Loging in...");
            const script = document.createElement("script");
            script.src = url;
            document.querySelector("head").appendChild(script);

            let checkExist = setInterval(function () {
              if (typeof tests !== "undefined") {
                localStorage.clear();
                sessionStorage.clear();
                sessionStorage.setItem("tests", JSON.stringify(tests));
                sessionStorage.setItem("file", url);
                sessionStorage.setItem("userName", userName);
                localStorage.setItem("version", version);
                localStorage.setItem("userId", token);

                addMessage("Logged in succesfully!");

                clearInterval(checkExist);

                resolve();
              }
            }, 100);
          }
        })
        .catch((error) => {
          message.innerHTML = `Error: ${error}`;
          console.error("Error:", error);
          resolve();
        });
    }
  });
}
