
/* FIREBASE SETUP */
const firebaseConfig = {
    apiKey: "AIzaSyB5mzQtdcMlu0x1nZ97xqIHxCnCs1m5eSY",
    authDomain: "life-achievements-1e0ed.firebaseapp.com",
    projectId: "life-achievements-1e0ed",
    storageBucket: "life-achievements-1e0ed.firebasestorage.app",
    messagingSenderId: "615507127300",
    appId: "1:615507127300:web:a79f6ced4d93a977cc5951",
    measurementId: "G-5X3KJ5NYS9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* =========================================================
   LIFE ACHIEVEMENTS
   99 ACHIEVEMENTS
========================================================= */

const achievements = [

    // 1
    {
        id: 1,
        title: "Spawned",
        description: "Enter the world for the very first time.",
        target: 1,
        icon: "✦",
        rarity: "common"
    },

    // 2
    {
        id: 2,
        title: "Starter",
        description: "Take your very first step.",
        target: 1,
        icon: "👣",
        rarity: "common"
    },

    // 3
    {
        id: 3,
        title: "Voice Commander",
        description: "Speak your very first word.",
        target: 1,
        icon: "💬",
        rarity: "common"
    },

    // 4
    {
        id: 4,
        title: "One Year Experienced",
        description: "Celebrate your first birthday.",
        target: 1,
        icon: "🎂",
        rarity: "common"
    },

    // 5
    {
        id: 5,
        title: "Student",
        description: "Walk into school for the first time.",
        target: 1,
        icon: "🏫",
        rarity: "common"
    },

    // 6
    {
        id: 6,
        title: "Readable?",
        description: "Start learning to read.",
        target: 1,
        icon: "📖",
        rarity: "common"
    },

    // 7
    {
        id: 7,
        title: "New Connection",
        description: "Make your very first friend.",
        target: 1,
        icon: "🤝",
        rarity: "common"
    },

    // 8
    {
        id: 8,
        title: "Gang!",
        description: "Make at least 20 friends.",
        target: 20,
        icon: "👥",
        rarity: "uncommon",
        unlock: { type: "achievement", id: 7 }
    },

    // 9
    {
        id: 9,
        title: "Just Two Wheels!?",
        description: "Learn how to ride a bicycle.",
        target: 1,
        icon: "🚲",
        rarity: "common"
    },

    // 10
    {
        id: 10,
        title: "Trusted Species",
        description: "Tame a pet and make a new companion.",
        target: 1,
        icon: "🐾",
        rarity: "uncommon"
    },

    // 11
    {
        id: 11,
        title: "Teacher? What Teacher?",
        description: "Successfully bunk a lecture at least once.",
        target: 1,
        icon: "🏃",
        rarity: "uncommon"
    },

    // 12
    {
        id: 12,
        title: "Stronger Legs!",
        description: "Kick a football for the first time.",
        target: 1,
        icon: "⚽",
        rarity: "common"
    },

    // 13
    {
        id: 13,
        title: "My Life, My Rules!",
        description: "Travel somewhere by train alone.",
        target: 1,
        icon: "🚆",
        rarity: "rare"
    },

    // 14
    {
        id: 14,
        title: "In the Sky",
        description: "Take your first flight.",
        target: 1,
        icon: "✈️",
        rarity: "uncommon"
    },

    // 15
    {
        id: 15,
        title: "First Disappointment",
        description: "Get properly scolded by parents.",
        target: 1,
        icon: "😶",
        rarity: "common"
    },

    // 16
    {
        id: 16,
        title: "Sry teacher!",
        description: "Get properly scolded by teacher.",
        target: 1,
        icon: "😝",
        rarity: "common"
    },

    // 17
    {
        id: 17,
        title: "Ayoo, Heartbeat?",
        description: "Experience falling in love.",
        target: 1,
        icon: "♥",
        rarity: "rare"
    },

    // 18
    {
        id: 18,
        title: "Mission Failed Successfully",
        description: "Get rejected by your crush.",
        target: 1,
        icon: "💔",
        rarity: "uncommon",
        unlock: { type: "achievement", id: 17 }
    },

    // 19
    {
        id: 19,
        title: "What a tech!",
        description: "Learn how to properly use a laptop or computer.",
        target: 1,
        icon: "💻",
        rarity: "common"
    },

    // 20
    {
        id: 20,
        title: "Round-n-Round, Up-n-Down!",
        description: "Ride on Ferris Wheel.",
        target: 1,
        icon: "🎡",
        rarity: "common"
    },

    // 21
    {
        id: 21,
        title: "Hard Biscuit",
        description: "Win your first medal.",
        target: 1,
        icon: "🏅",
        rarity: "uncommon"
    },

    // 22
    {
        id: 22,
        title: "First Boss Defeated",
        description: "Successfully finish Class 10.",
        target: 1,
        icon: "🎓",
        rarity: "rare",
        unlock: { type: "achievement", id: 5 }
    },

    // 23
    {
        id: 23,
        title: "Not Bad. Not Bad.",
        description: "Score at least 85% in an examination.",
        target: 1,
        icon: "📊",
        rarity: "rare"
    },

    // 24
    {
        id: 24,
        title: "Life Decision, Maybe?",
        description: "Choose the stream that feels right for you.",
        target: 1,
        icon: "🧬",
        rarity: "uncommon",
        unlock: { type: "achievement", id: 22 }
    },

    // 25
    {
        id: 25,
        title: "Feels like a Topper",
        description: "Study for 6 hours without using social media.",
        target: 1,
        icon: "🌱",
        rarity: "rare"
    },

    //26
    {
        id: 26,
        title: "Who Needs Technicians?",
        description: "Repair any gadget.",
        target: 1,
        icon: "⚙️",
        rarity: "uncommon"
    },

    // 27
    {
        id: 27,
        title: "Mic Check",
        description: "Record a piece of music in your own voice.",
        target: 1,
        icon: "🎙️",
        rarity: "uncommon"
    },

    // 28
    {
        id: 28,
        title: "2-P Game?",
        description: "Get into your first relationship.",
        target: 1,
        icon: "❤️",
        rarity: "rare"
    },

    // 29
    {
        id: 29,
        title: "It's Over!",
        description: "Experience a Break-Up.",
        target: 1,
        icon: "🥀",
        rarity: "rare",
        unlock: { type: "achievement", id: 28 }
    },

    // 30
    {
        id: 30,
        title: "I'm the Best!",
        description: "Discover a hobby you genuinely enjoy.",
        target: 1,
        icon: "🎨",
        rarity: "uncommon"
    },

    // 31
    {
        id: 31,
        title: "Is That a Portal?",
        description: "Visit Cinema",
        target: 1,
        icon: "🎦",
        rarity: "uncommon"
    },

    // 32
    {
        id: 32,
        title: "Quiet Zone",
        description: "Visit a library.",
        target: 1,
        icon: "📚",
        rarity: "uncommon"
    },

    // 33
    {
        id: 33,
        title: "Soundtrack of My Life",
        description: "Create a playlist containing at least 100 songs you listen.",
        target: 1,
        icon: "🎧",
        rarity: "rare"
    },

    // 34
    {
        id: 34,
        title: "Chapati or Disk?",
        description: "Learn how to make round chapatis.",
        target: 1,
        icon: "🫓",
        rarity: "uncommon"
    },

    // 35
    {
        id: 35,
        title: "Chef",
        description: "Learn to cook 7 different food items.",
        target: 7,
        icon: "🍳",
        rarity: "rare"
    },

    // 36
    {
        id: 36,
        title: "Master Chef",
        description: "Learn to cook any international dish.",
        target: 1,
        icon: "🧑‍🍳",
        rarity: "epic"
    },

    // 37
    {
        id: 37,
        title: "Second Boss?",
        description: "Enter Class 12.",
        target: 1,
        icon: "🎓",
        rarity: "epic",
        unlock: { type: "achievement", id: 22 }
    },

    // 38
    {
        id: 38,
        title: "Me? Teacher?",
        description: "Teach something to your junior.",
        target: 1,
        icon: "🧠",
        rarity: "uncommon"
    },

    // 39
    {
        id: 39,
        title: "Personal Space Physically",
        description: "Get your Private Room.",
        target: 1,
        icon: "👻",
        rarity: "epic"
    },

    // 40
    {
        id: 40,
        title: "Wheels with Motors!",
        description: "Learn how to drive a car or motorcycle.",
        target: 1,
        icon: "🚗",
        rarity: "rare"
    },

    // 41
    {
        id: 41,
        title: "Second Boss Defeated",
        description: "Complete Class 12.",
        target: 1,
        icon: "🎓",
        rarity: "epic",
        unlock: { type: "achievement", id: 37 }
    },

    // 42
    {
        id: 42,
        title: "Adult Feeling.",
        description: "Celebrate your 18th birthday.",
        target: 1,
        icon: "🔓",
        rarity: "uncommon",
        unlock: { type: "age", value: 18 }    },

    // 43
    {
        id: 43,
        title: "My Account, My Money",
        description: "Open your first bank account.",
        target: 1,
        icon: "🏦",
        rarity: "uncommon"
    },

    // 44
    {
        id: 44,
        title: "Licensed Drive",
        description: "Get your driving license.",
        target: 1,
        icon: "🪪",
        rarity: "rare",
        unlock: { type: "achievements", ids: [40] , age: 18 }
    },

    // 45
    {
        id: 45,
        title: "Personal Space Digitally",
        description: "Own your first personal phone.",
        target: 1,
        icon: "📱",
        rarity: "uncommon"
    },

    // 46
    {
        id: 46,
        title: "New Identity",
        description: "Get your first personal SIM card.",
        target: 1,
        icon: "📶",
        rarity: "uncommon",
        unlock: { type: "achievement", id: 45 }
    },

    // 47
    {
        id: 47,
        title: "Welcome to the Digital World",
        description: "Create your own Social Media account.",
        target: 1,
        icon: "◎",
        rarity: "common"
    },

    // 48
    {
        id: 48,
        title: "Shhh!",
        description: "Prank your Friend.",
        target: 1,
        icon: "🤫",
        rarity: "common"
    },

    // 49
    {
        id: 49,
        title: "New Environment",
        description: "Get into the College.",
        target: 1,
        icon: "📚",
        rarity: "rare",
        unlock: { type: "achievement", id: 41 }
    },

    // 50
    {
        id: 50,
        title: "The End!",
        description: "Watch a web series all the way to the end.",
        target: 1,
        icon: "📺",
        rarity: "common"
    },

    // 51
    {
        id: 51,
        title: "New Dimension?",
        description: "Watch an anime with all its seasons.",
        target: 1,
        icon: "🤩",
        rarity: "uncommon"
    },

    // 52
    {
        id: 52,
        title: "The Real Ones",
        description: "Have 3 close friends you can truly trust.",
        target: 3,
        icon: "🫂",
        rarity: "rare",
        unlock: { type: "achievement", id: 8 }
    },

    // 53
    {
        id: 53,
        title: "Fluid Surface",
        description: "Ride a boat at least once.",
        target: 1,
        icon: "🚤",
        rarity: "uncommon"
    },

    // 54
    {
        id: 54,
        title: "How It's Made?",
        description: "Visit a Factory.",
        target: 1,
        icon: "🏭",
        rarity: "epic"
    },

    // 55
    {
        id: 55,
        title: "Offline Mode",
        description: "Spend 24 hours without your phone and internet.",
        target: 1,
        icon: "📵",
        rarity: "legendary"
    },

    // 56
    {
        id: 56,
        title: "Owls",
        description: "Go for a night out.",
        target: 1,
        icon: "🦉",
        rarity: "rare"
    },

    // 57
    {
        id: 57,
        title: "Tourist Arc",
        description: "Visit 10 different tourist places.",
        target: 10,
        icon: "📌",
        rarity: "epic"
    },

    // 58
    {
        id: 58,
        title: "Tourist Arc Upgraded",
        description: "Visit 20 different tourist places.",
        target: 20,
        icon: "📍",
        rarity: "legendary"
    },

    // 59
    {
        id: 59,
        title: "Easy-squizy!",
        description: "Master any one game.",
        target: 1,
        icon: "🎯",
        rarity: "epic"
    },

    // 60
    {
        id: 60,
        title: "Planting Plant, Planted Plant",
        description: "Plant 20 Plants.",
        target: 20,
        icon: "🪴",
        rarity: "legendary"
    },

    // 61
    {
        id: 61,
        title: "Hot Stuff",
        description: "Travel through a desert.",
        target: 1,
        icon: "🏜️",
        rarity: "rare"
    },

    // 62
    {
        id: 62,
        title: "White World",
        description: "Experience snowfall.",
        target: 1,
        icon: "❄️",
        rarity: "rare"
    },

    // 63
    {
        id: 63,
        title: "First Money",
        description: "Earn your first ₹1,000.",
        target: 1,
        icon: "₹",
        rarity: "uncommon",
        money: true
    },

    // 64
    {
        id: 64,
        title: "Two Wheels, One Dream",
        description: "Buy your first bike.",
        target: 1,
        icon: "🏍️",
        rarity: "epic",
        unlock: { type: "achievement", id: 63 }
    },

    // 65
    {
        id: 65,
        title: "Make Some Noise",
        description: "Learn to play a musical instrument.",
        target: 1,
        icon: "🎸",
        rarity: "uncommon"
    },

    // 66
    {
        id: 66,
        title: "Investor",
        description: "Invest your money in something beneficial.",
        target: 1,
        icon: "📈",
        rarity: "epic"
    },

    // 67
    {
        id: 67,
        title: "Where Am I?",
        description: "Go on a solo trip.",
        target: 1,
        icon: "🧭",
        rarity: "epic"
    },

    // 68
    {
        id: 68,
        title: "Is World Ending?",
        description: "Experience a natural disaster.",
        target: 1,
        icon: "🫨",
        rarity: "rare"
    },

    // 69
    {
        id: 69,
        title: "Physical Development",
        description: "Visit a gym and begin taking fitness seriously.",
        target: 1,
        icon: "🏋️",
        rarity: "rare"
    },

    // 70
    {
        id: 70,
        title: "Four Wheels, One Dream",
        description: "Buy your own car.",
        target: 1,
        icon: "🚘",
        rarity: "legendary",
        unlock: { type: "achievement", id: 63 }
    },

    // 71
    {
        id: 71,
        title: "Worth the Risk",
        description: "Go on a genuine adventure.",
        target: 1,
        icon: "🗺️",
        rarity: "rare"
    },

    //72
    {
        id: 72,
        title: "Confusing Pattern",
        description: "Learn solving 3 different cubes.",
        target: 3,
        icon: "🧊",
        rarity: "rare"
    },

    // 73
    {
        id: 73,
        title: "Party Goes Regional",
        description: "Travel outside your state with friends.",
        target: 1,
        icon: "🛣️",
        rarity: "epic"
    },

    // 74
    {
        id: 74,
        title: "Seven Coordinates",
        description: "Travel to 7 different states in your country.",
        target: 7,
        icon: "🌎",
        rarity: "epic"
    },

    // 75
    {
        id: 75,
        title: "Ripple Effect",
        description: "Help 20 different people.",
        target: 20,
        icon: "🤲",
        rarity: "rare"
    },

    // 76
    {
        id: 76,
        title: "Stacking Up",
        description: "Save your first ₹10,000.",
        target: 1,
        icon: "💰",
        rarity: "rare",
        money: true,
        unlock: { type: "achievement", id: 63 }
    },

    // 77
    {
        id: 77,
        title: "New Server",
        description: "Travel outside your country.",
        target: 1,
        icon: "🌐",
        rarity: "legendary"
    },

    // 78
    {
        id: 78,
        title: "Wish Granted",
        description: "Visit a country you've always dreamed of seeing.",
        target: 1,
        icon: "✨",
        rarity: "legendary"
    },

    // 79
    {
        id: 79,
        title: "Bought With My Own",
        description: "Buy your first personal phone entirely with your own money.",
        target: 1,
        icon: "📱",
        rarity: "epic"
    },

    // 80
    {
        id: 80,
        title: "Give Back",
        description: "Buy a meaningful gift for your parents using your own money.",
        target: 1,
        icon: "🎁",
        rarity: "epic"
    },

    // 81
    {
        id: 81,
        title: "Golden Stuff...",
        description: "Buy a gold ornament.",
        target: 1,
        icon: "🌟",
        rarity: "rare",
        unlock: { type: "achievement", id: 63 }
    },

    // 82
    {
        id: 82,
        title: "Six Figures",
        description: "Save your first ₹100,000.",
        target: 1,
        icon: "💎",
        rarity: "legendary",
        money: true,
        unlock: { type: "achievement", id: 76 }
    },

    // 83
    {
        id: 83,
        title: "Grown Up buddy!",
        description: "Get married and begin a new chapter of life.",
        target: 1,
        icon: "💍",
        rarity: "epic",
        unlock: { type: "achievement", id: 42 }
    },

    // 84
    {
        id: 84,
        title: "Financial Toughness",
        description: "Save your first 1Cr.",
        target: 1,
        icon: "💸",
        rarity: "ultra",
        money: true,
        unlock: { type: "achievement", id: 82 }
    },

    // 85
    {
        id: 85,
        title: "Different Experience",
        description: "Become a Parent",
        target: 1,
        icon: "👨‍👩‍👧‍👦",
        rarity: "epic",
        unlock: { type: "achievement", id: 83 }
    },

    // 86
    {
        id: 86,
        title: "Party Expansion",
        description: "Have 2 children.",
        target: 2,
        icon: "👨‍👩‍👧‍👦",
        rarity: "epic",
        unlock: { type: "achievement", id: 85 }
    },

    // 87
    {
        id: 87,
        title: "History Repeats",
        description: "Watch your child take their first step.",
        target: 1,
        icon: "👣",
        rarity: "epic",
        unlock: { type: "achievement", id: 85 }
    },

    // 88
    {
        id: 88,
        title: "Say It Again",
        description: "Hear your child say their first word.",
        target: 1,
        icon: "💬",
        rarity: "epic",
        unlock: { type: "achievement", id: 85 }
    },

    // 89
    {
        id: 89,
        title: "Tiny Birthday",
        description: "Celebrate your child's first birthday.",
        target: 1,
        icon: "🎂",
        rarity: "epic",
        unlock: { type: "achievement", id: 85 }
    },

    // 90
    {
        id: 90,
        title: "Halfway to a Century",
        description: "Celebrate your 50th birthday.",
        target: 1,
        icon: "🎉",
        rarity: "legendary",
        unlock: { type: "age", value: 50 }
    },

    // 91
    {
        id: 91,
        title: "Home Sweet Home",
        description: "Renovate your house or buy a new one.",
        target: 1,
        icon: "🏠",
        rarity: "legendary",
        unlock: { type: "achievement", id: 63 }
    },

    // 92
    {
        id: 92,
        title: "Family Party",
        description: "Go on a Family Trip.",
        target: 1,
        icon: "👨‍👩‍👧‍👦",
        rarity: "epic"
    },

    // 93
    {
        id: 93,
        title: "New Chapter?",
        description: "Watch your children get married.",
        target: 1,
        icon: "💐",
        rarity: "legendary",
        unlock: { type: "achievement", id: 85 }
    },

    // 94
    {
        id: 94,
        title: "New Generation Spawned",
        description: "Become a grandparent.",
        target: 1,
        icon: "👶",
        rarity: "legendary",
        unlock: { type: "achievement", id: 93 }
    },

    // 95
    {
        id: 95,
        title: "Three Quarters",
        description: "Celebrate your 75th birthday.",
        target: 1,
        icon: "🎂",
        rarity: "legendary",
        unlock: { type: "age", value: 75 }
    },

    // 96
    {
        id: 96,
        title: "Credits Rolling",
        description: "Retire after completing your working journey.",
        target: 1,
        icon: "🌅",
        rarity: "legendary",
        unlock: { type: "achievement", id: 63 }
    },

    // 97
    {
        id: 97,
        title: "The Old Player",
        description: "Tell stories to your grandchildren.",
        target: 1,
        icon: "📖",
        rarity: "legendary",
        unlock: { type: "achievement", id: 94 }
    },

    // 98
    {
        id: 98,
        title: "Last Party, maybe?",
        description: "Watch your grandchildren get married.",
        target: 1,
        icon: "💐",
        rarity: "ultra",
        unlock: { type: "achievement", id: 94 }
    },

    // 99
    {
        id: 99,
        title: "And Yet, I Continue",
        description: "Completed all achievements and still finding something new to explore.",
        target: 99,
        icon: "∞",
        rarity: "ultra"
    }
];


/* =========================================================
   STATE
========================================================= */

const GUEST_PROGRESS_KEY = "lifeAchievementsGuestProgress";
const ACCOUNT_PROGRESS_KEY = "lifeAchievementsProgress";

let progress = JSON.parse(
    localStorage.getItem(GUEST_PROGRESS_KEY) || "{}"
);

let currentAchievement = null;
let currentFilter = "all";

const scoreValues = {
    common: 1,
    uncommon: 3,
    rare: 5,
    epic: 8,
    legendary: 15,
    ultra: 20
};

const ranks = [
    { name: "BEGINNER", icon: "🌱", min: 0, max: 49, description: "Begin your journey" },
    { name: "EXPLORER", icon: "🧭", min: 50, max: 119, description: "Life is opening up" },
    { name: "ADVENTURER", icon: "🗺️", min: 120, max: 219, description: "Collecting experiences" },
    { name: "EXPERIENCED", icon: "⚡", min: 220, max: 339, description: "You've come a long way" },
    { name: "VETERAN", icon: "🛡️", min: 340, max: 479, description: "Major milestones unlocked" },
    { name: "ELITE", icon: "👑", min: 480, max: 569, description: "Among the most accomplished" },
    { name: "LEGEND", icon: "🏆", min: 570, max: 635, description: "A life fully lived" }
];

const maxScore = achievements.reduce(
    (total, achievement) => total + scoreValues[achievement.rarity],
    0
);

function getLifeScore() {
    return achievements.reduce((total, achievement) => {
        return total + (
            isCompleted(achievement)
                ? scoreValues[achievement.rarity]
                : 0
        );
    }, 0);
}

function getCurrentRank(score) {
    return ranks.find(rank => score >= rank.min && score <= rank.max)
        || ranks[ranks.length - 1];
}

function updateScore() {
    const score = getLifeScore();
    const rank = getCurrentRank(score);
    const rankIndex = ranks.indexOf(rank);
    const nextRank = ranks[rankIndex + 1];

    const scoreText = document.getElementById("scoreText");
    const scoreFill = document.getElementById("scoreFill");
    const rankIcon = document.getElementById("rankIcon");
    const rankName = document.getElementById("rankName");
    const scoreRankText = document.getElementById("scoreRankText");
    const nextRankText = document.getElementById("nextRankText");

    scoreText.textContent = score + " / " + maxScore;

    rankIcon.textContent = rank.icon;
    rankName.textContent = rank.name;
    scoreRankText.textContent = rank.description;

    if (nextRank) {
        const rankRange = nextRank.min - rank.min;
        const rankProgress = Math.min(
            Math.max(score - rank.min, 0) / rankRange * 100,
            100
        );

        scoreFill.style.width = rankProgress + "%";
        nextRankText.textContent =
            nextRank.min + " pts → " + nextRank.name;
    } else {
        scoreFill.style.width = "100%";
        nextRankText.textContent = "MAX RANK • " + maxScore + " pts";
    }
}



/* =========================================================
   HELPERS
========================================================= */

function getProgress(id) {
    const achievement = getAchievement(id);

    if (!achievement) return 0;

    if (achievement.id === 99) {
        return isCompleted(achievement) ? achievement.target : 0;
    }

    return Math.min(progress[id] || 0, achievement.target);
}

function getAchievement(id) {
    return achievements.find(a => a.id === id);
}

function isCompleted(achievement) {
    if (achievement.id === 99) {
        return achievements
            .filter(a => a.id !== 99)
            .every(a => isCompleted(a));
    }

    return getProgress(achievement.id) >= achievement.target;
}

function getUserAge() {
    const profile = JSON.parse(
        localStorage.getItem("lifeAchievementsProfile") || "{}"
    );

    return Number(profile.age) || 0;
}

function isUnlocked(achievement) {
    if (achievement.id === 99) {
        return achievements
            .filter(a => a.id !== 99)
            .every(a => isCompleted(a));
    }

    if (!achievement.unlock) return true;

    const rule = achievement.unlock;
    const age = getUserAge();

    if (rule.type === "age") {
        return age >= rule.value;
    }

    if (rule.type === "achievement") {
        const required = getAchievement(rule.id);
        return !!required && isCompleted(required);
    }

    if (rule.type === "achievements") {
        const achievementsDone = rule.ids.every(id => {
            const required = getAchievement(id);
            return required && isCompleted(required);
        });

        return achievementsDone && age >= (rule.age || 0);
    }

    return true;
}


function getUnlockMessage(achievement) {
    if (achievement.id === 99) {
        return "Complete all other 98 achievements.";
    }

    if (!achievement.unlock) {
        return "";
    }

    const rule = achievement.unlock;
    const age = getUserAge();
    const messages = [];

    if (rule.type === "age") {
        if (age < rule.value) {
            messages.push(`Reach age ${rule.value} to unlock this achievement.`);
        }
    }

    if (rule.type === "achievement") {
        const required = getAchievement(rule.id);

        if (required && !isCompleted(required)) {
            messages.push(
                `Complete "${required.title}" to unlock this achievement.`
            );
        }
    }

    if (rule.type === "achievements") {
        rule.ids.forEach(id => {
            const required = getAchievement(id);

            if (required && !isCompleted(required)) {
                messages.push(
                    `Complete "${required.title}" to unlock this achievement.`
                );
            }
        });

        if (rule.age && age < rule.age) {
            messages.push(
                `Reach age ${rule.age} to unlock this achievement.`
            );
        }
    }

    return messages.length
        ? messages.join(" ")
        : "Complete the required criteria to unlock this achievement.";
}

function isMetaAchievement(achievement) {
    return achievement.id === 99;
}

function saveProgress() {
    localStorage.setItem(
        ACCOUNT_PROGRESS_KEY,
        JSON.stringify(progress)
    );

    if (auth.currentUser) {
        queueCloudSave();
    } else {
        localStorage.setItem(
            GUEST_PROGRESS_KEY,
            JSON.stringify(progress)
        );
    }
}

function formatProgress(achievement, value) {

    if (achievement.money) {
        return "₹" + value.toLocaleString("en-IN") +
            " / ₹" + achievement.target.toLocaleString("en-IN");
    }

    return value + " / " + achievement.target;
}

function rarityLabel(rarity) {
    return rarity.toUpperCase();
}

/* =========================================================
   RENDER
========================================================= */

function render() {

    const grid = document.getElementById("achievementGrid");
    const sort = document.getElementById("sortSelect").value;

    let list = [...achievements];

    if (currentFilter === "locked") {
        list = list.filter(a => !isUnlocked(a));
    }

    if (currentFilter === "completed") {
        list = list.filter(a => isCompleted(a));
    }

    if (currentFilter === "completed") {
        list = list.filter(a => isCompleted(a));
    }

    if (sort === "rarity") {

        const order = {
            ultra: 6,
            legendary: 5,
            epic: 4,
            rare: 3,
            uncommon: 2,
            common: 1
        };

        list.sort(
            (a,b) => order[b.rarity] - order[a.rarity]
        );
    }

    if (sort === "progress") {
        list.sort((a,b) => {
            const pa = getProgress(a.id) / a.target;
            const pb = getProgress(b.id) / b.target;
            return pb - pa;
        });
    }

    if (sort === "title") {
        list.sort((a,b) =>
            a.title.localeCompare(b.title)
        );
    }

    grid.innerHTML = "";

    list.forEach(achievement => {

        const value = getProgress(achievement.id);
        const completed = isCompleted(achievement);
        const percentage =
            Math.min((value / achievement.target) * 100, 100);

        const card = document.createElement("div");

        card.className =
            "achievement-card" +
            (completed ? " completed" : "") +
            (!isUnlocked(achievement) ? " locked" : "");

        card.innerHTML = `
            <div class="card-top">

                <div class="card-icon">
                    ${achievement.icon}
                </div>

                <span class="rarity rarity-${achievement.rarity}">
                    ${rarityLabel(achievement.rarity)}
                </span>

            </div>

            <h3 class="card-title">
                ${achievement.title}
            </h3>

            <p class="card-description">
                ${achievement.description}
            </p>

            <div class="card-bottom">

                <div class="card-progress-header">
                    <span>PROGRESS</span>
                    <strong>
                        ${formatProgress(achievement, value)}
                    </strong>
                </div>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width:${percentage}%">
                    </div>
                </div>

            </div>

            ${completed
                ? `<div class="completed-check">✓</div>`
                : ""
            }
        `;

        /*
            IMPORTANT:
            Clicking the card ONLY opens details.
            It does NOT increase progress.
        */

        card.addEventListener("click", () => {
            if (!isUnlocked(achievement)) {
                showToast(
                            "🔒 " + getUnlockMessage(achievement),
                    5000
                );
                return;
            }

            openAchievement(achievement.id);
        });

        grid.appendChild(card);
    });

    updateOverall();
}


/* =========================================================
   OVERALL PROGRESS
========================================================= */

function updateOverall() {

    let completed = achievements.filter(isCompleted).length;

    const total = achievements.length;
    const remaining = total - completed;

    const percentage = Math.round(
        (completed / total) * 100
    );

    document.getElementById("overallPercent").textContent =
        percentage + "%";

    document.getElementById("overallCount").textContent =
        completed + " / " + total;

    document.getElementById("completedStat").textContent =
        completed;

    document.getElementById("remainingStat").textContent =
        remaining;

    document.getElementById("progressStat").textContent =
        percentage + "%";

    const circumference = 327;

    const offset =
        circumference -
        (percentage / 100) * circumference;

    document.getElementById("overallRing")
        .style.strokeDashoffset = offset;

    updateScore();
}


/* =========================================================
   MODAL
========================================================= */

function openAchievement(id) {

    const achievement = getAchievement(id);

    if (!achievement) return;

    currentAchievement = id;

    const value = getProgress(id);

    document.getElementById("modalRarity").textContent =
        rarityLabel(achievement.rarity);

    document.getElementById("modalIcon").textContent =
        achievement.icon;

    document.getElementById("modalTitle").textContent =
        achievement.title;

    document.getElementById("modalDescription").textContent =
        achievement.description;

    document.getElementById("modalProgressText").textContent =
        formatProgress(achievement, value);

    updateModalProgress();

    document.getElementById("detailsModal")
        .classList.remove("hidden");
}


function updateModalProgress() {

    if (!currentAchievement) return;

    const achievement =
        getAchievement(currentAchievement);

    const value =
        getProgress(currentAchievement);

    const percentage =
        Math.min(
            (value / achievement.target) * 100,
            100
        );

    document.getElementById("modalProgressText")
        .textContent =
        formatProgress(achievement, value);

    document.getElementById("modalProgressBar")
        .style.width =
        percentage + "%";
}


function closeModal() {
    document.getElementById("detailsModal")
        .classList.add("hidden");

    currentAchievement = null;
}


/* =========================================================
   CHANGE PROGRESS
========================================================= */

function changeProgress(amount) {

    if (!currentAchievement) return;

    const achievement =
        getAchievement(currentAchievement);

    let current =
        progress[currentAchievement] || 0;

    current += amount;

    current = Math.max(
        0,
        Math.min(current, achievement.target)
    );

    progress[currentAchievement] = current;

    saveProgress();

    updateModalProgress();
    render();

    if (current >= achievement.target) {
        showToast("Achievement completed ✓");
    }
}


/* =========================================================
   RESET
========================================================= */

function askReset() {

    if (!currentAchievement) return;

    document.getElementById("confirmModal")
        .classList.remove("hidden");
}


function closeConfirm() {

    document.getElementById("confirmModal")
        .classList.add("hidden");
}


function confirmReset() {

    if (!currentAchievement) return;

    progress[currentAchievement] = 0;

    saveProgress();

    closeConfirm();

    updateModalProgress();
    render();

    showToast("Progress reset");
}


/* =========================================================
   FILTERS
========================================================= */

document.querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            render();
        });

    });


