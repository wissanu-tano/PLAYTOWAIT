/* --- ระบบหลัก ตัวจัดการหน้า คะแนนสะสม --- */
let totalAccumulatedPoints = parseInt(localStorage.getItem('gt_points') || '0');
let currentTimer = null;
let timeLeft = 60;
let p1Lives = 3;
let botLives = 3;
let currentGameScore = 0;
let isPlayerTurn = true;
let activeGameLoop = null;
let modeHasP1Lives = false;
let modeHasBotLives = false;
let currentMiniGameType = '';

/* --- ระบบจัดการจำกัดแต้มสะสมประจำวัน (ไม่เกิน 1,000 แต้ม/วัน) --- */
const DAILY_LIMIT = 1000;

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getDailyPointsData() {
    const todayStr = getTodayString();
    const savedData = JSON.parse(localStorage.getItem('gt_daily_points')) || { date: todayStr, points: 0 };
    
    if (savedData.date !== todayStr) {
        savedData.date = todayStr;
        savedData.points = 0;
        localStorage.setItem('gt_daily_points', JSON.stringify(savedData));
    }
    return savedData;
}

function savePoints(pts) {
    const dailyData = getDailyPointsData();
    
    if (dailyData.points >= DAILY_LIMIT) {
        alert(`⚠️ วันนี้คุณสะสมแต้มครบโควตา 1,000 PTS แล้ว!\n(แต้มรอบนี้จะไม่ถูกนำไปบันทึกเพิ่ม)`);
        return;
    }

    const allowedPoints = Math.min(pts, DAILY_LIMIT - dailyData.points);
    
    dailyData.points += allowedPoints;
    localStorage.setItem('gt_daily_points', JSON.stringify(dailyData));

    totalAccumulatedPoints += allowedPoints;
    localStorage.setItem('gt_points', totalAccumulatedPoints);
    updatePointsDisplays();

    if (dailyData.points >= DAILY_LIMIT) {
        alert(`🎉 บันทึกแต้มสะสม +${allowedPoints} PTS สำเร็จ!\n🏆 คุณสะสมแต้มครบโควตาประจำวันแล้ว (${dailyData.points}/${DAILY_LIMIT} PTS)`);
    } else {
        alert(`🎉 บันทึกแต้มสะสม +${allowedPoints} PTS สำเร็จ!\n📊 แต้มสะสมวันนี้: ${dailyData.points}/${DAILY_LIMIT} PTS`);
    }
}

function updatePointsDisplays() {
    // ดึงค่าล่าสุดจาก localStorage เสมอ
    totalAccumulatedPoints = parseInt(localStorage.getItem('gt_points') || '0', 10);
    const dailyData = getDailyPointsData();
    
    const totalDisp = document.getElementById('total-points-display');
    if (totalDisp) totalDisp.innerText = totalAccumulatedPoints;
    
    const shopDisp = document.getElementById('shop-points-display');
    if (shopDisp) shopDisp.innerText = totalAccumulatedPoints;
    
    const dailyDisp = document.getElementById('daily-points-display');
    if (dailyDisp) {
        dailyDisp.innerText = dailyData.points;
    }

    if (typeof renderShopGrid === 'function') {
        renderShopGrid();
    }
}

function switchScreen(screenId) {
    clearInterval(currentTimer);
    if (activeGameLoop) clearInterval(activeGameLoop);

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    updatePointsDisplays();
    if (typeof initAndPlayAudio === 'function') {
        initAndPlayAudio();
    }
}

function exitCurrentGame() {
    playSound('btn');
    switchScreen('selection-screen');
}

