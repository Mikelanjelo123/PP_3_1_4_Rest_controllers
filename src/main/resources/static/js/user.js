 // Загрузка данных пользователя с API при загрузке страницы
    document.addEventListener('DOMContentLoaded', function () {
    fetchUserData();
});

    function fetchUserData() {
    fetch('/api/user')  // Замените на ваш актуальный API-эндпоинт
        .then(response => response.json())
        .then(data => {
            if (data.userDetails && data.userDetails.user) {
                const user = data.userDetails.user;

                // Обновление email в заголовке
                const userEmailSpan = document.getElementById('userEmail');
                if (userEmailSpan) {
                    userEmailSpan.textContent = user.email;
                }

                // Обновление данных в таблице
                updateUserTable(user);
            } else {
                console.error('Ошибка: Неправильный формат JSON или отсутствуют данные пользователя', data);
            }
        })
        .catch(error => console.error('Ошибка загрузки данных пользователя:', error));
}

    function updateUserTable(user) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) {
    console.error('Ошибка: Таблица не найдена');
    return;
}

    // Очистка текущих данных в таблице
    tableBody.innerHTML = '';

    const userRole = user.roles && user.roles.length > 0
    ? user.roles[0].name.replace('ROLE_', '')  // Извлекаем роль без префикса ROLE_
    : 'No Role';

    // Создание новой строки в таблице
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${userRole}</td>
            `;
    tableBody.appendChild(row);
}