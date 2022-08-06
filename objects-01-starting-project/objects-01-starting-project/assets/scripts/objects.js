//영화 객체 추가
//객체에 프로퍼티를 동적으로 저장하는 방법을 사용할 것임

const addMovieBtn = document.getElementById("add-movie-btn");
const searchBtn = document.getElementById("search-btn");

const movies = [];

const renderMovies = (filter = "") => {
  const movieList = document.getElementById("movie-list");

  if (movies.length === 0) {
    movieList.classList.remoive("visible");
    return; //visible 클래스를 삭제한 후 즉 if 이후에도 innerHTML 삭제 작업이
    //이루어짐
  } else {
    movieList.classList.add("visible");
  }
  movieList.innerHTML = ""; //비효율적이지만 일단 실행 렌더링 된 항목 모두 지움
  // 렌더링 될 때마다 모든 리스트를 지우고 다시 렌더링함 비효율

  const filteredMovies = !filter
    ? movies
    : movies.filter((movie) => {
        return movie.info.title.includes(filter);
      }); //filter에 내용이 들어가면 영화가 포함된 걸 filteredMovies에 넣고
  //아무 내용이 안들어가면 모든 영화 리스트를 보여줘라
  console.log(filteredMovies);
  filteredMovies.forEach((movie) => {
    // 필터된 영화 목록 보여주기
    const movieEl = document.createElement("li");

    const { info, ...otherProps } = movie;
    // ...otherProps하면 info를 제외한 나머지 키
    // const { title } = info;
    let { getFormattedTitle } = movie;
    // getFormattedTitle = getFormattedTitle.bind(movie);
    console.log(otherProps);
    let text = getFormattedTitle.call(movie) + " - ";
    for (const key in info) {
      if (key !== "title" && key !== "_title") {
        text += `${key} : ${info[key]}`;
      }
    }
    movieEl.textContent = text;
    movieList.append(movieEl);
  });
};

//영화 추가 핸들러
const addMovieHandler = () => {
  const title = document.getElementById("title").value;
  const extraName = document.getElementById("extra-name").value;
  const extraValue = document.getElementById("extra-value").value;

  if (
    title.trim() === "" ||
    extraName.trim() === "" ||
    extraValue.trim() === ""
  ) {
    //trim은 양쪽 끝 공백을 없애줌
    return; //입력한 값이 셋다 빈 값인 경우
  }

  const newMovie = {
    info: {
      set title(value) {
        if (value.trim() === "") {
          this._title = "DEAFUALT";
        }
        this._title = value;
      },
      get title() {
        return this._title;
      }, //키와 값이름이 동일한 경우 그냥 title만 적어줘도 됨
      [extraName]: extraValue,
      //동적 프로퍼티 이름을 등록할 수 잇음
    },
    id: Math.random(),
    getFormattedTitle: function () {
      return this.info.title.toUpperCase();
    },
  };

  newMovie.info.title = title;

  movies.push(newMovie);
  renderMovies(); //추가한 내용을 아래 리스트에 추가함
};

//검색기능
const searchMovieHandler = () => {
  const filterTerm = document.getElementById("filter-title").value;
  console.log(filterTerm);
  renderMovies(filterTerm);
};

addMovieBtn.addEventListener("click", addMovieHandler);
searchBtn.addEventListener("click", searchMovieHandler);
