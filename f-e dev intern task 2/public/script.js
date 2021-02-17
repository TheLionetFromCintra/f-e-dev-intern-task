'use strict';

const form = document.querySelector('#form'),
      firstName = document.querySelector('#firstName'),
      lastName = document.querySelector('#lastName'),
      gender = document.querySelectorAll('input[name="gender"]'),
      age = document.querySelector('#age'),
      email = document.querySelector('#email'),
      password = document.querySelector('#password'),
      password2 = document.querySelector('#password2'),
      modal = document.querySelector('.modal-overlay'),
      modalBtn = document.querySelector('.modal__btn'),
      modalName = document.querySelector('.modal__name');

const fieldsArr = [firstName, lastName, age, email, password, password2];      

const arrUp = document.querySelector('.arr-up'),    
      arrDown = document.querySelector('.arr-down');
      
const min = 10,
      max = 100;    
          
let copyPass1 = '',
    copyPass2 = '',
    arrPass1 = [],
    arrPass2 = [];

let optGender;

let modalFn = document.querySelector('.modal__info-firstname'),
    modalLn = document.querySelector('.modal__info-lastname'),
    modalG = document.querySelector('.modal__info-gender'),
    modalA = document.querySelector('.modal__info-age'),
    modalE = document.querySelector('.modal__info-email'),
    modalP = document.querySelector('.modal__info-password');

const modalArr = [modalName, modalFn, modalLn, modalG, modalA, modalE, modalP];

let inputs = document.querySelectorAll('.form__box-input');
inputs = Array.prototype.slice.call(inputs); // nodelist to array

function showError(input, message) {
    const formBox = input.parentElement;
    formBox.className = 'form__box-input error';
    const small = formBox.querySelector('small');
    small.innerText = message;
}

function showSuccess(input) {
    const formBox = input.parentElement;
    formBox.className = 'form__box-input';
    const small = formBox.querySelector('small');
    small.innerText = '';
}

function checkEmail(input) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid');
    }
}

