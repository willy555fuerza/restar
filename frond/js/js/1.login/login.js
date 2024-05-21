
// login.js
const form_login = document.getElementById('login-form');
form_login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3009/La_holandesa/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username, 
                password 
            }),
            credentials: 'include' // Incluye las cookies en la solicitud   
        });
                
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            verificarAutenticacion(); // Verificar la autenticación después de iniciar sesión
        } else {
            // Manejo de errores en caso de credenciales incorrectas
            console.error('Credenciales incorrectas');
        }
                
    } catch (err) {
        console.error('Error al enviar la solicitud:', err);
        alert('Error al enviar la solicitud');
    }
});

const verificarAutenticacion = async () => {
    try {
        const response = await fetch('http://localhost:3009/La_holandesa/verify-auth', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            // El usuario está autenticado, redirigir al panel de control
            window.location.href = "http://127.0.0.1:5500/frond/usuarios.html";
        } else {
            // El usuario no está autenticado, redirigirlo a la página de inicio de sesión
            window.location.href = "http://127.0.0.1:5500/frond/index.html";
        }
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
    }
};

// Llamar a la función de verificación de autenticación al cargar la página


// Función para decodificar un token JWT (JSON Web Token)
function parseJwt(token) {
    try {
        // Dividir el token en sus tres partes: encabezado, carga útil y firma
        const [header, payload, signature] = token.split('.');
        // Decodificar la carga útil Base64 y analizarla como JSON
        const decodedPayload = JSON.parse(atob(payload));
        // Decodificar el encabezado Base64 y analizarlo como JSON
        const decodedHeader = JSON.parse(atob(header));
        return { header: decodedHeader, payload: decodedPayload };
    } catch (error) {
        // Manejar errores al decodificar el token
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

//**************Función para verificar la autenticación del usuario********************/

  
  //**************Función para verificar la autenticación del usuario********************/
  