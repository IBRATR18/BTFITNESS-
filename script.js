(function () {
  'use strict';
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', String(open));
  });
  function num(id) { var v = document.getElementById(id).value.trim().replace(',', '.'); return v === '' ? NaN : Number(v); }
  function show(id, html, err) { var b = document.getElementById(id); b.className = 'result' + (err ? ' err' : ''); b.innerHTML = html; }
  function round10(n) { return Math.round(n / 10) * 10; }

  var fc = document.getElementById('form-calorias');
  if (fc) fc.addEventListener('submit', function (e) {
    e.preventDefault();
    var sex = document.getElementById('c-sexo').value, age = num('c-edad'), w = num('c-peso'), h = num('c-altura');
    var act = Number(document.getElementById('c-act').value), goal = document.getElementById('c-obj').value;
    var goals = { perder: 0.85, mantener: 1, ganar: 1.1 }, acts = [1.2, 1.375, 1.55, 1.725, 1.9], errs = [];
    if (sex !== 'h' && sex !== 'm') errs.push('Elige el sexo.');
    if (!(age >= 15 && age <= 100)) errs.push('La edad debe estar entre 15 y 100 años.');
    if (!(w >= 30 && w <= 300)) errs.push('El peso debe estar entre 30 y 300 kg.');
    if (!(h >= 100 && h <= 250)) errs.push('La altura debe estar entre 100 y 250 cm.');
    if (acts.indexOf(act) < 0) errs.push('Elige un nivel de actividad.');
    if (!(goal in goals)) errs.push('Elige un objetivo.');
    if (errs.length) return show('res-calorias', errs.join('<br>'), true);
    var bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'h' ? 5 : -161); // Mifflin-St Jeor
    var target = bmr * act * goals[goal], floor = sex === 'h' ? 1500 : 1200, raised = target < floor;
    if (raised) target = floor;
    show('res-calorias',
      '<strong>≈ ' + round10(target) + ' kcal/día</strong><br>Rango orientativo: ' + round10(target * 0.95) + '–' + round10(target * 1.05) +
      ' kcal. Mantenimiento estimado: ' + round10(bmr * act) + ' kcal.' +
      (raised ? '<br>Hemos aplicado un mínimo de ' + floor + ' kcal: por debajo conviene supervisión profesional.' : '') +
      '<br><span class="note">Es una estimación, no una recomendación médica. Tu gasto real varía según cada persona.</span>');
  });

  var fp = document.getElementById('form-proteina');
  if (fp) fp.addEventListener('submit', function (e) {
    e.preventDefault();
    var w = num('p-peso'), goal = document.getElementById('p-obj').value, act = document.getElementById('p-act').value, errs = [];
    var base = { perder: [1.6, 2.2], mantener: [1.2, 1.8], ganar: [1.6, 2.2] };
    var shift = { sedentario: -0.3, ligero: -0.2, moderado: 0, alto: 0.1, muy_alto: 0.2 };
    if (!(w >= 30 && w <= 300)) errs.push('El peso debe estar entre 30 y 300 kg.');
    if (!(goal in base)) errs.push('Elige un objetivo.');
    if (!(act in shift)) errs.push('Elige un nivel de actividad.');
    if (errs.length) return show('res-proteina', errs.join('<br>'), true);
    var lo = Math.max(0.8, base[goal][0] + shift[act]), hi = Math.min(2.4, base[goal][1] + shift[act]);
    show('res-proteina',
      '<strong>' + Math.round(w * lo) + '–' + Math.round(w * hi) + ' g/día</strong><br>Equivale a ' + lo.toFixed(1) + '–' + hi.toFixed(1) + ' g por kg de peso.' +
      '<br><span class="note">Orientación general, no una pauta médica. Si tienes una enfermedad renal u otra condición, consulta a un profesional sanitario.</span>');
  });

  var fi = document.getElementById('form-imc');
  if (fi) fi.addEventListener('submit', function (e) {
    e.preventDefault();
    var w = num('i-peso'), h = num('i-altura'), errs = [];
    if (!(w >= 30 && w <= 300)) errs.push('El peso debe estar entre 30 y 300 kg.');
    if (!(h >= 100 && h <= 250)) errs.push('La altura debe estar entre 100 y 250 cm.');
    if (errs.length) return show('res-imc', errs.join('<br>'), true);
    var bmi = w / Math.pow(h / 100, 2), cat;
    if (bmi < 18.5) cat = 'por debajo del rango habitual';
    else if (bmi < 25) cat = 'dentro del rango habitual';
    else if (bmi < 30) cat = 'por encima del rango habitual (sobrepeso)';
    else cat = 'muy por encima del rango habitual (obesidad)';
    show('res-imc',
      '<strong>IMC ' + bmi.toFixed(1) + '</strong><br>Categoría orientativa para adultos: ' + cat + '.' +
      '<br><span class="note">No es un diagnóstico. El IMC no distingue músculo de grasa, ni tiene en cuenta la edad, el sexo ni dónde se acumula la grasa. Es menos fiable en personas muy musculadas, mayores o menores de 18 años. Consulta a un profesional sanitario para valorar tu salud.</span>');
  });

  var fr = document.getElementById('form-rm');
  if (fr) fr.addEventListener('submit', function (e) {
    e.preventDefault();
    var w = num('r-peso'), reps = num('r-reps'), errs = [];
    if (!(w > 0 && w <= 500)) errs.push('El peso debe ser mayor que 0 y no superar 500 kg.');
    if (!(reps >= 1 && reps <= 12 && Math.floor(reps) === reps)) errs.push('Las repeticiones deben ser un número entero entre 1 y 12.');
    if (errs.length) return show('res-rm', errs.join('<br>'), true);
    var rm = reps === 1 ? w : (w * (1 + reps / 30) + w * 36 / (37 - reps)) / 2; // media Epley y Brzycki
    var rows = [[100, '1'], [95, '2'], [90, '4'], [85, '6'], [80, '8'], [75, '10'], [70, '12'], [60, '15 o más']], t = '';
    rows.forEach(function (r) { t += '<tr><td>' + r[0] + '%</td><td>' + (Math.round(rm * r[0] / 100 * 2) / 2) + ' kg</td><td>' + r[1] + '</td></tr>'; });
    show('res-rm',
      '<strong>1RM estimado ≈ ' + (Math.round(rm * 2) / 2) + ' kg</strong>' +
      '<div style="overflow-x:auto"><table><tr><th>% del 1RM</th><th>Peso</th><th>Reps orientativas</th></tr>' + t + '</table></div>' +
      '<span class="note">Es una estimación (media de las fórmulas Epley y Brzycki) y varía según ejercicio y persona. Con más de 10 repeticiones es menos precisa. No intentes un máximo real sin experiencia, buena técnica y un compañero que te asista.</span>');
  });
})();
