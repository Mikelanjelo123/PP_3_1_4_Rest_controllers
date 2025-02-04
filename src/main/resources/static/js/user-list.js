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
            console.log('Users:', data.users);
            console.log('Roles:', data.roles);
            users = data.users; // Обновляем список пользователей
            updateUserTable(data.users); // Обновляем таблицу пользователей
        } else {
            console.error('Error fetching users:', data);
        }
    } catch (error) {
        console.error('Error:', error);
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
            console.log('User added:', data);
            fetchUsers(); // Обновляем список пользователей
        } else {
            console.error('Error adding user:', data);
        }
    } catch (error) {
        console.error('Error:', error);
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
            console.log('User updated:', data);
            fetchUsers(); // Обновляем список пользователей
        } else {
            console.error('Error updating user:', data);
        }
    } catch (error) {
        console.error('Error:', error);
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
            console.log('User deleted:', data);
            fetchUsers(); // Обновляем список пользователей
        } else {
            console.error('Error deleting user:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Функция для открытия модала редактирования
function openEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.roles[0].name; // Убедитесь, что у пользователя только один роль
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
}

// Функция для открытия модала удаления
function openDeleteModal(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Устанавливаем значения в поля формы для удаления
        document.getElementById('deleteFirstName').value = user.firstName; // Используем .value для input
        document.getElementById('deleteLastName').value = user.lastName;   // и для input
        document.getElementById('deleteEmail').value = user.email;         // и для input
        document.getElementById('deleteRole').value = user.roles[0].name;   // и для select

        // Открываем модальное окно
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();

        // Устанавливаем обработчик для кнопки подтверждения удаления
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUsers);
