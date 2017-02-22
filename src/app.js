import cats from './cats';
import $ from 'jquery';

$('body').append($('<ul>').append(cats.map((cat) => {
    return $('<li>').text(cat);
})));