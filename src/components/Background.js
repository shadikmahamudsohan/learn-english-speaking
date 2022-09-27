import React from 'react';

const Background = ({ children }) => {
    return (
        <main className='min-h-screen bg-slate-900 flex justify-center items-center'>
            <div class="min-w-max mx-auto rounded-md shadow-lg shadow-slate-200 px-20 py-10 bg-slate-50">
                {children}
            </div>
        </main>
    );
};

export default Background;