/* =========================================================
   SORT
========================================================= */

document.getElementById("sortSelect")
    .addEventListener("change", render);


/* =========================================================
   BUTTONS
========================================================= */

document.getElementById("plusBtn")
    .addEventListener("click", () => {
        changeProgress(1);
    });

document.getElementById("minusBtn")
    .addEventListener("click", () => {
        changeProgress(-1);
    });

document.getElementById("resetAchievementBtn")
    .addEventListener("click", askReset);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeModal();
        closeConfirm();

    }

});


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message, duration = 2200) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, duration);
}


/* =========================================================
   INITIAL LOAD
========================================================= */

render();



/* =========================================================
   ACCOUNT UI + GOOGLE AUTH + CLOUD SYNC
========================================================= */

const profileBtn = document.getElementById("profileBtn");
const guestLoginLabel = document.getElementById("guestLoginLabel");
const profileAvatar = document.getElementById("profileAvatar");

const loginModal = document.getElementById("loginModal");
const loginBackdrop = document.getElementById("loginBackdrop");
const closeLoginBtn = document.getElementById("closeLoginBtn");

const googleSlide = document.getElementById("googleSlide");
const googleSlideHandle = document.getElementById("googleSlideHandle");
const loginHint = document.getElementById("loginHint");

const accountModal = document.getElementById("accountModal");
const accountBackdrop = document.getElementById("accountBackdrop");
const closeAccountBtn = document.getElementById("closeAccountBtn");
const accountPhoto = document.getElementById("accountPhoto");
const accountDisplayName = document.getElementById("accountDisplayName");
const accountEmail = document.getElementById("accountEmail");
const profileDob = document.getElementById("profileDob");
const saveDobBtn = document.getElementById("saveDobBtn");

