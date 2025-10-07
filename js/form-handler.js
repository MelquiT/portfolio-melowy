// API_KEY_PLACEHOLDER

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // if (typeof CONFIG === 'undefined' || !CONFIG.WEB3FORMS_API_KEY) {
        //     result.innerHTML = "Error: Config not available";
        //     return;
        // }

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        console.log(object);
        
        // object.access_key = CONFIG.WEB3FORMS_API_KEY;
        object.access_key = WEB3FORMS_API_KEY;

        const json = JSON.stringify(object);

        result.innerHTML = "Please wait...";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    result.classList.add('message-success');
                    result.innerHTML = json.message;
                    result.appendChild(document.createElement('i')).classList.add('icon-success');
                } else {
                    console.log(response);
                    result.classList.add('message-warning');
                    result.innerHTML = json.message;
                    result.appendChild(document.createElement('i')).classList.add('icon-error');
                }
            })
            .catch(error => {
                console.log(error);
                result.classList.add('message-error');
                result.innerHTML = "Something went wrong!";
                result.appendChild(document.createElement('i')).classList.add('icon-error');
            })
            .then(function () {
                form.reset();
                setTimeout(() => {
                    result.style.display = "none";
                }, 3000);
            });
    });
});