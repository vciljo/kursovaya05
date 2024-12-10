let currentPage = 1; // Текущая страница
const itemsPerPage = 8; // Количество элементов на странице

// Инициализация данных в localStorage
const users = [
    { id: "000003", name: "Иван", email: "ivan@example.com", password: "123456", access: "client" },
    { id: "000004", name: "Мария", email: "maria@example.com", password: "123456", access: "client" }
];

const employees = [
    { id: "100001", name: "Алексей", lastName: "Петров", middleName: "Сергеевич", email: "alexey@example.com", password: "admin123", access: "admin" },
    { id: "100002", name: "Светлана", lastName: "Иванова", middleName: "Алексеевна", email: "svetlana@example.com", password: "admin123", access: "admin" }
];

const currentUser = [];

// Пример данных о бронированиях (44 штук)
const reservations = [
    { id: "943254", name: "Мария", email: "maria@example.com", date: "2024-12-25", time: "12:00", tableNumber: "5" },
    { id: "948253", name: "Мария", email: "maria@example.com", date: "2024-12-25", time: "13:00", tableNumber: "5" },
    { id: "943254", name: "Мария", email: "maria@example.com", date: "2024-12-25", time: "14:00", tableNumber: "5" },
    { id: "948232", name: "Мария", email: "maria@example.com", date: "2024-12-26", time: "13:00", tableNumber: "8" },  
];

const currentDate = new Date();
const maxDate = new Date(currentDate);
maxDate.setMonth(currentDate.getMonth() + 1); // Максимальная дата - месяц вперед

for (let i = 0; i < 43; i++) {
    // Генерация случайной даты в пределах текущей даты и месяца вперед
    const randomDate = new Date(currentDate.getTime() + Math.random() * (maxDate - currentDate));
    const formattedDate = randomDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD

    // Генерация случайного времени с 12:00 до 23:00
    const randomHour = Math.floor(Math.random() * 12) + 12; // Часы от 12 до 23
    const formattedTime = `${String(randomHour).padStart(2, '0')}:00`; // Формат HH:00

    reservations.push({
        id: generateUniqueId(),
        name: `Пользователь ${i + 1}`,
        email: `user${i + 1}@example.com`,
        date: formattedDate,
        time: formattedTime,
        tableNumber: Math.floor(Math.random() * 8) + 1,
    });
}

// Объединяем пользователей и сотрудников в один массив
const allUsers = [...users, ...employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    lastName: emp.lastName,
    middleName: emp.middleName,
    email: emp.email,
    password: emp.password,
    access: emp.access
}))];

// Сохраняем всех пользователей в localStorage
localStorage.setItem('users', JSON.stringify(allUsers));

// Инициализация пустого массива для броней
localStorage.setItem('reservations', JSON.stringify([]));

localStorage.setItem('reservations', JSON.stringify(reservations)); // Сохраняем примерные данные о бронях в localStorage

// Получаем элементы модальных окон
const modal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const modalBackground = document.getElementsByClassName("modalBackground");
const btn = document.getElementById("loginBtn");
const span = document.getElementsByClassName("close")[0];
const registerBtn = document.getElementById("registerBtn");
const closeRegisterSpan = document.getElementsByClassName("close-register")[0];
const user = document.getElementsByClassName("user");
const admin = document.getElementsByClassName("admin");
const main = document.getElementsByClassName("main");

// Генерация уникального 6-значного ID
function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Генерируем 6-значный ID
}

// Функция для отображения информации о сотруднике
function displayUserInfo(user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    // Заполняем поля ФИО и ID
    if (user.access === 'admin') {
        document.querySelector('.name__admin').textContent = `${user.name} ${user.lastName} ${user.middleName}`;
        document.querySelector('#id__admin').textContent = user.id;
        displayReservations()
    } else {
        document.querySelector('.name__user').textContent = `${user.name}`;
        document.querySelector('#id__user').textContent = user.id;
        displayReservations()
    }
}

// Открытие модального окна при нажатии на кнопку "Войти"
btn.onclick = function() {
    modal.style.display = "block";
    modalBackground.style = "display: block;"; // Показываем фон
}

// Открытие модального окна регистрации
registerBtn.onclick = function() {
    modal.style.display = "none"; // Скрываем окно авторизации
    registerModal.style.display = "block"; // Показываем окно регистрации
}

