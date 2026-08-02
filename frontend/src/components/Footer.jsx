import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <span className="site-footer__brand">Zaiqa</span>
          <p>Home-style Lahori cooking, ordered in a few taps.</p>
        </div>
        <div className="site-footer__meta">
          <p>Gulberg, Lahore · Open 12pm – 1am</p>
          <p>+92 300 1234567</p>
        </div>
      </div>
    </footer>
  );
}
