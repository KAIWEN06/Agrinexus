import LoginForm from "../../components/auth/LoginForm";
import loginBg from "../../assets/images/login-bg.jpg";
// import logo from "../../assets/images/logo.png";

export default function Login() {
  return (
    <main className="login-page">
      {/* Sisi Kiri */}
      <section
        className="login-left"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(18, 52, 36, 0.70),
              rgba(18, 52, 36, 0.70)
            ),
            url(${loginBg})
          `,
        }}
      >
        <div className="overlay-content">
          {/* Logo */}
          {/* <img src={logo} alt="Agrinexus" className="login-logo" /> */}

          <h1>AGRINEXUS</h1>

          <h2>Sistem Monitoring Perkebunan Pintar</h2>

          <p>
            Pantau kondisi lingkungan perkebunan secara real-time melalui
            teknologi Internet of Things untuk mendukung pengambilan keputusan
            yang lebih cepat, tepat, dan efisien.
          </p>
        </div>
      </section>

      {/* Sisi Kanan */}
      <section className="login-right">
        <LoginForm />
      </section>
    </main>
  );
}