const signOutBtn = document.getElementById("signOutBtn");
const signOutConfirmModal = document.getElementById("signOutConfirmModal");
const signOutConfirmBackdrop = document.getElementById("signOutConfirmBackdrop");
const cancelSignOutBtn = document.getElementById("cancelSignOutBtn");
const confirmSignOutBtn = document.getElementById("confirmSignOutBtn");

const resetAllProgressBtn = document.getElementById("resetAllProgressBtn");
const resetAllProgressModal = document.getElementById("resetAllProgressModal");
const resetAllProgressBackdrop = document.getElementById("resetAllProgressBackdrop");
const cancelResetAllProgressBtn = document.getElementById("cancelResetAllProgressBtn");
const confirmResetAllProgressBtn = document.getElementById("confirmResetAllProgressBtn");


let cloudReady = false;
let cloudSyncTimer = null;
let sliderPointerId = null;
let sliderStartX = 0;
let sliderStartOffset = 0;
let sliderOffset = 0;
let loginInProgress = false;

const GOOGLE_SLIDER_END_PADDING = 5;

function getSavedProfile() {
    try {
        return JSON.parse(
            localStorage.getItem("lifeAchievementsProfile") || "{}"
        );
    } catch {
        return {};
    }
}

function saveLocalProfile(profile) {
    localStorage.setItem(
        "lifeAchievementsProfile",
        JSON.stringify(profile)
    );
}

