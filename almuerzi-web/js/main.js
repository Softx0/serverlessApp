
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

    //templates strings
    const renderItem = (item) => {
        return `<li data-id="${item._id}" >${item.name}</li>`;
    }

    fetch('https://serverless-app.softx0.vercel.app/api/meals')
        .then(response => response.json()) //.json, .text, .xml
        .then(data => {
            const mealsList = document.getElementById('meals-list');
            const template = data.map(renderItem).join('');
            const submit = document.getElementById('submit');

            mealsList.innerHTML = template;
            submit.removeAttribute('disabled');
        });

    
}

