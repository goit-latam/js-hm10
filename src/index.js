import './css/styles.css';
import getRefs from './js/get-refs';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import countryTpl from './templates/country.hbs';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  const inputText = event.target.value.trim();
  if (!inputText) {
    clearCountryInfo();
    clearCountryList();
    return;
  }
  fetchCountries(inputText).then(renderMarkup);
}

function renderMarkup(countries) {
  clearCountryInfo();
  clearCountryList();

  if (countries.length > 10) {
    Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length >= 2 && countries.length < 10) {
    renderCountriesList(countries);
    return;
  }
  renderCountryInfo(countries);
}

function renderCountriesList(countries) {
  const markup = countries
    .map(
      ({ flags, name }) => `<li class="country-description list">
        <img  class="country-flag" src=${flags.svg} alt="" width="50" height="30">
        <span class="country-name">${name.official}</span>
    </li>`,
    )
    .join('');

  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  refs.countryInfo.innerHTML = countryTpl(country);
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
