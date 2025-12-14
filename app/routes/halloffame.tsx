import Header from "~/shared/header";
export default function HallOfFame() {
  return <div>
    <Header />
    <div className="flex justify-center m-8">
      <div className="m-4">
        Komandas
      </div>
      <div className="m-4">
        Dalībnieki
      </div>
      <div className="m-4">
        Staptautiskās sacensības
      </div>
    </div>
  </div>;
}
