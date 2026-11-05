function loadRunnerGame(container) {
    container.innerHTML = `
        <div style="color:var(--pixel-text); font-size:11px; margin-bottom:6px; font-weight:bold;">🏃 แตะหน้าจอเพื่อกระโดดหลบสิ่งกีดขวาง!</div>
        <canvas id="runner-canvas" width="320" height="200"></canvas>
    `;

    const canvas = document.getElementById('runner-canvas');
    const ctx = canvas.getContext('2d');

    let player = { x: 30, y: 130, w: 20, h: 26, vy: 0, jumping: false };
    let bot = { x: 30, y: 40, w: 20, h: 26, vy: 0, jumping: false };
    let obstacles = [];
    let spawnTimer = 0;

    function doJump() {
        if (!player.jumping) {
            playSound('jump');
            player.vy = -9;
            player.jumping = true;
        }
    }

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); doJump(); });
    canvas.addEventListener('mousedown', doJump);

    activeGameLoop = setInterval(() => {
        player.y += player.vy;
        if (player.y < 130) player.vy += 0.55;
        else { player.y = 130; player.jumping = false; player.vy = 0; }

        bot.y += bot.vy;
        if (bot.y < 40) bot.vy += 0.55;
        else { bot.y = 40; bot.jumping = false; bot.vy = 0; }

        spawnTimer++;
        if (spawnTimer > 75) {
            spawnTimer = 0;
            obstacles.push({ x: 320, w: 16, h: 22, hitPlayer: false, hitBot: false });
        }

        obstacles.forEach(obs => {
            if (obs.x > 35 && obs.x < 75 && !bot.jumping) {
                if (Math.random() < 0.75) {
                    bot.vy = -9;
                    bot.jumping = true;
                }
            }
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // พื้นหญ้า
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(0, 156, 320, 10);
        ctx.fillRect(0, 66, 320, 10);

        // ตัวละครผู้เล่น (สีแดง) & บอท (สีเหลือง)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(player.x, player.y, player.w, player.h);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(bot.x, bot.y, bot.w, bot.h);

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= 4;

            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(obs.x, 156 - obs.h, obs.w, obs.h);
            ctx.fillRect(obs.x, 66 - obs.h, obs.w, obs.h);

            if (!obs.hitPlayer && player.x < obs.x + obs.w && player.x + player.w > obs.x && player.y + player.h > 156 - obs.h) {
                obs.hitPlayer = true;
                loseP1Life();
            }

            if (!obs.hitBot && bot.x < obs.x + obs.w && bot.x + bot.w > obs.x && bot.y + bot.h > 66 - obs.h) {
                obs.hitBot = true;
                loseBotLife();
            }

            if (obs.x < -20) {
                obstacles.splice(i, 1);
                addScore(10);
            }
        }
    }, 1000 / 60);
}