// Закрытие модального окна авторизации при нажатии на "X"
span.onclick = function() {
    modal.style.display = "none";
    modalBackground.style.display = "none"; // Скрываем фон
}

// Закрытие модального окна регистрации при нажатии на "X"
closeRegisterSpan.onclick = function() {
    registerModal.style.display = "none";
    modalBackground.style.display = "none"; // Скрываем фон
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    if (event.target == modal || event.target == modalBackground) {
        modal.style.display = "none";
        modalBackground.style.display = "none"; // Скрываем фон
    }
    
    if (event.target == registerModal || event.target == modalBackground) {
        registerModal.style.display = "none";
        modalBackground.style.display = "none"; // Скрываем фон
    }
}

// Валидация пароля
function validatePassword(password) {
    const regex = /^(?=.*\d).{6,}$/; // Минимум 6 символов и хотя бы 1 цифра
    return regex.test(password);
}

// Обработка отправки формы авторизации
document.getElementById("login__form").onsubmit = function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const usersData = JSON.parse(localStorage.getItem('users')) || [];

    const userFound = usersData.find(user => user.email === loginEmail && user.password === loginPassword);

    if (userFound) {
        // successModal()
        modal.style.display = "none";
        modalBackground.style.display = "none";
        document.querySelector('header').style.display = 'none'; // Скрываем навигацию
        document.querySelector('main').style.display = 'none'; // Скрываем основной контент
        if (userFound.access === 'client') {
            document.querySelectorAll('.user').forEach(el => el.style.display = 'flex'); // Показываем элементы для клиента
            document.querySelectorAll('.admin').forEach(el => el.style.display = 'none'); // Скрываем элементы для администратора
            displayUserInfo(userFound);
            document.querySelector('.user__table').style.display = 'flex';
        } else {
            document.querySelectorAll('.admin').forEach(el => el.style.display = 'flex'); // Показываем элементы для администратора
            document.querySelectorAll('.user').forEach(el => el.style.display = 'none'); // Скрываем элементы для клиента
            displayUserInfo(userFound);
        }
        // Здесь можно перенаправить пользователя или выполнить другие действия
    } else {
        alert('Неверный логин или пароль.');
    }
}

// Обработка отправки формы регистрации
document.getElementById("registerForm").onsubmit = function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const regName = document.getElementById('regName').value;
    const regEmail = document.getElementById('regEmail').value;
    const regPassword = document.getElementById('regPassword').value;
    const regConfirmPassword = document.getElementById('regConfirmPassword').value;

    // Сброс ошибок
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    let validForm = true;

    // Проверка электронной почты на уникальность
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    
    if (usersData.some(user => user.email === regEmail)) {
        document.getElementById('emailError').textContent = 'Электронная почта уже используется.';
        validForm = false;
    }

    // Проверка пароля
    if (!validatePassword(regPassword)) {
        document.getElementById('regPassword').classList.add('error');
        document.getElementById('passwordError').textContent = 'Пароль должен содержать не менее 6 символов и хотя бы 1 цифру.';
        validForm = false;
    } else {
        document.getElementById('regPassword').classList.remove('error');
    }

    // Проверка совпадения паролей
    if (regPassword !== regConfirmPassword) {
        document.getElementById('regConfirmPassword').classList.add('error');
        document.getElementById('confirmPasswordError').textContent = 'Пароли не совпадают.';
        validForm = false;
    } else {
        document.getElementById('regConfirmPassword').classList.remove('error');
    }

    if (validForm) {
        // Генерация уникального ID для нового пользователя
        const newUserId = generateUniqueId(usersData);
        
        // Добавление нового пользователя в массив и сохранение в localStorage
        const newUserData = { id: newUserId, name: regName, email: regEmail, password: regPassword, access: 'client' };
        
        usersData.push(newUserData); // Добавляем нового пользователя в массив
        localStorage.setItem('users', JSON.stringify(usersData)); // Сохраняем массив пользователей
                
        // Возвращаемся к окну авторизации
        registerModal.style.display = "none"; // Скрываем окно регистрации
        modal.style.display = "block"; // Показываем окно авторизации
    }
}

