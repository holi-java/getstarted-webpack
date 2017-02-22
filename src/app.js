import cats from 'babel!./cats';
import './app.css';

document.body.innerHTML = `<ul>${cats.map((cat) => `<li>${cat}</li>`).join('')}</ul>`;