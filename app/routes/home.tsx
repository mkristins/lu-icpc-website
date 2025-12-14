import type { Route } from "./+types/home";
import Section from "../shared/section";
import Header from "../shared/header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LUPO" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div>
    <Header />
    <Section
      title="Jaunumi"
      content={[]}
    />
    <Section
      title="Sacensību norise"
      content={[
        "Tradicionāli šīs programmēšanas sacensības norisinās 5 stundas, savstarpēji sacenšoties 3 cilvēku komandām. Par katru atrisināto uzdevumu komanda saņem 1 punktu, kā arī soda minūtes. Sacensības uzvar komanda ar visvairāk punktiem, bet ja ir vairākas tādas, tad komanda ar vismazāk soda minūtēm."
      ]}
    />
    <Section
      title="Starptautiskās sacensības"
      content={[
        "Pasaules studentu programmēšanas sacensības (ACM ICPC) ir senākās un prestižākās akadēmiskās programmēšanas sacensības pasaulē, kurās piedalās studenti.",
        "Katru gadu Latvijas Universitāte nosūta 2 labākās komandas uz Centrāleiropas pusfinālu, kurš ikkgadēji notiek decembrī. 2025. gadā tas norisināsies Vroclavā, Polijā.",
        "No pusfināla 2 labākās komandas tiks nosūtītas uz Pasaules finālu, taču 13 labākās tiks nosūtītas uz Eiropas Finālu, tādējādi dodot iespēju komandām turpināt cīņu par vietu finālā!" 
      ]}
    />
    <Section
      title="Kā sagatavoties?"
      content={[
        "Sistēmā Codeforces ir pieejams plašs uzdevumu arhīvs."
      ]}
    />
    <Section 
      title="Sponsori un atbalstītāji" 
      content={["Gravity Team", "LU Fonds"]}
    />
  </div>
}
