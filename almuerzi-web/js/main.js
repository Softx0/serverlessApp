let mealsState = [];
let user = {};
let ruta = 'login';

const stringToHTML = (cadena) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cadena, 'text/html');

    return doc.body.firstChild;
}

//templates strings
const renderItem = (item) => {
    const element = stringToHTML(`<li data-id="${item._id}" >${item.name}</li>`);

    //añadiendo la principal funcionalidad de seleccion de los platos...
    element.addEventListener('click', () => {
        const mealsList = document.getElementById('meals-list');
        const mealsIdInput = document.getElementById('mealsId');

        Array.from(mealsList.children).forEach(x => x.classList.remove('selected'));
        element.classList.add('selected');

        mealsIdInput.value = item._id;
    });

    return element;
}

const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id);
    console.log(meal.name)
    const element = stringToHTML(`<li data-id="${order._id}" >${meal.name} - ${order.user_id}</li>`);
    console.log(element)
    return element;
}

const initializeForm = () => {
    const orderForm = document.getElementById('order');

    orderForm.onsubmit = (event) => {
        //para evitar el refresh
        event.preventDefault();

        const submit = document.getElementById('submit');
        const mealId = document.getElementById('mealsId');
        const mealIdValue = mealId.value;

        submit.setAttribute('disabled', true);

        if (!mealIdValue) {
            alert('Debe seleccionar un plato');
            submit.removeAttribute('disabled', false);
            return
        }

        const order = {
            meal_id: mealIdValue,
            user_id: user._id
        }

        const token = window.localStorage.getItem('token');
        if (token) {
            fetch('https://serverless-app.softx0.vercel.app/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify(order),
            }).then(LaX => LaX.json()).then(respuesta => {
                console.log(respuesta, mealsState)
                const renderedOrder = renderOrder(order, mealsState);
                const ordersList = document.getElementById('orders-list');


                ordersList.appendChild(renderedOrder);
                submit.removeAttribute('disabled', false);
            });
        }
    }
}

const initializeData = () => {
    fetch('https://serverless-app.softx0.vercel.app/api/meals')
        .then(response => response.json()) //.json, .text, .xml
        .then(data => {
            mealsState = data;
            const mealsList = document.getElementById('meals-list');
            const submit = document.getElementById('submit');
            const listItems = data.map(renderItem);

            mealsList.removeChild(mealsList.firstElementChild);
            listItems.forEach(element => {
                mealsList.appendChild(element);
            });

            submit.removeAttribute('disabled');

            fetch('https://serverless-app.softx0.vercel.app/api/orders')
                .then(response => response.json())
                .then(ordersData => {
                    const ordersList = document.getElementById('orders-list');
                    const listOrders = ordersData
                        .map(orderData => renderOrder(orderData, mealsState));

                    ordersList.removeChild(ordersList.firstElementChild);
                    listOrders.forEach(order => {
                        ordersList.appendChild(order);
                    });
                });
        });
}

//Cada vez que cambiemos una ruta, y esta rederizara el contenido de nuestra app, 
//funcionando en base al token de login
const renderApp = () => {

    const token = localStorage.getItem('token');
    if (token) {
        user = JSON.parse(localStorage.getItem('user'));
        return renderOrders();
    }
    renderLogin();
}

const renderOrders = () => {
    const ordersView = document.getElementById('orders-view');
    //Lo que hace un fr por debajo :v
    document.getElementById('app').innerHTML = ordersView.innerHTML;

    initializeForm();
    initializeData();
}

const renderLogin = () => {
    const loginView = document.getElementById('login-view');
    document.getElementById('app').innerHTML = loginView.innerHTML;

    const loginForm = document.getElementById('login-form');

    //recordemos que estos forms recibenn eventos
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('https://serverless-app.softx0.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ email: email, password: password })
            //cuando la propieddad tiene el mismo nombre de la varieble pues..
            body: JSON.stringify({ email, password })
        }).then(respuesta => respuesta.json())
            .then(miToken => {
                localStorage.setItem('token', miToken.token);
                ruta = 'orders';
                return miToken.token;
            }).then(token => {
                return fetch('https://serverless-app.softx0.vercel.app/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                    },
                })
            })
            .then(x => x.json())
            .then(fetchedUser => {
                localStorage.setItem('user', JSON.stringify(fetchedUser));
                user = fetchedUser;
                renderOrders();
            })
    }
}

window.onload = () => {
    renderApp();
}

