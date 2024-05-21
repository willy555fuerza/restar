//*********************************poner en mayuscula**********************************/
function mayus(e) {
  e.value = e.value.toUpperCase();
}
//*********************************poner en mayuscula**********************************/

//***********************************crear usuario*************************************/
const formAgregarUsuario = document.getElementById("form");

formAgregarUsuario.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  // Obtener los valores del formulario, incluida la foto
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const foto = document.getElementById("foto").files[0];
  const perfil = document.getElementById("perfil").value; // Nuevo campo de perfil
  const usuario = document.getElementById("usuario").value;
  const contraseña = document.getElementById("contraseña").value;

  // Crear un objeto FormData para enviar datos de formulario, incluida la foto
  const formData = new FormData();
  formData.append("nombres", nombres);
  formData.append("apellidos", apellidos);
  formData.append("foto", foto); // Agregar la foto al FormData
  formData.append("perfil", perfil);
  formData.append("usuario", usuario);
  formData.append("password", contraseña);

  try {
    // Enviar los datos al servidor para crear el nuevo usuario
    const response = await fetch(
      "http://localhost:3009/ADB/create_users",
      {
        method: "POST",
        /* headers: {
                'Content-Type': 'application/json'
            }, */
        body: formData, // Usar el FormData que contiene la foto
        /* body: JSON.stringify({
                nombres,
                apellidos,
                foto,
                perfil,
                usuario,
                contraseña
            }) */
      }
    );

    if (response.ok) {
      const create = await response.json();
      // Actualizar la tabla después de cambiar el estado
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: create.message,
      });
      getAll();
    } else {
      const errorData = await response.json();
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: errorData.error,
      });
      getAll();
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    alert("Error al enviar la solicitud");
  }
});
//***********************************crear usuario*************************************/

//*************renderizado de tabla usuarios y mostrar tabla usuario*******************/
const users = document;

const paginaUsers = users.querySelector("#usuarios");

const Users = ({
  id_usuario,
  nombres,
  apellidos,
  foto,
  perfil,
  usuario,
  fecha_registro,
  estado,
}) => {
  // Convertir la fecha de registro a un formato de año-mes-día
  const formattedDate = new Date(fecha_registro).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const buttonColor =
    estado === true ? "btn btn-outline-success" : "btn btn-outline-danger";
  const buttontxt = estado === true ? "SI" : "NO";

  // Mostrar la contraseña como asteriscos
  /* const maskedPassword = contraseña.replace(/./g, '*'); */
  // Mostrar solo los últimos 4 caracteres de la contraseña cifrada
  /* const maskedPassword = `******${contraseña.slice(-4)}`; */
  // Mostrar la contraseña cifrada como asteriscos
  /* const maskedPassword = '*'.repeat(contraseña.length); */
  // Mostrar los primeros 2 y últimos 2 caracteres de la contraseña cifrada
  /* const maskedPassword = `${contraseña.slice(0, 2)}..${contraseña.slice(-2)}`; */

  return `
            <tr id="user-row-${id_usuario}">  <!-- Agregar un ID único para la fila --> 
                <td>${id_usuario}</td>
                <td>${nombres}</td>
                <td>${apellidos}</td>
                <td style="width:10%;"><img src="data:image/jpeg;base64,${foto}" class="img-responsive img-fluid" alt="Responsive image"></td>
                <td>${perfil}</td>
                <td>${usuario}</td>
                <td>${formattedDate}</td>
                <td>
                    <div class="container-btn-state">
                        <button style="cursor: inherit;" class="${buttonColor}">${buttontxt}</button>
                    </div>
                </td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Acciones
                        </button>
                        <ul class="dropdown-menu ">
                            <li><a id="actualizar" class="dropdown-item" onclick="toggleEditMode(${id_usuario})" class="dropdown-item" href="#">Actualizar</a></li>
                            <li><a onclick="deleteUser(${id_usuario})" class="dropdown-item" href="#">Eliminar</a></li>
                            <li><a onclick="changeState(${id_usuario}, ${estado})" class="dropdown-item" href="#" id="change-state-${id_usuario}">${estado ? "Inhabilitar" : "Habilitar"}</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
    `;
};

