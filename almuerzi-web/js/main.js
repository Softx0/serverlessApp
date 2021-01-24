
window.onload = () => {
    // fetch('https://serverless-app.softx0.vercel.app/api/meals', {
    //     method: 'GET', //post, put, delete
    //     mode: 'cors',
    //     cache: 'no-cache',
    //     credentials: 'same-origin',
    //     headers: {
    //         'Conten-Type': 'application/json'
    //     },
    //     redirect: 'follow',
    //     body: JSON.stringify({user: 'lala', pass: 'hola'})
    // })
    //     .then(response => response.json()) //.json, .text, .xml
    //     .then(data => console.log(data));

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

            Array.from(mealsList.children).forEach( x => x.classList.remove('selected'));
            element.classList.add('selected');

            mealsIdInput.value = item._id;
        });

        return element;
    }

    fetch('https://serverless-app.softx0.vercel.app/api/meals')
        .then(response => response.json()) //.json, .text, .xml
        .then(data => {

            const mealsList = document.getElementById('meals-list');
            const submit = document.getElementById('submit');
            const listItems = data.map(renderItem);
            
            mealsList.removeChild(mealsList.firstElementChild);
            listItems.forEach(element => {
                mealsList.appendChild(element);
            });

            submit.removeAttribute('disabled');
        });

    
}