function calculateAgeFromDOB(dobString) {
    if (!dobString) return 0;

    const dob = new Date(dobString + "T00:00:00");
    const today = new Date();

    if (Number.isNaN(dob.getTime()) || dob > today) return 0;

    let age = today.getFullYear() - dob.getFullYear();

    const birthdayNotReached =
        today.getMonth() < dob.getMonth() ||
        (
            today.getMonth() === dob.getMonth() &&
            today.getDate() < dob.getDate()
        );

    if (birthdayNotReached) age--;

    return age;
}

function updateAccountButton(user) {
    if (user) {
        guestLoginLabel.classList.add("hidden");
        profileAvatar.classList.remove("hidden");

        profileAvatar.src = user.photoURL || "";
        profileAvatar.alt = (user.displayName || "Google") + " profile photo";
        profileAvatar.referrerPolicy = "no-referrer";
        profileAvatar.onerror = () => {
            profileAvatar.classList.add("hidden");
            guestLoginLabel.textContent = "Account";
            guestLoginLabel.classList.remove("hidden");
        };
    } else {
        profileAvatar.removeAttribute("src");
        profileAvatar.classList.add("hidden");
        guestLoginLabel.textContent = "Log in or Sign Up";
        guestLoginLabel.classList.remove("hidden");
    }
}

