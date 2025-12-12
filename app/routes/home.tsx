import type { Route } from "./+types/home";
import { Link } from "react-router";
import Section from "../shared/section";
import Header from "../shared/header";
import { Welcome } from "../welcome/welcome";
import type { TextBody } from "~/types/content";

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
      title="Par sacensībām"
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