/* const render = (data) => {
    const filteredUsers = data.filter(user => user.estado == true);
    const sortedUsers = filteredUsers.sort((a, b) => a.id_usuario - b.id_usuario);
  
    if (Array.isArray(sortedUsers) && sortedUsers.length > 0) {
      const cardsHTML = sortedUsers.map(item => Users(item)).join('');
      paginaUsers.innerHTML = cardsHTML;
    } else {
      paginaUsers.innerHTML = '<tr><td colspan="8">NO SE ENCONTRARON USUARIOS.</td></tr>';
    }
  }; */

const render = (data) => {
  const sortedUsers = data.sort((a, b) => {
    // Si a está habilitado y b no, a debe ir antes que b
    if (a.estado && !b.estado) {
      return -1;
    }
    // Si b está habilitado y a no, b debe ir antes que a
    if (!a.estado && b.estado) {
      return 1;
    }
    // Si ambos están habilitados o deshabilitados, ordenar por id_usuario
    return a.id_usuario - b.id_usuario;
  });

  if (Array.isArray(sortedUsers) && sortedUsers.length > 0) {
    const cardsHTML = sortedUsers.map((item) => Users(item)).join("");
    paginaUsers.innerHTML = cardsHTML;
    
  // Verificar si la tabla ya ha sido inicializada
  if (!$.fn.DataTable.isDataTable("#myTable")) {
    // Si la tabla no ha sido inicializada, inicializar DataTables
    $("#myTable").DataTable({
      language: {
        // Configuración del idioma
        decimal: "",
        emptyTable: "No hay información",
        info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        infoEmpty: "Mostrando 0 to 0 of 0 Entradas",
        infoFiltered: "(Filtrado de _MAX_ total entradas)",
        infoPostFix: "",
        thousands: ",",
        lengthMenu: "Mostrar _MENU_ Entradas",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        search: "Buscar:",
        zeroRecords: "Sin resultados encontrados",
        paginate: {
          first: "Primero",
          last: "Ultimo",
          next: ">",
          previous: "<",
        },
      },
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "Todos"],
      ], // Opciones de longitud de página
      pageLength: 5, // Mostrar 5 filas por página de manera predeterminada
      resposive:true,
      autowidth:true,
    });
  }
  
  } else {
    paginaUsers.innerHTML =
      '<tr><td colspan="8">NO SE ENCONTRARON USUARIOS.</td></tr>';
  }
};

const getAll = async () => {
  try {
    const response = await fetch("http://localhost:3009/ADB/Users");
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();
    /* console.log(result); */
    if (result.error) {
      console.error("Error:", result.message);
      alert(result.message);
    } else {
      render(result.data);
    }
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
};
//*************renderizado de tabla usuarios y mostrar tabla usuario*******************/

let isEditMode = false;

const toggleEditMode = (id_usuario) => {
  const row = document.getElementById(`user-row-${id_usuario}`);
  const editButton = row.querySelector("#actualizar");
  const cells = row.getElementsByTagName("td");

  // Guardar los valores originales de todas las celdas
  const valoresOriginales = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    valoresOriginales.push(cell.innerHTML);
  }

  if (!isEditMode) {
    // Modo de edición
    editUser(id_usuario);
    editButton.innerHTML = "Guardar";
    editButton.setAttribute(
      "onclick",
      `toggleEditMode(${id_usuario}, ${JSON.stringify(valoresOriginales)})`
    );
    isEditMode = true;
  } else {
    // Modo de guardar cambios
    saveChanges(id_usuario, valoresOriginales);
    editButton.innerHTML = "Actualizar";
    editButton.setAttribute("onclick", `toggleEditMode(${id_usuario})`);
    isEditMode = false;
  }
};

//*****************************editar usuario y guardar********************************/
const editUser = (id_usuario) => {
  const row = document.getElementById(`user-row-${id_usuario}`);
  const cells = row.getElementsByTagName("td");

  // Guardar los valores originales de todas las celdas
  const valoresOriginales = [];
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    valoresOriginales.push(cell.innerHTML);
  }

  // Iterar sobre las celdas de la fila, excepto la primera y las últimas tres
  for (let i = 1; i < cells.length - 3; i++) {
    const cell = cells[i];
    const oldValue = cell.innerText.trim();
    cell.innerHTML = `<input class="tab" type="text" value="${oldValue}" style="width: 100%; ">`;
  }

  // Dejar la primera celda (id_usuario) y las últimas tres celdas sin modificar
  for (let i = 0; i < 1; i++) {
    const cell = cells[i];
    // Aquí puedes dejar el contenido de la celda como está
  }
  for (let i = cells.length - 3; i < cells.length; i++) {
    const cell = cells[i];
    // Aquí puedes dejar el contenido de la celda como está
  }

  const editButton = cells[cells.length - 1].querySelector("#actualizar");
  editButton.setAttribute(
    "onclick",
    `toggleEditMode(${id_usuario}, ${JSON.stringify(valoresOriginales)}, this)`
  );
};

