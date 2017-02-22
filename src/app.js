import cats from 'babel!./cats';
import $ from 'jquery';
import './app.css';

$('body').append($('<ul>').append(cats.map((cat) => {
    return $('<li>').text(cat);
})));