import ArchiveLink from "~/components/archive-link";
import Header from "~/shared/header";

export default function Archive() {
  const STORAGE_URL = "/local"
  const link = `${STORAGE_URL}/competition-archive/2010/euc2025-official.pdf`
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
      Arhīvs
    </div>
    <ArchiveLink year="2025" resultLink="./scoreboard" taskLink={link} testLink="/" />
    <ArchiveLink year="2024" resultLink="./scoreboard" taskLink={link} testLink="/" />
    <ArchiveLink year="2023" resultLink="./scoreboard" taskLink={link} testLink="/" />
  </div>;
}