// Función para guardar los cambios realizados en la fila
const saveChanges = async (id_usuario, valoresOriginales) => {
  const row = document.getElementById(`user-row-${id_usuario}`);
  const cells = row.getElementsByTagName("td");
  const newValues = [];

  for (let i = 1; i < cells.length - 3; i++) {
    const cell = cells[i];
    const newValue = cell.getElementsByTagName("input")[0].value;
    newValues.push(newValue);
  }

  // Restaurar los valores de la primera celda (id_usuario) y las últimas tres celdas
  for (let i = 0; i < 1; i++) {
    const cell = cells[i];
    cell.innerHTML = valoresOriginales[i];
  }
  for (let i = cells.length - 3; i < cells.length; i++) {
    const cell = cells[i];
    cell.innerHTML = valoresOriginales[i];
  }

  try {
    // Mostrar el SweetAlert2 antes de guardar los cambios
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios realizados?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
    });
    if (isConfirmed) {
      const response = await fetch(
        `http://localhost:3009/ADB/Users/${id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombres: newValues[0],
            apellidos: newValues[1],
            foto: newValues[2],
            perfil: newValues[3],
            usuario: newValues[4],
            fecha_registro: newValues[5]
          }),
        }
      );

      if (response.ok) {
        const update = await response.json();
        // Actualizar la tabla después de cambiar el estado
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "success",
          title: update.message,
        });
        getAll();
      } else {
        const updat = await response.json();
        // Actualizar la tabla después de cambiar el estado
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Error al actualizar el usuario",
        });
        getAll();
      }
    } else {
      // Si el usuario cancela, ejecutar la función getAll()
      getAll();
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    // Eliminar la clase 'active' del botón
    getAll();
  }
};
//*****************************editar usuario y guardar********************************/

//*******************************inavilitar, habilitar*********************************/
const changeState = async (userId, currentState) => {
  try {
    let newState = true;
    let buttonText = "Habilitar";
    if (currentState == true) {
      newState = false;
      buttonText = "Inhabilitar";
    }
    // Mostrar el SweetAlert2 antes de cambiar el estado
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas ${buttonText.toLowerCase()} el usuario ${userId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, ${buttonText.toLowerCase()}`,
      background: "rgba(255, 255, 255,)",
    });

    if (isConfirmed) {
      const response = await fetch(
        `http://localhost:3009/ADB/Users/${userId}/state`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: newState }), // Cambiar el estado a 0
        }
      );

      if (response.ok) {
        const messageData = await response.json();
        //console.log(inavilitado.message)
        // Actualizar la tabla después de cambiar el estado
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "success",
          title: messageData.message,
        });
        getAll();
      } else {
        // Actualizar la tabla después de cambiar el estado
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Error al cambiar el estado del usuario",
        });
        getAll();
      }
    }
  } catch (error) {
    alert("Error " + error);
    getAll();
  }
};

//*******************************inavilitar, habilitar*********************************/

//*************************************eliminar**************************************/
const deleteUser = async (userId) => {
  try {
    // Mostrar el SweetAlert2 antes de eliminar el usuario
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el usuario ${userId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      background: "rgba(255, 255, 255,)",
    });

    if (isConfirmed) {
      const response = await fetch(
        `http://localhost:3009/ADB/Users_delete/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const eliminado = await response.json();

        // Actualizar la tabla después de eliminar el usuario
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: "success",
          title: eliminado.message,
        });

        getAll(); // Función para actualizar la tabla
      } else {
        // Actualizar la tabla después de un error
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: "error",
          title: "Error al eliminar usuario",
        });

        getAll(); // Función para actualizar la tabla
      }
    }
  } catch (error) {
    alert("Error " + error);
    getAll(); // Función para actualizar la tabla
  }
};
//*************************************eliminar**************************************/

getAll();
