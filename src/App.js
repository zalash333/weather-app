import React, {useEffect, useState} from 'react';
import './App.css';
import {connect} from 'react-redux'
import {
    addItems,
    addTextInInput,
    getCityLocal,
    requestCity,
    runCurrentItems
} from "./redux/weatherReducer";

let App = ({value, items, addTextInInput, addItems, getCityLocal, runCurrentItems, requestCity, styleInputToggle, massage, toggleMassage, city, response, currentCityWeather}) => {
    useEffect(() => {
        getCityLocal();
    }, [getCityLocal]);
    const [style, setStyle] = useState(true);
    const [itemsCurrent, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const onTextChanged = (e) => {
        let values = typeof e === 'string' ? e : e.target.value;
        values = values.replace(/[^a-zA-Z ]/g,'');
        if(e && e.target && e.target.value !== values){
            setErrorMessage(true);
            return ''
        }else{
            setErrorMessage(false)
        }
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
                    <div>{errorMessage ? `only letters can be entered` : ''}</div>
                    <div>
                    <input
                        className={`input-style ${value && value.length > 0 ? `${!styleInputToggle ? 'error' : 'active'}` : ''}`}
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
                        <img onClick={()=>value ? addItems() : ''} className={'img_style'} src={'http://s1.iconbird.com/ico/2013/9/450/w256h2561380453921Search256x25632.png'}/>
                    </div>
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
    currentCityWeather: state.weather.currentCityWeather
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
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
