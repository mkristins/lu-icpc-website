export default function AdminWrap({isAdmin, children} : {isAdmin : boolean, children : React.ReactNode}){
    if(isAdmin){
        return children
    }
    else{
        return <></>
    }
}