function initGameHeader(hasP1Lives = false, hasBotLives = false) {
    timeLeft = 60;
    p1Lives = 3;
    botLives = 3;
    currentGameScore = 0;
    isPlayerTurn = true;
    modeHasP1Lives = hasP1Lives;
    modeHasBotLives = hasBotLives;
    
    document.getElementById('p1-lives-box').style.display = hasP1Lives ? 'flex' : 'none';
    document.getElementById('bot-lives-box').style.display = hasBotLives ? 'flex' : 'none';
    document.getElementById('lives-wrapper').style.display = (hasP1Lives || hasBotLives) ? 'flex' : 'none';
    
    updateHeaderUI();

    clearInterval(currentTimer);
    currentTimer = setInterval(() => {
        timeLeft--;
        updateHeaderUI();
        if (timeLeft <= 0) {
            clearInterval(currentTimer);

            if (currentMiniGameType === 'monopoly') {
                const pNet = window.currentMonoPNetWorth || 0;
                const bNet = window.currentMonoBNetWorth || 0;

                if (pNet > bNet) {
                    playSound('correct');
                    addScore(100);
                    savePoints(currentGameScore);
                    alert(`⏰ หมดเวลา! ทรัพย์สินรวมคุณ (฿${pNet}) มากกว่าบอท (฿${bNet})\n🎉 คุณชนะเลิศ!`);
                } else if (pNet < bNet) {
                    playSound('wrong');
                    alert(`⏰ หมดเวลา! ทรัพย์สินรวมคุณ (฿${pNet}) น้อยกว่าบอท (฿${bNet})\n💥 คุณแพ้ในรอบนี้!`);
                } else {
                    playSound('correct');
                    savePoints(currentGameScore);
                    alert(`⏰ หมดเวลา! ทรัพย์สินรวมเท่ากันที่ ฿${pNet}\n🤝 เสมอกัน!`);
                }
            } else {
                playSound('wrong');
                alert(`⏰ หมดเวลา! คะแนนที่คุณได้ในรอบนี้คือ: ${currentGameScore}`);
                savePoints(currentGameScore);
            }

            switchScreen('selection-screen');
        }
    }, 1000);
}

function updateHeaderUI() {
    const timerElem = document.getElementById('timer-display');
    if (timerElem) {
        timerElem.innerHTML = `⏳ <span>${timeLeft}</span>s`;
    }
    
    if (modeHasP1Lives) {
        let h = ''; for (let i = 0; i < p1Lives; i++) h += '❤️';
        document.getElementById('p1-lives').innerText = h || '💀';
    }
    if (modeHasBotLives) {
        let bh = ''; for (let i = 0; i < botLives; i++) bh += '❤️';
        document.getElementById('bot-lives').innerText = bh || '💀';
    }

    document.getElementById('game-score-display').innerText = `SCORE: ${currentGameScore}`;
    
    if (['snake','chess','monopoly','runner'].includes(currentMiniGameType)) {
        document.getElementById('turn-banner').style.display = 'block';
        document.getElementById('turn-banner').innerText = isPlayerTurn ? "🎮 เทิร์นของคุณ (P1)" : "🤖 เทิร์นของบอท (CPU)...";
    } else {
        document.getElementById('turn-banner').style.display = 'none';
    }
}

function loseP1Life() {
    if (!modeHasP1Lives) return;
    playSound('wrong');
    p1Lives--;
    updateHeaderUI();
    if (p1Lives <= 0) {
        clearInterval(currentTimer);
        if (activeGameLoop) clearInterval(activeGameLoop);
        alert('💥 Game Over! คุณเสียหัวใจครบ 3 ดวงแล้ว');
        savePoints(currentGameScore);
        switchScreen('selection-screen');
    }
}

function loseBotLife() {
    if (!modeHasBotLives) return;
    playSound('correct');
    botLives--;
    updateHeaderUI();
    if (botLives <= 0) {
        clearInterval(currentTimer);
        if (activeGameLoop) clearInterval(activeGameLoop);
        addScore(100);
        savePoints(currentGameScore);
        alert(`🏆 ชนะเลิศ! บอทหัวใจหมดแล้ว!`);
        switchScreen('selection-screen');
    }
}

function addScore(pts) {
    playSound('correct');
    currentGameScore += pts;
    updateHeaderUI();
}

function startMiniGame(type) {
    switchScreen('game-screen');
    currentMiniGameType = type;
    const arena = document.getElementById('game-arena');
    arena.innerHTML = '';

    switch(type) {
        case 'snake': initGameHeader(false, false); loadSnakeGame(arena); break;
        case 'chess': initGameHeader(false, false); loadChessGame(arena); break;
        case 'monopoly': initGameHeader(false, false); loadMonopolyGame(arena); break;
        case 'jigsaw': initGameHeader(false, false); loadJigsawGame(arena); break;
        case 'trivia': initGameHeader(true, false); loadTriviaGame(arena); break;
        case 'runner': initGameHeader(true, true); loadRunnerGame(arena); break;
    }
}

function animateDiceRoll(dispElement, finalDiceVal, onComplete) {
    let rollTicks = 0;
    const diceIcons = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    dispElement.classList.add('dice-rolling');

    const rollInterval = setInterval(() => {
        playSound('dice');
        dispElement.innerText = diceIcons[Math.floor(Math.random() * 6)];
        rollTicks++;

        if (rollTicks > 10) {
            clearInterval(rollInterval);
            dispElement.classList.remove('dice-rolling');
            dispElement.innerText = diceIcons[finalDiceVal - 1];
            if (onComplete) onComplete();
        }
    }, 70);
}

document.addEventListener("DOMContentLoaded", () => {
    updatePointsDisplays();
});