const button = document.querySelector("button");

// button.onclick = function () {

// };

// //화살표 함수 방식
// const buttonClickHandler = (event) => {
//   event.target.disabled = true;
//   console.log(event);
// };
// buttons.forEach((btn) => {
//   btn.addEventListener("mouseenter", buttonClickHandler);
// });

// button.addEventListener("click", buttonClickHandler);
// const anoterButtonClickHandler = () => {
//   console.log("하이");
// };

// button.onclick = buttonClickHandler;
// button.onclick = anoterButtonClickHandler;

// const boundFn = buttonClickHandler.bind(this);

// //기존의 방식을 오버라이딩 해서 console.log가 됨
// button.addEventListener("click", boundFn);
// setTimeout(() => {
//     button.removeEventListener("click", boundFn);
// }, 2000);

// window.addEventListener("scroll", (event) => {
//   console.log(event);
// });

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event);
});

const div = document.querySelector("div");
div.addEventListener("click", (event) => {
  console.log("CLICKED DIV");
  console.log(event);
});
//세번째 매개변수에 true로 설정하면 캡처링 단계의 일부임

button.addEventListener("click", function (event) {
  event.stopPropagation();
  console.log("CLICKED BUTTON");
  console.log(event);
  console.log(this);
});

const listitems = document.querySelectorAll("li");
const list = document.querySelector("ul");

// listitems.forEach((el) => {
//   el.addEventListener("click", (event) => {
//     event.target.classList.toggle("highlight");
//   });
// });

list.addEventListener("click", function (event) {
  //     console.log(event.currentTarget);
  //     //등록한 곳을 참조함
  //   event.target.classList.toggle("highlight");
  event.target.closest("li").classList.toggle("highlight");
  //가장가까운 li를 탐색함
  //   button.click();
  //   //이벤트를 수신
  //   div.click();
  console.log(this);
  button.click();
});
