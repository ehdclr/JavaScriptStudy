const startGameBtn = document.getElementById('start-game-btn');
const ROCK ="ROCK";
const PAPER = "PAPER";
const SCISSORS = 'SCISSORS';
const DEFAULT_USER_CHOICE = ROCK;
const RESULT_DRAW ="DRAW";
const RESULT_PLAYER_WINS ="PLAYER_WINS";
const RESULT_COMPUTER_WINS ="COMPUTER_WINS";


let gameIsRunning = false;


//가위 바위 보 중 뭘  낼지 
const getPlayerChoice = function(){
    //대문자로 인식하도록 함 
    const selection = prompt(`${ROCK}, ${PAPER} or ${SCISSORS}?`, '').toUpperCase();
    if(selection !==ROCK 
    && selection !== PAPER
    && selection !==SCISSORS ){
        alert(`유효하지 않은 값을 선택입니다! default : ${DEFAULT_USER_CHOICE}`);
        return DEFAULT_USER_CHOICE;
    }
    return selection;
}

//컴퓨터가 가위바위보 무작위로 내는 지 랜덤
const getComputerChoice = function(){
    const randomValue = Math.random(); //Math는 전역 객체로 0과 1사이의 난수를 생성
    if(randomValue < 0.34){
        return ROCK;
    }else if (randomValue < 0.67){
        return PAPER;
    } else {
        return SCISSORS;
    }
};




//누가 이겼는지 결정 
const determineWinner = (cChoice= DEFAULT_USER_CHOICE,pChoice  ) =>
        cChoice === pChoice 
        ? RESULT_DRAW 
        : (cChoice ===ROCK && pChoice ===PAPER|| 
        cChoice ===PAPER && pChoice ===SCISSORS||
        cChoice === SCISSORS && pChoice === ROCK) 
        ?  RESULT_PLAYER_WINS 
        : RESULT_COMPUTER_WINS;
//     if(cChoice === pChoice){
//         return RESULT_DRAW;
//     } else if (cChoice ===ROCK && pChoice ===PAPER|| 
//         cChoice ===PAPER && pChoice ===SCISSORS||
//         cChoice === SCISSORS && pChoice === ROCK){
//         return RESULT_PLAYER_WINS;
//     } else{
//         return RESULT_COMPUTER_WINS;
// }



startGameBtn.addEventListener('click', function(){
    if(gameIsRunning){
        return;
    }
    //버튼을 클릭해도 새로운 게임이 실행되지 않도록 하는 동작을 반환
    gameIsRunning = true;
    console.log('게임시작');
    const playerSelection =getPlayerChoice();
    console.log(playerSelection);
    const computerChoice = getComputerChoice();
    const winner = determineWinner(computerChoice,playerSelection);
    let message =`You Picked ${playerSelection}, computer picked ${computerChoice} , You`;
    if( winner === RESULT_DRAW){
        message = message + 'Had a draw';

    } else if (winner ===RESULT_PLAYER_WINS){
        message = message + 'won';
    } else {
        message = message + 'lost';
    }

    alert(message);
    gameIsRunning =false; //모든 단계 실행 후 게임 다시 시작 
});



//not related to game
const combine = (resultHandler,operation,...numbers) => {
    const validateNumber = number => {
        return isNaN(number) ? 0 : number;

    }
    let sum = 0;
    for (const num of numbers){
        if(operation ==='ADD'){
            sum += validateNumber(num);
        } else {
            sum -= validateNumber(num);
        }
        
}
resultHandler(sum );
// resultHandler로 통해 보내는 값은 자동으로 함수의 마지막 인자에 추가 
}

// const subtractUp = function(resultHandler,...numbers){
//     let sum = 0;
//     for (const num of numbers){
//         sum = sum - num;
// }
// resultHandler(sum,"빼기의 결과는 :");
// }

const showResult = (messageText, result) => {
    alert (messageText+ ' ' + result);
};

combine(showResult.bind(this,'더하기 합계는 :'),'ADD',1,5,10,-3,6,10);
//괄호없이 콜백을 해야한다. 인자이기 때문에 sumUp이 실행해야하므로 

combine(showResult.bind(this,'빼기 합계는 :'),'SUBTRACT',5,10,87);
