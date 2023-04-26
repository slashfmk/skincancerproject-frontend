import React from 'react';

interface IPanel {
    title: string;
    children?: React.ReactNode;
}

const Panel: React.FC<IPanel> = (props) => {

    return (
        <div className={`m-10 w-lg bg-slate-50 shadow-lg shadow-gray-400 pb-4`}>
            <h2 className={`p-4 text-slate-800 font-medium border-gray-200 border-b-[1px] mb-3`}>{ props.title}</h2>
            {props.children}
        </div>
    );
}

export default Panel;