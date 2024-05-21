//*********************************poner en mayuscula**********************************/
function mayus(e) {
    e.value = e.value.toUpperCase();
}
//*********************************poner en mayuscula**********************************/



//***********************************crear Tipo de Ingresos*************************************/
const formAgregarUsuario = document.getElementById('myForm');

formAgregarUsuario.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const registro_fecha = document.getElementById('registro_fecha').value;



    try {
        // Enviar los datos al servidor para crear el nuevo usuario
        const response = await fetch('http://localhost:3009/ADB/create_tipo_ingreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                registro_fecha
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
                title: "Se creo el tipo de ingreso correctamente"
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
                title: "Error al crear nuevo tipo de ingreso"
            });
            getAll()
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
});
//***********************************crear tipo de ingresos*************************************/



//*************renderizado de tabla tipo de ingresos y mostrar tabla tipo de ingresos*******************/
const tipo_ingreso = document;

const paginaTipo_ingreso = tipo_ingreso.querySelector('#tipo_ingresos ')

const tipo_ingresos = ({ id_tipo_ingresos, nombre, registro_fecha, estado }) => {
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
        <tr id="tipo_ingreso-row-${id_tipo_ingresos}"> <!-- Agregar un ID único para la fila -->
            <td>${id_tipo_ingresos}</td>
            <td>${nombre}</td>
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
                  <ul class="dropdown-menu">
                      <li><a id="actualizar" class="dropdown-item" onclick="toggleEditMode(${id_tipo_ingresos})" class="dropdown-item" href="#">Actualizar</a></li>
                      <li><a onclick="deleteUser(${id_tipo_ingresos})" class="dropdown-item" href="#">Eliminar</a></li>
                      <li><a onclick="changeState(${id_tipo_ingresos}, ${estado})" class="dropdown-item" href="#" id="change-state-${id_tipo_ingresos}">${estado ? "Inhabilitar" : "Habilitar"}</a></li>
                  </ul>
              </div>
            </td>
        </tr>
    `;
}
const render = (data) => {
    const sortetipo_ingreso = data.sort((a, b) => {
        // Si a está habilitado y b no, a debe ir antes que b
        if (a.estado && !b.estado) {
            return -1;
        }
        // Si b está habilitado y a no, b debe ir antes que a
        if (!a.estado && b.estado) {
            return 1;
        }
        // Si ambos están habilitados o deshabilitados, ordenar por id_usuario
        return a.id_tipo_ingresos - b.id_tipo_ingresos;
    });

    if (Array.isArray(sortetipo_ingreso) && sortetipo_ingreso.length > 0) {
        const cardsHTML = sortetipo_ingreso.map(item => tipo_ingresos(item)).join('');
        paginaTipo_ingreso.innerHTML = cardsHTML;

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
        paginaTipo_ingreso.innerHTML = '<tr><td colspan="8">NO SE ENCONTRARON TIPO DE INGRESOS.</td></tr>';
    }
};

const getAll = async () => {
    try {
        const response = await fetch('http://localhost:3009/ADB/tipo_ingreso');
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
//*************renderizado de tabla Tipo de ingresos y mostrar tabla tipo de ingresos*******************/
let isEditMode = false;

const toggleEditMode = (id_tipo_ingresos) => {
    const row = document.getElementById(`tipo_ingreso-row-${id_tipo_ingresos}`);
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
        edittipo_ingreso(id_tipo_ingresos);
        editButton.innerHTML = 'Guardar';
        editButton.setAttribute('onclick', `toggleEditMode(${id_tipo_ingresos}, ${JSON.stringify(valoresOriginales)})`);
        isEditMode = true;
    } else {
        // Modo de guardar cambios
        saveChanges(id_tipo_ingresos, valoresOriginales);
        editButton.innerHTML = 'Actualizar';
        editButton.setAttribute('onclick', `toggleEditMode(${id_tipo_ingresos})`);
        isEditMode = false;
    }
};
//*****************************editar tipo de ingresos y guardar********************************/
const edittipo_ingreso = (id_tipo_ingresos) => {
    const row = document.getElementById(`tipo_ingreso-row-${id_tipo_ingresos}`);
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
    editButton.setAttribute('onclick', `toggleEditMode(${id_tipo_ingresos}, ${JSON.stringify(valoresOriginales)}, this)`);
}

// Función para guardar los cambios realizados en la fila
const saveChanges = async (id_tipo_ingresos, valoresOriginales) => {
    const row = document.getElementById(`tipo_ingreso-row-${id_tipo_ingresos}`);
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
            const response = await fetch(`http://localhost:3009/ADB/tipo_ingreso/${id_tipo_ingresos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: newValues[0],
                    registro_fecha: newValues[1],
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
//*****************************editar tipo de ingresos y guardar********************************/



//*******************************inavilitar, eliminar*********************************/
// CAmbiar state del tipo de ingresos (deshabilitacion logica)
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
            text: `¿Deseas ${buttonText.toLowerCase()} el tipo de ingreso ${userId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${buttonText.toLowerCase()}`,
            background: 'rgba(255, 255, 255,)',
        });

        if (isConfirmed) {
            const response = await fetch(`http://localhost:3009/ADB/tipo_ingreso/${userId}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: newState }) // Cambiar el estado a 0
            });

            if (response.ok) {
                const messageData = await response.json()
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
                    title: messageData.message
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
                    title: "Error al cambiar el estado de la medida"
                }
                );
                getAll();
            }
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
            text: `¿Deseas eliminar el tipo de ingreso ${userId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            background: 'rgba(255, 255, 255,)'
        });

        if (isConfirmed) {
            const response = await fetch(`http://localhost:3009/ADB/tipo_ingreso_delete/${userId}`, {
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
                    title: "Error al eliminar tipo de ingresos"
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
