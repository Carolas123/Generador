document.getElementById("generarBtn").addEventListener("click", () => {
    const expresion = document.getElementById("expresionInput").value;
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    // Validación simple de entrada
    if (!expresion) {
        alert("Por favor, ingresa una expresión matemática.");
        return;
    }

    let cuadruplos = [];  // Lista de cuádruplos
    let valores = {};  // Almacena valores de cada resultado temporal

    // Función que procesa las operaciones en la expresión y genera los cuadruplos
    function generarCuadruplo(operador, operando1, operando2, resultadoOperacion) {
        // Agregar el cuádruplo con el valor calculado
        cuadruplos.push([operador, operando1, operando2, resultadoOperacion]);
    }

    // Función para evaluar la expresión y generar cuádruplos
    function procesarExpresion(expr) {
        expr = expr.replace(/\s+/g, "");  // Eliminar espacios
        const operadores = [];
        const operandos = [];

        for (let i = 0; i < expr.length; i++) {
            const c = expr[i];

            if (c === '(') {
                operadores.push(c);
            } else if (c >= 'A' && c <= 'Z' || !isNaN(c)) {
                operandos.push(c);
            } else if (c === '+' || c === '-' || c === '*' || c === '/') {
                while (operadores.length && operadores[operadores.length - 1] !== '(' &&
                    prioridad(operadores[operadores.length - 1]) >= prioridad(c)) {
                    const operador = operadores.pop();
                    const op2 = operandos.pop();
                    const op1 = operandos.pop();
                    const valor1 = isNaN(op1) ? valores[op1] : parseFloat(op1);
                    const valor2 = isNaN(op2) ? valores[op2] : parseFloat(op2);
                    const resultadoOperacion = calcularOperacion(operador, valor1, valor2);
                    generarCuadruplo(operador, op1, op2, resultadoOperacion);
                    operandos.push(resultadoOperacion);  // Agregar el resultado directamente
                }
                operadores.push(c);
            } else if (c === ')') {
                while (operadores.length && operadores[operadores.length - 1] !== '(') {
                    const operador = operadores.pop();
                    const op2 = operandos.pop();
                    const op1 = operandos.pop();
                    const valor1 = isNaN(op1) ? valores[op1] : parseFloat(op1);
                    const valor2 = isNaN(op2) ? valores[op2] : parseFloat(op2);
                    const resultadoOperacion = calcularOperacion(operador, valor1, valor2);
                    generarCuadruplo(operador, op1, op2, resultadoOperacion);
                    operandos.push(resultadoOperacion);  // Agregar el resultado directamente
                }
                operadores.pop();
            }
        }

        // Procesar cualquier operación restante
        while (operadores.length) {
            const operador = operadores.pop();
            const op2 = operandos.pop();
            const op1 = operandos.pop();
            const valor1 = isNaN(op1) ? valores[op1] : parseFloat(op1);
            const valor2 = isNaN(op2) ? valores[op2] : parseFloat(op2);
            const resultadoOperacion = calcularOperacion(operador, valor1, valor2);
            generarCuadruplo(operador, op1, op2, resultadoOperacion);
            operandos.push(resultadoOperacion);  // Agregar el resultado directamente
        }

        return operandos.pop();
    }

    // Función para calcular el resultado de la operación
    function calcularOperacion(operador, operando1, operando2) {
        switch (operador) {
            case '+': return operando1 + operando2;
            case '-': return operando1 - operando2;
            case '*': return operando1 * operando2;
            case '/': return operando2 !== 0 ? operando1 / operando2 : "Error (división por cero)";
            default: return null;
        }
    }

    // Función para definir prioridad de operadores
    function prioridad(operador) {
        if (operador === '+' || operador === '-') return 1;
        if (operador === '*' || operador === '/') return 2;
        return 0;
    }

    procesarExpresion(expresion);

    // Mostrar cuádruplos en el HTML con el resultado de la operación
    cuadruplos.forEach(cuadruplo => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = `${cuadruplo[0]}, ${cuadruplo[1]}, ${cuadruplo[2]}, ${cuadruplo[3]}`;
        resultado.appendChild(li);
    });
});
