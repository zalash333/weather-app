import axiosInstance from "../serverRequest/axiosServerRequest";
import {net} from "../countres/brainjs";

const CITY = 'CITY';
const ADD_TEXT_IN_INPUT = 'ADD_TEXT_IN_INPUT';
export const addTextInInput = (value) => ({type: ADD_TEXT_IN_INPUT, value});
const ADD_ITEMS = 'ADD_ITEMS';
export const addItemsAction = () => ({type: ADD_ITEMS});
const ADD_ITEMS_FROM_LOCAL = 'ADD_ITEMS_FROM_LOCAL';
const addItemsFromLocal = (items) => ({type: ADD_ITEMS_FROM_LOCAL, items});
const RUN_CURRENT_ITEMS = 'RUN_CURRENT_ITEMS';
export const runCurrentItems = (id) => ({type: RUN_CURRENT_ITEMS, id});
const TOGGLE_STYLE_INPUT = 'TOGGLE_STYLE_INPUT';
const toggleStyleInput = (bool) => ({type: TOGGLE_STYLE_INPUT, bool});
const REQUEST_CITY = 'REQUEST_CITY';
const requestCityAction = (city) => ({type: REQUEST_CITY, city});
const RESPONSE_WEATHER = 'RESPONSE_WEATHER';
const responseWeatherAction = (data) => ({type: RESPONSE_WEATHER, data});
const MASSAGE_RESPONSE = 'MASSAGE_RESPONSE';
const massageResponse = (massage) => ({type: MASSAGE_RESPONSE, massage});
const TOGGLE_MASSAGE = 'TOGGLE_MASSAGE';
const toggleMassage = () => ({type: TOGGLE_MASSAGE});
const CLEAR_VALUE = 'CLEAR_VALUE';
const clearValue = () => ({type: CLEAR_VALUE});
export const CURRENT_CITY_WEATHER = 'CURRENT_CITY_WEATHER';
const currentCityWeatherAction = () => ({type: CURRENT_CITY_WEATHER});
export const GET_ITEMS_IN_BRAIN = 'GET_ITEMS_IN_BRAIN';
const getItemsInBrainAction = (items) => ({type: GET_ITEMS_IN_BRAIN, items});
export const SET_MASSAGE_BRAIN = 'SET_MASSAGE_BRAIN';
const setMassageBrainAction = (massage) => ({type: SET_MASSAGE_BRAIN, massage});


const initialState = {
    massage: '',
    valueInput: '',
    items: [],
    styleInput: false,
    city: '',
    toggleMassage: false,
    response: '',
    contentItemsBoolean: false,
    currentCityWeather: '',
    brainItems: [],
    massageBrain:''
};

export const requestCity = (value) => async (dispatch) => {
    const API_KEY = "c3bd9e705a169cb812e91bad08db54bb";
    await axiosInstance.get(`weather?q=${value}&appid=${API_KEY}&units=metric`)
        .then(e => {
            dispatch(toggleStyleInput(true));
            dispatch(requestCityAction(e.data.name));
            dispatch(responseWeatherAction(e.data))
        })
        .catch((error) => {
            dispatch(toggleStyleInput(false));
            dispatch(massageResponse(error.response.data.message))
        })
};


export const brainRun = () => (dispatch, getState) => {
    let brainItems = getState().weather.brainItems;
    net.train(brainItems, {
        iterations: 2000,
        timeout: 10
    });
};

export const getItemsInBrains = () => async (dispatch) => {
    let items = JSON.parse(localStorage.getItem(CITY));
    if (items) await dispatch(getItemsInBrainAction(items));
    if(items) await dispatch(brainRun())
};

const setCityLocal = () => (dispatch, getState) => {
    let items = getState().weather.items;
    localStorage.setItem(CITY, JSON.stringify(items))
};

export const getCityLocal = () => (dispatch) => {
    let items = JSON.parse(localStorage.getItem(CITY));
    if (items) dispatch(addItemsFromLocal(items))
};

export const addItems = () => (dispatch, getState) => {
    let bool = getState().weather.styleInput;
    let value = getState().weather.valueInput;
    let items = getState().weather.items;
    if (bool) {
        let check = items.filter(e => e.value === value).length;
        if (!check) dispatch(addItemsAction());
        else dispatch(clearValue());
        dispatch(currentCityWeatherAction());
        dispatch(setCityLocal());
        dispatch(getItemsInBrains())
    } else {
        dispatch(toggleMassage());
        dispatch(setMassageBrainAction(net.run(value)))
    }
};

const weatherReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MASSAGE_BRAIN:
            return {...state,massageBrain:action.massage};
        case GET_ITEMS_IN_BRAIN:
            let copyState = {...state};
            for (let i = 0; action.items.length > i; i++) {
                let box = '';
                let ava = action.items[i].value.split('');
                for (let e = 0; ava.length > e; e++) {
                    box += ava[e];
                    copyState.brainItems.push({input: box, output: action.items[i].value})
                }
            }
            return copyState;
        case CURRENT_CITY_WEATHER:
            return {...state, currentCityWeather: state.response};
        case RESPONSE_WEATHER:
            return {...state, response: action.data};
        case CLEAR_VALUE:
            return {...state, valueInput: ''};
        case TOGGLE_MASSAGE:
            return {...state, toggleMassage: true};
        case MASSAGE_RESPONSE:
            return {...state, massage: action.massage};
        case REQUEST_CITY:
            return {...state, city: action.city};
        case TOGGLE_STYLE_INPUT:
            return {...state, styleInput: action.bool};
        case RUN_CURRENT_ITEMS:
            return {
                ...state,
                valueInput: state.items.filter((el) => el.id === action.id)[0].value,
                toggleMassage: false
            };
        case ADD_ITEMS_FROM_LOCAL:
            return {...state, items: action.items};
        case ADD_ITEMS:
            return {
                ...state,
                items: [{value: state.valueInput, id: new Date()}, ...state.items],
                valueInput: '',
                toggleMassage: false
            };
        case ADD_TEXT_IN_INPUT:
            return {...state, valueInput: action.value, toggleMassage: false};
        default:
            return state
    }
};

export default weatherReducer