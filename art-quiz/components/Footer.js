'use strict';

export const Footer = {
  render: async () => {
    const view =  `
      <div class="container footer-container footer-info-container">
        <div class="footer-info">
          <span class="footer-copyright">&copy; 2021</span>
          <a class="footer-info-link" href="https://rs.school/js/">The Rolling Scopes School</a>
          <a class="footer-info-link" href="https://github.com/aleshkinpaul">aleshkinpaul</a>
        </div>
      </div>
    `
    return view
  }
}

export default Footer;