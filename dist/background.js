// 도서관 로그인 페이지로 리다이렉트되면,
// 기존의 url을 가져와서, 
// 로그인이 완료된 상태의 "https://library.korea.ac.kr/" == location.href 이면 기존의 url로 리다이렉트 시켜주고
// 기존의 url은 chrome.storage에서 삭제함.
// 