function checkRequired(inputArr) {
    inputArr.forEach(function(input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`);
        } else {
            showSuccess(input);
        }
    })
}

function checkPasswordsMatch(copy1, copy2, pass2) {
    if (copy1 !== copy2) {
        showError(pass2, 'Passwords do not match');
    } 
}

function checkAge(input) {
    if (input.value < 10 || input.value > 100) {
        showError(input, 'Specify the age from 10 to 100');
    } else {
        showSuccess(input);
    }
}

function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function getGender(arrInput) {
   arrInput.forEach(function(input) {
        if (input.checked) optGender = input.value
    });
}

function getInfo() {
    modalName.textContent = firstName.value;
    modalFn.textContent = firstName.value;
    modalLn.textContent = lastName.value;
    modalG.textContent = optGender;
    modalA.textContent = age.value;
    modalE.textContent = email.value;
    modalP.textContent = copyPass1;
}

function clearModal(arr) {
    arr.forEach(function(field) {
        field.textContent = '';
    });
}

function clearFields(arr) {
    arr.forEach(function(field) {
        field.value = '';
    });
    optGender = '';
    copyPass1 = '';
    copyPass2 = '';
    arrPass1 = [];
    arrPass2 = [];
}

function clearGender(arr) {
    arr.forEach(function(input) {
        input.checked = false;
    });
    arr[0].checked = true;
}

function getObject() {
    const values = {
        firstName: firstName.value,
        lastName: lastName.value,
        gender: optGender,
        age: age.value,
        email: email.value,
        password: copyPass1,
    };

    return values;
}

function storeJSON(json) {

fetch('http://localhost:3000/users', {
    method: "POST",
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: json
}).then(function(response) {
    if (!response.ok) {
        return Promise.reject(new Error(
            'Response failed: ' + response.status + ' (' + response.statusText + ')'
        ));
    }
    return response.json();
}).then(function(data) {
    console.log(data);
}).catch(function(error) {
    console.log(error);
});
}

function createUser(arr) {
    const users = document.querySelector('.modal__info-right');

    arr.forEach(function(object) {
        let userHtml = document.createElement('div');
        userHtml.classList.add('modal__user');
        userHtml.innerHTML =
        `  <div class="modal__user-field">
                <span class="modal__user-firstName">${object.firstName}</span>
                <span class="modal__user-lastName">${object.lastName}</span> //
                <span class="modal__user-gender">${object.gender}</span> //
                <span class="modal__user-age">${object.age}</span> y.o //
                <span class="modal__user-email">${object.email}</span>
            </div>
        `;
    users.appendChild(userHtml);
    });
}



function showUser() {
    
    fetch('http://localhost:3000/users')
    .then(function(res) {
    return res.json();
    })
    .then(function(data) {
        let current = data.splice(data.length - 1, 1);
        createUser(current);
    })
}

function saveUsers() {
    fetch('http://localhost:3000/users')
    .then(function(res) {
    return res.json();
    })
    .then(function(data) {
        createUser(data);
    })
}
saveUsers();


arrDown.addEventListener('click', function() {
    if (age.value > min) {
        age.value = +age.value - 1;
    }
    if (age.value <= max && age.value > min) showSuccess(age);
});

arrUp.addEventListener('click', function() {
    if (age.value < max) {
        age.value = +age.value + 1;
    }
    if (age.value < min) showError(age, 'Specify the age from 10 to 100');
    if (age.value >= min && age.value < max) showSuccess(age);
    
});

age.addEventListener('input', function() {
    this.value = this.value.replace(/[^\d]/g, '');
    checkAge(age);
});


// function copyPassword(passArr) {
//     let arrInput = this.value.split('');
//     if (arrInput.length === 0) {
//         passArr = [];
//     }
//     console.log(arrInput);
//     let part = arrInput.splice(arrInput.length - 1, 1).join();
//     this.value = this.value.replace(/[^*]/,'*');
    
//     if (part !== '*' && part !== '') {
//         passArr.push(part);
//     } else {
//         passArr.pop();
//     }
//     console.log(passArr);
    
// }

// password.addEventListener('input', copyPassword.bind(password, arrPass1));

// password2.addEventListener('input', copyPassword.bind(password2, arrPass2));

password.addEventListener('input', function() {
    
    let arrInput = this.value.split('');
    if (arrInput.length === 0) {
        arrPass1 = [];
    }
   
    let part = arrInput.splice(arrInput.length - 1, 1).join();
    this.value = this.value.replace(/[^*]/,'*');
    
    if (part !== '*' && part !== '') {
        arrPass1.push(part);
    } else {
        arrPass1.pop();
    }
    copyPass1 = arrPass1.join('');
});

password2.addEventListener('input', function() {
    
    let arrInput = this.value.split('');
    if (arrInput.length === 0) {
        arrPass2 = [];
    }
   
    let part = arrInput.splice(arrInput.length - 1, 1).join();
    this.value = this.value.replace(/[^*]/,'*');
    
    if (part !== '*' && part !== '') {
        arrPass2.push(part);
    } else {
        arrPass2.pop();
    }
    copyPass2 = arrPass2.join('');
});


form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    checkRequired([firstName, lastName, password, password2]);
    getGender(gender);
    checkAge(age);
    checkEmail(email);
    checkPasswordsMatch(copyPass1, copyPass2, password2);
    getInfo();
    
    if (inputs.every(input => !input.classList.contains('error'))) {
        modal.classList.add('open-modal');
        getObject();
        let json = JSON.stringify(getObject());
        storeJSON(json);
    }

});


modalBtn.addEventListener('click', function() {
    modal.classList.remove('open-modal');
    clearModal(modalArr);
    clearFields(fieldsArr);
    clearGender(gender);
    showUser();
});

// json-server --watch db.json