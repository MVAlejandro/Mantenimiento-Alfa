

const op_periodo = document.getElementById('op_periodo');
const tabla_periodo = document.getElementById('tabla_periodo');

op_periodo.addEventListener('change', function () {
    if(op_periodo.value === "1"){
        tabla_periodo.innerHTML = ``;
    } else if(op_periodo.value === "Semanal") {
        tabla_periodo.innerHTML = 
        `<table class="table table-bordered">
                    <thead>
                        <tr>
                        <th scope="col">Semana</th>
                        <th scope="col">Unidad</th>
                        <th scope="col">Tarea</th>
                        <th scope="col">Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>John</td>
                        <td>Doe</td>
                        <td>@social</td>
                        </tr>
                    </tbody>
                </table>`;
    } else if(op_periodo.value === "Quincenal") {
        tabla_periodo.innerHTML = 
        `<table class="table table-bordered">
                    <thead>
                        <tr>
                        <th scope="col">Quincena</th>
                        <th scope="col">Unidad</th>
                        <th scope="col">Tarea</th>
                        <th scope="col">Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>John</td>
                        <td>Doe</td>
                        <td>@social</td>
                        </tr>
                    </tbody>
                </table>`;
    } else {
        tabla_periodo.innerHTML = 
        `<table class="table table-bordered">
                    <thead>
                        <tr>
                        <th scope="col">Mes</th>
                        <th scope="col">Unidad</th>
                        <th scope="col">Tarea</th>
                        <th scope="col">Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>John</td>
                        <td>Doe</td>
                        <td>@social</td>
                        </tr>
                    </tbody>
                </table>`;
    }
});