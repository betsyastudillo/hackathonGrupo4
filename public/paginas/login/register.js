const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        name: name,
        email: email,
        password: password,
        photo: "ruta/a/tu/foto.jpg" // Ajusta esta ruta según necesites
    };

    try {
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = "Login.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error al registrar:', error);
    }
});
