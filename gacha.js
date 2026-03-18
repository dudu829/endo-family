// --- 1. ガチャの景品データ ---
const GACHA_ITEMS = [
    { name: "お皿洗い券", rare: false },
    { name: "お風呂掃除券", rare: false },
    { name: "パシリ券", rare: false },
    { name: "送迎券", rare: false },
    { name: "ムクの散歩券", rare: false },
    { name: "肩たたき15分券", rare: false },
    { name: "ゴミ出し代行券", rare: false },
    { name: "お風呂掃除免除券", rare: false },
    { name: "夜ごはん代わりに作る券", rare: false },
    { name: "ラーメンおごり券", rare: false },
    { name: "スタバ新作おごり券", rare: false },
    { name: "なんでも1つおねだり券", rare: false },
    { name: "【レア】ガソリン代おごり券", rare: false },
    { name: "【レア】1日「家事休み」宣言券", rare: false },
    { name: "【激レア】欲しい靴をプレゼント券", rare: true },
    { name: "【激レア】欲しいかばんをプレゼント券", rare: true },
    { name: "【激レア】欲しい服を1プレゼント券", rare: true },
    { name: "【激レア】焼肉おごり券", rare: true }, // ←カンマ追加
    { name: "【激激レア】旅行費プレゼント券", rare: true }
];

// --- 2. データの読み込みと初期化 ---
let inventory = JSON.parse(localStorage.getItem('mamaInventory')) || [];
let gachaCount = localStorage.getItem('gachaCount') !== null ? parseInt(localStorage.getItem('gachaCount')) : 1;
let lastChargeDate = localStorage.getItem('lastChargeDate') || ""; 

const now = new Date();
const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

// 📅 3日に1回チャージする判定（古い「週」のコードは削除しました）
if (lastChargeDate === "") {
    localStorage.setItem('lastChargeDate', todayStr);
} else {
    const lastDate = new Date(lastChargeDate);
    const diffTime = now - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays >= 3) {
        gachaCount += 1; 
        localStorage.setItem('gachaCount', gachaCount);
        localStorage.setItem('lastChargeDate', todayStr); 
    }
}

// --- 🎂 誕生日特別ボーナスの判定 ---
const birthdayKey = `${now.getFullYear()}-03-20`; 
const lastBirthdayBonusDate = localStorage.getItem('lastBirthdayBonusDate') || "";

if (now.getMonth() === 2 && now.getDate() === 20 && lastBirthdayBonusDate !== birthdayKey) {
    gachaCount += 3; 
    localStorage.setItem('gachaCount', gachaCount);
    localStorage.setItem('lastBirthdayBonusDate', birthdayKey); 
    
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            alert("🎂 お誕生日おめでとうございます！ 🎂\n\n今日は特別にガチャを【3回分】プレゼントしたよ！🎁");
            updateCountDisplay();
        }, 500);
    });
}

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
        alert("ガチャの回数がなくなっちゃった！\nまた3日後に1回分チャージされるよ。");
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

        // 💎 激レア確率を 2% に設定
        if (random < 2) { 
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

        gachaCount--;
        localStorage.setItem('gachaCount', gachaCount);
        updateCountDisplay();

        btn.disabled = false;
        
        setTimeout(() => {
            alert(`🎉 おめでとう！\n\n「${result.name}」をゲットしたよ！`);
        }, 300);

    }, 1500);
}
