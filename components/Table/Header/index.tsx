interface TableHeaderProps{
    children: React.ReactNode,
}

export default function TableHeader({children}: TableHeaderProps){
    return (
        <thead className="table-header">
            {children}
        </thead>
    );
}