const orbits = [
  { selector: '.orbit-mercury', duration: 4 },
  { selector: '.orbit-venus', duration: 7 },
  { selector: '.orbit-earth', duration: 10 },
  { selector: '.orbit-mars', duration: 19 },
  { selector: '.orbit-jupiter', duration: 120 },
  { selector: '.orbit-saturn', duration: 300 },
  { selector: '.orbit-uranus', duration: 840 },
  { selector: '.orbit-neptune', duration: 1640 }
];

let running = true;
let planetAngles = Array(orbits.length).fill(0);
let lastTimestamp = null;
let speed = 1;
let moonAngle = 0;
let phobosAngle = 0;
let deimosAngle = 0;
const moonPeriod = 1;
const phobosPeriod = 0.3;
const deimosPeriod = 1.2;
const modal = document.getElementById("planet-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const infoBtn = document.getElementById("planet-info");
const closeBtn = document.getElementById("modal-close");

const planetInfo = {
  mercury: {
    name: "Mercurio",
    description: `🌡️ *Temperatura*: de -173 °C a 427 °C
🪨 *Composición*: roca metálica
🧭 *Órbita*: 88 días terrestres
📏 *Diámetro*: 4.880 km

Mercurio es el planeta más cercano al Sol. No tiene atmósfera significativa, lo que hace que sus temperaturas varíen drásticamente entre el día y la noche. Es el segundo planeta más denso del sistema solar.`
  },
  venus: {
    name: "Venus",
    description: `🌡️ *Temperatura media*: ~462 °C
🌫️ *Atmósfera*: dióxido de carbono, con nubes de ácido sulfúrico
📏 *Diámetro*: 12.104 km
🧭 *Órbita*: 225 días terrestres

Venus es el planeta más caliente del sistema solar, debido al efecto invernadero extremo. Su rotación es tan lenta que un día venusiano es más largo que su año. También gira en sentido contrario al de la mayoría de los planetas.`
  },
  earth: {
    name: "Tierra",
    description: `🌍 *Nuestro hogar*
🌬️ *Atmósfera*: nitrógeno (78%), oxígeno (21%)
📏 *Diámetro*: 12.742 km
🧭 *Órbita*: 365.25 días

La Tierra es el único planeta conocido con vida. Tiene agua líquida en abundancia, una atmósfera estable y un campo magnético que nos protege del viento solar.`
  },
  mars: {
    name: "Marte",
    description: `🔴 *Apodado*: el planeta rojo
🌫️ *Atmósfera*: dióxido de carbono, nitrógeno, argón
📏 *Diámetro*: 6.779 km
🧭 *Órbita*: 687 días terrestres

Marte tiene dos lunas pequeñas: Fobos y Deimos. Posee grandes volcanes (como el Olympus Mons) y valles gigantescos. Se cree que alguna vez tuvo agua líquida en su superficie.`
  },
  jupiter: {
    name: "Júpiter",
    description: `🌀 *Apodado*: el gigante gaseoso
🌪️ *Gran Mancha Roja*: tormenta gigante activa por más de 300 años
📏 *Diámetro*: 139.820 km
🧭 *Órbita*: 12 años terrestres

Es el planeta más grande del sistema solar. Tiene más de 90 lunas, incluyendo Ganímedes, la luna más grande del sistema solar. Su intensa gravedad influencia a todo el sistema.`
  },
  saturn: {
    name: "Saturno",
    description: `💍 *Famoso por*: sus espectaculares anillos
📏 *Diámetro*: 116.460 km
🧭 *Órbita*: 29.5 años terrestres
🌕 *Lunas*: más de 80, incluyendo Titán

Los anillos de Saturno están compuestos de partículas de hielo y roca. Titán, su luna más grande, tiene una atmósfera densa y mares de metano líquido.`
  },
  uranus: {
    name: "Urano",
    description: `🌀 *Gira de lado*: su eje de rotación está inclinado ~98°
📏 *Diámetro*: 50.724 km
🧭 *Órbita*: 84 años terrestres
🌬️ *Color*: azul verdoso por el metano

Urano es un gigante helado con una atmósfera compuesta de hidrógeno, helio y metano. Su rotación lateral es única entre los planetas.`
  },
  neptune: {
    name: "Neptuno",
    description: `💨 *Vientos más rápidos*: hasta 2.100 km/h
📏 *Diámetro*: 49.244 km
🧭 *Órbita*: 165 años terrestres
🌫️ *Atmósfera*: hidrógeno, helio y metano

Neptuno es el planeta más lejano del Sol. Tiene una intensa actividad atmosférica, incluyendo tormentas oscuras. Su luna más grande, Tritón, orbita en dirección opuesta a la rotación del planeta.`
  }
};

function animatePlanets(timestamp) {
  if (!running) return;
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = ((timestamp - lastTimestamp) / 1000) * speed;
  lastTimestamp = timestamp;
  orbits.forEach((orbit, i) => {
    const orbitElem = document.querySelector(orbit.selector);
    if (!orbitElem) return; 
    const planet = orbitElem.querySelector('.planet');
    if (!planet) return; 
    const label = orbitElem.querySelector('.planet-label');
    const period = orbit.duration;
    planetAngles[i] = (planetAngles[i] + (360 / period) * delta) % 360;
    const orbitRadius = orbitElem.offsetWidth / 2;
    const planetRadius = planet.offsetWidth / 2;
    const angleRad = planetAngles[i] * Math.PI / 180;
    const x = Math.cos(angleRad) * orbitRadius;
    const y = Math.sin(angleRad) * orbitRadius;
    planet.style.left = `calc(50% + ${x}px)`;
    planet.style.top = `calc(50% + ${y}px)`;
    planet.style.transform = `translate(-50%, -50%)`;
    if (label) {
      label.style.left = `calc(50% + ${x}px)`;
      label.style.top = `calc(50% + ${y - planet.offsetHeight / 2 - 18}px)`;
      label.style.transform = `translate(-50%, -50%)`;
    }
    if (i === 2 && planet.querySelector('.moon-orbit')) {
      const moonOrbit = planet.querySelector('.moon-orbit');
      const moon = moonOrbit.querySelector('.moon');
      const moonLabel = moonOrbit.querySelector('.moon-label');
      moonAngle = (moonAngle + (360 / moonPeriod) * delta) % 360;
      const moonOrbitRadius = moonOrbit.offsetWidth / 2;
      const moonAngleRad = moonAngle * Math.PI / 180;
      const mx = Math.cos(moonAngleRad) * moonOrbitRadius;
      const my = Math.sin(moonAngleRad) * moonOrbitRadius;
      moon.style.left = `calc(50% + ${mx}px)`;
      moon.style.top = `calc(50% + ${my}px)`;
      moon.style.transform = `translate(-50%, -50%)`;
      moonLabel.style.left = `calc(50% + ${mx}px)`;
      moonLabel.style.top = `calc(50% + ${my - 12}px)`;
      moonLabel.style.transform = `translate(-50%, -100%)`;
    }
    if (i === 3 && planet.querySelector('.phobos-orbit') && planet.querySelector('.deimos-orbit')) {
      const phobosOrbit = planet.querySelector('.phobos-orbit');
      const phobos = phobosOrbit.querySelector('.phobos');
      const phobosLabel = phobosOrbit.querySelector('.moon-label');
      phobosAngle = (phobosAngle + (360 / phobosPeriod) * delta) % 360;
      const phobosOrbitRadius = phobosOrbit.offsetWidth / 2;
      const phobosAngleRad = phobosAngle * Math.PI / 180;
      const px = Math.cos(phobosAngleRad) * phobosOrbitRadius;
      const py = Math.sin(phobosAngleRad) * phobosOrbitRadius;
      phobos.style.left = `calc(50% + ${px}px)`;
      phobos.style.top = `calc(50% + ${py}px)`;
      phobosLabel.style.left = `calc(50% + ${px}px)`;
      phobosLabel.style.top = `calc(50% + ${py - 8}px)`;
      phobosLabel.style.transform = `translate(-50%, -100%)`;
      const deimosOrbit = planet.querySelector('.deimos-orbit');
      const deimos = deimosOrbit.querySelector('.deimos');
      const deimosLabel = deimosOrbit.querySelector('.moon-label');
      deimosAngle = (deimosAngle + (360 / deimosPeriod) * delta) % 360;
      const deimosOrbitRadius = deimosOrbit.offsetWidth / 2;
      const deimosAngleRad = deimosAngle * Math.PI / 180;
      const dx = Math.cos(deimosAngleRad) * deimosOrbitRadius;
      const dy = Math.sin(deimosAngleRad) * deimosOrbitRadius;
      deimos.style.left = `calc(50% + ${dx}px)`;
      deimos.style.top = `calc(50% + ${dy}px)`;
      deimosLabel.style.left = `calc(50% + ${dx}px)`;
      deimosLabel.style.top = `calc(50% + ${dy - 8}px)`;
      deimosLabel.style.transform = `translate(-50%, -100%)`;
    }
  });
  requestAnimationFrame(animatePlanets);
}

document.getElementById('toggle-animation').onclick = function () {
  running = !running;
  this.textContent = running ? 'Pausar' : 'Reanudar';
  if (running) {
    lastTimestamp = null;
    requestAnimationFrame(animatePlanets);
  }
};

const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
speedRange.addEventListener('input', function () {
  speed = parseFloat(this.value);
  speedValue.textContent = speed + 'x';
});

window.onload = () => {
  speedValue.textContent = speed + 'x';
  requestAnimationFrame(animatePlanets);
  drawAsteroidBelts();
  setupPlanetSelection(); 
  console.log('window.onload ejecutado, selección de planetas lista');
};

function drawAsteroidBelts() {
  const belt = document.querySelector('.asteroid-belt');
  belt.innerHTML = '';
  for (let i = 0; i < 180; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 150 + Math.random() * 18; 
    const x = 167 + Math.cos(angle) * radius;
    const y = 167 + Math.sin(angle) * radius;
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.style.left = x + 'px';
    asteroid.style.top = y + 'px';
    asteroid.style.width = (1 + Math.random() * 2) + 'px';
    asteroid.style.height = asteroid.style.width;
    asteroid.style.position = 'absolute';
    asteroid.style.background = '#ccc';
    asteroid.style.borderRadius = '50%';
    asteroid.style.opacity = 0.7 + Math.random() * 0.3;
    belt.appendChild(asteroid);
  }

  const kuiper = document.querySelector('.kuiper-belt');
  kuiper.innerHTML = '';
  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 350 + Math.random() * 30; 
    const x = 375 + Math.cos(angle) * radius;
    const y = 375 + Math.sin(angle) * radius;
    const obj = document.createElement('div');
    obj.className = 'kuiper-object';
    obj.style.left = x + 'px';
    obj.style.top = y + 'px';
    obj.style.width = (1.5 + Math.random() * 2.5) + 'px';
    obj.style.height = obj.style.width;
    obj.style.position = 'absolute';
    obj.style.background = '#b5e0ff';
    obj.style.borderRadius = '50%';
    obj.style.opacity = 0.5 + Math.random() * 0.4;
    kuiper.appendChild(obj);
  }
}

