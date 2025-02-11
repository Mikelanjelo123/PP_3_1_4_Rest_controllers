const BASE_URL = "/api/admin";

// Загружаем список пользователей
function fetchUsers() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            renderUsers(data.users);
            fetchCurrentUser();  // Загружаем email текущего пользователя
        })
        .catch(error => console.error("Ошибка загрузки пользователей:", error));
}

// Функция для получения информации о текущем авторизованном пользователе
function fetchCurrentUser() {
    // Так как у нас одна конечная точка /api/admin, мы извлекаем email из данных пользователей
    fetch(`${BASE_URL}`)
        .then(response => response.json())
        .then(data => {
            const userEmailElement = document.getElementById("userEmail");
            const currentUser = data.personDetails ? data.personDetails.user : null;
            if (currentUser && currentUser.email) {
                userEmailElement.innerText = currentUser.email;  // Обновляем email в элементе
            } else {
                userEmailElement.innerText = "Email не найден";  // Если email не найден
            }
        })
        .catch(error => console.error("Ошибка при загрузке данных пользователя:", error));
}

// Рендерим таблицу пользователей
function renderUsers(users) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";
    users.forEach(u => {
        const userRole = u.roles && u.roles.length > 0
            ? u.roles[0].name.replace('ROLE_', '')  // Убираем префикс ROLE_
            : 'No Role';

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${u.id}</td>
          <td>${u.firstName || ""}</td>
          <td>${u.lastName || ""}</td>
          <td>${u.email || ""}</td>
          <td>${userRole}</td>
          <td><button class="btn btn-warning btn-sm">Edit</button></td>
          <td><button class="btn btn-danger btn-sm">Delete</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".btn-warning").addEventListener("click", () => openEditModal(u));
        row.querySelector(".btn-danger").addEventListener("click", () => openDeleteModal(u));
    });
}

// Открываем модальное окно для редактирования
function openEditModal(user) {
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editFirstName").value = user.firstName || "";
    document.getElementById("editLastName").value = user.lastName || "";
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editPassword").value = "" || "";
    document.getElementById("editRole").value = (user.roles && user.roles[0]) ? user.roles[0].name : "ROLE_USER";

    new bootstrap.Modal(document.getElementById("editModal")).show();
}

// Открываем модальное окно для удаления
function openDeleteModal(user) {
    document.getElementById("deleteUserId").value = user.id;
    document.getElementById("deleteFirstName").value = user.firstName || "";
    document.getElementById("deleteLastName").value = user.lastName || "";
    document.getElementById("deleteEmail").value = user.email || "";
    document.getElementById("deleteRole").value = (user.roles && user.roles[0]) ? user.roles[0].name : "ROLE_USER";

    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

// При загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();

    // Добавление пользователя
    document.getElementById("addUserForm").addEventListener("submit", e => {
        e.preventDefault();
        const userData = {
            firstName: document.getElementById("addFirstName").value,
            lastName: document.getElementById("addLastName").value,
            email: document.getElementById("addEmail").value,
            password: document.getElementById("addPassword").value,
            roles: [{ name: document.getElementById("addRole").value }]
        };
        addUser(userData);
    });

    // Сохранение изменений при редактировании
    document.getElementById("editUserForm").addEventListener("submit", e => {
        e.preventDefault();
        const userId = document.getElementById("editUserId").value;
        const userData = {
            firstName: document.getElementById("editFirstName").value,
            lastName: document.getElementById("editLastName").value,
            email: document.getElementById("editEmail").value,
            password: document.getElementById("editPassword").value,
            roles: [{ name: document.getElementById("editRole").value }]
        };
        editUser(userId, userData);
    });

    // Удаление пользователя
    document.getElementById("confirmDeleteButton").addEventListener("click", () => {
        const userId = document.getElementById("deleteUserId").value;
        deleteUser(userId);
    });
});

// Добавляем пользователя
async function addUser(userData) {
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        closeModal("#addModal");
        fetchUsers();
    } catch (error) {
        console.error("Ошибка при добавлении:", error);
    }
}

// Редактируем пользователя
async function editUser(userId, userData) {
    try {
        const response = await fetch(`${BASE_URL}/edit/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        closeModal("#editModal");
        fetchUsers();
    } catch (error) {
        console.error("Ошибка при редактировании:", error);
    }
}

// Удаляем пользователя
async function deleteUser(userId) {
    try {
        const response = await fetch(`${BASE_URL}/delete/${userId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        closeModal("#deleteModal");
        fetchUsers();
    } catch (error) {
        console.error("Ошибка при удалении:", error);
    }
}

// Закрываем модалку
function closeModal(selector) {
    const modalEl = document.querySelector(selector);
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}
