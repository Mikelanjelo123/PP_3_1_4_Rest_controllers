// Базовый URL для ваших эндпоинтов
const BASE_URL = "/api/admin";

// Загружаем список пользователей
function fetchUsers() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            renderUsers(data.users);
        })
        .catch(error => console.error("Ошибка загрузки пользователей:", error));
}

// Рендерим таблицу
function renderUsers(users) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";
    users.forEach(u => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.firstName || ""}</td>
      <td>${u.lastName || ""}</td>
      <td>${u.email || ""}</td>
      <td>${(u.roles || []).map(r => r.name).join(", ")}</td>
      <td><button class="btn btn-warning btn-sm">Edit</button></td>
      <td><button class="btn btn-danger btn-sm">Delete</button></td>
    `;
        tableBody.appendChild(row);

        // Кнопка Edit
        row.querySelector(".btn-warning").addEventListener("click", () => openEditModal(u));
        // Кнопка Delete
        row.querySelector(".btn-danger").addEventListener("click", () => openDeleteModal(u));
    });
}

// Открываем модальное окно для редактирования
function openEditModal(user) {
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editFirstName").value = user.firstName || "";
    document.getElementById("editLastName").value = user.lastName || "";
    document.getElementById("editEmail").value = user.email || "";
    // Если нужно передавать пароль при редактировании:
    document.getElementById("editPassword").value = "";
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
            // Если пароль не передаётся — передадим пустой. Сервис перезапишет.
            // В реальном проекте можно сделать проверку, чтобы старый пароль не терялся.
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
        const response = await fetch(`${BASE_URL}/edit?id=${userId}`, {
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
        const response = await fetch(`${BASE_URL}/delete?id=${userId}`, {
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