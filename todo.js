// あなたがPCでこれを書き換えてアップロードする
const SHARED_TODOS = [
    "3月20日のケーキを買う",
    "週末のランチを予約する",
    "お母さんの肩をもむ"
];

function renderTodos() {
    const listElement = document.getElementById('todo-list');
    listElement.innerHTML = "";

    SHARED_TODOS.forEach(task => {
        const item = document.createElement('div');
        item.className = 'todo-item'; // ピンクの四角などのデザイン
        item.innerText = task;
        listElement.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', renderTodos);