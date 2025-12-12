import ArchiveLink from "~/components/archive-link";
import Header from "~/shared/header";

export default function Archive() {
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
      Arhīvs
    </div>
    <ArchiveLink year="2025" resultLink="/" taskLink="/" testLink="/" />
    <ArchiveLink year="2024" resultLink="/" taskLink="/" testLink="/" />
    <ArchiveLink year="2023" resultLink="/" taskLink="/" testLink="/" />
  </div>;
}
