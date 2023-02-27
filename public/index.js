document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const test = document.getElementById("test");
  const test2 = document.getElementById("test2");
  const returnCode = document.getElementById("returnCode");
  document.addEventListener("click", async (e) => {
    if (e.target === logon) {
      try {
        const response = await fetch("/logon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        returnCode.textContent = response.status.toString();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
        } else {
          message.textContent = data.message;
        }
      } catch (err) {
        message.textContent = "An error occurred: " + err.message;
      }
    } else if (e.target === register) {
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: name.value,
          }),
        });
        const data = await response.json();
        returnCode.textContent = response.status.toString();

        message.textContent = data.message;
      } catch (err) {
        message.textContent = "An error occurred: " + err.message;
      }
    } else if (e.target === logoff) {
      try {
        const response = await fetch("/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        returnCode.textContent = response.status.toString();
        message.textContent = data.message;
      } catch (err) {
        message.textContent = "An error occurred: " + err.message;
      }
    } else if (e.target === test) {
      try {
        const response = await fetch("/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        returnCode.textContent = response.status.toString();
        message.textContent = data.message;
      } catch (err) {
        message.textContent = "An error occurred: " + err.message;
      }
    } else if (e.target === test2) {
      try {
        const response = await fetch("/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        });
        const data = await response.json();
        returnCode.textContent = response.status.toString();
        message.textContent = data.message;
      } catch (err) {
        message.textContent = "An error occurred: " + err.message;
      }
    }
  });
});
