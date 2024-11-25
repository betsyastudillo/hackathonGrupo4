// Manejo del usuario
window.onload = function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userContainer = document.getElementById("userContainer");
    const loginContainer = document.getElementById("loginContainer");
    const userName = document.getElementById("userName");
    const userPhoto = document.getElementById("userPhoto");
    const logoutButton = document.getElementById("logoutButton");

    if (loggedInUser) {
        userContainer.style.display = "flex";  // Muestra el contenedor del usuario
        loginContainer.style.display = "none";  // Oculta el botón de inicio de sesión
        userName.textContent = loggedInUser.name; // Muestra el nombre del usuario
        
        // Verifica si el usuario tiene una foto guardada
        if (loggedInUser.photo) {
            userPhoto.src = loggedInUser.photo; // Muestra la foto del usuario si está guardada
        } else {
            userPhoto.src = "default-profile.png"; // O una imagen por defecto si no tiene foto
        }
    } else {
        userContainer.style.display = "none";    // Oculta el contenedor del usuario
        loginContainer.style.display = "block";   // Muestra el botón de inicio de sesión
    }

    // Manejo del cierre de sesión
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        window.location.reload(); // Recargar la página
    });
};

// Cambia la imagen de perfil al hacer clic en ella
function changeProfilePic() {
    document.getElementById('file-input').click();
}

// Muestra una vista previa de la imagen seleccionada y la sube al servidor
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const profilePic = document.getElementById('userPhoto');
        profilePic.src = e.target.result; // Cambia la imagen de perfil

        // Guarda la nueva imagen en localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('email', loggedInUser.email); // Asumiendo que el email se usa como identificador

            // Hacer una solicitud POST para actualizar la imagen de perfil en el servidor
            fetch('/updateProfilePic', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Actualizar la imagen en localStorage
                    loggedInUser.photo = e.target.result;
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                } else {
                    alert('Error al actualizar la foto de perfil');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Hubo un error al subir la foto.');
            });
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}
