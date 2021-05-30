// Dark Mode
const html = document.querySelector('html');
let check = JSON.parse(localStorage.getItem('darkMode'));
const toggle = document.querySelector('#dark-mode');
const borderMap = document.querySelector('.map-container');
const visible = document.querySelector('.visible');

if (!check) {
    localStorage.setItem('darkMode', JSON.stringify({
        value: false
    }));

    check = JSON.parse(localStorage.getItem('darkMode'));
}

if (toggle) {
    const container = document.createElement('div');
    const content = document.createElement('div');
    const icon = document.createElement('img');

    if (container) {
        Object.assign(container.style,{
            width: 'min(90vw, 800px)', 
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        });
    }

    if (content) {
        content.style.cursor = 'pointer'
    }

    if (icon) {
        icon.style.maxWidth = '36px';
        if (check.value) {
            icon.setAttribute('src', 'public/assets/moon.svg');
        } else {
            icon.setAttribute('src', 'public/assets/sun.svg');
        }
    }

    content.appendChild(icon);
    container.appendChild(content);
    toggle.appendChild(container);

    icon.addEventListener('click', function(event){
        if (!check.value) {
            localStorage.setItem('darkMode', JSON.stringify({
                value: true
            }));
            check.value = true;
            visible.style.filter = 'invert(1)';
            icon.setAttribute('src', 'public/assets/moon.svg');
        } else {
            localStorage.setItem('darkMode', JSON.stringify({
                value: false
            }));
            check.value = false;
            visible.style.filter = 'invert(0)';
            icon.setAttribute('src', 'public/assets/sun.svg');
        }
    
        dark(check.value);
    });
}

const initialColors = {
    bgColor: window.getComputedStyle(html).getPropertyValue('--bg-color'),
    bgHeader: window.getComputedStyle(html).getPropertyValue('--bg-header'),
    bgCard: window.getComputedStyle(html).getPropertyValue('--bg-card'),
    cardColor: window.getComputedStyle(html).getPropertyValue('--card-color'),
    tableTh: window.getComputedStyle(html).getPropertyValue('--table-th'),
    tableTd: window.getComputedStyle(html).getPropertyValue('--table-td'),
    fontColor: window.getComputedStyle(html).getPropertyValue('--font-color'),
    modalColor: window.getComputedStyle(html).getPropertyValue('--modal-color'),
    inputColor: window.getComputedStyle(html).getPropertyValue('--input-color'),
    fontTooltip: window.getComputedStyle(html).getPropertyValue('--font-tooltip'),
    bgTooltip: window.getComputedStyle(html).getPropertyValue('--bg-tooltip')
}

const darkMode = {
    bgColor: 'rgba(31, 27, 36, 1)',
    bgHeader: 'rgba(18, 18, 18, 1)',
    bgCard: 'rgba(31, 27, 36, 1)',
    cardColor: 'rgba(0, 0, 0, 1)',
    tableTh: 'rgba(18, 18, 18, 1)',
    tableTd: 'rgba(18, 18, 18, 1)',
    fontColor: 'rgba(255, 255, 255, 1)',
    modalColor: 'rgba(31, 27, 36, 1)',
    inputColor: 'rgba(58, 51, 66, 1)',
    fontTooltip: 'rgba(0, 0, 0, 1)',
    bgTooltip: 'rgba(255, 255, 255, 1)'
}

const transformKey = key => '--' + key.replace(/([A-Z])/, '-$1').toLowerCase();

function changeColors(colors) {
    Object.keys(colors).map(function(key) {
        html.style.setProperty(transformKey(key), colors[key]);
    });
};

// Function responsible for changing colors
dark(check.value);

// Setting the chosen theme and changing the images
function dark(value) {
    if (value) {
        changeColors(darkMode); 
    } else {
        changeColors(initialColors);
    } 
}
