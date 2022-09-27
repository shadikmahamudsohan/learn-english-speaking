import React, { useContext, useEffect } from 'react';
import Background from '../components/Background';
import { useState } from 'react';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const Home = () => {
    const [data, setData] = useState({});
    const [spokenText, setSpokenText] = useState("");
    const [start, setStart] = useState(0);
    useEffect(() => {
        fetch('http://api.kanye.rest/')
            .then(res => res.json())
            .then(data => setData(data));
    }, [start]);


    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening === false) {
            setSpokenText(transcript);
        }
    }, [listening, transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function getWords(text) {
        let x = text?.replace(/[^A-Za-z0-9]+/g, " ");
        let newArr = x?.trim()?.split(" ");
        return newArr;
    }

    const dataArray = [];
    if (data.quote && spokenText.length > 0) {
        for (let i = 0; i < getWords(data.quote.toLowerCase())?.length; i++) {
            if (getWords(data.quote)[i].toLowerCase() !== getWords(spokenText)[i]) {
                dataArray.push(false);
            } else {
                dataArray.push(true);
            }
        }
    }

    const allTrue = [];
    for (let i = 0; i < dataArray?.length; i++) {
        if (dataArray[i] === true) {
            allTrue.push(true);
        }
    }
    function getPercentage(total, right) {
        return (parseInt(right) / parseInt(total)) * 100;
    }
    const correctPercentage = getPercentage(dataArray.length, allTrue.length);
    console.log(correctPercentage);
    return (
        <Background>
            <h1 className='text-red-600 text-xl w-96'>
                {data.quote}
            </h1>
            <div className='mt-5'>
                <p className='text-blue-600 text-xl w-72 mb9w-96'>{spokenText}</p>
                <button className='py-5 md:py-2 w-full md:my-0 my-1 md:w-7 bg-blue-500 rounded mr-5 text-white'
                    onClick={() => {
                        SpeechRecognition.startListening();
                        setStart(start + 1);
                    }
                    }>Start</button>
                <button className='py-5 md:py-2 w-full md:my-0 my-1  md:w-7 bg-blue-500 rounded mr-5 text-white' onClick={SpeechRecognition.stopListening}>Stop</button>
                <button className='py-5 md:py-2 w-full md:my-0 my-1  md:w-7 bg-blue-500 rounded mr-5 text-white' onClick={SpeechRecognition.startListening}>Retry</button>

                <h1 className='text-5xl text-green-600 text-center my-5'>{(correctPercentage >= 0) && Math.floor(correctPercentage) + " %"}</h1>

                <p className='mt-3 font-xl'>{listening ? 'listening...' : ''}</p>

            </div>
        </Background>
    );
};

export default Home;