// --- 1. ガチャの景品データ ---
const GACHA_ITEMS = [
    { name: "お皿洗い1回免除券", rare: false },
    { name: "肩たたき15分券", rare: false },
    { name: "ゴミ出し代行券", rare: false },
    { name: "お風呂掃除免除券", rare: false },
    { name: "スタバ新作おごり券", rare: false },
    { name: "なんでも1つおねだり券", rare: false },
    { name: "1日「家事休み」宣言券", rare: false },
    { name: "【激レア】欲しい靴をプレゼント券", rare: true },
    { name: "【激レア】欲しい服を1着プレゼント券", rare: true },
    { name: "【激レア】焼肉おごり券", rare: true }
];

// --- 2. データの読み込みと初期化 ---
let inventory = JSON.parse(localStorage.getItem('mamaInventory')) || [];
let gachaCount = localStorage.getItem('gachaCount') !== null ? parseInt(localStorage.getItem('gachaCount')) : 1;
let lastResetDate = localStorage.getItem('lastResetDate') || ""; // 最後にリセットした「週」を記録

// 📅 「1週間に1回追加（繰り越し対応）」の判定
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const now = new Date();
const currentWeekKey = `${now.getFullYear()}-${getWeekNumber(now)}`;

// --- 🎂 誕生日特別ボーナスの判定 ---
const birthdayKey = `${now.getFullYear()}-03-20`; // 今年の誕生日キー
const lastBirthdayBonusDate = localStorage.getItem('lastBirthdayBonusDate') || "";

// 今日が3月20日 かつ まだ今年のボーナスをあげていない場合
if (now.getMonth() === 2 && now.getDate() === 20 && lastBirthdayBonusDate !== birthdayKey) {
    gachaCount += 3; // 3回分追加！
    localStorage.setItem('gachaCount', gachaCount);
    localStorage.setItem('lastBirthdayBonusDate', birthdayKey); // 今年分は完了と記録
    
    // お祝いメッセージ（ページを開いた時に出す）
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            alert("🎂 お誕生日おめでとうございます！ 🎂\n\n今日は特別にガチャを【3回分】プレゼントしたよ！🎁");
            updateCountDisplay();
        }, 500);
    });
}

// 週が変わっていたら、回数を +1 する（繰り越し）
if (lastResetDate !== currentWeekKey) {
    // 初回起動時以外で、週が変わっていれば追加
    if (lastResetDate !== "") {
        gachaCount += 1; 
    }
    localStorage.setItem('gachaCount', gachaCount);
    localStorage.setItem('lastResetDate', currentWeekKey);
}

// ページを開いた時に残り回数を画面に出す
document.addEventListener('DOMContentLoaded', () => {
    updateCountDisplay();
});

function updateCountDisplay() {
    const countElement = document.getElementById('gacha-count');
    if (countElement) {
        countElement.innerText = gachaCount;
    }
}

// --- 3. ガチャを回す機能 ---
function spinGacha() {
    if (gachaCount <= 0) {
        alert("今週のガチャはもうおわり！\nまた来週1回分チャージされるよ。");
        return;
    }

    const btn = document.getElementById('gacha-button');
    const display = document.getElementById('gacha-result-display');
    
    btn.disabled = true; 
    display.classList.add('shaking'); 
    display.innerText = "？？？";

    setTimeout(() => {
        const random = Math.floor(Math.random() * 100);
        let result;

        // 💎 激レア確率を 5% に設定（ちょうどいいバランス！）
        if (random < 5) {
            const rareItems = GACHA_ITEMS.filter(item => item.rare);
            result = rareItems[Math.floor(Math.random() * rareItems.length)];
        } else {
            const normalItems = GACHA_ITEMS.filter(item => !item.rare);
            result = normalItems[Math.floor(Math.random() * normalItems.length)];
        }

        display.classList.remove('shaking');
        display.innerText = result.name;
        
        if(result.rare) {
            display.style.color = "#ff1493";
            display.style.textShadow = "0 0 10px #ffb6c1";
            display.innerText = "✨" + result.name + "✨";
        } else {
            display.style.color = "#ff8c00";
            display.style.textShadow = "none";
        }

        inventory.push(result.name);
        localStorage.setItem('mamaInventory', JSON.stringify(inventory));

        // 回数を1減らして保存
        gachaCount--;
        localStorage.setItem('gachaCount', gachaCount);
        updateCountDisplay();

        btn.disabled = false;
        
        setTimeout(() => {
            alert(`🎉 おめでとう！\n\n「${result.name}」をゲットしたよ！`);
        }, 300);

    }, 1500);

      
    
}