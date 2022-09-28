import React, { useEffect } from 'react';
import Background from '../components/Background';
import { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const Home = () => {
    const [data, setData] = useState({});
    const [spokenText, setSpokenText] = useState("");
    const [start, setStart] = useState(0);
    useEffect(() => {
        fetch('https://api.kanye.rest/')
            .then(res => res.json())
            .then(data => setData(data));
    }, [start]);

    const {
        audioResult,
        startRecording,
        status,
        stopRecording,
        resumeRecording,
        errorMessage
    } = useAudioRecorder(); // voice record


    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening,
        isMicrophoneAvailable
    } = useSpeechRecognition(); // turning speech into text

    const { speak } = useSpeechSynthesis(); // listen text option

    useEffect(() => {
        if (listening === false) {
            setSpokenText(transcript);
        }
    }, [listening, transcript]);



    useEffect(() => {
        if (browserSupportsContinuousListening) {
            if (listening === false) {
                stopRecording();

            } else {
                startRecording();
            }
        }
    }, [listening]);

    useEffect(() => {
        if (browserSupportsContinuousListening) {
            SpeechRecognition.startListening({ continuous: true });
        } else {
            // Fallback behaviour
        }
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    if (!isMicrophoneAvailable) {
        return <span>Please turn available your microphone.</span>;
    }
    function getWords(text) {
        let x = text?.replace(/[^A-Za-z0-9]+/g, " ");
        let newArr = x?.trim()?.split(" ");
        return newArr;
    }

    const dataArray = [];
    if (data.quote && spokenText.length > 0) {
        for (let i = 0; i < getWords(data.quote.toLowerCase())?.length; i++) {
            if (getWords(data.quote)[i].toLowerCase() !== getWords(spokenText)[i]?.toLowerCase()) {
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

    return (
        <Background>
            {
                data?.quote && <>
                    <button
                        className=' bg-blue-500 text-white mx-auto block mb-5'
                        style={{ borderRadius: "50%", minWidth: "70px", minHeight: "70px" }}
                        onClick={() => speak({ text: data.quote })}

                    >Listen</button>
                </>
            }


            <h1 className='text-red-600 text-xl w-full md:w-96'>
                {data.quote}
            </h1>
            <div className='mt-5'>
                <p className='mb-3 text-blue-600 text-xl w-full md:w-96'>{spokenText}</p>
                <button className='py-5 md:py-2 w-full md:my-0 my-1 md:w-14 bg-blue-500 rounded mr-5 text-white'
                    onClick={() => {
                        SpeechRecognition.startListening();
                        setStart(start + 1);
                    }
                    }>Start</button>
                <button className='py-5 md:py-2 w-full md:my-0 my-1  md:w-14 bg-blue-500 rounded mr-5 text-white' onClick={SpeechRecognition.stopListening}>Stop</button>
                <button className='py-5 md:py-2 w-full md:my-0 my-1  md:w-14 bg-blue-500 rounded mr-5 text-white'
                    onClick={() => {
                        SpeechRecognition.startListening();
                        if (browserSupportsContinuousListening) {
                            resumeRecording();
                        }
                    }}
                >Retry</button>
                {(listening === false && browserSupportsContinuousListening) && <audio className='w-full mt-5 border border-blue-500 rounded-3xl' controls src={audioResult} />}
                <h1 className='text-5xl text-green-600 text-center my-5'>{(correctPercentage >= 0) && Math.floor(correctPercentage) + " %"}</h1>

                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                <p className='mt-3 font-xl'>{listening ? 'listening...' : ''}</p>
            </div>
        </Background>
    );
};

export default Home;