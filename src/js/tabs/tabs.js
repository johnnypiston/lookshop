const Tabs = function(tabName) {
  const tabContainer = document.querySelector('.' + tabName);
  const tabLinks = document.querySelectorAll('.' + tabName + '__link');
  const tabPanels = document.querySelectorAll('.tabs__content-item');
  let clickedTab;
  let tabPanelCurrent = 'tab001';

  tabContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains('tabs__link')) {
      return;
    }
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove(tabName + '__link--active');
    }
    for (let i = 0; i < tabPanels.length; i++) {
      tabPanels[i].classList.remove('tabs__content-item--active');
    }

    clickedTab = evt.target;
    clickedTab.classList.add(tabName + '__link--active');
    tabPanelCurrent = clickedTab.getAttribute('href').slice(1);
    document
      .getElementById(tabPanelCurrent)
      .classList.add('tabs__content-item--active');
  });
};

export default Tabs;
