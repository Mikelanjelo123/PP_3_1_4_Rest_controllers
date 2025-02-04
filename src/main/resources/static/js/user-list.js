const apiUrl = '/api/admin'; // URL вашего API
let users = []; // Глобальный массив пользователей

// Функция для получения списка пользователей
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            users = data.users; // Обновляем список пользователей
            updateUserTable(users); // Обновляем таблицу пользователей
        } else {
            showError('Error fetching users: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Функция для добавления нового пользователя
async function addUser(user) {
    try {
        const response = await fetch(`${apiUrl}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();

        if (response.ok) {
            users.push(data.user); // Локально добавляем пользователя
            updateUserTable(users); // Обновляем таблицу
        } else {
            showError('Error adding user: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Функция для редактирования пользователя
async function editUser(id, user) {
    try {
        const response = await fetch(`${apiUrl}/edit?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();

        if (response.ok) {
            // Обновляем пользователя локально
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                // Если сервер возвращает весь объект пользователя
                users[index] = data;  // Обновляем напрямую, так как сервер возвращает объект
                updateUserTable(users); // Перерисовываем таблицу
            }
        } else {
            showError('Error updating user: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}


// Функция для удаления пользователя
async function deleteUser(id) {
    try {
        const response = await fetch(`${apiUrl}/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            users = users.filter(user => user.id !== id); // Локально удаляем пользователя
            updateUserTable(users); // Обновляем таблицу
        } else {
            showError('Error deleting user: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Функция для открытия модала редактирования
function openEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.roles.name;
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
}

// Функция для открытия модала удаления
function openDeleteModal(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('deleteFirstName').value = user.firstName;
        document.getElementById('deleteLastName').value = user.lastName;
        document.getElementById('deleteEmail').value = user.email;
        document.getElementById('deleteRole').value = user.roles[0].name;

        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();

        const deleteButton = document.getElementById('confirmDeleteButton');
        deleteButton.onclick = () => {
            deleteUser(userId); // Удаляем пользователя
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide(); // Закрываем модальное окно
        };
    }
}

// Функция для обновления таблицы пользователей
function updateUserTable(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = ''; // Очищаем таблицу

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(', ')}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" onclick="openEditModal(${user.id})">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Функция для отображения ошибок
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerText = message;
    errorContainer.style.display = 'block';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUsers);
