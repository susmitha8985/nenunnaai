import { useEffect, useState } from "react";
import { getDoctors, getLabTests } from "./api";

export default function App() {
  const [doctors,setDoctors] = useState<any[]>([]);
  const [tests,setTests] = useState<any[]>([]);
  const [tab,setTab] = useState<"home"|"doctors"|"labs"|"whatsapp">("home");

  useEffect(()=>{ getDoctors().then(setDoctors).catch(console.error); getLabTests().then(setTests).catch(console.error); },[]);

  return <div className="app">
    <header><div className="brand">NENUNNA <span>AI</span><small>Healthcare Automation Platform</small></div>
      <nav>
        <button onClick={()=>setTab("home")}>Home</button>
        <button onClick={()=>setTab("doctors")}>Doctors</button>
        <button onClick={()=>setTab("labs")}>Lab Tests</button>
        <button onClick={()=>setTab("whatsapp")}>WhatsApp</button>
      </nav>
      <button className="primary">Book Appointment</button>
    </header>

    {tab==="home" && <main>
      <section className="hero"><div><p className="eyebrow">CONNECTED HEALTHCARE</p>
        <h1>Healthcare bookings made simple with AI & WhatsApp.</h1>
        <p>Book doctors, diagnostic tests, manage appointments and receive reports through one connected healthcare platform.</p>
        <div className="actions"><button className="primary" onClick={()=>setTab("doctors")}>Book Appointment</button><button onClick={()=>setTab("labs")}>Book Lab Test</button><button onClick={()=>setTab("whatsapp")}>Chat on WhatsApp</button></div>
      </div><div className="mock"><div className="mock-title">NENUNNA AI · Online</div><div className="bubble bot">Hello 👋 Welcome to NENUNNA AI.<br/>How can we help you today?</div><div className="choices"><button>Book Doctor</button><button>Book Lab Test</button><button>My Reports</button></div></div></section>
    </main>}

    {tab==="doctors" && <main><h2>Find a Doctor</h2><div className="grid">{doctors.map(d=><article className="card" key={d.id}><div className="avatar">{d.name.replace("Dr. ","").slice(0,1)}</div><h3>{d.name}</h3><p>{d.specialty}</p><p>{d.qualification} · {d.experience} years</p><p>⭐ {d.rating} · ₹{d.consultation_fee}</p><button className="primary">Book Appointment</button></article>)}</div></main>}

    {tab==="labs" && <main><h2>Lab Tests</h2><div className="grid">{tests.map(t=><article className="card" key={t.id}><h3>{t.name}</h3><p>{t.description}</p><span className="tag">{t.category}</span><h3>₹{t.price}</h3><p>Report: {t.report_delivery_time}</p><button className="primary">Book Test</button></article>)}</div></main>}

    {tab==="whatsapp" && <main className="whatsapp-page"><div className="phone"><div className="phone-head">NENUNNA AI <small>Online</small></div><div className="chat"><div className="bubble bot">Hello 👋 Welcome to NENUNNA AI.<br/><br/>How can we help you today?</div><button>Book Doctor</button><button>Book Lab Test</button><button>My Appointments</button><button>My Reports</button><button>Talk to Support</button></div></div></main>}
    <footer>NENUNNA AI · Healthcare Automation Platform · Demo Mode</footer>
  </div>
}