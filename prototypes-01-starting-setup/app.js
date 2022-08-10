// class AgedPerson {
//   printAge() {
//     console.log(this.age);
//   }
// }

// class Person {
//   name = "Max";

//   constructor() {
//     // super();
//     this.age = 30;
//   }

//   greet = function () {
//     console.log("Hi I am" + this.name + "and I am " + this.age + "years Old");
//   };
// }

// function Person() {
//   this.age = 30;
//   this.name = "Max";
// //   this.greet = function () {
// //     console.log("Hi I am" + this.name + "and I am " + this.age + "years Old");
// //   };
// }
// // Person.prototype = {
// //   printAge() {
// //     console.log(this.age);
// //   },
// // };
// Person.prototype.greet = function () {
//   console.log("Hi I am" + this.name + "and I am " + this.age + "years Old");
// };

// console.dir(Person);
// const person = new Person();
// person.greet();
// person.printAge(); //이게 된다. 생성자 함수에 직접 설정된게 아니라
// //폴백 객체에 설정했기 때문
// console.log(person.__proto__);
// const p2 = new person.__proto__.constructor();
// console.log(p2);

// const p = new Person();
// const p2 = new Person();
// p.greet();
// console.log(p);

// const course = {
//   //new Object()
//   title: "JavaScript - The Complete Guide",
//   rating: 5,
// };

// console.log(course.__proto__);//모든 브라우저에 의해 구현된 비공식 기능이지만,
// //자바스크립트 프로토타입 작업하기 좋게 의도된 기능은 아니다.

// console.log(Object.getPrototypeOf(course));

const student = Object.create(
  {
    printProgress: function () {
      console.log(this.progress);
    },
  },
  {
    nme: {
      configurable: false,
      enumerable: true,
      value: "Max",
      writable: true,
    },
  }
);

console.log(student);