function openLoginModal() {
    if (auth.currentUser) {
        openAccountModal();
        return;
    }

    resetGoogleSlider();
    loginModal.classList.remove("hidden");
}

function closeLoginModal() {
    loginModal.classList.add("hidden");
    resetGoogleSlider();
}

function openAccountModal() {
    const user = auth.currentUser;
    if (!user) {
        openLoginModal();
        return;
    }

    accountPhoto.src = user.photoURL || "";
    accountPhoto.alt = (user.displayName || "Google") + " profile photo";
    accountPhoto.referrerPolicy = "no-referrer";

    accountDisplayName.textContent = user.displayName || "Google User";
    accountEmail.textContent = user.email || "";

    const savedProfile = getSavedProfile();
    profileDob.value = savedProfile.dob || "";

    accountModal.classList.remove("hidden");
}

function closeAccountModal() {
    accountModal.classList.add("hidden");
}

function openSignOutConfirm() {
    accountModal.classList.add("hidden");
    signOutConfirmModal.classList.remove("hidden");
}

function closeSignOutConfirm() {
    signOutConfirmModal.classList.add("hidden");
}

profileBtn.addEventListener("click", () => {
    if (auth.currentUser) {
        openAccountModal();
    } else {
        openLoginModal();
    }
});

closeLoginBtn.addEventListener("click", closeLoginModal);
loginBackdrop.addEventListener("click", closeLoginModal);