let selectedPlanet = null;

function clearPlanetSelection() {
  document.querySelectorAll('.planet.selected').forEach(p => p.classList.remove('selected'));
  selectedPlanet = null;
}

function setupPlanetSelection() {
  document.querySelectorAll('.planet').forEach(planet => {
    const newPlanet = planet.cloneNode(true);
    planet.parentNode.replaceChild(newPlanet, planet);
  });

  document.querySelectorAll('.planet').forEach(planet => {
    planet.style.cursor = 'pointer';
    newPlanetClickHandler(planet);
  });
}

function newPlanetClickHandler(planet) {
  planet.addEventListener('click', e => {
    e.stopPropagation();
    clearPlanetSelection();
    planet.classList.add('selected');
    selectedPlanet = planet;
    console.log('Planeta seleccionado:', planet.className);
  });
}

window.onload = () => {
  speedValue.textContent = speed + 'x';
  requestAnimationFrame(animatePlanets);
  drawAsteroidBelts();
  setupPlanetSelection(); 
  console.log('window.onload ejecutado, selección de planetas lista');
};

const deleteBtn = document.getElementById('planet-delete');
deleteBtn.addEventListener('click', () => {
  if (!selectedPlanet) {
    console.warn('No hay planeta seleccionado para eliminar');
    return;
  }

  selectedPlanet.classList.add('exploding');
  console.log('Eliminando planeta:', selectedPlanet.className);
  setTimeout(() => {
    const orbit = selectedPlanet.closest('.orbit');
    if (orbit) {
      orbit.remove();
      console.log('Órbita eliminada');
    } else {
      console.error('No se encontró la órbita del planeta');
    }
    clearPlanetSelection();
  }, 600);
});

document.getElementById('explosion-solar').addEventListener('click', () => {
  const sun = document.querySelector('.sun');

  if (sun) {
    sun.classList.add('explosion-solar');
    setTimeout(() => {
      const toDestroy = document.querySelectorAll(
        '.planet, .planet-label, .moon, .moon-label, .phobos, .deimos, .asteroid, .kuiper-object, .sun, .orbit'
      );
      toDestroy.forEach(el => el.remove());
      console.log('Explosión solar ejecutada: todo destruido');
    }, 1200);
  }
});

infoBtn.addEventListener("click", () => {
  if (!selectedPlanet) return;
  const planetClass = selectedPlanet.classList[1];
  const info = planetInfo[planetClass];
  if (!info) return;
  modalTitle.innerText = info.name;
  modalDesc.innerHTML = info.description.replace(/\n/g, "<br>");
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
