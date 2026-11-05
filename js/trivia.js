function loadTriviaGame(container) {
    const rawQuestions = [
        { q: "เดือนอะไร มี 28 วัน ?", options: ["กุมภาพันธ์", "ทุกเดือน", "ไม่มีเลย"], ans: 1 },
        { q: "อะไรยิ่งตัด ยิ่งยาว ?", options: ["กางเกง", "เชือก", "ถนน"], ans: 2 },
        { q: "ปลาอะไร ไม่มีก้าง ?", options: ["ปูเค็ม", "ปลาป๋อง", "ปลาไร้ก้าง"], ans: 0 },
        { q: "จังหวัดอะไร มีแมวเยอะที่สุด ?", options: ["แมวฮ่องกง", "แคทมันดู", "แมวสอด"], ans: 1 },
        { q: "อะไรเอ่ย มีตาข้างเดียว แต่ดูอะไรไม่เห็น ?", options: ["เข็มเย็บผ้า", "สับปะรด", "พายุ"], ans: 0 },
        { q: "อะไรเอ่ย เดินได้ ยืนได้ แต่ไม่มีขา ?", options: ["นาฬิกา", "เงา", "งู"], ans: 0 },
        { q: "ต้นอะไรออกลูกเป็นลิง ?", options: ["ต้นวานร", "ต้นไม้เลื้อย", "ต้นกล้วย (เครือลิง)"], ans: 2 },
        { q: "สัตว์อะไรห้ามชน ?", options: ["คางคก", "ช้าง", "คางหมู"], ans: 2 },
        { q: "รถอะไรยาวที่สุดในโลก ?", options: ["รถไฟ", "รถด่วน", "รถติด"], ans: 2 },
        { q: "อะไรอยู่ตรงกลางระหว่าง 'หัว' กับ 'ท้าย' ?", options: ["กับ", "ลำตัว", "หัวใจ"], ans: 0 },
        { q: "อะไรเอ่ย มีขา 4 ขา แต่เดินไม่ได้ ?", options: ["โต๊ะ/เก้าอี้", "สุนัข", "แมว"], ans: 0 },
        { q: "ทำไมปลาจึงต้องอยู่ในน้ำ ?", options: ["เพราะกลัวแดด", "เพราะว่าน้ำอยู่ในปลาไม่ได้", "เพราะว่าไม่มีบ้านอยู่"], ans: 1 },
        { q: "ไก่อะไร นั่งรถไฟมา ?", options: ["ไก่ย่าง", "ไก่ทอด", "ไก่ชน"], ans: 0 },
        { q: "อะไรเอ่ย ยิ่งโกรธ ยิ่งโต ?", options: ["อารมณ์", "ลูกไฟ", "ดวงตา"], ans: 1 },
        { q: "นกอะไรเอ่ย บินไม่ได้ นอนไม่ได้ เดินไม่ได้ ?", options: ["นกเพนกวิน", "นกตาย", "นกกระดาษ"], ans: 1 },
        { q: "อะไรเอ่ย ยิ่งถู ยิ่งสั้น ?", options: ["ยางลบ", "สบู่", "แปรงสีฟัน"], ans: 1 },
        { q: "ผลไม้อะไร มีตารอบตัว ?", options: ["แตงโม", "สับปะรด", "แก้วมังกร"], ans: 1 },
        { q: "อะไรเอ่ย ยิ่งล้าง ยิ่งสกปรก ?", options: ["ผ้าเช็ดตัว", "น้ำ", "สบู่"], ans: 1 },
        { q: "แก๊งอะไร ชอบกินของหวาน ?", options: ["แก๊งกวนเมือง", "แก๊งไอศกรีม", "แก๊งหวานเจี๊ยว"], ans: 1 },
        { q: "งูอะไร ไวที่สุดในโลก ?", options: ["งูเห่า", "งูเขียว", "งูไว (งูไวโอเล็ต)"], ans: 2 }
    ];

    let shuffledQuestions = [...rawQuestions].sort(() => Math.random() - 0.5);
    let qIdx = 0;

    function renderTrivia() {
        const item = shuffledQuestions[qIdx % shuffledQuestions.length];
        container.innerHTML = `
            <div class="trivia-container">
                <div class="trivia-box">
                    ❓ คำถามข้อที่ ${qIdx + 1}:<br><br>
                    <strong>"${item.q}"</strong>
                </div>
                <div class="trivia-options">
                    <button class="pixel-btn red" onclick="ansTrivia(0, ${item.ans})">1. ${item.options[0]}</button>
                    <button class="pixel-btn" onclick="ansTrivia(1, ${item.ans})">2. ${item.options[1]}</button>
                    <button class="pixel-btn green" onclick="ansTrivia(2, ${item.ans})">3. ${item.options[2]}</button>
                </div>
            </div>
        `;
    }

    window.ansTrivia = function(selected, correct) {
        if (selected === correct) {
            addScore(20);
            alert("ถูกต้องครับ! 🎉 +20 คะแนน");
        } else {
            loseP1Life();
            alert("ผิดครับ! ❌ เสียหัวใจ 1 ดวง");
        }

        qIdx++;
        renderTrivia();
    };

    renderTrivia();
}