closeAccountBtn.addEventListener("click", closeAccountModal);
accountBackdrop.addEventListener("click", closeAccountModal);

signOutBtn.addEventListener("click", openSignOutConfirm);
signOutConfirmBackdrop.addEventListener("click", closeSignOutConfirm);
cancelSignOutBtn.addEventListener("click", () => {
    closeSignOutConfirm();
    openAccountModal();
});

/* Save date of birth and sync calculated age */
saveDobBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        showToast("Please log in first.");
        return;
    }

    const dob = profileDob.value;

    if (!dob) {
        showToast("Please select your date of birth.");
        return;
    }

    const selectedDate = new Date(dob + "T00:00:00");
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
        showToast("Please enter a valid date of birth.");
        return;
    }

    const age = calculateAgeFromDOB(dob);
    const existingProfile = getSavedProfile();

    saveLocalProfile({
        ...existingProfile,
        dob,
        age
    });

    render();
    queueCloudSave();

    showToast("Date of birth saved!");
});

/* ===== DRAG-TO-CONTINUE GOOGLE SLIDER ===== */

function getSliderMaxOffset() {
    return Math.max(
        0,
        googleSlide.clientWidth -
        googleSlideHandle.offsetWidth -
        GOOGLE_SLIDER_END_PADDING * 2
    );
}

