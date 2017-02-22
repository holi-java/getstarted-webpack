import cats from 'babel!./cats';
import $ from 'jquery';

$('body').append($('<ul>').append(cats.map((cat) => {
    return $('<li>').text(cat);
})));