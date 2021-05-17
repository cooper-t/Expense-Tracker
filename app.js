
// ******** SELECT ITEMS *********
const alert = document.querySelector('.alert');
const form = document.querySelector('.form');
const item = document.getElementById('item');
const figure = document.getElementById('amount');
const submitBtn = document.querySelector('.submit-btn');
const total = document.querySelector('.total');
const totalContainer = document.querySelector('.total-container');
const container = document.querySelector('.container');
const list = document.querySelector('.list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editAmt;
let editFlag = false;
let editID = "";

// ******** EVENT LISTENERS *********
// submit form
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);

// load items
window.addEventListener('DOMContentLoaded', setupItems)

// ******** FUNCTIONS *********
function addItem(e) {
    e.preventDefault();
    const value = item.value;
    const amount = figure.value;
    const id = new Date().getTime().toString();
    // can be shortened to (value && !editFlag) <-- this works because value is already truthy and !(not)editFlag is falsey by default so making it not false makes it a truthy 
    if (value !== "" && amount !== "" && editFlag === false){
        createListItem(id, value, amount);
        // display alert
        displayAlert('item added to the list', 'success');
        // show container
        totalContainer.classList.add('show-container');
        container.classList.add('show-container');
        // add to storage
        addToLocalStorage(id, value, amount);
        createTotal();
        // set back to default
        setBackToDefault();
        
    } else if (value !== "" && amount !== "" && editFlag === true) {
        editElement.innerHTML = value;
        editAmt.innerHTML = amount;
        displayAlert('value changed', 'success');
        // edit local storage
        editLocalStorage(editID, value, amount);
        setBackToDefault();
        createTotal();
    } else {
        displayAlert('please enter value', 'danger');
    }
}

// display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function () {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 2000);
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.list-item');

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    totalContainer.classList.remove('show-container');
    container.classList.remove('show-container');
    displayAlert('empty list', 'success');
    setBackToDefault();
    localStorage.removeItem('list');
};

// delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0) {
        container.classList.remove('show-container');
    }
    createTotal();
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
};
// edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    editAmt = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    item.value = editElement.innerHTML;
    figure.value = editAmt.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';  
};

function sum(){
    let arr = [];
    getLocalStorage().map(function(item){
        let numbers = parseFloat(item.amount);
        arr.push(numbers);
    });
    return arr.reduce((acc, currentValue) =>  acc += currentValue, 0).toString();
};

// set back to default
function setBackToDefault() {
    item.value = "";
    figure.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
};
// ******** LOCAL STORAGE *********
function addToLocalStorage(id, value, amount) {
    const item = { id:id, value:value, amount:amount };
    let items = getLocalStorage();
    items.push(item);
    localStorage.setItem('list', JSON.stringify(items));
};

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
    createTotal();
};

function editLocalStorage(id, value, amount){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
            item.amount = amount;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
    createTotal();
};

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
};
// ******** SETUP ITEMS *********
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value, item.amount)
        });
        totalContainer.classList.add('show-container');
        container.classList.add('show-container');
        createTotal();
    }
}

function createListItem(id, value, amount){
    const element = document.createElement('article');
        // add class
        element.classList.add('list-item');
        // add id
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
        <p class="amount">${amount}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <img src="images/pencil.png">
          </button>
          <button type="button" class="delete-btn">
            <img src="images/close.png">
          </button>
        </div>`;
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        // append child
        list.appendChild(element);
};

function createTotal(){
    total.innerHTML = `$ ${sum()}`
};