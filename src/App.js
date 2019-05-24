import React, {useEffect, useState} from 'react';
import './App.css';
import {connect} from 'react-redux'
import {
    addItems,
    addTextInInput,
    getCityLocal,
    getItemsInBrains,
    requestCity,
    runCurrentItems
} from "./redux/weatherReducer";

let App = ({value, brainItems, massageBrain, getItemsInBrains, items, addTextInInput, addItems, getCityLocal, runCurrentItems, requestCity, styleInputToggle, massage, toggleMassage, city, response, currentCityWeather}) => {
    useEffect(() => {
        getCityLocal();
        getItemsInBrains();
    }, []);
    const [style, setStyle] = useState(true);
    const [itemsCurrent, setItems] = useState([]);
    const onTextChanged = (e) => {
        const values = typeof e === 'string' ? e : e.target.value;
        requestCity(values);
        addTextInInput(values);
        let suggestion = [];
        if (values.length > 0) {
            const regex = new RegExp(`${values}`, 'i');
            let string = items.map(el => el.value).filter(el => regex.test(el)).sort();
            suggestion = string.map(el => items.filter(e => e.value === el)[0]);
        }
        setItems(suggestion)
    };

    return (
        <div className="App">
            <div className={'App-logo'}>WEATHER</div>
            <header className="App-header">
                {/*<div className={'block-style'}>*/}
                <div className={'block-all-header'}>
                    <div className={'block-header-information'}>
                        <div className={'block-nameCity-codeCountry'}>
                            <div className={'city-weather'}>{currentCityWeather ? currentCityWeather.name : ''}</div>
                            <div
                                className={'country-weather'}>{currentCityWeather ? `(${currentCityWeather.sys.country})` : ''}</div>
                        </div>
                        <div
                            className={'description-weather'}>{currentCityWeather ? currentCityWeather.weather[0].description : ''}</div>
                    </div>
                    <div
                        className={'temp-weather'}>{currentCityWeather ? `${Math.trunc(currentCityWeather.main.temp)}${String.fromCharCode(176)}` : ''}
                    </div>
                </div>
                <div className={'block-input-drop-menu'}>
                    <div>{massageBrain && toggleMassage ? `maybe you meant ${massageBrain}` : ''}</div>
                    <input
                        className={`input-style ${value.length > 0 ? `${!styleInputToggle ? 'error' : 'active'}` : ''}`}
                        type={'text'}
                        placeholder={'city'}
                        value={value}
                        onChange={onTextChanged}
                        onFocus={(e) => {
                            setItems(items);
                            setStyle(true)
                        }}
                        onBlur={(e) => {
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && value ? addItems() : ''}/>
                    <div
                        className={style ? 'drop-down-menu' : 'display-none'}>{itemsCurrent ? itemsCurrent.map((el, i) =>
                        i < 8 ? <div
                            onClick={() => {
                                onTextChanged(el.value);
                                setStyle(false)
                            }} className={'items'}
                            key={el.id}>{el.value}</div> : '') : ''}</div>
                </div>
                <div className={'massage-request'}>{toggleMassage ? massage : ''}</div>
                <div className={'block-information-weather'}>
                    <div>
                        {currentCityWeather ? <img className={'img-weather'}
                                                   src={`https://openweathermap.org/img/w/${currentCityWeather.weather[0].icon}.png`}/> : ''}
                    </div>
                    <div>
                        <div>{currentCityWeather ? `wind: ${currentCityWeather.wind.speed} km/h` : ''}</div>
                        <div>{currentCityWeather ? `humidity: ${currentCityWeather.main.humidity}%` : ''}</div>
                    </div>
                </div>
                {/*<button className={'button'} onClick={() => value ? addItems() : ''}>click</button>*/}
                {/*</div>*/}
            </header>
        </div>
    );
};
const mapStateToProps = (state) => ({
    items: state.weather.items,
    massage: state.weather.massage,
    value: state.weather.valueInput,
    styleInputToggle: state.weather.styleInput,
    toggleMassage: state.weather.toggleMassage,
    city: state.weather.city,
    response: state.weather.response,
    currentCityWeather: state.weather.currentCityWeather,
    brainItems: state.weather.brainItems,
    massageBrain: state.weather.massageBrain
});
const mapDispatchToProps = (dispatch) => ({
    addTextInInput(value) {
        dispatch(addTextInInput(value))
    },
    addItems() {
        dispatch(addItems())
    },
    getCityLocal() {
        dispatch(getCityLocal())
    },
    runCurrentItems(id) {
        dispatch(runCurrentItems(id))
    },
    requestCity(value) {
        dispatch(requestCity(value))
    },
    getItemsInBrains() {
        dispatch(getItemsInBrains())
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