// Обработка выхода из аккаунта
document.querySelectorAll('.exit').forEach(el => el.onclick = function() {
    document.querySelector('header').style.display = 'flex'; // Скрываем навигацию
    document.querySelector('main').style.display = 'flex'; // Скрываем основной контент
    document.querySelectorAll('.user').forEach(el => el.style.display = 'none'); // Показываем элементы для клиента
    document.querySelectorAll('.admin').forEach(el => el.style.display = 'none'); // Скрываем элементы для администратора
    localStorage.setItem('currentUser', [])
 }
)

// Инициализация данных при загрузке страницы
window.onload = function() {   
   // Если пользователь уже авторизован, отображаем его данные
   const loggedInUserEmail = localStorage.getItem("loggedInUserEmail"); // Получаем email авторизованного пользователя

   if (loggedInUserEmail) {
       const usersData = JSON.parse(localStorage.getItem('users')) || [];
       const loggedInUser = usersData.find(user => user.email === loggedInUserEmail);
       
       if (loggedInUser && loggedInUser.access === 'admin') {
           displayUserInfo(loggedInUser);
       }
   }
}

//---------------------------
// Сортировка/фильтрация в таблице
//---------------------------

// Фильтрация по имени и дате/времени
function filterTable() {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currUser.access === "admin") {
        const dateInputValue = document.getElementById("dateInputAdmin").value;
        const timeInputValue = document.getElementById("timeInputAdmin").value;
        const nameInputValue = document.getElementById("filterSearch").value.toLowerCase();
        
        let filteredReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        
        if (dateInputValue) {
            filteredReservations = filteredReservations.filter(reservation => reservation.date === dateInputValue);
        }
        
        if (timeInputValue) {
            filteredReservations = filteredReservations.filter(reservation => reservation.time === timeInputValue);
        }
    
        if (nameInputValue) {
            filteredReservations = filteredReservations.filter(reservation => 
                reservation.name.toLowerCase().includes(nameInputValue)
            );
        }
    
       displayFilteredReservations(filteredReservations);
    } else {
        const dateInputValue = document.getElementById("dateInputUser").value;
        const timeInputValue = document.getElementById("timeInputUser").value;
        
        let filteredReservations = JSON.parse(localStorage.getItem('reservations')).filter(reservation => reservation.email === currUser.email) || [];

        console.log(filteredReservations);
        
        if (dateInputValue) {
            filteredReservations = filteredReservations.filter(reservation => reservation.date === dateInputValue);
        }
        
        if (timeInputValue) {
            filteredReservations = filteredReservations.filter(reservation => reservation.time === timeInputValue);
        }
        
       displayFilteredReservations(filteredReservations);
    }
}

// Отображение отфильтрованных броней в таблице
function displayFilteredReservations(filteredReservations) {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currUser.access === "admin") {
        const reservationsTableBody = document.querySelector('#reservationsTable tbody');
        reservationsTableBody.innerHTML = ''; // Очищаем таблицу перед заполнением

        // Пагинация для отфильтрованных данных
        const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
        
        // Отображаем только текущую страницу с отфильтрованными данными
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        filteredReservations.slice(startIndex, endIndex).forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.name}</td>
                <td>${reservation.email}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.tableNumber}</td>
                <td>
                    <button class="button edit-button" onclick="editReservation('${reservation.id}')"><img src="img/edit.svg" alt="Редактировать"></button>
                    <button class="button delete-button" onclick="openDeleteConfirmation('${reservation.id}')"><img src="img/del.svg" alt="Удалить"></button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });

        // Обновление текста пагинации для отфильтрованных данных
        document.querySelectorAll('.pages').forEach(page => page.textContent = `${currentPage}/${totalPages}`);
    } else {
        const reservationsTableBody = document.querySelector('#reservationsTableUser tbody');
        reservationsTableBody.innerHTML = ''; // Очищаем таблицу перед заполнением

        // Пагинация для отфильтрованных данных
        const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
        
        // Отображаем только текущую страницу с отфильтрованными данными
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        filteredReservations.slice(startIndex, endIndex).forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.tableNumber}</td>
                <td>
                    <button class="button edit-button" onclick="editReservation('${reservation.id}')"><img src="img/edit.svg" alt="Редактировать"></button>
                    <button class="button delete-button" onclick="openDeleteConfirmation('${reservation.id}')"><img src="img/del.svg" alt="Удалить"></button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });

        // Обновление текста пагинации для отфильтрованных данных
        document.querySelectorAll('.pages').forEach(page => page.textContent = `${currentPage}/${totalPages}`);
    }
}

