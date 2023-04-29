import React, { useState } from 'react';
import { motion, easeInOut } from 'framer-motion';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


import LineProgress from './LineProgress';
import Panel from './Panel';
import axios from 'axios';

function Main() {

    const [result, setResult] = useState<number[]>([0.0, 0.0]);
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [raw, setRaw] = useState(null);

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            setRaw(event.target.files[0]);
            setResult([0, 0]);
        }
    }

    //function to convert our image to base64
    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async () => {

        try {
            const base64 = await convertBase64(raw);
            setImage(base64);
            setLoading(true);
            const response = await axios.post("https://whispering-stream-60846.herokuapp.com/api/predict",
                { image: base64, signal: AbortSignal.timeout(5000) }, //send this data to our server, and our server will send data to aws endpoint
            );

            setLoading(false);
            setResult(response.data.message);

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <section className={`w-full  m-auto p-5 flex flex-col`}>
            <div className={`text-center mt-8 w-auto md:w-[800px] self-center content-center items-center`}>
           
           

                <h1 className={`text-slate-500 font-semibold text-2xl`}>Cancer Image Classifier</h1>
                <p> 1. Click "Choose File" and select the image from your local computer</p>
                <p> 2. After selecting the image, click "Upload Image" Button</p>
                <p> 3. After uploading the image, the model will run a prediction on it and output results</p>
                <p> 4. Each percentage has model confidence with image belonging to that class.</p>
                
                <Panel title={`Image Upload`}>
                    <p>Please browse your computer for an image</p>

                    <div className={`m-4`}>

                        <input
                            type='file'
                            accept="image/png, image/gif, image/jpeg"
                            name='image'
                            id='image'
                            onChange={onImageChange}
                        />
                    </div>

                    <br />
                    <button
                        onClick={uploadImage}
                        disabled={!image || loading && true}
                        className={`disabled:${loading} ${!image || loading ? 'bg-slate-400' : 'bg-blue-600'}  text-blue-50 py-2 px-5 rounded-full `}
                    >{loading ? 'Sending to the server' : 'Upload image'}</button>

                </Panel>

                <Panel title={`Classification Result`} >

                    <div className={`w-full p-3 flex flex-wrap justify-between align-middle`}>

                        {

                            loading ? 
                                <div className={`text-center self-center`}>We are working on your request ...</div> :
                                result[0] === 0 && result[1] === 0 ?
                                    <p className={`text-center rounded-sm self-center bg-slate-200 p-3 my-2 w-full`}>Send an image to see the result here</p> :
                                    <motion.div
                                        className={`w-full p-2`}
                                        initial={{
                                            opacity: 0,
                                        }}

                                        animate={{
                                            opacity: 1
                                        }}
                                    >
                                        <LineProgress title={`Benign ${(result[0] * 100).toFixed(2)}%`} percentage={result[0] * 100} />
                                        <LineProgress title={`Malignant ${(result[1] * 100).toFixed(2)}%`} percentage={result[1] * 100} />

                                    </motion.div>
                        }

                        <motion.div

                            initial={{
                                opacity: 0,
                                translateY: '-20px',
                            }}
                            animate={{
                                opacity: 1,
                                translateY: '0px'
                            }}
                            transition={{
                                duration: 3,
                                ease: easeInOut
                            }}

                            exit={{
                                opacity: 0,
                                translateY: '-20px',
                            }}
                        >
                            <img
                                src={image}
                                className={`w-auto`}
                            />
                        </motion.div>

                    </div>

                </Panel>

            </div>
        </section>
    )
}

export default Main