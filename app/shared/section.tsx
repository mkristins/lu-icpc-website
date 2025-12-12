import type { TextBody } from "~/types/content";

export default function Section({title, content} : {title : string, content : TextBody}) {
    return <div className="flex flex-col m-8">
        <div className="font-bold text-2xl">
            {title}
        </div>
        {
            content.map((item, i) => {
                return <div className="mt-3" key={i}>
                    {item}
                </div>
            })
        }
    </div>
}