class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destionationElement = document.querySelector(newDestinationSelector);
    destionationElement.append(element);
    element.scrollIntoView({ behavior: "smooth" });
    //자동으로 해당 뷰로 스크롤함
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }
  detach() {
    if (this.element) {
      this.element.remove();
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "beforeend",
      this.element
    );
  }
}

class Tooltip extends Component {
  constructor(closeNotifierFunction, text, hostElementId) {
    super(hostElementId);

    this.closeNotifier = closeNotifierFunction;
    this.text = text;
    this.create();
  }
  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  };
  create() {
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "card";
    const tooltipTemplate = document.getElementById("tooltip");
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    tooltipBody.querySelector("p").textContent = this.text;
    tooltipElement.append(tooltipBody);
    // console.log(this.hostElement.getBoundingClientRect());
    //tooltip의 위치 확인

    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    //왼쪽 상단의 모서리 좌표
    const hostElHeight = this.hostElement.clientHeight;
    //테두리가 없어서 offsetHeight랑 똑같음
    const parentElementScrolling = this.hostElement.parentElement.scrollTop;

    //화면의 절대적인 좌표시스템에서 요소의 위치 지정
    tooltipElement.style.position = "absolute";
    const x = hostElPosLeft + 20; //작업하는 값은 항상 픽셀
    const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;
    //스크롤 한만큼 빼줘야함 실제위치는 스크롤링한 양에 따라 바뀜
    //스크롤에 반응하려면 스크롤에 반응하는 이벤트 리스너를 설정해야함
    //좌표시스템이 왼쪽 상단 모서리에서 시작하므로 요소를 아래로 밀어낸다.
    //높이만큼 아래서 시작함 근데 -10을 뺌 높이에서 10만큼만 내려감

    //top,left는 읽기 전용 좌표로 새롭게 하려면 css로 할당해야함
    tooltipElement.style.left = x + "px"; //예시 500px처럼
    tooltipElement.style.top = y + "px"; //예시 500px처럼

    tooltipElement.addEventListener("click", this.closeTooltip);
    this.element = tooltipElement;
  }
}

//단일 아이템 관리
class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectMoreInfoButton();
    this.connectSwitchButton(type);
    this.connectDrag();
  }
  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const tooltipText = projectElement.dataset.extraInfo;
    //data-속성은 데이터셋특성에서 모두 병합됨

    const tooltip = new Tooltip(
      () => {
        this.hasActiveTooltip = false;
      },
      tooltipText,
      this.id
    );
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  connectDrag() {
    const item = document.getElementById(this.id);
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.id);
      //드래그 이벤트기 때문에 데이터 통신 객체가 있을 것
      //setData 메소드는 서로 다른 유형의 데이터를 설정할 수 있다.
      //식별자에 의해 식별된 평문 어떤 문구든 가능
      //두번째 인자는 this.id id가 끝에 있으므로 그냥 this.id
      event.dataTransfer.effectAllowed = "move";
      //어떤 종류의 드래그앤 드롭이 처리되는지를 설명
    });
    item.addEventListener("dragend", (event) => {
      console.log(event);
    });
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoBtn = projectItemElement.querySelector(
      "button:first-of-type"
    );

    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler.bind(this));
  }
  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchBtn = projectItemElement.querySelector("button:last-of-type");
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    //이렇게 하면 기존의 이벤트 리스너는 항상 삭제가되고
    //새로운 리스너가 추가돼서 시간이 지나도 이벤트 리스너가 누적이 안됨
    switchBtn.textContent = type === "active" ? "Finish" : "Activate";
    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }

  update(upadteProjectListsFn, type) {
    this.updateProjectListsHandler = upadteProjectListsFn;
    this.connectSwitchButton(type);
  }
}

class ProjectList {
  projects = [];

