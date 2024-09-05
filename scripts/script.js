const themeButtons = document.querySelectorAll('.header__theme-menu-button');

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    themeButtons.forEach((btn) => {
      btn.classList.remove('header__theme-menu-button_active');
      btn.removeAttribute('disabled');
    });
    if (
      [...button.classList].includes('header__theme-menu-button_type_light')
    ) {
      changeTheme('light');
    } else if (
      [...button.classList].includes('header__theme-menu-button_type_dark')
    ) {
      toggleDarkMode("dark", changeTheme, button)
    } else {
      changeTheme('auto');
    }
    button.classList.add('header__theme-menu-button_active');
    button.setAttribute('disabled', true);
  });
});

function changeTheme(theme) {
  document.body.className = 'page';
  document.body.classList.add(`theme_${theme}`);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const theme = localStorage.getItem('theme');
  if (theme) {
    changeTheme(theme);
    themeButtons.forEach((btn) => {
      btn.classList.remove('header__theme-menu-button_active');
      btn.removeAttribute('disabled');
    });
    document
      .querySelector(`.header__theme-menu-button_type_${theme}`)
      .classList.add('header__theme-menu-button_active');
    document
      .querySelector(`.header__theme-menu-button_type_${theme}`)
      .setAttribute('disabled', true);
  }
}

const toggleDarkMode = async (
  theme,
  toggleTheme,
  element,
) => {
  const transition = document.startViewTransition(() => {
    toggleTheme();
  });

  const reverse = theme === 'dark';
  
  document.documentElement.classList.add('no-view-transition');
  document.documentElement.classList.toggle('reverse', reverse);

  const { top, left, width, height } = element.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 650,
        easing: 'ease-in-out',
        pseudoElement: `::view-transition-${reverse ? 'old' : 'new'}(root)`,
        direction: reverse ? 'reverse' : 'normal',
      },
    );
  });
  transition.finished.finally(() => {
    document.documentElement.classList.remove('no-view-transition', 'reverse');
  });
};


initTheme();
