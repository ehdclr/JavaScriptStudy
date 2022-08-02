const addMovieModal = document.getElementById('add-modal');
const startAddMovieButton = document.querySelector('header button');
//헤더의 버튼 쿼리 셀렉터 
// const startAddMovieButton = document.querySelector('header button').lastElementchild;
//이 방식과 같음 
const backdropEl = document.getElementById('backdrop');
const cancelButton = document.querySelector('.btn--passive');
const confirmAddMovieButton =cancelButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
const entryTextSection = document.getElementById('entry-text');
const deleteMovieModal = document.getElementById('delete-modal');

const movies = []; //영화 저장 

const backdrop = () => {
    backdropEl.classList.toggle('visible');
}

//영화에 리스트가 추가되면, ui 업데이트
//없으면 그대로 냅두기 
const updateUI =()=>{
    if(movies.length ===0){
        entryTextSection.style.display ='block'; //섹션부분 보이게
    } else{

        entryTextSection.style.display ='none'; // 영화리스트 있으면 섹션부분 지우기 

    }

}
const closeMovieDeletionModal = () => {
    backdrop();
    deleteMovieModal.classList.remove('visible');
}

const deleteMovie = (movieId) => {
// for 반복문을 사용해서 movies 의 모든 요소 거침
let movieIndex =0;
for(const movie of movies){
    if(movie.id ===movieId){
        break;
    }
    movieIndex++; //우리에게 필요한 무비 인덱스
}
movies.splice(movieIndex,1);//인덱스를 넣고 제거하려는 항목의 숫자 
const listRoot = document.getElementById('movie-list');
listRoot.children[movieIndex].remove();
// listRoot.removeChild(listRoot.children[movieIndex]); //예전방법
closeMovieDeletionModal();
updateUI();// 아예 없을 때 섹션 보이도록 
}




const deleteMovieHandler = (movieId) => {
    //클릭했을 때 모달 창 
    
    deleteMovieModal.classList.add('visible');
    //토글을 쓰면안됨 movieElement를 클릭해서 호출이 되면
    //이 모달이 보일 방법이 없다. visible 클래스를 제거 위해 토글을 하는건
    //가능하지만 쓰지말아 모달은 함수가 실행되면 보이지 않기때문
    backdrop();
    const cancelDeletionButton= deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionButton=deleteMovieModal.querySelector('.btn--danger');

    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
    //이벤트 리스널르 추가하기 전에 DeletionButton을 바꿔줘서 함수가 재실행될 때마다
    //새로운 DeletionButton을 갖는 것임 복제한 것이 기존의 것을 대체함 새로운 객체가됨 
    //모든 리스너들은  지워질 수 있고 깊은 복제가 필요할 수 있다. 버튼 내부의 텍스트는 복제안됨

    confirmDeletionButton=deleteMovieModal.querySelector('.btn--danger');

    // confirmAddMovieButton.removeEventListener('click',deleteMovie.bind(null,movieId));
    cancelDeletionButton.removeEventListener('click',closeMovieDeletionModal)
    cancelDeletionButton.addEventListener('click',closeMovieDeletionModal)
    //이 것은 바인드를 쓰지 않아서 버튼이 작동 새로운걸 만들지 않아서 같은 객체임 
    confirmDeletionButton.addEventListener('click',deleteMovie.bind(null,movieId));
    // 새 이벤트 리스너를 하는 거여서 같은 내용이여도 객체와 함수가 다를 수 있다. 그래서 
    //bind 해도 됨 
    //deleteMovie(movieId);

};

const renderNewMovieElement = (id,title,imageUrl,rating)=>{
    const newMovieElement = document.createElement('li');
    newMovieElement.className ='movie-element';
    newMovieElement.innerHTML = `
    <div class="movie-element__image>
        <img src="${imageUrl}" alt ="${title}">

    </div>
    <div class="movie-element__info">
        <h2>${title}</h2>
        <p>${rating}/5 stars</p>
    </div>
    `;
    newMovieElement.addEventListener('click',deleteMovieHandler.bind(null,id));
    //bind할 때 별로 중요하지않은 null을 전달하고, 생성된 영화에 대한 고유 식별자 필요
    //이 이벤트에 대한 참조는 상수인 newMovieElement가 있다.
    // 이 상수가 addEventListener를 포함하고 있는 li를 가리킴 
    // 함수가 실행되어 이 상수가 더이상 사용되지 않으면, 
    //자바스크립트가 이를 감지해 참조안되서 DOM을 삭제하면 이벤트 리스너를 삭제함
    const listRoot = document.getElementById('movie-list');
    listRoot.append(newMovieElement);
}



const closeMovieModal =() => {
    addMovieModal.classList.remove('visible');
}


const showMovieModal = () => {
    // addMovieModal.className='modal visible';
    //toggle모달로 사용 하는 방법 두가지  1번 방식은 HTML 수정하면 힘듬
    //classList 메서드 
    // addMovieModal.classList.toggle('visible');
    //다른 창이 생겨서 바꿔줘야함
    addMovieModal.classList.add('visible');
    // backdropEl.classList.toggle('visible');
    backdrop();
    //현재 상태에 따라 클래스를 추가하고 제거 
}

//배경이나 cancel버튼을 누르면 모달창이 사라져야함 
const backdropClickHandler = () =>{
    closeMovieModal();
    closeMovieDeletionModal();
    clearInput();
    
}
//모달 창에서 입력한거 ADD누르면 없어지도록 하기 
const clearInput =() => {
    // userInputs[0].value=''
    // userInputs[1].value=''
    // userInputs[2].value=''
    //이런식으로 하드코딩해서 일일이 모달창 꺼지면 없애줄 수 있으나 forEach씀
    for (const usrInput of userInputs){
        usrInput.value = '';
    }
};

const cancelButtonHandler = () => {
    closeMovieModal();
    backdropClickHandler();
    clearInput();
    
    
}

const addMovieHandler = () =>{
    const titleValue = userInputs[0].value;
    const imageUrlValue = userInputs[1].value;
    const ratinglValue = userInputs[2].value;
    if(titleValue.trim()===''
    || imageUrlValue.trim ==='' 
    || ratinglValue===''
    || +ratinglValue < 1
    || +ratinglValue> 5) {//문자열이긴 하지만 타입 변환 하기  trim으로 빈공백 없애주기
        alert('평점을 1부터 5사이 입니다. 입력해주세요.');
        return;
    }

    const newMovie =  {
        id : Math.random().toString(),//무작위 숫자는 고유ID 불가 같은 숫자 두번 생성 가능 
        //데모라 참음 
        title : titleValue,
        image : imageUrlValue,
        rating : ratinglValue,
    };
    movies.push(newMovie);
    console.log(movies);
    closeMovieModal();
    backdropClickHandler();
    clearInput();
    renderNewMovieElement(newMovie.id,newMovie.title,newMovie.image,newMovie.rating); //영화 렌더링 
    updateUI(); //영화 UI 추가 
}

startAddMovieButton.addEventListener('click',showMovieModal);
backdropEl.addEventListener('click',backdropClickHandler);
cancelButton.addEventListener('click',cancelButtonHandler);
confirmAddMovieButton.addEventListener('click',addMovieHandler);



console.log(addMovieModal);
console.log(startAddMovieButton);
console.log(userInputs);
console.log(cancelButton);
