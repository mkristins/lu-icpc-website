export function RowHighlighting({highlight, children} : {highlight : boolean, children : React.ReactNode }){
    if(highlight){
        return <tr className="bg-blue-300">
            {children}
        </tr>
    }
    else{
        return <tr>
            {children}
        </tr>
    }
}

export function CellHighlighting({highlight, children} : {highlight : boolean, children : React.ReactNode}) {
    if(highlight){
        return <td className="border px-3 py-2 text-left bg-amber-300">
            {children}
        </td>
    }
    else{
        return <td className="border px-3 py-2 text-left">
            {children}
        </td>
    }
}