// Функция сортировки таблицы
function sortTable(columnIndex) {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currUser.access === 'admin') {
        const table = document.getElementById("reservationsTable");
        const tbody = table.tBodies[0];
        const rowsArray = Array.from(tbody.rows);
        
        // Определяем порядок сортировки (по возрастанию или убыванию)
        const isAscending = tbody.dataset.sortOrder === "asc";
        
        rowsArray.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex].innerText;
            const cellB = rowB.cells[columnIndex].innerText;

            if (columnIndex === 3) { // Сортировка по дате
                return isAscending ? new Date(cellA) - new Date(cellB) : new Date(cellB) - new Date(cellA);
            } else if (columnIndex === 4) { // Сортировка по времени
                return isAscending ? new Date("1970-01-01 " + cellA) - new Date("1970-01-01 " + cellB) : new Date("1970-01-01 " + cellB) - new Date("1970-01-01 " + cellA);
            }
            
            return 0; // Если не дата или время, не сортируем
        });

        // Устанавливаем новый порядок строк в tbody
        rowsArray.forEach(row => tbody.appendChild(row));
        
        // Обновляем порядок сортировки
        tbody.dataset.sortOrder = isAscending ? "desc" : "asc";
    } else {
        const table = document.getElementById("reservationsTableUser");
        const tbody = table.tBodies[0];
        const rowsArray = Array.from(tbody.rows);
        
        // Определяем порядок сортировки (по возрастанию или убыванию)
        const isAscending = tbody.dataset.sortOrder === "asc";
        
        rowsArray.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex].innerText;
            const cellB = rowB.cells[columnIndex].innerText;

            if (columnIndex === 1) { // Сортировка по дате
                return isAscending ? new Date(cellA) - new Date(cellB) : new Date(cellB) - new Date(cellA);
            } else if (columnIndex === 2) { // Сортировка по времени
                return isAscending ? new Date("1970-01-01 " + cellA) - new Date("1970-01-01 " + cellB) : new Date("1970-01-01 " + cellB) - new Date("1970-01-01 " + cellA);
            }
            
            return 0; // Если не дата или время, не сортируем
        });

        // Устанавливаем новый порядок строк в tbody
        rowsArray.forEach(row => tbody.appendChild(row));
        
        // Обновляем порядок сортировки
        tbody.dataset.sortOrder = isAscending ? "desc" : "asc";
    }
}


// -----------------------------
// Функционал со стороны администратора
// -----------------------------

document.querySelectorAll('.booksBtn').forEach(el => el.onclick = function () {
    if (!localStorage.currentUser) {
        alert('Войдите, пожалуйста, в аккаунт')
    } else {
        const currUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currUser.access === "admin") {
            document.querySelector('header').style.display = 'none'; // Скрываем навигацию
            document.querySelector('main').style.display = 'none'; // Скрываем основной контент
            document.querySelectorAll('.admin').forEach(el => el.style.display = 'flex'); // Скрываем элементы для администратора
            document.querySelectorAll('.user').forEach(el => el.style.display = 'none'); // Показываем элементы для клиента
        } else if (currUser.access === "client") {
            document.querySelector('header').style.display = 'none'; // Скрываем навигацию
            document.querySelector('main').style.display = 'none'; // Скрываем основной контент
            document.querySelectorAll('.admin').forEach(el => el.style.display = 'none'); // Скрываем элементы для администратора
            document.querySelector('.nav .user').style.display = 'flex'; // Показываем элементы для клиента
            document.querySelector('.user__table').style.display = 'flex';
            document.querySelector('.infrastructure').style.display = 'none'
        } else {
            alert('Что-то пошло не так')
        }
    }
});

