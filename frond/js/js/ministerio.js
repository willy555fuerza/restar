//*********************************poner en mayuscula**********************************/
function mayus(e) {
    e.value = e.value.toUpperCase();
}
//*********************************poner en mayuscula**********************************/



//***********************************crear ministerio*************************************/
const formAgregarUsuario = document.getElementById('myForm');

formAgregarUsuario.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;

    try {
        // Enviar los datos al servidor para crear el nuevo usuario
        const response = await fetch('http://localhost:3009/ADB/create_ministerio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                descripcion
            })
        });

        if (response.ok) {
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
                title: "Se creo el ministerio correctamente"
            });
            getAll()
        } else {
            // Actualizar la tabla después de cambiar el estado
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                
            });
            Toast.fire({
                icon: "error",
                title: "Error al crear nuevo ministerio"
            });
            getAll()
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
});
//***********************************crear Ministerio*************************************/


//*************renderizado de tabla ministerio y mostrar tabla ministerio*******************/
const ministerios = document;

const paginaMinisterios = ministerios.querySelector('#ministerio')

const Ministerios = ({ id_ministerio, nombre, descripcion, registro_fecha, estado }) => {
    // Convertir la fecha de registro a un formato de año-mes-día
    const formattedDate = new Date(registro_fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        /* timeZoneName: 'short' */
    });

    const buttonColor = estado === true ? "btn btn-outline-success" : "btn btn-outline-danger";
    const buttontxt = estado === true ? 'SI' : 'NO';

    return `
        <tr id="ministerio-row-${id_ministerio}"> <!-- Agregar un ID único para la fila -->
            <td>${id_ministerio}</td>
            <td>${nombre}</td>
            <td>${descripcion}</td>
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
                      <li><a id="actualizar" class="dropdown-item" onclick="toggleEditMode(${id_ministerio})" href="#" class="dropdown-item">Actualizar</a></li>
                      <li><a onclick="deleteUser(${id_ministerio})" class="dropdown-item" href="#">Eliminar</a></li>
                      <li><a onclick="changeState(${id_ministerio}, ${estado})" class="dropdown-item" href="#" id="change-state-${id_ministerio}">${estado ? "Inhabilitar" : "Habilitar"}</a></li>
                  </ul>
              </div>
            </td>
        </tr>
    `;
}
const render = (data) => {
    const sorteministerio = data.sort((a, b) => {
        // Si a está habilitado y b no, a debe ir antes que b
        if (a.estado && !b.estado) {
            return -1;
        }
        // Si b está habilitado y a no, b debe ir antes que a
        if (!a.estado && b.estado) {
            return 1;
        }
        // Si ambos están habilitados o deshabilitados, ordenar por id_usuario
        return a.id_ministerio - b.id_ministerio;
    });

    if (Array.isArray(sorteministerio) && sorteministerio.length > 0) {
        const cardsHTML = sorteministerio.map(item => Ministerios(item)).join('');
        paginaMinisterios.innerHTML = cardsHTML;
            
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
        autowidth:true
      });
    }
    
    } else {
        paginaMinisterios.innerHTML = '<tr><td colspan="8">NO SE ENCONTRARON MINISTERIOS.</td></tr>';
    }
};