  //프로젝트 유형에 따라 다르게
  constructor(type) {
    this.type = type;

    //리스트에 속한 아이템을 다룰 수 있음
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(
        new ProjectItem(prjItem.id, this.switchproject.bind(this), this.type)
      );
    }
    console.log(this.projects);
    this.connectDroppable();
  }

  connectDroppable() {
    const list = document.querySelector(`#${this.type}-projects ul`);

    //둘의 차이는 트리거 될 때 하위 요소를 포함하는지
    list.addEventListener("dragenter", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        list.parentElement.classList.add("droppable");
        event.preventDefault();
      }
      //요소를 드롭하는 것이 가능하고 드롭이벤트가 트리거 됨
      //prevent하지않으면 요소를 드롭할 순 있어도. 드롭이벤트가 트리거 안됨
      //드래그할 때 옳은 데이터만 받아들이기 위해서 if문으로 함 확인하는 절차
      //데이터 유형만 파악이 가능하다 id읽는 것이 불가능함
    });

    list.addEventListener("dragover", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
    });

    list.addEventListener("dragleave", (event) => {
      //가장 가까운 ul에서 벗어났는지 확인하는 것임
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        list.parentElement.classList.remove("droppable");
      }
    });

    list.addEventListener("drop", (event) => {
      const prjId = event.dataTransfer.getData("text/plain");
      // 이벤트 리스너가 작동중인 그 리스트의 프로젝트에서
      //이 id를 가진 프로젝트를 찾을 수 있는지
      // 그리스트에서 할당된 프로젝트에서 일치하는 id의 프로젝트를 찾았다면
      //이미 그게 속해있던 리스트에 드롭한 것임
      if (this.projects.find((p) => p.id === prjId)) {
        return; //함수를 더이상 실행 x
      }
      //드래그해서 꺼내면 다른 곳에 추가하면 기존은 삭제되고 새로운곳에 추가
      //드래그하면 클릭이 되도록 할 수 있음
      document
        .getElementById(prjId)
        .querySelector("button:last-of-type")
        .click();
      list.parentElement.classList.remove("droppable");
    });
  }

  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchproject.bind(this), this.type);
  }

  //인스턴스를 두개를 추가
  //프로젝트를 인스턴스 A에서 B
  //Activate 에서 Finish로 옮길 때 인스턴스 A
  //Finish에 해당하는 인스턴스 B에는 프로젝트를 추가
  switchproject(projectId) {
    // const projectIndex = this.projects.findIndex((p) => p.id === projectId);
    // this.projects.splice(projectIndex, 1);
    //방법2
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}

class App {
  //서로 다른 아이템을 분석하기 위해 논리를 추가할 수 있다.
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectList = new ProjectList("finished");
    activeProjectsList.setSwitchHandlerFunction(
      finishedProjectList.addProject.bind(finishedProjectList)
    );
    finishedProjectList.setSwitchHandlerFunction(
      activeProjectsList.addProject.bind(activeProjectsList)
    );
    //bind해야한다. addProject함수를 호출하고 addProject 안에 있는 것은
    //this.swichHandler와 동일한 걸 나타내니까
    //addProject에서 호출하는 곳이 아닌 실행할 인스턴스로 bind해야함

    //자바스크립트를 사용해 동적으로 스크립트 실행
    // const someScript = document.createElement("script");
    // someScript.textContent = 'alert("Hi there");';
    // document.head.append(someScript);
    //별로 필요하진 않음

    //다른 스크립트를 특정 시간에 다운로드 가능함
    // this.startAnalytics();
    //앱이 시작되면 바로 실행 가능 //init때문에
    // document
    //   .getElementById("start-analytics-btn")
    //   .addEventListener("click", this.startAnalytics);
    //페이지 로드 후 5초후 로드
    // const timerId = setTimeout(this.startAnalytics, 3000);
    // //async의 예시임

    // document
    //   .getElementById("stop-analytics-btn")
    //   .addEventListener("click", () => {
    //     clearTimeout(timerId);
    //   });
    // //3초전에 클릭하면 안나타남
    // //간격 타이머 설정도 없앨 수 있음
  }

  static startAnalytics() {
    const analyticsScript = document.createElement("script");
    analyticsScript.src = "assets/scripts/analytics.js";
    analyticsScript.defer = true;
    document.head.append(analyticsScript);
  }
}

App.init();