function setGoogleSliderOffset(value) {
    sliderOffset = Math.max(
        0,
        Math.min(value, getSliderMaxOffset())
    );
    const isDragging = sliderOffset > 0;

    googleSlide.classList.toggle("is-sliding", isDragging);

    googleSlide.style.setProperty("--slide-x", sliderOffset + "px");

    const maxOffset = getSliderMaxOffset();
    const percentage = maxOffset ? sliderOffset / maxOffset : 0;

    googleSlideHandle.style.background =
        percentage > 0.85 ? "#e8fff5" : "#ffffff";

    googleSlideHandle.style.cursor =
        loginInProgress ? "wait" : "grab";
}

function resetGoogleSlider() {
    sliderOffset = 0;
    sliderPointerId = null;
    setGoogleSliderOffset(0);
    googleSlideHandle.disabled = false;
    googleSlideHandle.style.opacity = "1";
    loginHint.textContent = "Drag the Google icon all the way to the right.";
    googleSlide.querySelector(".google-slide-label").textContent =
        "Slide to continue with Google";
}

googleSlideHandle.addEventListener("pointerdown", event => {
    if (loginInProgress || auth.currentUser) return;

    event.preventDefault();

    sliderPointerId = event.pointerId;
    sliderStartX = event.clientX;
    sliderStartOffset = sliderOffset;

    googleSlideHandle.setPointerCapture(event.pointerId);
});

googleSlideHandle.addEventListener("pointermove", event => {
    if (sliderPointerId !== event.pointerId || loginInProgress) return;

    const delta = event.clientX - sliderStartX;
    setGoogleSliderOffset(sliderStartOffset + delta);
});

async function finishGoogleSlider(event) {
    if (sliderPointerId !== event.pointerId) return;

    sliderPointerId = null;

    const maxOffset = getSliderMaxOffset();
    const reachedEnd = maxOffset > 0 && sliderOffset >= maxOffset * 0.88;

    if (!reachedEnd) {
        setGoogleSliderOffset(0);
        return;
    }

    if (loginInProgress) return;

    loginInProgress = true;
    googleSlide.classList.remove("is-sliding");
    googleSlide.classList.add("is-connecting");
    googleSlideHandle.disabled = true;
    googleSlideHandle.style.opacity = "0.7";
    loginHint.textContent = "Opening Google sign-in...";
    googleSlide.querySelector(".google-slide-label").textContent =
        "Connecting securely...";

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        await auth.signInWithPopup(provider);
        closeLoginModal();
    } catch (error) {
        console.error("Google login failed:", error);
        loginHint.textContent =
            "Login failed. Check your connection and try again.";
        showToast("Google login failed. Please try again.");
        resetGoogleSlider();
        googleSlide.classList.remove("is-sliding", "is-connecting");
    } finally {
        loginInProgress = false;
    }
}

googleSlideHandle.addEventListener("pointerup", finishGoogleSlider);
googleSlideHandle.addEventListener("pointercancel", event => {
    if (sliderPointerId === event.pointerId) resetGoogleSlider();
});

/* Keyboard accessibility for the slider */
googleSlideHandle.addEventListener("keydown", async event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (sliderOffset >= getSliderMaxOffset() * 0.88) {
            await finishGoogleSlider({
                pointerId: sliderPointerId
            });
        } else {
            setGoogleSliderOffset(getSliderMaxOffset());
            loginHint.textContent = "Press Enter again to continue with Google.";
        }
    }
});

