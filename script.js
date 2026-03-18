document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('main-title');
    
    // 1. メインタイトルの書き換え（要素がある時だけ実行）
    if (titleElement) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const date = today.getDate();

        if (month === 3 && date === 20) {
            titleElement.innerText = "✨Happy Birthday Mama!✨";
            titleElement.classList.add('birthday-mode');
        } else {
            titleElement.innerText = "Welcome to Mama's Site!";
        }
    }

    // 2. もし script.js に showPage という関数が残っていたら、
    // ここから下のコードは全部消して大丈夫です！
});