// Отображение всех броней
function displayReservations() {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currUser.access === 'admin') {
        
        const reservationsTableBody = document.querySelector('#reservationsTable tbody');
        reservationsTableBody.innerHTML = ''; // Очищаем таблицу перед заполнением

        const reservations =  JSON.parse(localStorage.getItem('reservations')) || [];
        
        // Пагинация
        const totalPages = Math.ceil(reservations.length / itemsPerPage);
        
        // Отображаем только текущую страницу
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        reservations.slice(startIndex, endIndex).forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.name}</td>
                <td>${reservation.email}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.tableNumber}</td>
                <td>
                    <button class="button edit-button" onclick="editReservation('${reservation.id}')"><img src="img/edit.svg" alt="Редактировать"></button>
                    <button class="button delete-button" onclick="openDeleteConfirmation('${reservation.id}')"><img src="img/del.svg" alt="Удалить"></button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });

    // Обновление текста пагинации
    document.querySelectorAll('.pages').forEach(page => page.textContent = `${currentPage}/${totalPages}`);   
    } else {
        const reservationsTableBodyUser = document.querySelector('#reservationsTableUser tbody');
        reservationsTableBodyUser.innerHTML = ''; // Очищаем таблицу перед заполнением

        const reservations = JSON.parse(localStorage.getItem('reservations')).filter(reservation => reservation.email === currUser.email) || [];
        
        // Пагинация
        const totalPages = Math.ceil(reservations.length / itemsPerPage);
        
        // Отображаем только текущую страницу
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        reservations.slice(startIndex, endIndex).forEach(reservation => {
            if (reservation.email === currUser.email) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservation.id}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>${reservation.tableNumber}</td>
                    <td>
                        <button class="button edit-button" onclick="editReservation('${reservation.id}')"><img src="img/edit.svg" alt="Редактировать"></button>
                        <button class="button delete-button" onclick="openDeleteConfirmation('${reservation.id}')"><img src="img/del.svg" alt="Удалить"></button>
                    </td>
                `;
                reservationsTableBodyUser.appendChild(row);
                // Обновление текста пагинации
                document.querySelectorAll('.pages').forEach(page => page.textContent = `${currentPage}/${totalPages}`);
            } else {
                console.log(reservation.email, currUser.email)
            }
            
        });
    }
}

// Открытие модального окна для добавления новой брони
document.querySelectorAll(".add").forEach(el => el.onclick = function () {
    const currUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currUser.access === "admin") {
        document.getElementById('reservationModal').style.display = 'block'; // Показываем модальное окно
        document.getElementById('reservationForm').reset(); // Сбрасываем форму
        document.getElementById('reservationId').value = ''; // Очищаем ID

        // Делаем поля имени и email доступными для редактирования
        document.getElementById('reservationName').disabled = false;
        document.getElementById('reservationEmail').disabled = false;

        // Меняем заголовок модального окна на "Создание брони"
        document.getElementById('title-modal-admin').textContent = 'Создание брони';

        // Меняем кнопку модального окна на "Добавить бронь"
        document.getElementById('reservation-btn-admin').textContent = 'Добавить бронь';

        clearErrorMessages(); // Очищаем сообщения об ошибках
        populateAvailableTimes(); // Заполняем доступные времена
    } else if (currUser.access === "client") {
        document.getElementById('reservationModal').style.display = 'block'; // Показываем модальное окно
        document.getElementById('reservationForm').reset(); // Сбрасываем форму
        document.getElementById('reservationId').value = ''; // Очищаем ID

        // Заполнение имени и почты
        document.getElementById('reservationName').value = currUser.name;
        document.getElementById('reservationEmail').value = currUser.email;

        // Делаем поля имени и email не доступными для редактирования
        document.getElementById('reservationName').disabled = true;
        document.getElementById('reservationEmail').disabled = true;

        // Меняем заголовок модального окна на "Создание брони"
        document.getElementById('title-modal-admin').textContent = 'Создание брони';

        // Меняем кнопку модального окна на "Добавить бронь"
        document.getElementById('reservation-btn-admin').textContent = 'Добавить бронь';

        clearErrorMessages(); // Очищаем сообщения об ошибках
        populateAvailableTimes(); // Заполняем доступные времена
    } else {
        alert('Что-то не так')
    }
    
});

// Функция для редактирования брони
function editReservation(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservationToEdit = reservations.find(res => res.id === reservationId);

    if (reservationToEdit) {
        // Заполняем поля модального окна редактирования данными брони
        document.getElementById('reservationId').value = reservationToEdit.id;
        document.getElementById('reservationName').value = reservationToEdit.name;
        document.getElementById('reservationEmail').value = reservationToEdit.email;
        document.getElementById('reservationDate').value = reservationToEdit.date; // Убедитесь, что формат совпадает
        document.getElementById('reservationTime').value = reservationToEdit.time; // Корректное заполнение времени
        document.getElementById('tableNumber').value = reservationToEdit.tableNumber;

        // Делаем поля имени и email недоступными для редактирования
        document.getElementById('reservationName').disabled = true;
        document.getElementById('reservationEmail').disabled = true;

        // Меняем заголовок модального окна на "Редактирование брони"
        document.getElementById('title-modal-admin').textContent = 'Редактирование брони';

        // Меняем кнопку модального окна на "Сохранить изменения"
        document.getElementById('reservation-btn-admin').textContent = 'Сохранить изменения';

        // Показываем модальное окно редактирования
        document.getElementById('reservationModal').style.display = 'block';

        clearErrorMessages(); // Очищаем сообщения об ошибках
        populateAvailableTimes(); // Заполняем доступные времена
    } else {
        console.error("Бронь не найдена:", reservationId);
    }
}

// Функция для проверки валидации формы
function validateReservation(name, email, date, time, tableNumber) {
    let isValid = true;

    clearErrorMessages(); // Очищаем предыдущие сообщения об ошибках

    const currentDateTime = new Date();
    const selectedDate = new Date(date);

    // Проверка на дату (не ранее текущей даты)
    if (selectedDate < currentDateTime.setHours(0, 0, 0, 0)) {
        showErrorMessage('reservationDate', "Дата не может быть ранее текущей.");
        isValid = false;
    }

    // Проверка на время (должно быть не ранее следующего часа)
    const selectedTimeHour = parseInt(time.split(':')[0], 10);
    
    if (selectedDate.toDateString() === currentDateTime.toDateString() && selectedTimeHour <= currentDateTime.getHours() + 1) {
        showErrorMessage('reservationTime', "Время должно быть не ранее следующего часа.");
        isValid = false;
    }

    // Проверка на допустимые часы (от 12 до 23)
    if (selectedTimeHour < 12 || selectedTimeHour > 23) {
        showErrorMessage('reservationTime', "Время должно быть выбрано с 12:00 до 23:00.");
        isValid = false;
    }

    // Проверка на номер столика (от 1 до 8)
    if (tableNumber < 1 || tableNumber > 8) {
        showErrorMessage('tableNumber', "Номер столика должен быть от 1 до 8.");
        isValid = false;
    }

    return isValid;
}
// Функция для отображения сообщения об ошибке
function showErrorMessage(fieldId, message) {
    const field = document.getElementById(fieldId);
    
    field.classList.add('error'); // Добавляем класс ошибки

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;

    field.parentNode.insertBefore(errorMessage, field.nextSibling); // Вставляем сообщение после поля ввода
}

// Функция для очистки сообщений об ошибках
function clearErrorMessages() {
    const errorFields = document.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.remove()); // Удаляем все сообщения об ошибках

    const inputsWithErrorClass = document.querySelectorAll('.error');
    
    inputsWithErrorClass.forEach(input => input.classList.remove('error')); // Удаляем класс ошибки у полей ввода
}

// Функция для сохранения новой или измененной брони
document.getElementById('reservationForm').onsubmit = function(event) {
    event.preventDefault();

    const reservationId = document.getElementById('reservationId').value || generateUniqueId(); 
    const name = document.getElementById('reservationName').value;
    const email = document.getElementById('reservationEmail').value;
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('reservationTime').value;
    const tableNumber = parseInt(document.getElementById('tableNumber').value, 10);

   let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

   // Проверка на наличие конфликта с другими бронями (по дате, времени и номеру столика)
   const conflictExists = reservations.some(res => 
       res.date === date && 
       res.time === time && 
       res.tableNumber === tableNumber &&
       res.id !== reservationId 
   );

   if (conflictExists) {
       alert("Эта бронь уже существует на выбранную дату и время.");
       return;
   }

   // Валидация данных перед сохранением
   if (!validateReservation(name, email, date, time, tableNumber)) {
       return; // Если валидация не прошла, выходим из функции
   }

   if (document.getElementById('reservationId').value) {
       reservations = reservations.map(res => 
           res.id === reservationId ? { id: reservationId, name, email, date, time, tableNumber } : res
       );
       
       
   } else {
       reservations.push({ id: reservationId, name, email, date, time, tableNumber });
       
   }

   localStorage.setItem('reservations', JSON.stringify(reservations)); 
   
   displayReservations(); 

   // Закрываем модальное окно после добавления или редактирования
   document.getElementById('reservationModal').style.display = 'none';
};

// Функция для заполнения доступных времён в зависимости от существующих броней
function populateAvailableTimes() {
   const reservationsData = JSON.parse(localStorage.getItem('reservations')) || [];
    
   const selectedDateInput = document.getElementById('reservationDate');
    
   if (selectedDateInput.value) {
       const selectedDate = new Date(selectedDateInput.value);
        
       const takenTimes = reservationsData.filter(res => new Date(res.date).toDateString() === selectedDate.toDateString())
                                       .map(res => res.time);

       const timeSelect = document.getElementById('reservationTime');
        
       while (timeSelect.firstChild) { 
           timeSelect.remove(0); 
       }

       for (let hour = 12; hour <= 23; hour++) {
           const timeValue = `${hour.toString().padStart(2, '0')}:00`;
           if (!takenTimes.includes(timeValue)) {
               const option = new Option(timeValue, timeValue);
               timeSelect.add(option);
           }
       }
        
       if (timeSelect.options.length === 0) {
           alert("Нет доступных времён для выбранной даты.");
           timeSelect.value = ''; // Сбрасываем выбор времени
       }
        
       clearErrorMessages(); // Очищаем сообщения об ошибках при выборе новой даты
   }
}

let reservationIdToDelete = null; // Переменная для хранения ID брони, которую нужно удалить

// Функция для открытия модального окна подтверждения удаления
function openDeleteConfirmation(reservationId) {
    reservationIdToDelete = reservationId; // Сохраняем ID брони для удаления
    document.getElementById('deleteConfirmationModal').style.display = 'block'; // Показываем модальное окно
}

// Функция для закрытия модального окна подтверждения удаления
function closeDeleteConfirmation() {
    document.getElementById('deleteConfirmationModal').style.display = 'none'; // Скрываем модальное окно
}

function successModal() {
    document.getElementById('successModal').style.display = 'block'; // Показываем модальное окно
}

function closeSuccessModal() {
    console.log(document.getElementById('successModal'));
    document.getElementById('successModal').style.display = 'none'; // Скрываем модальное окно
}

// Обработка нажатия кнопки "Да, удалить"
document.getElementById('confirmDeleteButton').onclick = function() {
    deleteReservation(reservationIdToDelete); // Удаляем бронь
    closeDeleteConfirmation(); // Закрываем модальное окно
};

// Функция для удаления брони
function deleteReservation(reservationId) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations = reservations.filter(res => res.id !== reservationId); // Удаляем бронь по ID
    localStorage.setItem('reservations', JSON.stringify(reservations)); // Сохраняем обновленный массив в localStorage
    
    displayReservations(); // Обновляем отображение броней
}

// Закрытие модального окна при нажатии на крестик
document.querySelector('.close-reservation').onclick = function() {
   document.getElementById('reservationModal').style.display = 'none';
}

// Пагинация - изменяем страницу при клике на кнопки пагинации
function changePage(direction) {
    const reservationsCount = JSON.parse(localStorage.getItem('reservations')).length;
    
    if (direction === 1 && (currentPage * itemsPerPage) < reservationsCount) {
        currentPage++;
        displayReservations();
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
        displayReservations();
    }
}

// Функция закрытия модального окна успешного добавления брони
function closeSuccessModal() {
    const successModal = document.getElementById("successModal");
    successModal.classList.remove("show"); // Убираем класс показа с анимацией
 }
 
 // Функция для показа модального окна успешного добавления брони
 function showSuccessModal() {
    const successModal = document.getElementById("successModal");
    successModal.classList.add("show"); // Показываем модальное окно с анимацией
 
    setTimeout(() => { closeSuccessModal(); }, 3000); // Закрываем через 3 секунды
 }