const getAll = async () => {
    try {
        const response = await fetch('http://localhost:3009/ADB/ministerio');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const result = await response.json();
        /* console.log(result); */
        if (result.error) {
            console.error('Error:', result.message);
            alert(result.message);
        } else {
            render(result.data);
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
};
//*************renderizado de tabla ministerio y mostrar tabla ministerio*******************/

let isEditMode = false;

const toggleEditMode = (id_ministerio) => {
    const row = document.getElementById(`ministerio-row-${id_ministerio}`);
    const editButton = row.querySelector('#actualizar');
    const cells = row.getElementsByTagName('td');

    // Guardar los valores originales de todas las celdas
    const valoresOriginales = [];
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        valoresOriginales.push(cell.innerHTML);
    }

    if (!isEditMode) {
        // Modo de edición
        editMinisterio(id_ministerio);
        editButton.innerHTML = 'Guardar';
        editButton.setAttribute('onclick', `toggleEditMode(${id_ministerio}, ${JSON.stringify(valoresOriginales)})`);
        isEditMode = true;
    } else {
        // Modo de guardar cambios
        saveChanges(id_ministerio, valoresOriginales);
        editButton.innerHTML = 'Actualizar';
        editButton.setAttribute('onclick', `toggleEditMode(${id_ministerio})`);
        isEditMode = false;
    }
};
//*****************************editar ministerio y guardar********************************/
const editMinisterio = (id_ministerio) => {
    const row = document.getElementById(`ministerio-row-${id_ministerio}`);
    const cells = row.getElementsByTagName('td');

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

    // Dejar la primera celda (id_ministerio) y las últimas tres celdas sin modificar
    for (let i = 0; i < 1; i++) {
        const cell = cells[i];
        // Aquí puedes dejar el contenido de la celda como está
    }
    for (let i = cells.length - 3; i < cells.length; i++) {
        const cell = cells[i];
        // Aquí puedes dejar el contenido de la celda como está
    }

    const editButton = cells[cells.length - 1].querySelector('#actualizar');
    editButton.setAttribute('onclick', `toggleEditMode(${id_ministerio}, ${JSON.stringify(valoresOriginales)}, this)`);
}

// Función para guardar los cambios realizados en la fila
const saveChanges = async (id_ministerio, valoresOriginales) => {
    const row = document.getElementById(`ministerio-row-${id_ministerio}`);
    const cells = row.getElementsByTagName('td');
    const newValues = [];

    for (let i = 1; i < cells.length - 3; i++) {
        const cell = cells[i];
        const newValue = cell.getElementsByTagName('input')[0].value;
        newValues.push(newValue);
    }

    // Restaurar los valores de la primera celda (id_ministerio) y las últimas tres celdas
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
            title: '¿Estás seguro?',
            text: '¿Quieres guardar los cambios realizados?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
        });
        if (isConfirmed) {
            const response = await fetch(`http://localhost:3009/ADB/ministerio/${id_ministerio}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: newValues[0],
                    descripcion: newValues[1],
                })
            });

            if (response.status !== 200) {
                // Actualizar la tabla después de cambiar el estado
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,

                });
                Toast.fire({
                    icon: "error",
                    title: "Error al actualizar el ministerio"
                });
            }

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
                title: "Se actualizo correctamente"
            });
            getAll();
        } else {
            // Si el usuario cancela, ejecutar la función getAll()
            getAll();
        }
    } catch (error) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,

        });
        Toast.fire({
            icon: "error",
            title: "Ocurrio un error al actualizar el ministerio"
        });
        // Eliminar la clase 'active' del botón
        editButton.classList.remove('active');
        getAll();
    }
}
//*****************************editar ministerio y guardar********************************/



//*******************************inavilitar, eliminar*********************************/
// CAmbiar state del usaurio (deshabilitacion logica)
const changeState = async (userId, currentState) => {
    try {
        let newState = true;
        let buttonText = 'Habilitar';
        if (currentState == true) {
            newState = false;
            buttonText = 'Inhabilitar';
        }
        // Mostrar el SweetAlert2 antes de cambiar el estado
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas ${buttonText.toLowerCase()} el ministerio ${userId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${buttonText.toLowerCase()}`,
            background: 'rgba(255, 255, 255,)',
          });

        if (isConfirmed) {
            const response = await fetch(`http://localhost:3009/ADB/ministerio/${userId}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: newState }) // Cambiar el estado a 0
            });
            if (!response.ok) {
                const messageData = await response.json()
                // Actualizar la tabla después de cambiar el estado
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,

                });
                Toast.fire({
                    icon: "error",
                    title: messageData.message
                });
            }

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
                title: "Estado del ministerio cambiado correctamente"
            }
            );
            getAll();
        }
    } catch (error) {
        alert('Error ' + error);
        getAll();
    }
}
//*******************************inavilitar, eliminar*********************************/

//*************************************eliminar**************************************/
const deleteUser = async (userId) => {
    try {
      // Mostrar el SweetAlert2 antes de eliminar el usuario
      const { isConfirmed } = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el ministerio ${userId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        background: 'rgba(255, 255, 255,)'
      });
  
      if (isConfirmed) {
        const response = await fetch(`http://localhost:3009/ADB/ministerio_delete/${userId}`, {
          method: 'DELETE'
        });
  
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
            title: eliminado.message
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
            title: "Error al eliminar ministerio"
          });
  
          getAll(); // Función para actualizar la tabla
        }
      }
    } catch (error) {
      alert('Error ' + error);
      getAll(); // Función para actualizar la tabla
    }
  }
  //*************************************eliminar**************************************/
  
getAll()