window.addEventListener("resize", () => {
    if (!loginModal.classList.contains("hidden")) {
        setGoogleSliderOffset(sliderOffset);
    }
});

/* ===== FIRESTORE SYNC ===== */

async function saveCloudData() {
    const user = auth.currentUser;
    if (!user || !cloudReady) return;

    const profile = getSavedProfile();

    try {
        await db.collection("users").doc(user.uid).set({
            progress,
            profile,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Cloud save failed:", error);
        showToast("Cloud save failed. Check your connection.");
    }
}

function queueCloudSave() {
    if (!cloudReady || !auth.currentUser) return;

    clearTimeout(cloudSyncTimer);

    cloudSyncTimer = setTimeout(() => {
        saveCloudData();
    }, 500);
}


/* ===== RESET ALL PROGRESS ===== */

resetAllProgressBtn.addEventListener("click", () => {
    accountModal.classList.add("hidden");
    resetAllProgressModal.classList.remove("hidden");
});

function closeResetAllProgressModal() {
    resetAllProgressModal.classList.add("hidden");
}

resetAllProgressBackdrop.addEventListener("click", closeResetAllProgressModal);

cancelResetAllProgressBtn.addEventListener("click", closeResetAllProgressModal);

confirmResetAllProgressBtn.addEventListener("click", async () => {
    if (confirmResetAllProgressBtn.disabled) return;

    confirmResetAllProgressBtn.disabled = true;
    confirmResetAllProgressBtn.textContent = "Resetting...";

    try {
        // Reset every achievement currently stored locally.
        for (const id of Object.keys(progress)) {
            progress[id] = 0;
        }

        // Save the reset locally.
        localStorage.setItem(
            "lifeAchievementsProgress",
            JSON.stringify(progress)
        );

        // Save the reset to the signed-in account's cloud document.
        if (auth.currentUser) {
            await db.collection("users").doc(auth.currentUser.uid).set({
                progress: { ...progress },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // Cancel any older queued cloud save.
        clearTimeout(cloudSyncTimer);

        render();
        closeResetAllProgressModal();
        showToast("All progress reset.");
    } catch (error) {
        console.error("Reset all progress failed:", error);
        showToast("Cloud reset failed. Please check your connection.");
    } finally {
        confirmResetAllProgressBtn.disabled = false;
        confirmResetAllProgressBtn.textContent = "Reset All";
    }
});

/* Explicit confirmation before signing out */

confirmSignOutBtn.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
        closeSignOutConfirm();
        return;
    }

    confirmSignOutBtn.disabled = true;
    confirmSignOutBtn.textContent = "Signing out...";

    try {
        // Stop queued saves before writing the latest account data.
        clearTimeout(cloudSyncTimer);

        if (!cloudReady) {
            throw new Error("Cloud is not ready; sign-out cancelled.");
        }

        // Save the latest progress to this account first.
        await db.collection("users").doc(user.uid).set({
            progress: { ...progress },
            profile: getSavedProfile(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Keep guest progress separate; never copy account progress into it.
        localStorage.removeItem(ACCOUNT_PROGRESS_KEY);

        cloudReady = false;
        progress = JSON.parse(
            localStorage.getItem(GUEST_PROGRESS_KEY) || "{}"
        );

        await auth.signOut();

        render();
        closeSignOutConfirm();
        closeAccountModal();
        showToast("Signed out. Guest progress kept separate.");
    } catch (error) {
        console.error("Sign-out failed:", error);
        showToast("Could not safely sign out. Your account is still protected.");
    } finally {
        confirmSignOutBtn.disabled = false;
        confirmSignOutBtn.textContent = "Sure";
    }
});

/* ===== AUTH STATE ===== */

document.getElementById("mergeYes").addEventListener("click", async () => {
    const guest = JSON.parse(localStorage.getItem(GUEST_PROGRESS_KEY) || "{}");

    Object.assign(progress, guest);

    localStorage.setItem(ACCOUNT_PROGRESS_KEY, JSON.stringify(progress));
    localStorage.removeItem(GUEST_PROGRESS_KEY);

    const user = firebase.auth().currentUser;
    if (user) {
        await db.collection("users").doc(user.uid).set({
            progress,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    document.getElementById("mergeModal").classList.add("hidden");
    render();
    showToast("Guest progress merged ✓");
});

document.getElementById("mergeNo").addEventListener("click", () => {
    document.getElementById("mergeModal").classList.add("hidden");
});

auth.onAuthStateChanged(async user => {
    cloudReady = false;
    updateAccountButton(user);

    if (!user) {
        progress = JSON.parse(
            localStorage.getItem(GUEST_PROGRESS_KEY) || "{}"
        );

        closeAccountModal();
        render();
        return;
    }

    accountPhoto.src = user.photoURL || "";
    accountDisplayName.textContent = user.displayName || "Google User";
    accountEmail.textContent = user.email || "";

    try {
        const docRef = db.collection("users").doc(user.uid);
        const snapshot = await docRef.get();

        if (snapshot.exists) {
            const data = snapshot.data();

            // Load ONLY this Google account's cloud progress.
            progress = data.progress || {};

            if (data.profile) {
                saveLocalProfile(data.profile);
            }
        } else {
            // A new account starts separately from guest progress.
            progress = {};

            await docRef.set({
                progress: {},
                profile: getSavedProfile(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        localStorage.setItem(
            ACCOUNT_PROGRESS_KEY,
            JSON.stringify(progress)
        );

        cloudReady = true;

        render();
        updateAccountButton(user);
        showToast("Account synced ✓");

    if (Object.keys(
        JSON.parse(localStorage.getItem(GUEST_PROGRESS_KEY) || "{}")
    ).length > 0) {
        const guestProgress = JSON.parse(
            localStorage.getItem(GUEST_PROGRESS_KEY) || "{}"
        );

        if (Object.keys(guestProgress).length > 0) {
            document.getElementById("mergeModal").classList.remove("hidden");
        }
    }

    } catch (error) {
        console.error("Cloud loading failed:", error);
        showToast("Sync failed. Check your connection.");
    }
});

/* Initial account button state */
updateAccountButton(auth.currentUser);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
      console.log("Life Achievements PWA ready!");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}