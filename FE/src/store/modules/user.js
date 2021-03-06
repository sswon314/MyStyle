import * as authApi from "@/api/auth";

export default {
    state: () => ({
        // 유저 정보 데이터
        user: {
            userIdx: -1,
            userId: "",
            password: "",
            userName: "익명의 손",
        },
        heartData: null,
        // 상품 화면에 나올 상품의 인덱스값
        productIdx: 0,
        categoryIdx: "all",
    }),

    getters: {},

    mutations: {
        // detail페이지로 넘어갈 때 쓰일 productIdx를 설정
        setProductIdx(state, value) {
            console.log("mutation - setProductIdx 실행");
            console.log("productIdx값을 " + value + "로 바꿈");
            state.productIdx = value;
        },
        // 로그인 결과 처리
        loginResult(state, data) {
            console.log("mutation - loginResult 실행");
            if (data.isSuccess) {
                alert("로그인 성공");
                console.log("받은 IDX : " + data.result.userId);
                console.log("받은 Name : " + data.result.userName);
                state.user.userIdx = data.result.userId;
                state.user.userName = data.result.userName;
                location.href = "./";
            } else {
                alert("로그인 실패");
            }
        },
        // 회원가입 결과 처리
        registerResult(state, data) {
            console.log("mutation - registerResult 실행");
            if (data.isSuccess) {
                alert("회원가입 성공");
                location.href = "./login";
            } else {
                alert("회원가입 실패");
            }
        },
        // 로그아웃 처리
        requestLogout(state) {
            console.log("mutation - requestLogout 실행");
            console.log("로그아웃 후 유저 정보 초기화");
            state.user = {
                userIdx: -1,
                userId: "",
                password: "",
                userName: "익명의 손",
            };
            alert("로그아웃");
            location.href = "./";
        },
        // 마이페이지 정보(기본 정보) 가져와서 저장
        addMyInfoData(state, myInfoData) {
            console.log("mutation - addMyInfoData 실행");
            console.log("받아온 ID : ", myInfoData.userId);
            console.log("받아온 Name : ", myInfoData.userName);

            state.user.userId = myInfoData.userId;
            state.user.userName = myInfoData.userName;
        },
        // 마이페이지 정보(찜한 목록) 가져와서 저장
        addMyHeartList(state, myInfoData) {
            console.log("mutation - addMyHeartList 실행");
            console.log("받아온 List : ", myInfoData);

            state.heartData = myInfoData;
            // state.user.userName = myInfoData.userName;
        },
        // 상품 카테고리 id값 변경 (상품 카테고리 필터링 때 사용)
        setCategory(state, data) {
            state.categoryIdx = data;
        },
    },

    actions: {
        // 서버에 로그인 요청
        requestLogin(context, inputData) {
            console.log("action - requestLogin 실행");
            authApi
                .login(inputData[0], inputData[1])
                // 로그인 결과
                // isSuccess, code, message, result{jwt, userIdx}
                .then((response) => {
                    console.log("결과 : " + response.data.message);
                    console.log("성공여부 : " + response.data.isSuccess);
                    console.log("코드 : " + response.data.code);

                    context.commit("loginResult", response.data);
                })
                // 에러 발생 시 (예: 서버 닫힘)
                .catch((error) => {
                    console.log("에러 : " + error);
                });
        },
        // 서버에 회원가입 요청
        requestRegister(context, data) {
            console.log("action - requestRegister 실행");
            authApi
                .register(data[0], data[1], data[2], data[3])
                // 회원가입 결과
                // 회원가입 성공 시(isSuccess=true)로그인 페이지로 이동
                .then((response) => {
                    console.log("결과 : " + response.data.message);
                    console.log("성공여부 : " + response.data.isSuccess);
                    console.log("코드 : " + response.data.code);

                    context.commit("registerResult", response.data);
                })
                // 에러 발생 시
                .catch((error) => {
                    console.log("에러 : " + error);
                });
        },
        // 마이페이지 정보 요청
        getMyInfoData(context, userIdx) {
            authApi
                .myInfo(userIdx)
                // 마이페이지 정보 가져오기
                // isSuccess, code, message, result[{idx, userName, userId, email, phoneNum}] => 배열임
                .then((response) => {
                    console.log("결과 : " + response.data.message);
                    console.log("성공여부 : " + response.data.isSuccess);
                    console.log("코드 : " + response.data.code);

                    if (response.data.isSuccess) {
                        context.commit("addMyInfoData", response.data.result.myinfo);

                        context.commit("addMyHeartList", response.data.result.heartList);
                    } else {
                        // 로그인이 안되어있다면 로그인 필요하다는 알림과 함께 로그인 페이지로 이동
                        console.log("마이페이지 가져오기 실패");
                        alert("로그인 필요");
                        location.href = "./login";
                    }
                })
                // 에러 발생 시 (예: 서버 닫힘)
                .catch((error) => {
                    console.log("에러 : " + error);
                });
        },
    },
};
